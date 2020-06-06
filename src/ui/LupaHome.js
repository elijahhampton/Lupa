/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 * 
 *  LupaHome
 */

import React, { useState, useEffect } from 'react';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

import {
    View,
    StyleSheet,
    InteractionManager,
    ScrollView,
    TouchableOpacity,
    Image,
    Text,
    Modal,
    Dimensions,
    SafeAreaView,
    Button as NativeButton,
    Animated,
    ImageBackground,
    TouchableHighlight,
} from 'react-native';

import {
    Surface,
    DataTable,
    Button,
    IconButton,
    FAB,
    Chip,
    Paragraph,
    Card,
    Banner,
    Caption,
    Badge,
    Appbar,
    Divider,
    Avatar,
    Searchbar,

} from 'react-native-paper';

import {
    Left
} from 'native-base';

import TrainerInsights from './user/trainer/TrainerInsights'


import { Icon, SearchBar } from 'react-native-elements';

import { withNavigation } from 'react-navigation'

import LupaController from '../controller/lupa/LupaController';

import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';

import ThinFeatherIcon from "react-native-feather1s";

import FeatherIcon from 'react-native-vector-icons/Feather';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { Pagination } from 'react-native-snap-carousel';
import FeaturedProgramCard from './workout/program/components/FeaturedProgramCard';
import { RFPercentage } from 'react-native-responsive-fontsize';

const CreateProgramImage = require('./images/programs/sample_photo_three.jpg')

mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}


{/*
function InviteFriendsModal(props) {
    let [contactPermissionsGranted, setContactPermissionsGranted] = useState(true);
    let [contactRecords, setContactRecords] =  useState([]);
    let [invitedList, setInvitedList] = useState([])

    handleInviteContact = (mobileNumber) => {
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
                
              })
            }
            if (permission === 'authorized') {
              setContactPermissionsGranted(true);
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

        retrieveContacts()
    }, [contactRecords.length])

    return (
        <Modal visible={false} animated={true} animationStyle="slide" presentationStyle="fullScreen" style={{flex: 1, backgroundColor: '#FFFFFF'}}>
            <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
               <View style={{flex: 1, padding: 10, alignItems: 'center', justifyContent: 'space-evenly'}}>
               <Text style={{fontFamily: 'ARSMaquettePro-Black', fontSize: 20, fontWeight: '300'}}>
                    Invite your contacts
                </Text>

                <Text style={{color: 'rgb(174, 174, 178)', fontFamily: 'ARSMaquettePro-Medium', fontSize: 15}}>
                    Gather partners to start your fitness journey
                </Text>

                <Text style={{color: 'rgb(174, 174, 178)', fontFamily: 'ARSMaquettePro-Medium', fontSize: 15}}>
                    Manage your client list from a centralized location
                </Text>
               </View>

               <Divider />

               <View style={{flex: 4}}>
                   <ScrollView>
                    {
                        contactPermissionsGranted == true ?
                        contactRecords.map(contact => {
                            return (
                                <View style={{backgroundColor: invitedList.includes(contact.phoneNumbers[0].number) ? 'grey' : 'transparent', width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center',  justifyContent: 'space-between', margin: 10}}>
                                    <View style={{flex: 2, flexDirection: 'row', alignItems: 'center'}}>
                                        <Avatar.Icon icon="perm-identity" color="#212121" size={30} style={{backgroundColor: 'transparent', margin: 5}} />
                                        <View>
                                        <Text style={{fontSize: 18, fontWeight: '300'}}>
                                           {contact.familyName + " " + contact.givenName}
                                        </Text>
                                        <Caption>
                                            {contact.phoneNumbers[0].number}
                                        </Caption>
                                        </View>
                                        </View>

                                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                        <Button key={contact.phoneNumbers[0].number} style={{elevation: 0}} theme={{colors: {
                                            primary: 'rgb(33,150,243)'
                                        },
                                        roundness: 5
                                        }}
                                        mode="contained"
                                        onPress={() => handleInviteContact(contact.phoneNumbers[0].number)}>
                                            <Text>
                                                Invite
                                            </Text>
                                        </Button>
                                        </View>
                                </View>
                            )
                        })
                        :
                        <Text style={{backgroundColor: 'red'}}>
                            Hi
                        </Text>
                    }
                                       </ScrollView>
               </View>

               <Divider />

               <View style={{flex: 0.5, alignItems: 'center', justifyContent: 'center'}}>
                   <Text>
                       I'll handle this later
                   </Text>
                   <NativeButton title="Skip" />
               </View>
            
            </SafeAreaView>
        </Modal>
    )
}*/}

