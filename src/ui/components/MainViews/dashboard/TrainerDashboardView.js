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
    TouchableWithoutFeedback
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

import CreateSessionModal from '../../Modals/Session/CreateSessionModal';
import ModifySessionModal from '../../Modals/Session/ModifySessionModal';
import CancelSessionModal from '../../Modals/Session/CancelSessionModal';
import InviteFriendsModal from '../../Modals/InviteFriendsModal';

const chartWidth = Dimensions.get('screen').width - 20;
const chartHeight = 250;

class TrainerDashboardView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showCreateModal: false,
            showModifyModal: false,
            showCancelModal: false,
            showInviteModal: false,
            isActivityMenuVisible: false,
            isGoalsMenuVisible: false,
        }

    }

    _showActivityMenu = () => { this.setState({ isActivityMenuVisible: true }) }
    _showGoalsMenu = () => { this.setState({ isGoalsMenuVisible: true }) }
    _closeActivityMenu = () => { this.setState({ isActivityMenuVisible: false }) }
    _closeGoalsMenu = () => { this.setState({ isGoalsMenuVisible: false }) }
    _closecontrolPanel = () => {
        this._drawer.close();
    };
    _openControlPanel = () => {
        this._drawer.open();
    };

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

    _handleAvatarOnPress = () => {
        console.log("Clicked")
        this.setState({ showDrawer: true });
    }

    render() {
        return (
                <LinearGradient style={{flex: 1, padding: 10, paddingTop: 20}} colors={['#2196F3', '#E3F2FD', '#fafafa']}>
                <IconButton style={{alignSelf: "flex-start"}} icon="menu" size={20} onPress={() => {this.props.navigation.openDrawer()}}/>
                <ScrollView contentContainerStyle={styles.dashboardContent} showsVerticalScrollIndicator={false}>
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

                    <View style={styles.calendarButtons}>
                        <View style={styles.calendarButtonsContainer}>
                            <TouchableOpacity onPress={() => this.setState({ showCreateModal: true })}>
                                <Surface style={styles.buttonSurface}>
                                    <Icon name="zap" size={15} />
                                </Surface>
                            </TouchableOpacity>

                            <Text style={styles.calendarButtonText}>
                                Schedule Session
                            </Text>
                        </View>

                        <View style={styles.calendarButtonsContainer}>
                            <TouchableOpacity onPress={() => this.setState({ showModifyModal: true })}>
                                <Surface style={styles.buttonSurface}>
                                    <Icon name="edit-2" size={15} />
                                </Surface>
                            </TouchableOpacity>

                            <Text style={styles.calendarButtonText}>
                                Modify Session
                            </Text>
                        </View>

                        <View style={styles.calendarButtonsContainer}>
                            <TouchableOpacity onPress={() => this.setState({ showCancelModal: true })}>
                                <Surface style={styles.buttonSurface}>
                                    <Icon name="x" size={15} />
                                </Surface>
                            </TouchableOpacity>

                            <Text style={styles.calendarButtonText}>
                                Cancel Session
                            </Text>
                        </View>

                        <View style={styles.calendarButtonsContainer}>
                            <TouchableOpacity onPress={() => this.setState({ showInviteModal: true })}>
                                <Surface style={styles.buttonSurface}>
                                    <Icon name="globe" size={15} />
                                </Surface>
                            </TouchableOpacity>

                            <Text style={styles.calendarButtonText}>
                                Invite Friends
                            </Text>
                        </View>
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

                <CreateSessionModal isVisible={this.state.showCreateModal} />
                <ModifySessionModal isVisible={this.state.showModifyModal} />
                <CancelSessionModal isVisible={this.state.showCancelModal} />
                <InviteFriendsModal isVisible={this.state.showInviteModal} />
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
    calendarButtons: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        alignSelf: "center",
        width: "100%",
        height: "auto",
        margin: 20,
    },
    calendarButtonsContainer: {
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: 'center',
    },
    calendarButtonText: {
        padding: 10,
        fontSize: 10,
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