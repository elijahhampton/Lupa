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
import LOG from '../../../../common/Logger';
import LUPA_DB from '../../../../controller/firebase/firebase';
import getBookingStructure from '../../../../model/data_structures/user/booking';
import moment from 'moment';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { BOOKING_STATUS } from '../../../../model/data_structures/user/types';
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
    const [componentReady, setComponentReady] = useState(false);
    const [currPurchaseHistoryStartIndex, setCurrPurchaseHistoryStartIndex] = useState(0);
    const [currPurchaseHistoryEndIndex, setCurrPurchaseHistoryEndIndex] = useState(3);
    const [currPage, setCurrPage] = useState(1)
    const [userBookings, setUserBookings] = useState([]);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                await LUPA_CONTROLLER_INSTANCE.fetchDashboardData().then(data => {
                     setData(data);
                 });
            } catch(error) {
                setData({})
                setComponentReady(false)
            }
        }

      
        const currUserObserver = LUPA_DB.collection('bookings').where('trainer_uuid', '==', currUserData.user_uuid).where('status', '==', 2).onSnapshot(documentSnapshot => {
            let bookingData = []
            let booking = {}
            documentSnapshot.forEach(doc => {
            booking = doc.data();
            if (typeof(booking.uid) == 'undefined' 
            || booking.uid === 0 
            || booking.status == BOOKING_STATUS.BOOKING_COMPLETED) {
                
            } else {
                if (moment(booking.date).isAfter(moment(new Date())) || moment(new Date().getTime()).isAfter(moment(booking.end_time))) {
                    LUPA_CONTROLLER_INSTANCE.markBookingSessionCompleted(booking);
                } else {
                    bookingData.push(doc.data());
                }
            }
           });

            setUserBookings(bookingData);
        });

        LOG('TrainerDashboard.js', 'Running useEffect')
        setComponentReady(false);
        fetchDashboardData();
        setComponentReady(true)
        return () => currUserObserver();
    }, [componentReady]);

    const handleOnRefresh =  React.useCallback(() => {
        setRefreshing(true);

        LUPA_CONTROLLER_INSTANCE.fetchDashboardData().then(data => {
            setData(data);
        }).then(() => {
            setLastUpdated(new Date().getTime())
            setRefreshing(false);
        })
    }, []);

    const renderDataTableRows = () => {
        if (componentReady === false || typeof(data) == 'undefined' || data.purchaseMetaData.purchase_history.length === 0) {
            return (
                <Caption onPress={() => navigation.push('CreatePost')} style={{paddingHorizontal: 10, alignSelf: 'center', paddingVertical: 10}}>
                You haven't received any program purchases.{" "}
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
    const makePaymentToTrainer = async (token, amount, booking) => {
        //Create an idemptoencyKey to prevent double transactions
        const idempotencyKey = await Math.random().toString()
  
        //Get a copy of the current user data to pass some fields into the request
        const userData = LUPA_STATE.Users.currUserData

        let requester_stripe_id = undefined;
        await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(booking.requester_uuid).then(data => {
            requester_stripe_id = data.stripe_metadata.stripe_id;
        })
  
        //Make the payment request to firebase with axios
        axios({
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            url: PAY_TRAINER_ENDPOINT,
            data: JSON.stringify({
                requester_stripe_id: requester_stripe_id,
                trainer_stripe_id: userData.stripe_metadata.stripe_id,
                amount: amount,
                currency: CURRENCY,
                token: token,
                idempotencyKey: idempotencyKey,
            })
        }).then(response => {
        }).catch(err => {
            setPaymentSuccessful(false)
            setPaymentComplete(true)
        })
    }
  
    /**
     * Handles program purchase process
     */
    const handlePayBookingCost = async (amount) => {
        await setLoading(true)
         //handle stripe
         await initStripe();
  
         //collect payment information and generate payment token
         try {
             setToken(null)
             
             //retrieve token from the requester TODO NEXT
            

             //check if token is undefined
             if (token == undefined) {
                 throw LUPA_ERR_TOKEN_UNDEFINED;
             }
             
             await setToken(token)
         } catch (error) {
             setLoading(false)
             return;
         }
  
         //get the token from the state
         const generatedToken = await token;
  
         //Send request to make payment
         try {
             await makePayment(generatedToken, amount)
         } catch (error) {
             await setPaymentComplete(false)
             await setPaymentSuccessful(false)
             setLoading(false);
             return;
         }
  
        await setLoading(false);
    }

    handleBookingSessionCompleted = () => {
        //handlepayment request

        LUPA_CONTROLLER_INSTANCE.markBookingSessionCompleted(booking);
    }

    const openBookingsActionSheet = (booking) => {
        if (booking.status == BOOKING_STATUS.BOOKING_ACCEPTED
            && moment(new Date().getTime()).isSameOrAfter(moment(booking.end_time))) {
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
                          LUPA_CONTROLLER_INSTANCE.markBookingSessionCompleted(booking);
                      }
                    }
                  );
                  return;
        }

        if (booking.status == BOOKING_STATUS.BOOKING_ACCEPTED 
            && moment(booking.start_time).subtract(30, 'minutes').isSameOrAfter(moment(new Date().getDate()))) {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                  options: ["Cancel"],
                  destructiveButtonIndex: 0,
                  cancelButtonIndex: 0
                },
                buttonIndex => {
                  if (buttonIndex === 0) {
                    // cancel action
                  }
                }
              );
              return;
        }

        ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ["Cancel", "Cancel Booking"],
              destructiveButtonIndex: 0,
              cancelButtonIndex: 0
            },
            buttonIndex => {
              if (buttonIndex === 0) {
                // cancel action
              } else if (buttonIndex === 1) {
                LUPA_CONTROLLER_INSTANCE.handleCancelBooking(booking)
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
                        {moment(booking.start_time).format('LT').toString()}
                    </Text>
                </View>
                </View>
                <View>
                    <Button onPress={() => openBookingsActionSheet(booking)} uppercase={false} color="#1089ff" mode="outlined" theme={{roundness: 0}} style={{alignSelf: 'center', elevation: 0, marginVertical: 10, width: '100%'}} contentStyle={{width: '100%', height: 50}}>
                        <Text>
                            Booking Options
                        </Text>
                    </Button>
                </View>

                <Feather1s color="black" name="info" size={20} style={{position: 'absolute', top: 0, right: 0, margin: 10}} />
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
        componentReady === true ?
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
 <View style={{marginVertical: 15}}>
                        <Text style={{padding: 10, fontSize: 13, fontWeight: '600'}}>
                           Booking History
                        </Text>
                        <DataTable style={{backgroundColor: '#FFFFFF'}}>
        <DataTable.Header>
          <DataTable.Title>User</DataTable.Title>
          <DataTable.Title >Booking Date</DataTable.Title>
        </DataTable.Header>
        {renderDataTableRows()}
        {renderDataTablePagination()}
      </DataTable>
                        </View>


<View style={{marginVertical: 15}}>

<View style={{padding: 10}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <View style={{flex: 1}}>
                                <Text style={{  fontSize: 13, fontWeight: '600'}}>
                            Overview
                        </Text>
                                </View>
                                
                            {/*}   <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                    <Text>
                        <Text style={{fontSize: 15}}>
                            Gross:{" "}
                        </Text>
                        <Text style={{fontSize: 15}}>
                            ${renderGrossPay()}
                        </Text>
                        </Text>

                        <Text>
                        <Text style={{fontSize: 15}}>
                            Net:{" "}
                        </Text>
                        <Text style={{fontSize: 15}}>
                            ${renderNetPay()}
                        </Text>
                        </Text>
    </View> */}
                                </View>
  
                            </View>


                            <View>
                            <ScrollView horizontal contentContainerStyle={{alignItems: 'center'}}>
                                <Surface style={{margin: 10, elevation: 0, width: 135, height: 130, borderRadius: 20, backgroundColor: 'rgb(229, 229, 234)'}}>
                                    <View style={{position: 'absolute', top: 0, left: 0, margin: 5, width: 45, height: 45, borderRadius: 80, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                                        <FeatherIcon name="shopping-cart" color="rgb(33,150,243)" size={20} />
                                    </View> 

                                    <View style={{padding: 10, position: 'absolute', bottom: 0, width: '100%'}}>
                                        <Text style={{color: 'rgb(99, 99, 102)', fontSize: 15}}>
                                            Sales
                                        </Text>
                                        <Text style={{fontSize: 20}}>
                                            {renderSales()}
                                        </Text>
                                    </View>
                                </Surface>

                                <Surface style={{margin: 10, elevation: 0, width: 135, height: 130, borderRadius: 20, backgroundColor: 'rgb(229, 229, 234)'}}>
                                    <View style={{position: 'absolute', top: 0, left: 0, margin: 5, width: 45, height: 45, borderRadius: 80, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                                        <FeatherIcon name="share-2" color="rgb(33,150,243)" size={20} />
                                    </View> 

                                    <View style={{padding: 10, position: 'absolute', bottom: 0, width: '100%'}}>
                                        <Text style={{color: 'rgb(99, 99, 102)', fontSize: 15}}>
                                            Shares
                                        </Text>
                                        <Text style={{fontSize: 20}}>
                                            {renderShares()}
                                        </Text>
                                    </View>
                                </Surface>

                                <Surface style={{margin: 10, elevation: 0, width: 135, height: 130, borderRadius: 20, backgroundColor: 'rgb(229, 229, 234)'}}>
                                    <View style={{position: 'absolute', top: 0, left: 0, margin: 5, width: 45, height: 45, borderRadius: 80, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                                        <FeatherIcon name="eye" color="rgb(33,150,243)" size={20} />
                                    </View> 

                                    <View style={{padding: 10, position: 'absolute', bottom: 0, width: '100%'}}>
                                        <Text style={{color: 'rgb(99, 99, 102)', fontSize: 15}}>
                                            Views
                                        </Text>
                                        <Text style={{fontSize: 20}}>
                                        {renderViews()}
                                        </Text>
                                    </View>
                                    
                                </Surface>

                        

                            </ScrollView>
                        </View>
                        </View>

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
        :
        <View style={{flex: 1, backgroundColor: 'rgb(247 ,247, 247)'}} />
    )
}

export default TrainerDashboard;