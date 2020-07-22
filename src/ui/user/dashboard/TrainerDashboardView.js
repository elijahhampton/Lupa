/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 * 
 *  UserDashboardView
 */

import React, { useState, useEffect } from 'react';

import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Dimensions,
} from 'react-native';

import {
    Divider,
    Surface,
    Avatar,
    Caption,
} from 'react-native-paper';

import {
    Header,
    Left,
    Right,
    Body,
} from 'native-base';

import { useNavigation } from '@react-navigation/native'

import { LineChart } from 'react-native-chart-kit'

import { Constants } from 'react-native-unimodules';
import LupaController from '../../../controller/lupa/LupaController';
import { connect, useSelector } from 'react-redux';
import ThinFeatherIcon from "react-native-feather1s";
import { MenuIcon } from '../../icons/index.js';
import ServicedComponent from '../../../controller/lupa/interface/ServicedComponent'
import LUPA_DB from '../../../controller/firebase/firebase';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { NOTIFICATION_TYPES } from '../../../model/notifications/common/types'
import ReceivedProgramNotification from '../notifications/component/ReceivedProgramNotification';

const { windowWidth } = Dimensions.get('window').width

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

function TrainerDashboardView(props) {
    const [refreshing, setIsRefreshing] = useState(false)
    const [userNotifications, setUserNotifications] = useState([])

    const navigation = useNavigation()
    const currUserData = useSelector(state => {
        return state.Users.currUserData
    })

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    useEffect(() => {
        try {
            const currUserSubscription = LUPA_DB.collection('users').doc(currUserData.user_uuid).onSnapshot(documentSnapshot => {
                let userData = documentSnapshot.data()
                setUserNotifications(userData.notifications)
            })


            return () => currUserSubscription()
        } catch(err) {
            setUserNotifications([])
            alert(err)
            return
        }
    }, [])

    const setupComponent = async () => {
        await loadNotifications(currUserData.user_uuid)
    }

    const loadNotifications = async (uuid) => {
        let notificationsIn = [];

        try {
            await LUPA_CONTROLLER_INSTANCE.getUserNotifications(uuid).then(notifications => {
                notificationsIn = notifications;
            })

        } catch (err) {
           notificationsIn = []
        }

        setUserNotifications(notificationsIn)
    }

    const renderNotifications = () => {
        return userNotifications.map((notification, index, arr) => {
            switch(notification.type) {
                case NOTIFICATION_TYPES.RECEIVED_NOTIFICATION:
                    return <ReceivedProgramNotification notificationData={notification} />
                default:
                    
            }
        })
    }

    const _onRefresh = async () => {
        setIsRefreshing(true)
        await setupComponent()
        setIsRefreshing(false)
    }

    return (
        <View style={styles.safeareaview}>
            <View style={{marginTop: Constants.statusBarHeight, padding: 10}}>
            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                                     <Left>
                                         <MenuIcon customStyle={{marginVertical: 10}} onPress={() => navigation.openDrawer()} />
                                     </Left>
                                    
                                    <Body />

                                    <Right />
                                     </View>

                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: Dimensions.get('window').width}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                     <Text style={{fontSize: 20}}>
                                         Welcome,
                                     </Text>
                                     <Text>
                                         {" "}
                                     </Text>
                                     <Text style={{color: '#1089ff', fontSize: 20}}>
                                        {currUserData.display_name}
                                     </Text>
                                     </View>

                                     <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                     <ThinFeatherIcon name="mail" thin={true} size={25} style={{marginRight: 20}} onPress={() => navigation.navigate('Messages')} />
                                     </View>
                                    </View>
                                     <Divider style={{marginTop: 15, alignSelf: 'center', width: Dimensions.get('window').width}} />

            </View>
            <View style={{flex: 1}}>
            <Surface style={{padding: 5, marginVertical: 10, elevation: 3, borderRadius: 15, backgroundColor: '#1089ff', width: Dimensions.get('window').width - 20, alignSelf: 'center'}}>
<Text style={{fontSize: 20, color: '#E5E5E5', padding: 5}}> Sessions </Text>
<LineChart
data={{
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100
      ]
    }
  ]
}}
width={Dimensions.get("window").width - 20} // from react-native
height={160}
yAxisLabel="$"
yAxisSuffix="k"
yAxisInterval={1} // optional, defaults to 1
chartConfig={{
  backgroundColor: "#1089ff",
  backgroundGradientFrom: "#1089ff",
  backgroundGradientTo: "#1089ff",
  decimalPlaces: 2, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 0,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726"
  }
}}
bezier
style={{
  borderRadius: 0,
}}
/>
</Surface>
            <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={_onRefresh}
                />}>

                {renderNotifications()}
            </ScrollView>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 2,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF'
    },
    safeareaview: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        flexDirection: 'row', 
        alignItems: 'center', 
        width: "100%", 
        height: "auto",
    },
    headerText: {
          
        fontSize: 30,
        color: 'white', 
        alignSelf: "center",
        color: '#1565C0'
    },
    sectionHeader: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        margin: 3,
        fontFamily: "avenir-book",
        color: '#212121'
    },
    sectionHeaderText: {
        fontSize: 18, 
        color: '#212121',
         
    },
    divider: {
        margin: 10
    },
    iconButton: {
        
    },
    chipStyle: {
        backgroundColor: 'rgba(227,242,253 ,1)', 
        width: 'auto', 
        alignItems: 'center', 
        justifyContent: 'center',
        margin: 5, 
        alignSelf: 'flex-end'
    },
    chipTextStyle: {
        fontSize: 15,
    },
});

export default connect(mapStateToProps)(TrainerDashboardView);