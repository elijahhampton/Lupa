import React, { useEffect, useState } from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    ActionSheetIOS
} from 'react-native';

import {
    Button,
    Divider,
    Appbar,
    Chip,
    Surface,
    DataTable,
    Paragraph,
    Caption,
    Dialog,
    ActivityIndicator,
} from 'react-native-paper';

import {
    Header,
    Left,
    Right,
    Body,
} from 'native-base';

import { Avatar, ListItem } from 'react-native-elements';
import FeatherIcon from 'react-native-vector-icons/Feather'
import { useSelector } from 'react-redux'
import { LineChart } from 'react-native-chart-kit'
import { useNavigation } from '@react-navigation/native';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { MenuIcon } from '../../../icons';
import LupaController from '../../../../controller/lupa/LupaController';
import LOG, { LOG_ERROR } from '../../../../common/Logger';
import LUPA_DB from '../../../../controller/firebase/firebase';
import getBookingStructure from '../../../../model/data_structures/user/booking';
import moment from 'moment';
import { TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { BOOKING_STATUS } from '../../../../model/data_structures/user/types';
import { initStripe, PAY_TRAINER_ENDPOINT, CURRENCY } from '../../../../modules/payments/stripe/index'
import { getLupaUserStructurePlaceholder } from '../../../../controller/firebase/collection_structures';
import { getLupaStoreState } from '../../../../controller/redux/index'
import SessionDashboardComponent from '../../../sessions/modal/component/SessionDashboardComponent'
import axios from 'axios';
import DashboardPrograms from './DashboardPrograms';
import ParQAssessment from './ParQAssessment';
import ProgramPortal from '../../trainer/ProgramPortal';
import { getLupaProgramInformationStructure } from '../../../../model/data_structures/programs/program_structures';

const RedeemCouponCode = ({isVisible, closeModal}) => {
    const [code, setCode] = useState(false)
    const [loading, setLoading] = useState(false);

    const handleOnRedeem = async () => {
        await setLoading(true);

        await setTimeout(() => {
            
        }, 10000)
        setLoading(false);
        closeModal();
    }

    const renderComponent = () => {
        if (loading == true) {
            return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator animating={true} />
            </View>
            )
        } else {
            return (
                <>
                <Dialog.Title>
                Enter your code
            </Dialog.Title>
            <Dialog.Content>
                <TextInput 
                value={code} 
                onChangeText={text => setCode(text)} 
                placeholder="E.g. TRAINER10" />
            </Dialog.Content>
            <Dialog.Actions>
            <Button color="#1089ff" style={{marginVertical: 10}} onPress={handleOnRedeem}>
                Redeem
            </Button>

            <Button color="#1089ff" style={{marginVertical: 10}} onPress={closeModal}>
             Cancel
            </Button>
            </Dialog.Actions>
         
            </>
            )
        }
    }
    return (
        <Dialog visible={isVisible} contentContainerStyle={{}}>
            {renderComponent()}
        </Dialog>
    )
}

