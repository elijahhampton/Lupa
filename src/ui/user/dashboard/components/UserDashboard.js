import React, { useEffect, useState } from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    ScrollView,
    RefreshControl,
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
} from 'react-native-paper';

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
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { BOOKING_STATUS } from '../../../../model/data_structures/user/types';
import { initStripe, PAY_TRAINER_ENDPOINT, CURRENCY } from '../../../../modules/payments/stripe/index'
import { getLupaUserStructurePlaceholder } from '../../../../controller/firebase/collection_structures';
import { getLupaStoreState } from '../../../../controller/redux/index'
import SessionDashboardComponent from '../../../sessions/modal/component/SessionDashboardComponent'
import axios from 'axios';
import DashboardPrograms from './DashboardPrograms';

function UserDashboard(props) {

    useEffect(() => {
        const currUserObserver = LUPA_DB.collection('bookings').where('requester_uuid', '==', currUserData.user_uuid).where('status', '==', 2).onSnapshot(documentSnapshot => {
            let bookingData = []
            let booking = {}
            documentSnapshot.forEach(doc => {
            booking = doc.data();
            if (typeof(booking.uid) == 'undefined' 
            || booking.uid === 0 
            || booking.status == BOOKING_STATUS.BOOKING_COMPLETED) {
                
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
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const handleOnRefresh =  React.useCallback(() => {
        setRefreshing(true);
        /*const programsToCheck = currUserData.waitlisted_programs
        for (let i = 0; i < programsToCheck.length; i++) {
            alert('refreshing on: ' + programsToCheck[i])
            LUPA_CONTROLLER_INSTANCE.checkProgramWaitlistForMatches(programsToCheck[i], currUserData);
        }*/
        setRefreshing(false);
    }, []);

    const renderUpcomingBooking = () => {
        if (userBookings.length === 0) {
            return (
                <View style={{padding: 10}}>
  <Paragraph style={{color: '#212121', fontFamily: 'Avenir-Medium'}}>
                <Text>
                    You don't have any scheduled bookings.{" "}
                    </Text>
                    <Text>
                       Visit the search page to find a variety of Lupa trainers and fitness programs.
                    </Text>
                </Paragraph>

                <Button 
                uppercase={false}
                onPress={() => navigation.push('Search')} 
                style={{marginVertical: 10, width: '100%', elevation: 0}} 
                contentStyle={{width: Dimensions.get('window').width - 20, height: 55}} 
                mode="contained" 
                theme={{roundness: 12}} 
                color="#1089ff">
                    Search Trainers and Fitness Programs
                </Button>
                </View>
              
            )
        }

        return <SessionDashboardComponent booking={userBookings[0]} />
    }
    
    return (
        <View style={{
            flex: 1,
            backgroundColor: '#FFFFFF'
        }}>
            <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 0 }}>
                <MenuIcon onPress={() => navigation.openDrawer()} />
                <Appbar.Content title='Dashboard' titleStyle={{ alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20 }} />
            </Appbar.Header>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleOnRefresh} />}> 
            <View style={{marginVertical: 10}}>
                    <ListItem 
                    title="My Programs" 
                    titleStyle={{fontSize: 16, fontFamily: 'Avenir-Medium'}} 
                    subtitle="Access all of your programs." 
                    subtitleStyle={{fontSize: 15, fontFamily: 'Avenir-Roman'}} 
              
                    bottomDivider
                    rightIcon={() => <FeatherIcon name="arrow-right" size={20} />}
                    onPress={() => setProgramModalIsOpen(true)}
                    />
                </View>
                
            <View style={{ flex: 1, }}>
                <View style={{ flex: 2, marginVertical: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%', }}>
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
                </View>

                <View style={{ flex: 2, marginVertical: 15}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10}}>
                    <Text style={{fontFamily: 'Avenir-Heavy', fontSize: 18}}>
                        Upcoming Session
                    </Text>
                    </View>

                    {renderUpcomingBooking()}
                   
                </View>
            </View>
            </ScrollView>
            <DashboardPrograms isVisible={programsModalIsOpen} closeModal={() => setProgramModalIsOpen(false)} />
        </View>
    )
}

export default UserDashboard;