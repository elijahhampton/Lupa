/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 * 
 *  UserDashboardView
 */

import React, { useState } from 'react';

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
} from 'react-native-paper';

import {
    Header,
    Left,
    Right,
    Body,
} from 'native-base';

import { LineChart } from 'react-native-chart-kit'

import { Constants } from 'react-native-unimodules';
import LupaController from '../../../controller/lupa/LupaController';
import { connect } from 'react-redux';
import ThinFeatherIcon from "react-native-feather1s";
import { MenuIcon } from '../../icons/index.js';
import ServicedComponent from '../../../controller/lupa/interface/ServicedComponent'

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

class TrainerDashboardView extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            refreshing: false,
            packEventsData: [],
            showJournal: false,
            packInvites: [],
            openedPackInviteID: "",
            openedPackTitle: "",
            packInviteModalOpen: false,
            userNotifications: [],
        }

        this.workoutLogModalRef = React.createRef();

    }

    componentDidMount = async () => {
        await this.setupComponent()
    }

    setupComponent = () => {
        this.loadNotifications(this.props.lupa_data.Users.currUserData.user_uuid)
    }

    loadNotifications = async (uuid) => {
        let notificationsIn = [];

        try {
            await this.LUPA_CONTROLLER_INSTANCE.getUserNotifications(uuid).then(notifications => {
                notificationsIn = notifications;
            })

        } catch (err) {
           notificationsIn = []
        }

        await this.setState({
            userNotifications: notificationsIn
        })
    }

    _onRefresh = () => {
        this.setState({refreshing: true});

        this.setupComponent().then(() => {
          this.setState({refreshing: false});
        });
    }

    render() {
        return (
            <View style={styles.safeareaview}>
                <View style={{marginTop: Constants.statusBarHeight, padding: 10}}>
                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                                         <Left>
                                             <MenuIcon customStyle={{marginVertical: 10}} onPress={() => this.props.navigation.openDrawer()} />
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
                                            {this.props.lupa_data.Users.currUserData.display_name}
                                         </Text>
                                         </View>

                                         <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                         <ThinFeatherIcon name="mail" thin={true} size={25} style={{marginRight: 20}} onPress={() => this.props.navigation.navigate('Messages')} />
                                         </View>
                                        </View>
                                         <Divider style={{marginTop: 15, alignSelf: 'center', width: Dimensions.get('window').width}} />

                </View>
                <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />}>

<Surface style={{padding: 5, elevation: 5, borderRadius: 15, backgroundColor: '#1089ff', width: Dimensions.get('window').width - 20, alignSelf: 'center'}}>
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
        borderRadius: 0
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

                </ScrollView>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        alignItems: 'center',
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