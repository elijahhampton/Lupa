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
import BookingInformationModal from '../../../sessions/modal/BookingInformationModal';
import axios from 'axios';
import SessionDashboardComponent from '../../../sessions/modal/component/SessionDashboardComponent';
import { Constants } from 'react-native-unimodules';
import ParQAssessment from './ParQAssessment';
function TrainerDashboard(props) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    });

    const navigation = useNavigation();

    const [refreshing, setRefreshing] = useState(false);
    const [userBookings, setUserBookings] = useState([]);
    const [redeemModalOpen, setRedeemModalOpen] = useState(false);
    const [parQAssessmentVisible, setParQAssessmentVisible] = useState(false);

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
            
            <Header style={{ backgroundColor: '#23374d', elevation: 0, borderBottomColor: 'transparent'}}>
            
        <Right style={{flexDirection: 'row', alignItems: 'center'}}>
       
               <FeatherIcon color="#3d74ad" name="bell" size={20} style={{padding: 3, paddingHorizontal: 10}} onPress={() => navigation.push('Notifications')} />
               <FeatherIcon color="#3d74ad"  name="award" size={20} style={{padding: 3, paddingHorizontal: 10}} onPress={() => navigation.push('Achievements')} />
               <FeatherIcon color="#3d74ad" name="heart" size={20} style={{padding: 3, paddingHorizontal: 10}} onPress={() => navigation.push('PickInterest')} />
               <FeatherIcon color="#3d74ad"  name="activity" size={20} style={{ padding: 3, paddingHorizontal: 10 }} onPress={() => navigation.push('ExerciseDataLog')} />
               <FeatherIcon color="#3d74ad" name="settings" size={20} style={{padding: 3, paddingHorizontal: 10}} onPress={() => navigation.push('Settings')} />
               
        </Right>
             
            </Header>
          
            <ScrollView>
            <View style={{ flex: 1, }}>
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
                        title="PARQ Assessment"
                        titleStyle={{ fontSize: 18, color: 'white', fontFamily: 'Avenir-Heavy' }}
                        subtitle="Review your most recent PARQ."
                        subtitleStyle={{ fontSize: 15, color: 'white', fontFamily: 'Avenir-Roman' }}
                        rightIcon={() => <FeatherIcon name="arrow-right" color="#FFFFFF" size={20} />}
                        onPress={() => setParQAssessmentVisible(true)}
                        containerStyle={{backgroundColor: 'rgb(34, 74, 115)', margin: 5, width: Dimensions.get('window').width - 20, borderRadius: 15, alignSelf: 'center'}}
                        contentContainerStyle={{backgroundColor: 'rgb(34, 74, 115)',}}
                        style={{backgroundColor: '#23374d'}}
                    />
           </View> 

                  {
                      userBookings.length === 0 ?
                      null
                      :
                      <View style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10}}>
                      <Text style={{color: '#3d74ad', fontSize: 25, fontFamily: 'Avenir-Heavy' }}>
                          Bookings
                      </Text>
                      </View>
                  }
                 

                    {renderUpcomingBooking()}
                   
            </View>

            </ScrollView>
            <FAB onPress={() => navigation.push('MyClients')} icon={() => <FeatherIcon name="users" size={22} color="white" />} style={{ backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16 }} />
            <ParQAssessment isVisible={parQAssessmentVisible} closeModal={() => setParQAssessmentVisible(false)} loadAnswers={true} />
           
        </View>
    )
}

export default TrainerDashboard;