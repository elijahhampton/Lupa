/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 * 
 *  UserDashboardView
 */

import React from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    TouchableWithoutFeedback,
    RefreshControl
} from 'react-native';

import {
    Surface,
    IconButton,
    Menu,
    Divider,
    Caption
} from 'react-native-paper';

import {
    LineChart,
    ProgressChart
} from 'react-native-chart-kit';

import {
    LinearGradient
} from 'expo-linear-gradient';

import { Feather as Icon } from '@expo/vector-icons';

import LupaCalendar from '../../Calendar/LupaCalendar'

import SessionNotificationContainer from './Components/SessionNotificationContainer';

const chartWidth = Dimensions.get('screen').width - 20;
const chartHeight = 250;

class TrainerDashboardView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
        }

    }


    goalChartData = { //Each value defines a ring in the chart (labels -> data)
        labels: ['GoalA', 'GoalB', 'GoalC'], // optional
        data: [0.4, 0.6, 0.8]
    }

    goalChartConfig = {
        backgroundGradientFrom: '#2196F3',
        backgroundGradientTo: '#2196F3',
        color: (opacity = 0) => `rgba(255,255,255, ${opacity})`,
        style: {
            borderRadius: 16
        }
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.fetchSessions();
        /*fetchData().then(() => {
          this.setState({refreshing: false});
        });*/
      }

      fetchSessions = () => {
          
      }

    render() {
        return (
                <LinearGradient style={{flex: 1, padding: 10, paddingTop: 20}} colors={['#2196F3', '#E3F2FD', '#fafafa']}>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <IconButton style={{alignSelf: "flex-start"}} icon="menu" size={20} onPress={() => {this.props.navigation.openDrawer()}}/>
                    <Text style={{fontWeight: "900", color: "black", fontSize: 15}}>
                        Lupa
                    </Text>
                    </View>
                <ScrollView contentContainerStyle={styles.dashboardContent} showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />}>
                    <LupaCalendar />
                    <View style={styles.charts}>
                        <Surface style={styles.chartSurface}>
                            <View style={styles.chartOptions}>
                            <Text style={styles.chartSurfaceText}>
                                Fitness Activity
                            </Text>
                            <Menu 
                            visible={this.state.isActivityMenuVisible}
                            onDismiss={this._closeActivityMenu}
                            anchor={<IconButton icon="more-vert" size={20} onPress={this._showActivityMenu}/>}>
                                <Menu.Item onPress={() => {}} title="Expand" />
                                <Divider />
                                <Menu.Item onPress={() => {}} title="Download Chart Data" />
                            </Menu>
                            </View>
                            <LineChart
                                data={{
                                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                                    datasets: [{
                                        data: [
                                            Math.random() * 100,
                                            Math.random() * 100,
                                            Math.random() * 100,
                                            Math.random() * 100,
                                            Math.random() * 100,
                                            Math.random() * 100,
                                            Math.random() * 100
                                        ]
                                    }]
                                }}
                                width={chartWidth} // from react-native
                                height={chartHeight}
                                chartConfig={{
                                    backgroundColor: '#e26a00',
                                    backgroundGradientFrom: '#2196F3',
                                    backgroundGradientTo: '#2196F3',
                                    decimalPlaces: 2, // optional, defaults to 2dp
                                    color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
                                    strokeWidth: 1,
                                    style: {
                                        borderRadius: 16
                                    }
                                }}
                                bezier
                                style={styles.chartStyle}
                            />
                        </Surface>
                    </View>

                    <View style={{margin: 10}}>
                        <Text style={styles.chartSurfaceText}>
                            Goals
                        </Text>
                        <View style={{flexDirection: "row"}}>
                        <Caption>
                            You do not have any goals set. Visit your fitness profile to set your
                        </Caption>
                        <TouchableWithoutFeedback>
                        <Caption style={{color: "#2196F3"}}>
                            {" "} goals
                        </Caption>
                        </TouchableWithoutFeedback>
                        <Caption>
                            .
                        </Caption>
                        </View>

                    </View>

                    <View style={{margin: 10}}>
                        <Text style={styles.chartSurfaceText}>
                            Recent Workouts
                        </Text>
                        <Caption>
                            You have not performed any workouts recently.
                        </Caption>
                    </View>

                    <View>
                    <Text style={{fontSize: 20, fontWeight: "700"}}>
                            Sessions
                        </Text>
                        <SessionNotificationContainer />
                    </View>

                    <View>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%",}}>
                        <Text style={{fontSize: 20, fontWeight: "700"}}>
                            Pack Offers
                        </Text>
                        <Icon name="plus" size={15} />
                        </View>
                        <View>
                            <Caption>
                                You are currently not offering any pack offers.
                            </Caption>
                        </View>

                    </View>
                </ScrollView>

                </LinearGradient>
        );                    
    }
}

const styles = StyleSheet.create({
    scrollView: {
    },
    charts: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        display: "flex",
    },
    chartSurfaceControls: {
        width: "100%",
        height: "15%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
    },
    chartSurfaceText: {
        fontSize: 20,
        fontWeight: "400",
        color: "black",
    },
    chartSurface: {
        width: chartWidth,
        height: 300,
        elevation: 10,
        borderRadius: 20,
        alignSelf: "center",
        backgroundColor: "transparent",
        marginBottom: 5,
    },
    chartOptions: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    chartStyle: {
        borderRadius: 16,
        alignSelf: "center",
    },
    buttonSurface: {
        borderRadius: 40,
        width: 50,
        height: 50,
        elevation: 10,
        alignItems: "center",
        justifyContent: "center",
    }
});

export default TrainerDashboardView;