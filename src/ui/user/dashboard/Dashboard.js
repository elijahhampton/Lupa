/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 * 
 *  UserDashboardView
 */

import React from 'react';

import {
    View,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    ScrollView,
    Image,
    Text,
} from 'react-native';
import {
    Header,
    Left,
    Title,
    Right,
    Body,
} from 'native-base'
import {
    Appbar,
    Caption,
    Surface,
    Divider,
    Button,
    Avatar,
} from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit'
import { useNavigation } from '@react-navigation/native'

import { connect, useSelector } from 'react-redux';
import { MenuIcon } from '../../icons/index'
import FeatherIcon from 'react-native-vector-icons/Feather'
import ThinFeatherIcon from 'react-native-feather1s'
import ProfileProgramCard from '../../workout/program/components/ProfileProgramCard';
import Carousel from 'react-native-snap-carousel'
const marginSeparatorSize = 15

const Dashboard = () => {
    const navigation = useNavigation()

    const currUserData = useSelector(state => {
        return state.Users.currUserData
    })

    const currUserProgramsData = useSelector(state => {
        return state.Programs.currUserProgramsData
    })

    const renderTrainerDisplay = () => {
        if (currUserProgramsData.length === 0) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={[{ backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }]}>
                        <Image source={require('../../images/Clipboard.jpeg')} style={{ marginVertical: 10, width: 150, height: 150, borderRadius: 150 }} />


                        <View style={{ alignItems: 'center', paddingHorizontal: 10 }}>
                            <Text style={{ paddingVertical: 10, fontSize: 20, fontFamily: 'Avenir-Medium' }}>
                                You haven't created any programs.{" "}
                            </Text>

                            <Text style={{ color: '#1089ff', paddingVertical: 10, textAlign: 'center', fontFamily: 'Avenir-Light' }} onPress={() => navigation.navigate('CreateProgram')}>
                                When you create a program you will be able to find details about it here- including insights.
                        </Text>
                        </View>

                        <Button uppercase={false} color="#1089ff" mode="contained" style={{ fontFamily: 'Avenir-Roman', marginVertical: 10 }} onPress={() => navigation.navigate('CreateProgram')}>
                            Create a workout program
    </Button>

                    </View>
                </View>
            )
        }

        return (
            <View style={{ flex: 1 }}>
                <ScrollView>

                    <View style={{ alignSelf: 'center', }}>
                        <Text style={{ padding: 10, fontSize: 18, fontFamily: 'Avenir-Medium' }}>
                            Sales
                            </Text>

                        <LineChart
                            bezier
                            data={{
                                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jul", "Aug", "Sep"],
                                datasets: [
                                    {
                                        data: [
                                            0,
                                            0,
                                            0,
                                            0,
                                            0,
                                            0,
                                            0,
                                            0,
                                            0,
                                            0,
                                        ]
                                    }
                                ]
                            }}
                            width={Dimensions.get('window').width} // from react-native
                            height={200}
                            yAxisLabel="N"
                            withHorizontalLabels={true}
                            yAxisSuffix=""
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                                strokeWidth: 0.5,
                                backgroundColor: "#FFFFFF",
                                backgroundGradientFrom: "#FFFFFF",
                                backgroundGradientTo: "#FFFFFF",
                                decimalPlaces: 0, // optional, defaults to 2dp
                                color: (opacity = 0) => `rgba(33, 150, 243, ${opacity})`,
                                labelColor: (opacity = 0) => `rgba(33, 150, 243, ${opacity})`,
                                style: {
                                    borderRadius: 0
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: "#ffa726"
                                },
                                propsForBackgroundLines: {
                                    backgroundColor: 'transparent',
                                    color: 'transparent',
                                    stroke: 'transparent',
                                }
                            }}
                            style={{
                                borderRadius: 0
                            }}
                        />

                        <Divider style={{ marginHorizontal: 30, marginVertical: 5 }} />

                        <Button color="#1089ff" uppercase={false} mode="text" style={{ alignSelf: 'flex-end' }} onPress={() => navigation.push('TrainerInsights')}>
                            Trainer Insights
                  <FeatherIcon name="arrow-right" size={12} />
                        </Button>
                    </View>
                    <Divider style={{ height: 5, backgroundColor: '#EEEEEE' }} />
                </ScrollView>
            </View>
        )
    }

    const renderUserDisplay = () => {
        if (currUserProgramsData.length === 0) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={[{ backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }]}>
                        <Image source={require('../../images/Clipboard.jpeg')} style={{ marginVertical: 10, width: 150, height: 150, borderRadius: 150 }} />


                        <View style={{ alignItems: 'center', paddingHorizontal: 10 }}>
                            <Text style={{ paddingVertical: 10, fontSize: 20, fontFamily: 'Avenir-Medium' }}>
                                You haven't signed up for any programs.{" "}
                            </Text>

                            <Text style={{ color: '#1089ff', paddingVertical: 10, textAlign: 'center', fontFamily: 'Avenir-Light' }} onPress={() => navigation.navigate('Train')}>
                                When you sign up for a program you will be able to find details about it here- including program updates.
                        </Text>
                        </View>

                        <Button uppercase={false} color="#1089ff" mode="contained" style={{ fontFamily: 'Avenir-Roman', marginVertical: 10 }} onPress={() => navigation.navigate('Train')}>
                            Sign up for fitness programs
    </Button>

                    </View>
                </View>
            )
        }

        return (
            <View style={{ flex: 1 }}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    {
                        currUserProgramsData.map((program, index, arr) => {
                            if (index >= 1) {
                                return null;
                            }

                            return (
                                <ProfileProgramCard programData={program} />
                            )
                        })
                    }
                    <Caption>
                        Current Program
</Caption>
                </View>
                <Divider style={{ height: 5, backgroundColor: '#EEEEEE' }} />
            </View>
        )
    }

    const renderComponentDisplay = () => {
        return currUserData.isTrainer ? renderTrainerDisplay() : renderUserDisplay()
    }

    return (
        <View style={styles.safeareaview}>

            <Appbar.Header style={{ backgroundColor: 'white', elevation: 3, borderBottomColor: 'rgb(199, 199, 204)', borderBottomWidth: 0.8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Appbar.Action icon={() => <MenuIcon onPress={() => navigation.openDrawer()} />} />


                <Appbar.Content title="Dashboard" style={{ alignSelf: 'center' }} titleStyle={{ fontFamily: 'HelveticaNeue-Bold', fontSize: 15, fontWeight: '600' }} />


                <View style={{ flexDirection: 'row', alignItems: 'center' , padding: 0, margin: 0}}>
                    <Appbar.Action icon={() => <ThinFeatherIcon thin={true} name="bell" size={20} onPress={() => navigation.push('Notifications')} />} />
                    <Appbar.Action icon={() => <ThinFeatherIcon name="mail" thin={true} size={20} onPress={() => navigation.push('Messages')} />} />
                </View>


            </Appbar.Header>

            <View style={{ flex: 1 }}>
                {renderComponentDisplay()}
            </View>
            <SafeAreaView />
        </View>
    );
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: '#FFFFFF',
        elevation: 0,
        borderBottomColor: 'rgb(199, 199, 204)',
        borderBottomWidth: 0.8,
        alignItems: 'center',
        flexDirection: 'row',
    },
    safeareaview: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    box: {
        width: '100%',
        padding: 10
    }
});

export default connect(mapStateToProps)(Dashboard);