function UserDashboard(props) {

    useEffect(() => {
        const currUserObserver = LUPA_DB.collection('bookings').where('requester_uuid', '==', currUserData.user_uuid).where('status', '==', 2).onSnapshot(documentSnapshot => {
            let bookingData = []
            let booking = {}
            documentSnapshot.forEach(doc => {
                booking = doc.data();
                if (typeof (booking.uid) == 'undefined'
                    || booking.uid === 0
                    || booking.status == Number(BOOKING_STATUS.BOOKING_COMPLETED)) {

                } else {
                    if (moment(booking.date).isAfter(moment(new Date())) && moment(new Date().getTime()).isAfter(moment(booking.end_time))) {
                        LUPA_CONTROLLER_INSTANCE.markBookingSessionCompleted(booking);
                    } else {
                        bookingData.push(doc.data());
                     }
                }
            });

            setUserBookings(bookingData);
        });

        LOG('UserDashboard.js', 'Running useEffect')
        return () => currUserObserver();
    }, []);

    const navigation = useNavigation();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    });

    const [lastUpdated, setLastUpdated] = useState(new Date().getTime());
    const [loading, setLoading] = useState(false);
    const [programsModalIsOpen, setProgramModalIsOpen] = useState(false);
    const [trainersModalIsOpen, setTrainersModalIsOpen] = useState(false);
    const [userBookings, setUserBookings] = useState([]);
    const [refreshing, setRefreshing] = useState(false)
    const [redeemModalOpen, setRedeemModalOpen] = useState(false);
    const [parQAssessmentVisible, setParQAssessmentVisible] = useState(false);

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const handleOnRefresh = React.useCallback(() => {
        setRefreshing(true);
        setRefreshing(false);
    }, []);

    const renderUpcomingBooking = () => {
        if (userBookings.length === 0) {
            return (
                <View style={{ top: ((Dimensions.get('window').height) / 3.5) - 65, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                    <Paragraph style={{ color: '#212121', fontFamily: 'Avenir-Medium' }}>
                        <Text style={{color: 'white'}}>
                            You don't have any scheduled bookings.{" "}
                        </Text>
                        <Text style={{color: 'white'}}>
                            Visit the search page to find a variety of Lupa trainers and fitness programs.
                        </Text>
                    </Paragraph>

                    <Button
                        uppercase={false}
                        onPress={() => navigation.push('Search')}
                        style={{ marginVertical: 10, width: '100%', elevation: 0 }}
                        contentStyle={{ width: Dimensions.get('window').width - 20, height: 55 }}
                        mode="contained"
                        theme={{ roundness: 12 }}
                        color="rgb(34, 74, 115)">
                        Search Trainers and Fitness Programs
                </Button>
                </View>

            )
        }

        return userBookings.map((booking, index, arr) => {
            return (
                <SessionDashboardComponent key={index} booking={booking} />
            )
        });
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#23374d'
        }}>
            <Header style={{ backgroundColor: '#23374d', elevation: 0 }}>
                <Left>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <TouchableOpacity onPress={() => navigation.push('Profile', {
                            userUUID: currUserData.user_uuid
                        })}>
                            <Avatar rounded source={{ uri: currUserData.photo_url }} size={40} />
                        </TouchableOpacity>
                        <View style={{ paddingHorizontal: 10 }}>
                            <Text style={{
                                fontSize: 18,
                                color: 'white',
                                fontFamily: 'Avenir-Black'
                            }}>
                                {currUserData.display_name}
                            </Text>
                            <Text style={{
                                color: 'rgb(180, 180, 180)',
                                fontSize: 15,
                                fontFamily: 'Avenir-Medium'
                            }}>
                                Dashboard
                            </Text>
                        </View>
                    </View>
                </Left>

                <Right style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FeatherIcon name="bell" color="#FFFFFF" size={16} style={{ padding: 3, paddingHorizontal: 6 }} onPress={() => navigation.push('Notifications')} />
                    <FeatherIcon name="award" color="#FFFFFF" size={16} style={{ padding: 3, paddingHorizontal: 6 }} onPress={() => navigation.push('Achievements')} />
                    <FeatherIcon name="heart" color="#FFFFFF" size={16} style={{ padding: 3, paddingHorizontal: 6 }} onPress={() => navigation.push('PickInterest')} />
                    <FeatherIcon name="activity" color="#FFFFFF" size={16} style={{ padding: 3, paddingHorizontal: 6 }} onPress={() => navigation.push('ExerciseDataLog')} />
                    <FeatherIcon name="settings" color="#FFFFFF" size={16} style={{ padding: 3, paddingHorizontal: 6 }} onPress={() => navigation.push('Settings')} />
                 
                </Right>
            </Header>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleOnRefresh} />}>
                <View style={{ marginVertical: 10, backgroundColor: '#23374d' }}>
                    <ListItem
                        title="My Programs"
                        titleStyle={{ fontSize: 18, color: 'white', fontFamily: 'Avenir-Heavy' }}
                        subtitle="Access all of your personal programs."
                        subtitleStyle={{ fontSize: 15, color: 'white', fontFamily: 'Avenir-Roman' }}
                        bottomDivider
                        rightIcon={() => <FeatherIcon name="arrow-right" color="#FFFFFF" size={20} />}
                        onPress={() => setProgramModalIsOpen(true)}
                        containerStyle={{backgroundColor: '#23374d'}}
                        contentContainerStyle={{backgroundColor: '#23374d'}}
                        style={{backgroundColor: '#23374d'}}
                    />

<ListItem
                        title="Redeem a coupon"
                        titleStyle={{ fontSize: 18, color: 'white', fontFamily: 'Avenir-Heavy' }}
                        subtitle="Redeem an existing coupon code."
                        subtitleStyle={{ fontSize: 15, color: 'white', fontFamily: 'Avenir-Roman' }}
                        bottomDivider
                        rightIcon={() => <FeatherIcon name="arrow-right" color="#FFFFFF" size={20} />}
                        onPress={() => setRedeemModalOpen(true)}
                        containerStyle={{backgroundColor: '#23374d'}}
                        contentContainerStyle={{backgroundColor: '#23374d'}}
                        style={{backgroundColor: '#23374d'}}
                    />

