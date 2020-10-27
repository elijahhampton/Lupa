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
    Surface,
    DataTable,
    Caption, 
} from 'react-native-paper';

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
import axios from 'axios';
function TrainerDashboard(props) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    });

    const navigation = useNavigation();

    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState({
        purchaseMetaData: {
            purchase_history: [],
            gross_pay: 0,
            net_pay: 0,
        },
        interactions: {
            numInteractions: 0,
            shares: 0,
            views: 0
        }
    })
    const [lastUpdated, setLastUpdated] = useState(new Date().getTime());
    const [loading, setLoading] = useState(false);
    const [componentReady, setComponentReady] = useState(false);
    const [currPurchaseHistoryStartIndex, setCurrPurchaseHistoryStartIndex] = useState(0);
    const [currPurchaseHistoryEndIndex, setCurrPurchaseHistoryEndIndex] = useState(3);
    const [currPage, setCurrPage] = useState(1)
    const [userBookings, setUserBookings] = useState([]);
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [paymentSuccessful, setPaymentSuccessful] = useState(false);

    useEffect(() => {
        const currUserObserver = LUPA_DB.collection('bookings').where('trainer_uuid', '==', currUserData.user_uuid).where('status', '==', 2).onSnapshot(documentSnapshot => {
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

        LOG('TrainerDashboard.js', 'Running useEffect')
        return () => currUserObserver();
    }, []);

    const handleOnRefresh =  React.useCallback(() => {
       
    }, []);

    const renderDataTableRows = () => {
        if (componentReady === false || typeof(data) == 'undefined' || data.purchaseMetaData.purchase_history.length === 0) {
            return (
                <Caption onPress={() => navigation.push('CreatePost')} style={{paddingHorizontal: 10, alignSelf: 'center', paddingVertical: 10}}>
                You haven't received any booking request.  {" "}
                <Caption style={{color: '#1089ff',}}>
                    Create a vlog to advertise your content.
                </Caption> 
                </Caption>
            )
        }

        //TODO: Possible Bug
        return data.purchaseMetaData.purchase_history.slice(currPurchaseHistoryStartIndex, currPurchaseHistoryEndIndex).map((purchaseHistory, index, arr) => {
   
            return (
                <DataTable.Row>
                <DataTable.Cell>{purchaseHistory.purchaser} </DataTable.Cell>
                <DataTable.Cell >{purchaseHistory.date_purchased.seconds}</DataTable.Cell>
                <DataTable.Cell>{purchaseHistory.program_name}</DataTable.Cell>
              </DataTable.Row>
            )
        })
    }

    const renderDataTablePagination = () => {
        if (componentReady === false || typeof(data) == 'undefined' || data.purchaseMetaData.purchase_history.length === 0) {
            return (
               null
            )
        } else {
            return (
            <DataTable.Pagination
                page={currPage}
                numberOfPages={componentReady === true ? data.purchaseMetaData.purchase_history : 0}
                onPageChange={(page) => handleNextPage(page)}
                label={`1-3 of ${Math.round(data.purchaseMetaData.purchase_history.length / currPurchaseHistoryEndIndex)}`}
              />
            )
        }
    }

    const handleNextPage = (page) => {
       let updatedStartIndex = currPurchaseHistoryStartIndex + 3
       setCurrPurchaseHistoryStartIndex(updatedStartIndex)
      
       let updatedEndIndex = currPurchaseHistoryEndIndex + 3;
       setCurrPurchaseHistoryEndIndex(updatedEndIndex)

    }

    const renderGrossPay = () => {
        if (typeof(data) == 'undefined') {
            return 0;
        }

        try {
            return data.purchaseMetaData.gross_pay
        } catch(error) {
            return 0;
        }
    }

    const renderNetPay = () => {
        if (typeof(data) == 'undefined') {
            return 0;
        }

        try {
            return data.purchaseMetaData.net_pay;
        } catch(error) {
            return 0;
        }
    }

    const renderSales = () => {
        if (typeof(data) == 'undefined' || componentReady === false) {
            return 0;
        }

        try {
            return data.purchaseMetaData.purchase_history.length;
        } catch(error) {
            return 0;
        }
    }

    const renderShares = () => {
        if (typeof(data) == 'undefined') {
            return 0;
        }

        try {
            return data.interactions.shares;
        } catch(error) {
            return 0;
        }
    }

       /**
     * Sends request to server to complete payment
     */
    const makePaymentToTrainer = async (amount, booking) => {
        //Create an idemptoencyKey to prevent double transactions
        try {
        const idempotencyKey = await Math.random().toString()
  console.log('make payment to trainer start')
        //Get a copy of the current user data to pass some fields into the request
        const updatedUserData = getLupaStoreState().Users.currUserData;

        let requesterUserData = getLupaUserStructurePlaceholder()
        console.log(booking);
        await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(booking.requester_uuid).then(data => {
            requesterUserData = data
        }).catch(err => {
            console.log(err)
        })

        console.log(requesterUserData)
        
        console.log('about to make request')
        console.log(requesterUserData.stripe_metadata.card_source)
        //Make the payment request to firebase with axios
        axios({
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            url: PAY_TRAINER_ENDPOINT,
            data: JSON.stringify({
                requester_card_source: requesterUserData.stripe_metadata.card_source,
                customer_id: requesterUserData.stripe_metadata.stripe_id,
                trainer_card_source: updatedUserData.stripe_metadata.card_source,
                trainer_account_id: updatedUserData.stripe_metadata.account_id,
                amount: amount,
                currency: CURRENCY,
                source: requesterUserData.stripe_metadata.card_source,
                idempotencyKey: idempotencyKey,
            })
        }).then(response => {
            console.log('axios request worked!!!')
        }).catch(err => {
            console.log(err)
            setPaymentSuccessful(false)
            setPaymentComplete(true)
        })
    } catch(error ) {
        console.log(error)
    }
    }
  
    /**
     * Handles program purchase process
     */
    const handlePayBookingCost = async (amount, booking) => {
        await setLoading(true)
         //handle stripe
         await initStripe()

         //Send request to make payment
         try {
             await makePaymentToTrainer(amount, booking)
         } catch (error) {
             await setPaymentComplete(false)
             await setPaymentSuccessful(false)
             setLoading(false);
             return;
         }
  
        await setLoading(false);
    }

    handleBookingSessionCompleted = async (booking) => {
        
        //handlepayment request
        try {
        await handlePayBookingCost(2, booking);
        } catch(error) {
            alert(error);
            LOG_ERROR('TrainerDashboard.js', 'Failed payment in handlePayBookingCost', error);
            return;
        }

        LUPA_CONTROLLER_INSTANCE.markBookingSessionCompleted(booking);
    }

    const openBookingsActionSheet = (booking) => {
        if (booking.status == BOOKING_STATUS.BOOKING_ACCEPTED
            && moment(new Date().getTime()).isSameOrAfter(moment(new Date(booking.end_time)))) {
                ActionSheetIOS.showActionSheetWithOptions(
                    {
                      options: ["Cancel", "Session Completed"],
                      destructiveButtonIndex: 0,
                      cancelButtonIndex: 0
                    },
                    buttonIndex => {
                      if (buttonIndex === 0) {
                        // cancel action
                      } else if (buttonIndex === 1) {
                          handleBookingSessionCompleted(booking)
                      }
                    }
                  );
                  return;
        }

        if (booking.status == BOOKING_STATUS.BOOKING_ACCEPTED 
            && moment(booking.start_time).subtract(30, 'minutes').isSameOrAfter(moment(new Date().getDate()))) {
                ActionSheetIOS.showActionSheetWithOptions(
                    {
                      options: ["Cancel", "Session Completed"],
                      destructiveButtonIndex: 0,
                      cancelButtonIndex: 0
                    },
                    buttonIndex => {
                      if (buttonIndex === 0) {
                        // cancel action
                      } else if (buttonIndex === 1) {
                          handleBookingSessionCompleted(booking)
                      }
                    }
                  );
              return;
        }

        ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ["Cancel", "Session Completed"],
              destructiveButtonIndex: 0,
              cancelButtonIndex: 0
            },
            buttonIndex => {
              if (buttonIndex === 0) {
                // cancel action
              } else if (buttonIndex === 1) {
                  handleBookingSessionCompleted(booking)
              }
            }
          );
    }

    const renderBookings = () => {
        if (userBookings.length === 0) {
            return (
                <Caption>
                You don't have any scheduled bookings.
            </Caption>
            )
        }

        return userBookings.map((booking, index, arr) => {
            return (
                <>
            <View key={booking.uid} style={{backgroundColor: 'white', alignSelf: 'center', width: Dimensions.get('window').width, padding: 10}}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}>
                <Avatar size={70} rounded={false} containerStyle={{backgroundColor: 'black'}} />
                <View style={{paddingHorizontal: 10}}>
                    <Text style={{fontSize: 16, fontFamily: 'Avenir-Medium', paddingVertical: 10}}>
                        Elijah Hampton
                    </Text>
                    <Text style={{fontSize: 15, fontFamily: 'Avenir-Heavy'}}>
                        {moment(booking.date).format('LL').toString()}
                    </Text>
                    <Text style={{fontSize: 15, fontFamily: 'Avenir-Medium', color: 'rgb(210, 210, 210)'}}>
                       { booking.start_time}
                    </Text>
                </View>
                </View>
                <View>
                    <Button onPress={() => openBookingsActionSheet(booking)} uppercase={false} color="#1089ff" mode="contained" theme={{roundness: 0}} style={{alignSelf: 'center', elevation: 0, marginVertical: 10, width: '100%'}} contentStyle={{width: '100%', height: 50}}>
                        <Text>
                            Booking Options
                        </Text>
                    </Button>
                </View>

            </View>
            <Divider style={{width: Dimensions.get('window').width}} />
            </>
            )
        });
    }

    const renderViews = () => {
        if (typeof(data) == 'undefined') {
            return 0;
        }

        try {
            return data.interactions.views;
        } catch(error) {
            return 0;
        }
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#FFFFFF'
        }}>
             <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 0, borderBottomWidth: 0.5, borderColor: 'rgb(174, 174, 178)'}}>
                <MenuIcon onPress={() => navigation.openDrawer()} />
                <Appbar.Content title="Dashboard"  titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20}} />
                <Appbar.Action onPress={() => navigation.push('Messages')} icon={() => <Feather1s thin={true} name="mail" size={20} />}/>
              <Appbar.Action onPress={() => navigation.push('Notifications')} icon={() => <Feather1s thin={true} name="bell" size={20} />}/>
</Appbar.Header> 
 <ScrollView refreshControl={<RefreshControl refreshing={refreshing}  onRefresh={handleOnRefresh} />} contentContainerStyle={{backgroundColor: '#FFFFFF'}}>


                        <View style={{marginVertical: 15, padding: 10}}>
<Text style={{fontSize: 13, paddingVertical: 10, fontWeight: '600'}}>
                           Active Bookings
                        </Text>
                        <ScrollView contentContainerStyle={{ alignItems: 'center'}}>
                        {renderBookings()}
                        </ScrollView>
                      
</View>

</ScrollView>
        </View>
    )
}

export default TrainerDashboard;