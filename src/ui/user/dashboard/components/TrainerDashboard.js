import React, { useEffect, useState } from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    ScrollView,
    RefreshControl,
    ActionSheetIOS,
    TouchableOpacity
} from 'react-native';

import {
    Button,
    Chip,
    Divider,
    Paragraph,
    FAB,
    Appbar,
    Surface,
    DataTable,
    Caption,
} from 'react-native-paper';

import {
    Header,
    Right,
    Left,
    Body
} from 'native-base';

import { Avatar } from 'react-native-elements';
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
import BookingInformationModal from '../../../sessions/modal/BookingInformationModal';
import axios from 'axios';
import SessionDashboardComponent from '../../../sessions/modal/component/SessionDashboardComponent';
import { Constants } from 'react-native-unimodules';
function TrainerDashboard(props) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    });

    const navigation = useNavigation();

    const [refreshing, setRefreshing] = useState(false);
    const [userBookings, setUserBookings] = useState([]);

    useEffect(() => {
        const currUserObserver = LUPA_DB.collection('bookings').where('trainer_uuid', '==', currUserData.user_uuid).where('status', '==', 2).onSnapshot(documentSnapshot => {
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

        LOG('TrainerDashboard.js', 'Running useEffect')
        return () => currUserObserver();
    }, []);

    const handleOnRefresh = () => {

    }


    const renderUpcomingBooking = () => {
        if (userBookings.length === 0) {
            return (
                <View style={{top: (Dimensions.get('window').height) / 3.5, alignItems: 'center', justifyContent: 'center', padding: 10}}>
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
                color="rgb(34, 74, 115)" >
                    Search Trainers and Fitness Programs
                </Button>
                </View>
              
            )
        }

        return userBookings.map((booking, index, arr) => {
            return (
                <SessionDashboardComponent key={index} booking={booking} />
            )
        })
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#23374d'
        }}>
            
            <Header style={{ backgroundColor: '#23374d', elevation: 0,}}>
            
        <Left>
        <View style={{flexDirection: 'row', alignItems: 'center',}}>
        <TouchableOpacity onPress={() => navigation.push('Profile', {
                            userUUID: currUserData.user_uuid
                        })}>
                            <Avatar rounded source={{ uri: currUserData.photo_url }} size={40} />
                        </TouchableOpacity>
          <View style={{paddingHorizontal: 10}}>
          <Text style={{ 
      fontSize: 18,
      fontFamily: 'Avenir-Black', color: 'white'}}>
                {currUserData.display_name}
              </Text>
              <Text style={{
                  color: 'rgb(180, 180, 180)',
      fontSize: 15,
      fontFamily: 'Avenir-Medium'}}>
                Dashboard
              </Text>
          </View>
    
        </View>

        </Left>

        <Right style={{flexDirection: 'row', alignItems: 'center'}}>
       
               <FeatherIcon color="#FFFFFF" name="bell" size={20} style={{padding: 3, paddingHorizontal: 10}} onPress={() => navigation.push('Notifications')} />
               <FeatherIcon color="#FFFFFF"  name="award" size={20} style={{padding: 3, paddingHorizontal: 10}} onPress={() => navigation.push('Achievements')} />
               <FeatherIcon color="#FFFFFF" name="heart" size={20} style={{padding: 3, paddingHorizontal: 10}} onPress={() => navigation.push('PickInterest')} />
               <FeatherIcon color="#FFFFFF"  name="activity" size={20} style={{ padding: 3, paddingHorizontal: 10 }} onPress={() => navigation.push('ExerciseDataLog')} />
               <FeatherIcon color="#FFFFFF" name="settings" size={20} style={{padding: 3, paddingHorizontal: 10}} onPress={() => navigation.push('Settings')} />
               
        </Right>
             
            </Header>
          
            <ScrollView>
            <View style={{ flex: 1, }}>
               {/* <View style={{ flex: 2, marginVertical: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%', }}>
                    <View style={{ margin: 10, flex: 1, padding: 10, justifyContent: 'space-evenly', height: '80%', backgroundColor: 'rgb(35, 73, 115)', borderRadius: 15 }}>
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

                    </View>

                    <View style={{ margin: 10, flex: 1, height: '90%', paddingVertical: 20, justifyContent: 'space-between' }}>
                        <View style={{backgroundColor: 'rgb(240, 243, 252)', borderRadius: 8, justifyContent: 'space-evenly', padding: 10, alignItems: 'flex-start'}}>
                            <View style={{backgroundColor: 'rgb(35, 73, 115)', padding: 10, paddingVertical: 10, borderRadius: 5}}>
                                <Text style={{fontSize: 12, color: 'white'}}>
                                    0
                                </Text>
                            </View>

                            <View style={{paddingTop: 8}}>
                                <Text style={{fontSize: 12}}>
                                    Program Views
                                </Text>
                                <Text style={{fontSize: 12, fontFamily: 'Avenir-Roman'}}>
                                    Recently updated
                                </Text>
                            </View>
                        </View>

                        <View style={{backgroundColor: 'rgb(240, 243, 252)', borderRadius: 8, marginVertical: 10, padding: 10, alignItems: 'flex-start'}}>
                            <View style={{ backgroundColor: 'rgb(35, 73, 115)',  padding: 10, borderRadius: 5}}>
                                <Text style={{fontSize: 12, color: 'white'}}>
                                    0
                                </Text>
                            </View>

                            <View style={{paddingTop: 8}}>
                                <Text style={{fontSize: 12}}>
                                    Earnings
                                </Text>
                                <Text style={{fontSize: 12, fontFamily: 'Avenir-Roman'}}>
                                    Recently updated
                                </Text>
                            </View>
                        </View>
                    </View>
    </View>*/}
                <View style={{ flex: 2, marginVertical: 10, }}>
                  {
                      userBookings.length === 0 ?
                      null
                      :
                      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10}}>
                      <Text style={{color: '#FFFFFF', fontSize: 20, fontFamily: 'Avenir-Heavy'}}>
                          Bookings
                      </Text>
                      </View>
                  }
                 

                    {renderUpcomingBooking()}
                   
                </View>
            </View>

            </ScrollView>
            <FAB onPress={() => navigation.push('MyClients')} icon={() => <FeatherIcon name="users" size={22} color="white" />} style={{ backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16 }} />
        </View>
    )
}

export default TrainerDashboard;