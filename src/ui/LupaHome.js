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
} from 'react-native-paper';

import TrainerInsights from './user/trainer/TrainerInsights'


import { Icon, SearchBar } from 'react-native-elements';

import { withNavigation } from 'react-navigation'

import LupaController from '../controller/lupa/LupaController';

import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';

import ThinFeatherIcon from "react-native-feather1s";

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
        }

    }

    componentDidMount() {
        this.handleStartSwipers();
        this.setState({ visible: true })
    }

    componentWillUnmount() {
        this.handleStopSwipers()
    }

    handleStartSwipers = () => {
        this.swiperTwoInterval = setInterval(this.activateSwiperTwo, 4000);
    }

    handleStopSwipers = () => {
        clearInterval(this.swiperTwoInterval);
    }

    activateSwiperTwo = () => {
        if (this.state.swiperTwoViewIndex == 3) {
            this.setState({
                swiperTwoViewIndex: 0
            })

            return;
        }

        this.setState({
            swiperTwoViewIndex: this.state.swiperTwoViewIndex + 1
        })
    }

    closeTrainerInsightsModalMethod = () => {
        this.setState({ trainerInsightsVisible: false })
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#F2F2F2' }}>
                <Appbar.Header style={{ backgroundColor: '#F2F2F2', elevation: 0 }}>

                    <Appbar.Content title="Lupa" titleStyle={{alignSelf: 'flex-start', fontWeight: '400', fontSize: 30 }} />
                    {
                        this.props.lupa_data.Users.currUserData.isTrainer == true ?
                        <Appbar.Action icon={() => <ThinFeatherIcon
                            name="bar-chart"
                            color="#000000"
                            size={20}
                            thin={true}
                        />} color="#1E88E5"
                            onPress={() => this.setState({ trainerInsightsVisible: true })} />
                        :
                        null
                    }

<Appbar.Action icon={() => <ThinFeatherIcon
                        name="search"
                        size={20}
                        color="#000000"
                        thin={true}
                    />} color="#1E88E5"
                        onPress={() => console.log('Log')} />
                </Appbar.Header>

                <Banner
                    style={{ backgroundColor: 'transparent', elevation: 0 }}
                    visible={this.state.visible}
                    actions={[
                        {
                            label: 'Got it',
                            color: '#0D47A1',
                            onPress: () => this.setState({ visible: false }),
                        },
                    ]}
                    icon={({ size }) =>
                        <Image
                            source={{ uri: 'https://avatars3.githubusercontent.com/u/17571969?s=400&v=4' }}
                            style={{
                                width: size,
                                height: size,
                            }}
                        />
                    }
                >
                    Welcome to Lupa.  Start by customizing your experience.  Swipe right to take to an assessment or log a previous workout from the dashboard.
      </Banner>

                <View
                    style={{ flex: 2, justifyContent: 'center', justifyContent: 'center' }}
                    onMoveShouldSetResponder={evt => {
                        this.props.disableSwipe();
                        return true;
                    }}
                    onTouchEnd={() => this.props.enableSwipe()}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Text style={{ fontFamily: 'ARSMaquettePro-Medium', fontSize: 20, paddingLeft: 12 }}>
                            Get started
                        </Text>

                        <Button mode="text" color="#0D47A1" onPress={() => this.props.navigation.push('Programs')}>
                            <Text>
                                Show more
                            </Text>
                        </Button>
                    </View>
                    <ScrollView contentContainerStyle={{}} horizontal pagingEnabled={true} snapToInterval={Dimensions.get('window').width - 50} snapToAlignment={'center'} decelerationRate={0} >
                        <Card style={{ elevation: 2, margin: 10, width: Dimensions.get('window').width / 1.2, height: '90%', marginVertical: 10 }} onPress={() => console.log('Pressed')}>
                            <Card.Cover resizeMode="cover" source={require('./images/programs/sample_photo_two.jpg')} style={{ height: '65%' }} />
                            <Card.Actions style={{ width: '100%', height: '35%', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                                <View style={{ width: '100%', height: '100%', alignItems: 'flex-start', justifyContent: 'space-around' }}>
                                    <View style={{ width: '100%', }}>
                                        <Text style={{ fontFamily: 'avenir-roman', fontSize: 15, }} numberOfLines={1}>
                                            Program Title (New Haven Park, 1305 Tradition Circle)
             </Text>
                                    </View>

                                    <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#2962FF' }}>
                                            Emily Loefstedt
                </Text>


                                        <Text style={{ fontSize: 14, fontWeight: '400' }}>
                                            NASM
                </Text>

                                    </View>
                                </View>
                            </Card.Actions>
                        </Card>

                        <Card style={{ elevation: 2, margin: 10, width: Dimensions.get('window').width / 1.2, height: '90%', marginVertical: 10 }} onPress={() => console.log('Pressed')}>
                            <Card.Cover resizeMode="cover" source={require('./images/programs/sample_photo_two.jpg')} style={{ height: '70%' }} />
                            <Card.Actions style={{ width: '100%', height: '30%', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                                <View style={{ width: '100%', height: '100%', alignItems: 'flex-start', justifyContent: 'space-around' }}>
                                    <View style={{ width: '100%', }}>
                                        <Text style={{ fontFamily: 'avenir-roman', fontSize: 15, }} numberOfLines={1}>
                                            Program Title (Online)
             </Text>
                                    </View>

                                    <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#2962FF' }}>
                                            Emily Loefstedt
                </Text>


                                        <Text style={{ fontSize: 14, fontWeight: '400' }}>
                                            NASM
                </Text>

                                    </View>
                                </View>
                            </Card.Actions>
                        </Card>
                    </ScrollView>
                </View>


                <View style={{ flex: 2.5, width: Dimensions.get('window').width }}>
                    <Swiper
                        horizontal={true}
                        dotStyle={{ width: 3, height: 3 }}
                        activeDotStyle={{ width: 5, height: 5 }}
                        dotColor="#212121"
                        showsPagination={true}
                        autoplayDirection={true}
                        paginationStyle={{ position: 'absolute', bottom: 0, width: Dimensions.get('window').width }}
                        style={{ flex: 3, width: Dimensions.get('window').width, }}
                        scrollEnabled={false}
                        index={this.state.swiperTwoViewIndex}
                    >
                        <Surface style={{ backgroundColor: 'transparent', width: '100%', height: '100%', elevation: 5, alignItems: 'center', justifyContent: 'center' }}>
                            <ImageBackground resizeMode="cover" style={styles.imageBackground} imageStyle={{ borderRadius: 20, width: '100%', height: '100%' }} source={require('./images/programs/sample_photo_two.jpg')}>
                                <View style={styles.viewOverlay} />
                                <View style={{ alignItems: 'flex-start', flex: 1, justifyContent: 'center', borderRadius: 20 }}>
                                    <Text style={styles.mainGraphicText}>
                                        Register as a Trainer
                                    </Text>
                                    <Paragraph style={styles.subGraphicText}>
                                        Enter your certification ID number, register with Lupa, and bring your client list to one centralized platform.
                                    </Paragraph>
                                </View>

                                <Button mode="contained" color="white" style={styles.graphicButton} onPress={() => this.props.goToIndex(2)}>
                                    Register
                                    </Button>

                            </ImageBackground>
                        </Surface>

                        <Surface style={{ backgroundColor: 'transparent', width: '100%', height: '100%', elevation: 5, alignItems: 'center', justifyContent: 'center' }}>
                            <ImageBackground resizeMode="cover" style={styles.imageBackground} imageStyle={{ borderRadius: 20, width: '100%', height: '100%' }} source={require('./images/packprogramtwo.jpg')}>
                                <View style={styles.viewOverlay} />
                                <View style={{ alignItems: 'flex-start', flex: 1, justifyContent: 'center', borderRadius: 20 }}>
                                    <Text style={styles.mainGraphicText}>
                                        Engage in Community
                                    </Text>
                                    <Paragraph style={styles.subGraphicText}>
                                        Sign up under a pack, a group of your peers, and complete your fitness journey together.  Find out more on the pack page.
                                    </Paragraph>
                                </View>

                                <Button mode="contained" color="white" style={styles.graphicButton} onPress={() => this.props.goToIndex(2)}>
                                    Engage
                                </Button>

                            </ImageBackground>
                        </Surface>

                        <Surface style={{  width: '100%', height: '100%', elevation: 5, alignItems: 'center', justifyContent: 'center' }}>
                            <ImageBackground resizeMode="cover" style={styles.imageBackground} imageStyle={{ borderRadius: 20, width: '100%', height: '100%' }} source={CreateProgramImage}>
                                <View style={styles.viewOverlay} />
                                <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center', borderRadius: 20 }}>
                                    <Text style={styles.mainGraphicText}>
                                        Create a Program or Workout
            </Text>
                                    <Paragraph style={styles.subGraphicText}>
                                        Have a workout program that you want to share with your friends, family, or the world?  Create it here on Lupa.
            </Paragraph>
                                </View>

                                <Button mode="contained" color="white" style={styles.graphicButton} onPress={() => this.props.navigation.navigate('Programs')}>
                                    Create
            </Button>

                            </ImageBackground>
                        </Surface>


                        <Surface style={{ backgroundColor: 'transparent', width: '100%', height: '100%', elevation: 5, alignItems: 'center', justifyContent: 'center' }}>
                            <ImageBackground resizeMode="cover" style={styles.imageBackground} imageStyle={{ borderRadius: 20, width: '100%', height: '100%' }} source={require('./images/fitnesstrainer.jpg')}>
                                <View style={styles.viewOverlay} />
                                <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center', borderRadius: 20 }}>
                                    <Text style={styles.mainGraphicText}>
                                        Book a Trainer
            </Text>
                                    <Paragraph style={styles.subGraphicText}>
                                        Stop dealing with overpriced workout programs.  Book a trainer on Lupa with little effort.
            </Paragraph>
                                </View>

                                <Button mode="contained" color="white" style={styles.graphicButton} onPress={() => this.props.navigation.navigate('Programs')}>
                                    Book now
            </Button>

                            </ImageBackground>
                        </Surface>

                    </Swiper>

                    <View style={{ flex: 0.2, width: Dimensions.get('window').width, flexDirection: 'row', alignSelf: 'center', alignItems: 'flex-end', justifyContent: 'space-evenly' }}>
                        {/** 
                         * <FAB small onPress={() => this.props.navigation.navigate('MessagesView')} icon="email" color="white" style={{backgroundColor: '#212121',  }} />
<FAB small onPress={() => this.props.navigation.push('NotificationsView')} icon="notifications"  color="white"  style={{backgroundColor: '#212121', }} />

                        */}
                        <Icon
                            reverse
                            name='notifications'
                            type='material'
                            color='#212121'
                            size={20}
                            raised
                            onPress={() => this.props.navigation.navigate('NotificationsView')}
                        />

                        <Icon
                            reverse
                            name='email'
                            type='material'
                            color='#212121'
                            size={20}
                            raised
                            onPress={() => this.props.navigation.push('MessagesView')}
                        />
                    </View>
                </View>




                <TrainerInsights isVisible={this.state.trainerInsightsVisible} closeModalMethod={this.closeTrainerInsightsModalMethod} />
            </SafeAreaView>
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
        alignSelf: 'center'
    },
    subGraphicText: {
        fontFamily: 'ARSMaquettePro-Medium',
        color: '#FFFFFF',
        padding: 15,
        alignSelf: 'center',
        textAlign: 'center',
    },
    graphicButton: {
        marginBottom: 10,
        alignSelf: 'center',
        borderColor: '#FFFFFF',
        borderWidth: 1,
    },
    viewOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 20,
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
        width: '90%',
        height: '80%',
        borderRadius: 20,
        alignItems: 'center',

        justifyContent: 'space-around',
    },
});

export default connect(mapStateToProps)(withNavigation(LupaHome));