class LupaHome extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            swiperTwoViewIndex: 0,
            showTrainerRegistrationModal: false,
            trainerInsightsVisible: false,
            visible: false,
            usersNearYou: [],
            currCardIndex: 0,
            cardData: [1,2,3,4,5,6],
            data: [
                {text: 'All', icon: ''}, 
                {text: 'Increase Agility', icon: 'activity'}, 
                {text: 'Weight Loss', icon: 'anchor'}, 
                {text: 'New York', icon: 'map-pin'}
            ],
            searching: false,
            featuredPrograms: [],
            programModalVisible: false,
        }

    }

   async componentDidMount() {
        await this.loadFeaturedPrograms();
    }

    componentWillUnmount() {
    
    }

    loadFeaturedPrograms = async () => {
        let featuredProgramsIn;

        await this.LUPA_CONTROLLER_INSTANCE.getFeaturedPrograms().then(result => {
            featuredProgramsIn = result;
        });

        await this.setState({
            featuredPrograms: featuredProgramsIn,
        })
    }

    closeTrainerInsightsModalMethod = () => {
        this.setState({ trainerInsightsVisible: false })
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 0 }}>
                    <Left style={{flexDirection: 'row', alignItems: 'center'}}>
                        <FeatherIcon name="navigation" color="#2962FF" style={{margin: 3,}} />
                        <Text style={{fontFamily: 'HelveticaNeueMedium', color: 'rgba(41,98,255 ,1)'}}>
                            36079
                        </Text>
                    </Left>
                    <Appbar.Content title="Lupa" titleStyle={{alignSelf: 'flex-start', fontWeight: '400', fontSize: 30 }} />
                        <Appbar.Action icon={() => <ThinFeatherIcon
                            name="mail"
                            color="#000000"
                            size={20}
                            thin={false}
                        />} color="#1E88E5"
                            onPress={() => this.props.navigation.navigate('MessagesView')} />

