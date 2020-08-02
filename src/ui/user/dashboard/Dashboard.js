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
} from 'react-native';

import {
    Appbar,
} from 'react-native-paper';

import { useNavigation } from '@react-navigation/native'

import { connect } from 'react-redux';
import {MenuIcon } from '../../icons/index'
import FeatherIcon from 'react-native-vector-icons/Feather'

const Dashboard = () => {
    const navigation = useNavigation()

    return (
        <SafeAreaView style={styles.safeareaview}>
            <Appbar.Header style={styles.appbar}>
            <Appbar.Action icon={() => <MenuIcon customStyle={{margin: 10}} onPress={() => navigation.openDrawer()} />} />
            <Appbar.Content title="Dashboard" titleStyle={{fontFamily: 'HelveticaNeue-Medium', fontSize: 15, fontWeight: '600'}} />
            <Appbar.Action icon={() => <FeatherIcon name="bell" size={20} />} onPress={() => navigation.navigate('Notifications')} />
            </Appbar.Header>
            <View style={{flex: 1}}>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: '#FFFFFF',
        elevation: 0,
        borderBottomColor: 'rgb(199, 199, 204)', 
        borderBottomWidth: 0.8 
    },
    safeareaview: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    }
});

export default connect(mapStateToProps)(Dashboard);