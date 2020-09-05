import React, { useEffect, useState } from 'react';

import {
    View,
    StyleSheet,
    Text,
    Image,
    ScrollView
} from 'react-native';

import {
    Button,
    Appbar,
    Menu,
} from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import { MenuIcon } from '../../../icons';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { useSelector } from 'react-redux/lib/hooks/useSelector';
import DashboardProgramCard from './DashboardProgramCard';

function UserDashboard(props) {
    const navigation = useNavigation();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const renderComponent = () => {
        return currUserData.programs.length !== 0 ?
        <ScrollView>
            {
                currUserData.programs.map(program => {
                    return <DashboardProgramCard uuid={program} />
                })
            }
        </ScrollView>
        :
        <ScrollView contentContainerStyle={{flexGrow: 2, justifyContent: 'space-evenly'}}>
             <View style={[{ backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }]}>
                <Image source={require('../../../images/Clipboard.jpeg')} style={{ marginVertical: 10, width: 150, height: 150, borderRadius: 150 }} />


                <View style={{ alignItems: 'center', paddingHorizontal: 10 }}>
                    <Text style={{ paddingVertical: 10, fontSize: 20, fontFamily: 'Avenir-Medium' }}>
                        You haven't signed up for any programs.{" "}
                    </Text>

                    <Text style={{ paddingVertical: 10, textAlign: 'center', fontFamily: 'Avenir-Light' }} >
                       Sign up for a program and you will be able to find details about it here.
                </Text>
                </View>

                <Button uppercase={false} color="#1089ff" mode="text" style={{ fontFamily: 'Avenir-Roman', marginVertical: 10 }} onPress={() => navigation.navigate('Train')}>
                    Find a program
</Button>

            </View>
        </ScrollView>
    }
    
    return (
        <View style={{
            flex: 1,
            backgroundColor: '#FFFFFF'
        }}>
            <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 3,}}>
            <MenuIcon onPress={() => navigation.openDrawer()} />
                <Appbar.Content title="Dashboard"  titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20}} />
                <Appbar.Action onPress={() => this.props.navigation.push('Messages')} icon={() => <Feather1s thin={true} name="mail" size={20} />}/>
              <Appbar.Action onPress={() => this.props.navigation.push('Notifications')} icon={() => <Feather1s thin={true} name="bell" size={20} />}/>
</Appbar.Header> 
            {renderComponent()}
        </View>
    )
}

export default UserDashboard;