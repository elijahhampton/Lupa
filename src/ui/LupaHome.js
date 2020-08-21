import React, { useState } from 'react'

import {
    View,
    Text,
    StyleSheet
} from 'react-native'

import {
    Appbar, FAB,
    Divider,
} from 'react-native-paper'

import {
    Container,
    Left,
    Content,
    Tabs,
    Tab,
    Body,
    Right,
    Title,
    Header
} from 'native-base'

import { SearchBar} from 'react-native-elements'

import Search from './search/Search'
import Featured from './Featured'
import MyPrograms from './MyPrograms'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { MenuIcon } from './icons'
import { useNavigation } from '@react-navigation/native'
import ThinFeatherIcon from 'react-native-feather1s'
import { useSelector } from 'react-redux/lib/hooks/useSelector'
import LupaController from '../controller/lupa/LupaController'

const LupaHome = () => {
    const navigation = useNavigation()

    return(
        <Container style={styles.root}>
            <Appbar.Header style={{ backgroundColor: 'white', elevation: 3, borderBottomColor: 'rgb(199, 199, 204)', borderBottomWidth: 0.8 , flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Appbar.Action icon={() =>  <MenuIcon onPress={() => navigation.openDrawer()} />} />
                    
                    
                    <Appbar.Content title="Book trainers" titleStyle={{alignSelf: 'center', fontFamily: 'HelveticaNeue-Bold', fontSize: 15, fontWeight: '600'}} />
                    

                   
              
                </Appbar.Header>
            <Tabs locked={true} tabContainerStyle={{backgroundColor: '#FFFFFF'}} tabBarBackgroundColor='#FFFFFF'>
             <Tab  heading="Featured">
                <Featured />
             </Tab>
              <Tab heading="My Programs">
                <MyPrograms />
              </Tab>
            </Tabs>
    </Container>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#FFFFFF',
        flex: 1,
    },
    searchContainerStyle: {
        backgroundColor: "transparent", width: '90%'
    },
    inputContainerStyle: {
        backgroundColor: '#eeeeee',
    },
    inputStyle: {
        fontSize: 15, color: 'black', fontWeight: '800', fontFamily: 'avenir-roman'
    },
    iconContainer: {
        width: '10%', alignItems: 'center', justifyContent: 'center'
    },
})

export default LupaHome;