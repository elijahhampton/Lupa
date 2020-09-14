import React, {useState} from 'react';
import DrawerIcon from "react-native-vector-icons/Feather"

import { 
  connect, 
  useSelector 
} from 'react-redux';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';

import {
  Avatar,
  Caption,
  TouchableRipple,
  Button,
  Divider,
} from 'react-native-paper';

import { Constants } from 'react-native-unimodules';
import TrainerInsights from '../../user/trainer/TrainerInsights';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { LUPA_AUTH } from '../../../controller/firebase/firebase';

const ICON_SIZE = 20;
const ICON_COLOR = "#3d3d40"

/**
 * This component render a drawer menu. The drawer menu contains all of the content for the
 * drawer.
 * @param {Object} props Properties that this component receives.
 */
function DrawerMenu(props) {
  const navigation = useNavigation()
  const currUserData = useSelector(state => {
    return state.Users.currUserData;
  })

  /**
   * Navigates to the ProfileView
   * @param userUUID String uuid of the user to show on the profile
   * @param navFrom String Location navigating from
   */
  const navigateToProfile = () => {
    navigation.push('Profile', {
      userUUID: currUserData.user_uuid,
      navFrom: 'Drawer'
    })
  }

  const navigateToTrainerInformation = () => {
    navigation.navigate('RegisterAsTrainer', {
      navFrom: 'Drawer'
    })
  }

  /**
   * Logs the user out.
   */
  const _handleLogout = async () => {
    await LUPA_AUTH.signOut()
    navigation.navigate('Auth')
  }

  return (
    <View style={styles.container}>
    <SafeAreaView
      style={styles.safeAreaView}
      forceInset={{top: 'always', horizontal: 'never'}}>

      <TouchableOpacity onPress={navigateToProfile}>
      <View style={styles.drawerHeader}>
        <View>
              <Text style={styles.drawerHeaderText}>
                {currUserData.display_name}
              </Text>
              <Text style={styles.drawerHeaderSubText}>
                {currUserData.isTrainer ? 'Lupa Trainer' : 'Lupa User'}
              </Text>
            </View>

          <Avatar.Image source={{uri: currUserData.photo_url}} size={40} />
        </View>
      </TouchableOpacity>

        <Divider />

        <TouchableOpacity onPress={navigateToTrainerInformation}>
        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="file-text" color={ICON_COLOR} size={ICON_SIZE} style={styles.iconMargin}/>
          <Text style={styles.buttonText}>
           Register Trainer Account
          </Text>
        </View>
        </TouchableOpacity>
        
        <Divider />

        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="settings" color={ICON_COLOR} size={ICON_SIZE} style={styles.iconMargin}/>
          <Text style={styles.buttonText}>
           Settings
          </Text>
        </View>
        </TouchableOpacity>
        

        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="help-circle" color={ICON_COLOR} size={ICON_SIZE} style={styles.iconMargin}/>
          <Text style={styles.buttonText}>
           Support
          </Text>
        </View>

        <Divider />
        <Caption style={{padding: 10}}>
          Version 0.7 (41)
        </Caption>


        <View style={{position: 'absolute', bottom: 80, width: '100%'}}>
        <Button style={{alignSelf: 'center'}} mode="text" compact color="#1565C0" onPress={_handleLogout}>
    Log out
    </Button>
        </View> 
    </SafeAreaView>
  </View>
  )
}

export default DrawerMenu;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F2F2F2'
    },
    safeAreaView: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    drawerHeader: {
      margin: 15, 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between'
    },
    drawerFooter: {
      width: '100%', 
      flexDirection: 'column', 
      position: 'absolute', 
      bottom: Constants.statusBarHeight
    },
    footerSection: {
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-evenly', 
    },
    navigationButtonContaner: {
      flexDirection: 'row', 
      alignItems: 'center', 
      margin: 15,
      width: '90%'
    },
    drawerHeaderText: { 
      paddingVertical: 5,
      fontSize: 18,
      fontFamily: 'Avenir-Roman'
    },
    drawerHeaderSubText: {
      fontSize: 15,
      fontFamily: 'Avenir-Roman',
      color: '#1089ff',
    },
    iconMargin: {
      marginHorizontal: 8
    },
    healthCareCaption: {
      alignSelf: 'center', 
      padding: 5
    },
    buttonText: {
      color: '#000000',
    marginHorizontal: 15, 
        fontSize: 15, 
        fontFamily: 'Avenir-Roman',
    }
  });

  /*
    Trainers should go through their own spaces first
    

  */