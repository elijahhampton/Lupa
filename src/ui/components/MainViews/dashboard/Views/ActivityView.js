import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    ScrollView,
    TouchableOpacity
} from 'react-native';

import {
    Appbar,
    Surface,
    Title,
    IconButton,
    Menu,
    Divider,
    Caption
} from 'react-native-paper';

import {
    Left,
    Right,
    Body
} from 'native-base';

import {
    LineChart,
    ProgressChart
} from 'react-native-chart-kit';

import {
    LinearGradient
} from 'expo-linear-gradient';

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { DrawerActions } from 'react-navigation-drawer';

import LupaAppBar from '../../../AppBar/LupaAppBar';

import ControlPanel from '../../../Drawer/ControlPanel';

import MainView from '../../../Drawer/MainView';

import ProfileView from './Profile/ProfileView';


const chartWidth = Dimensions.get('screen').width - 20;
const chartHeight = 250;

export default class ActivityView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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



    render() {
        return (
            <View style={styles.root}>
                <LinearGradient style={{flex: 1}} colors={['#2196F3', '#E3F2FD', '#ffffff']}>
                <LupaAppBar title="Activity" />
                <ScrollView contentContainerStyle={styles.scrollView}>
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

                        <Surface style={styles.chartSurface}>
                            <View style={styles.chartOptions}>
                            <Text style={styles.chartSurfaceText}>
                                Goal Progression
                            </Text>
                            <Menu 
                            visible={this.state.isGoalsMenuVisible}
                            onDismiss={this._closeGoalsMenu}
                            anchor={<IconButton icon="more-vert" size={20} onPress={this._showGoalsMenu}/>}>
                                <Menu.Item onPress={() => {}} title="Expand" />
                                <Divider />
                                <Menu.Item onPress={() => {}} title="Download Chart Data" />
                            </Menu>
                            </View>
                            <ProgressChart
                                data={this.goalChartData}
                                width={chartWidth}
                                height={chartHeight}
                                chartConfig={this.goalChartConfig}
                                style={styles.chartStyle}
                            />
                        </Surface>
                    </View>


                    <View style={{margin: 10}}>
                        <Text style={styles.chartSurfaceText}>
                            Recent Workouts
                        </Text>
                        <Caption>
                            You have not performed any workouts recently.
                        </Caption>
                    </View>


                </ScrollView>

                </LinearGradient>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    appbar: {
        backgroundColor: "transparent",
        elevation: 0,
        margin: 10,
    },
    scrollView: {
        padding: 10
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
        marginVertical: 1,
        borderRadius: 16,
        alignSelf: "center",
    }   
});