<ListItem
                        title="PARQ Assessment"
                        titleStyle={{ fontSize: 18, color: 'white', fontFamily: 'Avenir-Heavy' }}
                        subtitle="Redeem an existing coupon code."
                        subtitleStyle={{ fontSize: 15, color: 'white', fontFamily: 'Avenir-Roman' }}
                        bottomDivider
                        rightIcon={() => <FeatherIcon name="arrow-right" color="#FFFFFF" size={20} />}
                        onPress={() => setParQAssessmentVisible(true)}
                        containerStyle={{backgroundColor: '#23374d'}}
                        contentContainerStyle={{backgroundColor: '#23374d'}}
                        style={{backgroundColor: '#23374d'}}
                    />

                   {/* <ListItem
                        title="Pack Programs "
                        titleStyle={{ fontSize: 18, fontFamily: 'Avenir-Heavy' }}
                        subtitle="Access programs shared with your workout buddies."
                        subtitleStyle={{ fontSize: 15, fontFamily: 'Avenir-Roman' }}

                        bottomDivider
                        rightIcon={() => <FeatherIcon name="arrow-right" size={20} />}
                        onPress={() => { }}
                   />*/}
                </View>

                <View style={{ flex: 1, }}>
                    {/* <View style={{ flex: 2, marginVertical: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%', }}>
                    <Surface style={{elevation: 0, margin: 10, flex: 1, padding: 10, justifyContent: 'space-evenly', height: '80%', backgroundColor: 'rgb(35, 73, 115)', borderRadius: 15 }}>
                        <Text style={{ color: 'white', fontFamily: 'Avenir-Heavy', fontSize: 20 }}>
                            Total Sessions Completed
                        </Text>

                        <View>
                            <Text style={{ alignSelf: 'flex-start', padding: 5, fontSize: 30, color: 'white' }}>
                                0
                        </Text>
                            <Chip textStyle={{ fontSize: 12 }} style={{ height: 20, alignItems: 'center', width: '85%', justifyContent: 'flex-start' }}>
                                ~ Since yesterday
                        </Chip>
                        </View>

                    </Surface>

                    <View style={{ margin: 10, flex: 1, height: '90%', paddingVertical: 20, justifyContent: 'space-between' }}>
                        <View style={{backgroundColor: 'rgb(240, 243, 252)', borderRadius: 8, justifyContent: 'space-evenly', padding: 10, alignItems: 'flex-start'}}>
                            <View style={{backgroundColor: 'rgb(35, 73, 115)', padding: 10, paddingVertical: 10, borderRadius: 5}}>
                                <Text style={{fontSize: 12, color: 'white'}}>
                                    0
                                </Text>
                            </View>

                            <View style={{paddingTop: 8}}>
                                <Text style={{fontSize: 12}}>
                                    Programs Completed
                                </Text>
                                <Text style={{fontSize: 12, fontFamily: 'Avenir-Roman'}}>
                                    Recently updated
                                </Text>
                            </View>
                        </View>

                        <TouchableWithoutFeedback onPress={() => navigation.push('Search')}>
                        <View style={{backgroundColor: 'rgb(240, 243, 252)', borderRadius: 8, marginVertical: 10, padding: 10, alignItems: 'flex-start'}}>
                            <FeatherIcon name="activity" size={18} color="rgb(35, 73, 115)" style={{marginVertical: 5}} />
                            <Text style={{fontFamily: 'Avenir-Roman', color: '#1089ff'}}>
                                Find more programs
                            </Text>
                        </View>
                        </TouchableWithoutFeedback>
    </View> 
    </View> */}

                    <View style={{ flex: 2, marginVertical: 15 }}>
                        {
                            userBookings.length === 0 ?
                                null
                                :
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                    <Text style={{color: 'white', fontSize: 20, fontFamily: 'Avenir-Heavy' }}>
                                        Bookings
                      </Text>
                                </View>
                        }

                        {renderUpcomingBooking()}

                    </View>
                </View>
            </ScrollView>
            <ProgramPortal isVisible={programsModalIsOpen} closeModal={() => setProgramModalIsOpen(false)} clientData={{client: currUserData, program_data: getLupaProgramInformationStructure()}} />
            <RedeemCouponCode isVisible={redeemModalOpen} closeModal={() => setRedeemModalOpen(false)} />
            <ParQAssessment isVisible={parQAssessmentVisible} closeModal={() => setParQAssessmentVisible(false)} loadAnswers={true} />
        </View>
    )
}

export default UserDashboard;