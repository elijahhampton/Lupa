import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Modal,
    ScrollView,
    SafeAreaView,
    ActionSheetIOS,
} from 'react-native';
import { Chip, Paragraph, Caption, Dialog, Divider, Snackbar, Surface, Button, Appbar} from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather'
import { Avatar } from 'react-native-elements'
import Feather1s from 'react-native-feather1s'
import { useSelector } from 'react-redux';
import LupaController from '../../../controller/lupa/LupaController';
import { getLupaPackEventStructure, getLupaUserStructurePlaceholder } from '../../../controller/firebase/collection_structures';
import { initStripe, PAY_TRAINER_ENDPOINT, CURRENCY } from '../../../modules/payments/stripe/index'
import { getLupaStoreState } from '../../../controller/redux/index'
import axios from 'axios';
import moment from 'moment';
import { getLupaProgramInformationStructure } from '../../../model/data_structures/programs/program_structures';
import LUPA_DB from '../../../controller/firebase/firebase';

function BookingInformationModal({ trainerUserData, requesterUserData, isVisible, closeModal, booking }) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const currUserData = useSelector(state => {
        return state.Users.currUserData
    });


    const [linkedProgram, setLinkedProgram] = useState(getLupaProgramInformationStructure());
    const [linkProgramDialogVisible, setLinkProgramDialogVisible] = useState(false);
    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarReason, setSnackBarReason] = useState("")
    const [programIsLinked, setProgramIsLinked] = useState(false)

    useEffect(() => {
        async function fetchLinkedProgram() {
            let clients = [];

            await LUPA_DB.collection('users').doc(booking.trainer_uuid).get().then(documentSnapshot => {
                clients = documentSnapshot.data().clients
                if (typeof(clients) == 'object') {

                    clients.forEach(clientData => {
                        if (clientData.client == requesterUserData.user_uuid) {
                            if (clientData.linked_program == "0") {
                                setLinkedProgram("0")
                                setProgramIsLinked(false);
                            } else {
                                setLinkedProgram(clientData.linked_program)
                                setProgramIsLinked(true)
                            }
                           
                        }
                    })
                }
            })


        }

        fetchLinkedProgram();
       
    }, [requesterUserData, trainerUserData, booking])

    const showBookingOptions = () => {
        //show trainer sheet
        if (trainerUserData.user_uuid == currUserData.user_uuid) {
            showTrainerBookingOptions()
        }

        //show requester sheet
        if (requesterUserData.user_uuid == currUserData.user_uuid) {
            showRequesterBookingOptions()
        }
    }

    const showTrainerBookingOptions = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ["Session Completed", "Link Program to Client", "Cancel Session", "Cancel"],
              destructiveButtonIndex: 2,
              cancelButtonIndex: 2,
            },
            buttonIndex => {
             if (buttonIndex === 0) {
                  handleBookingSessionCompleted()
             }
            else if (buttonIndex === 1) {
               setLinkProgramDialogVisible(true);
              } else if (buttonIndex === 2) {
                handleCancelBookingSession()
              }
            }
          );
    }

    const showRequesterBookingOptions = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ["Cancel", "Cancel Session"],
              destructiveButtonIndex: 0,
              cancelButtonIndex: 0
            },
            buttonIndex => {
              if (buttonIndex === 0) {
                // cancel action
              } else if (buttonIndex === 1) {
                  handleCancelBookingSession()
              }
            }
          );
    }

    const handleCancelBookingSession = () => {
        LUPA_CONTROLLER_INSTANCE.handleCancelBooking(booking);
        closeModal()
    }


    const handleLinkProgramToClient = (trainerUID, clientUID, program) => {
        //TODO: update in redux
        LUPA_CONTROLLER_INSTANCE.linkProgramToClient(trainerUID, clientUID, program);
        setLinkProgramDialogVisible(false);
    }

    const handleBookingSessionCompleted = async () => {
        if (programIsLinked == false) {
            setSnackBarVisible(true);
            setSnackBarReason('Link a program to this client first.')
            return;
        }

        LUPA_CONTROLLER_INSTANCE.markBookingSessionCompleted(booking);

        closeModal()
    }

    const renderEquipmentList = () => {
        const equipmentList = trainerUserData.trainer_metadata.personal_equipment_list;
        if (equipmentList.length === 0 || typeof(equipmentList) == 'undefined') {
            return (
                <Caption>
                    {trainerUserData.display_name} has not listed any available equipment.
                </Caption>
            )
        } else {
            return equipmentList.map(equipmentName => {
                return (
                    <Caption>
                    {equipmentName} {" "}
                </Caption>
                )
               
            })
        }
    }

    renderLinkedProgramStatus = () => {
        if (programIsLinked == false) {
            return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <FeatherIcon name="x" color="red" />
   <Caption style={{color: 'red'}}>
                    Link a program to this client though the session options before completing this session.
                </Caption>
                </View>
             
            )
        } else {
            return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <FeatherIcon name="check" color="#1089ff" />
 <Caption style={{color: '#1089ff'}}>
                    {" "} Program Linked 
                </Caption>
          
                </View>
               
            )
        }
    }

    const renderPaymentStatus = () => {
        if (booking.hasOwnProperty('isFirstSession') == true) {
            if (currUserData.user_uuid == requesterUserData.user_uuid) {
                return (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <FeatherIcon name="dollar-sign" color="#1089ff" style={{paddingRight: 5}} />
                    <Caption style={{color: '#1089ff'}}>
                        This is your first session with {trainerUserData.display_name}.  You will be charged a fixed price of $15.00.
                    </Caption>
                    </View>
                )
            } else {
                return (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <FeatherIcon name="dollar-sign" color="#1089ff" style={{paddingRight: 5}} />
                    <Caption style={{color: '#1089ff'}}>
                        This is your first session with {requesterUserData.display_name}.  {requesterUserData.display_name} will be charged a fixed price of $15.00.
                    </Caption>
                    </View>
                )
            }
        } else {
            if (currUserData.user_uuid == requesterUserData.user_uuid) {
                return (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <FeatherIcon name="dollar-sign" color="#1089ff" style={{paddingRight: 5}} />
                    <Caption style={{color: '#1089ff'}}>
                        This is your first session with {trainerUserData.display_name}.  You will be charged {trainerUserData.hourly_payment_rate}.
                    </Caption>
                    </View>
                )
            } else {
                return (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <FeatherIcon name="dollar-sign" color="#1089ff" style={{paddingRight: 5}} />
                    <Caption style={{color: '#1089ff'}}>
                        This is your first session with {requesterUserData.display_name}.  {requesterUserData.display_name} will be charged {trainerUserData.hourly_payment_rate}.
                    </Caption>
                    </View>
                )
            }
        }
      
    }

    const renderSessionDuration = () => {
       let startTime = booking.start_time.split(" ")[0];
       let updatedStartTime = startTime.split(":")[1];

       let endTime = booking.end_time.split(" ")[0];
       let updatedEndTime = endTime.split(":")[1];

       if ((Number(updatedEndTime) - Number(updatedStartTime)) == 0) {
           return "60"
       } else {
           return "90"
       }
    }

    const renderLinkProgramDialog = () => {
        return (
            <Dialog visible={linkProgramDialogVisible}  style={{height: Dimensions.get('window').height / 2, borderRadius: 20}}>
                <Dialog.Title>
                    Link a program to this client
                </Dialog.Title>
                <Dialog.Content>
                    <Dialog.ScrollArea style={{height: '70%'}}>
                        <ScrollView>
                            {
                                getLupaStoreState().Programs.currUserProgramsData.map(program => {
                                    if (typeof(program) == 'undefined') {
                                        return;
                                    }

                                    if (program.program_structure_uuid == linkedProgram.program_structure_uuid) {
                                        return <Text style={{marginVertical: 10, fontSize: 20, fontWeight: 'bold'}}> {program.program_name} </Text>
                                    }
                                    
                                    return (
                                        <Text style={{marginVertical: 10, fontSize: 20}} onPress={() => setLinkedProgram(program)}> {program.program_name} </Text>
                                    )
                                })
                            }
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Button 
                    uppercase={false}
                    mode="contained"
                    color="#23374d"
                    theme={{roundness: 12}}

                    style={{ marginVertical: 20, alignSelf: 'center'}}
                    onPress={() => handleLinkProgramToClient(trainerUserData.user_uuid ,requesterUserData.user_uuid , linkedProgram)}
                    >
                        <Text style={{fontWeight: '700'}}>
                            Link Program
                        </Text>
                    </Button>
                </Dialog.Content>
            </Dialog>
        )
    }

    return (
        <Modal presentationStyle="fullScreen" visible={isVisible} animationType="slide">
            <Appbar.Header style={{backgroundColor: 'white'}}>
                <Appbar.BackAction onPress={closeModal} />
            </Appbar.Header>
            <View style={{flex: 1, backgroundColor: 'white'}}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor: 'rgba(0,0,0,0)'}}>
                     
                      
                        <View style={{justifyContent: 'flex-start', backgroundColor: 'white', padding: 15, }}>
                            <Avatar source={{ uri: trainerUserData.photo_url }} size={120}  style={{marginVertical: 10, width: 120, height: 120, borderRadius: 10}} />

                            <Text style={{fontSize: 30, paddingVertical: 5, fontWeight: 'bold', color: '#23374d'}}>
                                {trainerUserData.display_name}
                            </Text>
                            <Text style={{fontSize: 20, paddingVertical: 5}}>
                                {trainerUserData.certification}
                            </Text>
                        </View>
                        <Divider />
                        <View style={{  padding: 10, borderRadius: 0,  alignItems: 'flex-start', justifyContent: 'space-evenly',  backgroundColor: 'white'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <FeatherIcon name="map-pin" style={{paddingHorizontal: 5}} />
                                <Caption>
                                    {trainerUserData.homegym.address}
                                </Caption>
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <FeatherIcon name="home" style={{paddingHorizontal: 5}} />
                                <Caption>
                                {trainerUserData.homegym.name}
                                </Caption>
                            </View>
                           </View >
                           <Divider />
                           <View style={{ padding: 10, borderRadius: 3,   backgroundColor: 'white'}}>
                                <Text style={{fontSize: 18, fontFamily: 'Avenir-Heavy', color: '#23374d'}}>
                                   {moment(booking.date).format('LL').toString()}
                                </Text>

                                <View>
                                    <View style={{paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, fontFamily: 'Avenir-Medium', color: 'black'}}>
                                            Starting Time
                                        </Text>
                                        <Chip>
                                            {moment(booking.start_time).format('LT').toString()}
                                        </Chip>
                                    </View>

                                    <View style={{paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, fontFamily: 'Avenir-Medium', color: 'black'}}>
                                            End Time
                                        </Text>
                                        <Chip>
                                          {moment(booking.end_time).format('LT').toString()}
                                        </Chip>
                                    </View>
                                </View>


                                    <View>

                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Feather1s name="clock" size={12} style={{paddingRight: 5, }} color='#1089ff' />
                                <Caption style={{color: '#1089ff'}}>
                                    {renderSessionDuration()} minutes session
                                </Caption>
                                </View>
                                        {renderLinkedProgramStatus()}
                                        {renderPaymentStatus()}
                                    </View>
                               
                               
                           </ View>
                            <Divider />
                           < View style={{  padding: 10, borderRadius: 3,   backgroundColor: 'white'}}>
                                <Text style={{fontSize: 18, fontFamily: 'Avenir-Heavy', color: '#23374d'}}>
                                    Session Note
                                </Text>

                                <Paragraph style={{fontFamily: 'Avenir-Light'}}>
                               {booking.note}
                                </Paragraph>
                           </ View >

                          {/*  <Divider />

                           < View style={{  padding: 10, borderRadius: 3,   backgroundColor: 'white'}}>
                                <Text style={{fontFamily: 'Avenir-Light', paddingVertical: 10}}>
                                    {trainerUserData.display_name} has listed the following equipment available:
                                </Text>

                                <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}}>
                                    {renderEquipmentList()}
                                </View>
                                
                          </ View> */}


                           <Button 
                           mode="contained" 
                           color="#23374d" 
                           onPress={showBookingOptions} 
                           theme={{roundness: 12}}
                           uppercase={false}
                           contentStyle={{height: 45, width: Dimensions.get('window').width - 10}} 
                           style={{marginVertical: 50, marginHorizontal: 10, alignItems: 'center', justifyContent: 'center', elevation: 0}}>
                               <Text style={{fontFamily: 'Avenir-Heavy', fontWeight: '800'}}>
                                   Session Options
                               </Text>
                           </Button>

                    </ScrollView>
                    
            </View>
            {renderLinkProgramDialog()}

            <Snackbar
        visible={snackBarVisible}
        onDismiss={() => setSnackBarVisible(false)}
        action={{
          label: 'Okay',
          onPress: () => {
            // Do something
          },
        }}>
        {snackBarReason}
      </Snackbar>
        </Modal>  
    )
}

export default BookingInformationModal;


//time date
//note you left for trainer
//location
//controls
//equipment trainer can bring
