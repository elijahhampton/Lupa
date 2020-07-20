import React, { useEffect, useState } from 'react'


import Contacts from 'react-native-contacts';

import {
    Button as NativeButton, ScrollView, Dimensions, SafeAreaView, View, Text, Modal, Image
} from 'react-native';

import { 
    Avatar, Caption, Button, Divider
} from 'react-native-paper';
import AssessmentReviewModal from '../dashboard/modal/AssessmentReviewModal';
import { useSelector } from 'react-redux';
import AssessmentModal from '../dashboard/modal/AssessmentModal';
import EditBioModal from '../profile/settings/modal/EditBioModal';
import WorkoutLogModal from '../../workout/modal/WorkoutLogModal';
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize'

function InviteFriendsModal(props) {
    const [contactPermissionsGranted, setContactPermissionsGranted] = useState(true);
    const [contactRecords, setContactRecords] =  useState([]);
    const [invitedList, setInvitedList] = useState([])
    const [assessmentModalIsVisible, setAssessmentModalIsVisible] = useState(false);
    const [editBioModalIsVisible, setEditBioModalVisible] = useState(false)
    const [workoutModalIsVisible, setWorkoutModalIsVisible] = useState(false)

    const lupaAssessments = useSelector(state => {
        return state.Assessments.generalAssessments
    })

    /*
    const handleInviteContact = (mobileNumber) => {
        let updatedInvitedContacts = invitedList;
        updatedInvitedContacts.push(mobileNumber);

        setInvitedList(updatedInvitedContacts);
    }

    useEffect(() => {
        Contacts.checkPermission((err, permission) => {
            if (err) throw err;
           
            // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
            if (permission === 'undefined') {
              Contacts.requestPermission((err, permission) => {
                if (permission == 'authorized')
                {
                    setContactPermissionsGranted(true)
                    retrieveContacts()
                }
                else
                {
                    setContactPermissionsGranted(false)
                }
              })
            }
            if (permission === 'authorized') {
              setContactPermissionsGranted(true);
              retrieveContacts()
            }
            if (permission === 'denied') {
              setContactPermissionsGranted(false)
            }
          })

          async function retrieveContacts() {
            await Contacts.getAll((err, response) => {
                if (err)
                {
                    
                }
    
                setContactRecords(response);
            })
        }

    }, [contactRecords.length])
*/

    const getParQAssessment = () => {
        for (let i = 0; i < lupaAssessments.length; i++)
        {
            if (lupaAssessments[i].assessment_acronym == "PARQ")
            {
                return lupaAssessments[i]
            }
        }
    }

    return (
        <Modal visible={props.isVisible} animated={true} presentationStyle="fullScreen" style={{flex: 1, backgroundColor: '#FFFFFF'}}>
            <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
               <View style={{padding: 20, alignItems: 'center', justifyContent: 'space-evenly'}}>
               <Text style={{  fontSize: RFValue(15), fontWeight: '300'}}>
                    Getting started
                </Text>

                <Text style={{color: 'rgb(28, 28, 30)' , fontSize: RFValue(12)}}>
                    Gathering partners to start your fitness journey or managing your client list?  Let us help you get started.
                </Text>
               </View>

               <View style={{flex: 1, marginHorizontal: 10}}>
                    {
                        props.showGettingStarted == true ?
                        <Divider style={{marginVertical: 10}}/>
                        :
                        null
                    }
                   
                    {
                        props.showGettingStarted == true ?
                         <View style={{flex: 1.5}}>
                         <View>
                         <Text style={{padding: 12,   alignSelf: 'center', fontSize: RFValue(15), fontWeight: '300'}}>
                              Getting started checklist
                          </Text>
                         </View>
                         <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-evenly'}}>
                              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                  <Image source={require('../../images/checkmark-icon.png')} style={{margin: 5, width: 30, height: 30}} />
                                  
                                  <Text style={{fontSize: RFValue(12), width: '80%'}}>
                                      <Text>
                                      Help us learn more about you and your needs.
                                      </Text>
                                      <Text>
                                          {" "}
                                      </Text>
                                      <Text style={{color: 'rgba(30,136,229 ,1)'}} onPress={() => setAssessmentModalIsVisible(true)}>
                                      Take your PARQ assessment.
                                      </Text>
                                       
                                  </Text>
                              </View>
  
                              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                              <Image source={require('../../images/checkmark-icon.png')} style={{margin: 5, width: 30, height: 30}} />
                                  
                                  <Text style={{fontSize: RFValue(12), width: '80%'}}>
                                      <Text>
                                      Have you completed any workouts recently?
                                      </Text>
                                      <Text>
                                          {" "}
                                      </Text>
                                      <Text style={{color: 'rgba(30,136,229 ,1)'}} onPress={() => setWorkoutModalIsVisible(true)}>
                                      Log them into your workout log.
                                      </Text>
                                       
                                  </Text>
                              </View>
  
                              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                              <Image source={require('../../images/checkmark-icon.png')} style={{margin: 5, width: 30, height: 30}} />
                              <Text style={{fontSize: RFValue(12), width: '80%'}}>
                                      <Text>
                                      Don't hesitate to let trainers and other users learn more about you.
                                      </Text>
                                      <Text>
                                          {" "}
                                      </Text>
                                      <Text style={{color: 'rgba(30,136,229 ,1)'}} onPress={() => setEditBioModalVisible(true)}>
                                      Setup your bio.
                                      </Text>
                                       
                                  </Text>
                              </View>
                         </View>
                     </View>
                     :
                     null
                    } 
               </View>

                   <NativeButton title="Complete" onPress={() => props.closeModalMethod()} />
              
              {/* Assessment Modal */}
                <AssessmentModal isVisible={assessmentModalIsVisible} assessmentObjectIn={getParQAssessment()} closeModalMethod={() => setAssessmentModalIsVisible(false)}/>
              {/* LogWorkout Modalize */}
              <WorkoutLogModal isVisible={workoutModalIsVisible} closeModalMethod={() => setWorkoutModalIsVisible(false)}/>

              {/* Edit Bio Modal */}
             <EditBioModal isVisible={editBioModalIsVisible} closeModalMethod={() => setEditBioModalVisible(false)} />
            </SafeAreaView>
        </Modal>
    )
}

export default InviteFriendsModal