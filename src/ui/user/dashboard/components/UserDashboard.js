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

function UserDashboard(props) {
    const navigation = useNavigation();
    
    return (
        <View style={{
            flex: 1,
            backgroundColor: '#FFFFFF'
        }}>
            <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 3,}}>
            <MenuIcon onPress={() => navigation.openDrawer()} />
                <Appbar.Content title="Dashboard"  titleStyle={{alignSelf: 'center'}} />
</Appbar.Header> 
            <ScrollView>
            <View style={[{ backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }]}>
                        <Image source={require('../../../images/Clipboard.jpeg')} style={{ marginVertical: 10, width: 150, height: 150, borderRadius: 150 }} />


                        <View style={{ alignItems: 'center', paddingHorizontal: 10 }}>
                            <Text style={{ paddingVertical: 10, fontSize: 20, fontFamily: 'Avenir-Medium' }}>
                                You haven't signed up for any programs.{" "}
                            </Text>

                            <Text style={{ paddingVertical: 10, textAlign: 'center', fontFamily: 'Avenir-Light' }} >
                                When you sign up for a program you will be able to find details about it here- including program updates.
                        </Text>
                        </View>

                        <Button uppercase={false} color="#1089ff" mode="contained" style={{ fontFamily: 'Avenir-Roman', marginVertical: 10 }} onPress={() => navigation.navigate('Train')}>
                            Find a program
    </Button>

                    </View>
            </ScrollView>
        </View>
    )
}

export default UserDashboard;