<Appbar.Action icon={() => <ThinFeatherIcon
                        name="bell"
                        size={20}
                        color="#000000"
                        thin={false}
                    />} color="#1E88E5"
                        onPress={() => this.props.navigation.navigate('NotificationsView')} />
                </Appbar.Header>

                <View style={{flex: this.state.searching === true ? 0 : 0.5, alignItems: 'center', justifyContent: 'center', padding: 5}}>
                    <Searchbar style={{marginHorizontal: 20, margin: 10}} placeholder="Search trainer or program name" inputStyle={{fontSize: 12, fontFamily: 'HelveticaNeueMedium'}} onFocus={() => this.setState({ searching: true })} onBlur={() => this.setState({ searching: false})} />
                </View>
                
                {
                    this.state.searching === true ?
                    <View style={{flex: 1}}>
                        <ScrollView>
                        
                        </ScrollView>
                    </View>
                    :
                    <>
                    <View style={{flex: 0.8}}>
                    <View>
                    <Text style={{ fontFamily: 'ARSMaquettePro-Medium', fontSize: RFPercentage(2.5), paddingLeft: 12 }}>
                            What are you interested in?
                        </Text>

                    </View>
                    <View style={{flex: 2}} onMoveShouldSetResponder={evt => {
                        this.props.disableSwipe();
                        return true;
                    }}
                    onTouchEnd={() => this.props.enableSwipe()}>
                    <ScrollView bounces={false} horizontal={true} contentContainerStyle={{alignItems: 'center', justifyContent: 'center',}}>
                        {
                            this.state.data.map((currVal, index, arr) => {
                                // off blue - rgba(30,136,229 ,0.3)
                                // deep - rgba(41,98,255 ,1)
                                return (
                                    <Chip style={{backgroundColor: 'rgba(41,98,255 ,1)', elevation: 3, margin: 5, width: 'auto', padding: 5, borderRadius: 8}}>
                                    <FeatherIcon size={15}  style={{margin: 10}} name={currVal.icon} color="#212121" />
                                    <Text style={{fontFamily: 'HelveticaNeueMedium', color: '#FFFFFF'}}>
                                        {currVal.text}
                                    </Text>
                                </Chip>
                               )
                            })
                        }
                    </ScrollView>
                    </View>
                </View>

                <View
                    style={{ flex: 2, justifyContent: 'center', justifyContent: 'center' }}
                    onMoveShouldSetResponder={evt => {
                        this.props.disableSwipe();
                        return true;
                    }}
                    onTouchEnd={() => this.props.enableSwipe()}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Text style={{ fontFamily: 'ARSMaquettePro-Medium', fontSize: RFPercentage(2.5), paddingLeft: 12 }}>
                            Start now
                        </Text>
                    </View>
                    <ScrollView onScroll={(event) => {
                    }} contentContainerStyle={{}} horizontal bounces={false} pagingEnabled={true} snapToInterval={Dimensions.get('window').width - 50} snapToAlignment={'center'} decelerationRate={0} >
                        {
                            this.state.featuredPrograms.map((currProgram, index, arr) => {
                                return (
                                   <FeaturedProgramCard currProgram={currProgram} key={index} />
                                )
                            })
                        }

                    </ScrollView>
                </View>


                <View style={{ flex: 0.5, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Pagination dotsLength={this.state.cardData.length} activeDotIndex={this.state.currCardIndex} dotColor="rgba(41,98,255 ,1)"/>

                    <View style={{margin: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Button mode="text" color="#212121" onPress={() => this.props.navigation.navigate('Programs')}>
                        <Text style={{fontFamily: 'HelveticaNeueMedium', fontSize: 15, padding: 0, margin: 0, color: 'rgba(41,98,255 ,1)'}} them>
                            Explore More
                        </Text>
                    </Button>
                    <FeatherIcon name="arrow-right" size={20}  />
                    </View>
                    
                </View>
                </>
                }
                
                <TrainerInsights isVisible={this.state.trainerInsightsVisible} closeModalMethod={this.closeTrainerInsightsModalMethod} />
                <SafeAreaView />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#212121",
    },
    mainGraphicText: {
        fontFamily: 'ARSMaquettePro-Bold',
        color: '#FFFFFF',
        fontSize: 25,
        alignSelf: 'flex-start'
    },
    subGraphicText: {
        fontFamily: 'ARSMaquettePro-Medium',
        color: '#FFFFFF',
        alignSelf: 'flex-start',
        textAlign: 'left',
    },
    graphicButton: {
        alignSelf: 'flex-start',
    },
    viewOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 0,
    },
    chipText: {
        color: 'white',
        fontFamily: 'ARSMaquettePro-Regular'
    },
    chip: {
        position: 'absolute',
        top: 15,
        right: 10,
        backgroundColor: '#2196F3',
        elevation: 15
    },
    imageBackground: {
        flex: 1,
        width: Dimensions.get('window').width,
        borderRadius: 0,
        alignItems: 'flex-start',
        justifyContent: 'space-around',
    },
});

export default connect(mapStateToProps)(withNavigation(LupaHome));