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
    Surface,
    Button,
} from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit'
import { useNavigation } from '@react-navigation/native'

import { connect, useSelector } from 'react-redux';
import {MenuIcon } from '../../icons/index'
import FeatherIcon from 'react-native-vector-icons/Feather'
import ThinFeatherIcon from 'react-native-feather1s'

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
                <View style={{flex: 1}}>
                <View style={[{backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center'}]}>
                <Image source={require('../../images/Clipboard.jpeg')} style={{marginVertical: 10, width: 150, height: 150, borderRadius: 150}} />


    <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                        <Text style={{paddingVertical: 10, fontSize: 20, fontFamily: 'Avenir-Medium'}}>
                        You haven't created any programs.{" "}
                        </Text>
                        
    <Text style={{color: '#1089ff', paddingVertical: 10, textAlign: 'center', fontFamily: 'Avenir-Light'}} onPress={() => navigation.navigate('CreateProgram')}>
                      When you create a program you will be able to find details about it here- including insights.
                        </Text>
    </View>

    <Button uppercase={false} color="#1089ff" mode="contained" style={{fontFamily: 'Avenir-Roman', marginVertical: 10}} onPress={() => navigation.navigate('CreateProgram')}>
        Create a workout program
    </Button>
                    
                </View>
            </View>
            )
        }   

        return (
            null
        )
    }

    const renderUserDisplay = () => {
        if (currUserProgramsData.length === 0) {
            return (
                <View style={{flex: 1}}>
                <View style={[{backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center'}]}>
                <Image source={require('../../images/Clipboard.jpeg')} style={{marginVertical: 10, width: 150, height: 150, borderRadius: 150}} />


    <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                        <Text style={{paddingVertical: 10, fontSize: 20, fontFamily: 'Avenir-Medium'}}>
                        You haven't signed up for any programs.{" "}
                        </Text>
                        
    <Text style={{color: '#1089ff', paddingVertical: 10, textAlign: 'center', fontFamily: 'Avenir-Light'}} onPress={() => navigation.navigate('Train')}>
                       When you sign up for a program you will be able to find details about it here- including program updates.
                        </Text>
    </View>

    <Button uppercase={false} color="#1089ff" mode="contained" style={{fontFamily: 'Avenir-Roman', marginVertical: 10}} onPress={() => navigation.navigate('Train')}>
        Sign up for fitness programs
    </Button>
                    
                </View>
            </View>
            )
        }

        return (
            null
        )
    }

    const renderComponentDisplay = () => {
        return currUserData.isTrainer ? renderTrainerDisplay() : renderUserDisplay()
    }

    return (
        <View style={styles.safeareaview}>
            <Header>
                <Left>
                <MenuIcon customStyle={{ margin: 10 }} onPress={() => navigation.openDrawer()} />
                </Left>

                <Body>
                    <Title style={{fontFamily: 'HelveticaNeue', fontSize: 15, fontWeight: '600'}}>
                        Dashboard
                    </Title>
                </Body>

                <Right>
                <ThinFeatherIcon thin={true} name="bell" style={{paddingHorizontal: 10}} size={25} onPress={() => navigation.navigate('Notifications')} />
                <ThinFeatherIcon name="mail" thin={true} size={25} style={{ paddingHorizontal: 10 }} onPress={() => navigation.navigate('MessagesView')}  />
                </Right>
            </Header>
            <View style={{flex: 1}}>
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