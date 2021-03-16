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
                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }}>
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
            <Header style={{ backgroundColor: '#23374d', elevation: 0, borderBottomColor: 'transparent' }}>

                <Right style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FeatherIcon name="bell" color="#3d74ad" size={16} style={{ padding: 3, paddingHorizontal: 6 }} onPress={() => navigation.push('Notifications')} />
                    <FeatherIcon name="award" color="#3d74ad" size={16} style={{ padding: 3, paddingHorizontal: 6 }} onPress={() => navigation.push('Achievements')} />
                    <FeatherIcon name="heart" color="#3d74ad" size={16} style={{ padding: 3, paddingHorizontal: 6 }} onPress={() => navigation.push('PickInterest')} />
                    <FeatherIcon name="activity" color="#3d74ad" size={16} style={{ padding: 3, paddingHorizontal: 6 }} onPress={() => navigation.push('ExerciseDataLog')} />
                    <FeatherIcon name="settings" color="#3d74ad" size={16} style={{ padding: 3, paddingHorizontal: 6 }} onPress={() => navigation.push('Settings')} />
                 
                </Right>
            </Header>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleOnRefresh} />}>
                <View style={{padding: 10}}>
                    <Text style={{color: '#3d74ad', fontSize: 25, fontWeight: '600'}}>
                        Hi,
                    </Text>
                    <Text style={{paddingVertical: 3, color: '#EEEEEE', fontSize: 25, fontWeight: '700'}}>
                        {currUserData.display_name}
                    </Text>
                </View>
                <View style={{ marginVertical: 10, backgroundColor: '#23374d' }}>
                    <ListItem
                        title="My Programs"
                        titleStyle={{ fontSize: 18, color: 'white', fontFamily: 'Avenir-Heavy' }}
                        subtitle="Access all of your personal programs."
                        subtitleStyle={{ fontSize: 15, color: 'white', fontFamily: 'Avenir-Roman' }}
                        leftIcon={() => <Feather1s name="activity" size={20} color="#FFFFFF" />}
                        rightIcon={() => <FeatherIcon name="arrow-right" color="#FFFFFF" size={20} />}
                        onPress={() => setProgramModalIsOpen(true)}
                        containerStyle={{backgroundColor: 'rgb(34, 74, 115)', margin: 5, width: Dimensions.get('window').width - 20, borderRadius: 15, alignSelf: 'center'}}
                        contentContainerStyle={{backgroundColor: 'rgb(34, 74, 115)',}}
                        style={{backgroundColor: '#23374d'}}

                    />

<ListItem
                        title="Redeem a coupon"
                        titleStyle={{ fontSize: 18, color: 'white', fontFamily: 'Avenir-Heavy' }}
                        subtitle="Redeem an existing coupon code."
                        subtitleStyle={{ fontSize: 15, color: 'white', fontFamily: 'Avenir-Roman' }}
                        leftIcon={() => <Feather1s name="dollar-sign" size={20} color="#FFFFFF" />}
                        rightIcon={() => <FeatherIcon name="arrow-right" color="#FFFFFF" size={20} />}
                        onPress={() => setRedeemModalOpen(true)}
                        containerStyle={{backgroundColor: 'rgb(34, 74, 115)', margin: 5, width: Dimensions.get('window').width - 20, borderRadius: 15, alignSelf: 'center'}}
                        contentContainerStyle={{backgroundColor: 'rgb(34, 74, 115)',}}
                        style={{backgroundColor: '#23374d'}}
                    />

<ListItem
                        title="PARQ Assessment"
                        titleStyle={{ fontSize: 18, color: 'white', fontFamily: 'Avenir-Heavy' }}
                        subtitle="Redeem an existing coupon code."
                        subtitleStyle={{ fontSize: 15, color: 'white', fontFamily: 'Avenir-Roman' }}
                        leftIcon={() => <Feather1s name="archive" size={20} color="#FFFFFF" />}
                        rightIcon={() => <FeatherIcon name="arrow-right" color="#FFFFFF" size={20} />}
                        onPress={() => setParQAssessmentVisible(true)}
                        containerStyle={{backgroundColor: 'rgb(34, 74, 115)', margin: 5, width: Dimensions.get('window').width - 20, borderRadius: 15, alignSelf: 'center'}}
                        contentContainerStyle={{backgroundColor: 'rgb(34, 74, 115)',}}
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

                    <View style={{ flex: 2, marginVertical: 15 }}>
                        {
                            userBookings.length === 0 ?
                                null
                                :
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                    <Text style={{color: '#3d74ad', fontSize: 25, fontFamily: 'Avenir-Heavy' }}>
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