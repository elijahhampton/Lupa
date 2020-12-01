import React, {useEffect, useState} from 'react';
import DrawerIcon from 'react-native-vector-icons/Feather'

import { 
  connect, 
  useDispatch, 
  useSelector 
} from 'react-redux';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
    Linking,
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
import { logoutUser } from '../../../controller/lupa/auth/auth';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { getLupaStoreState }from '../../../controller/redux/index';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const ICON_SIZE = 20;
const ICON_COLOR = "rgb(203, 209, 214)"

/**
 * This component render a drawer menu. The drawer menu contains all of the content for the
 * drawer.
 * @param {Object} props Properties that this component receives.
 */
function DrawerMenu(props) {
  const [lupaStoreState, setLupaStoreState] = useState(getLupaStoreState())
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const currUserData = useSelector(state => {
    return state.Users.currUserData;
  })

  const [packsAreVisible, setPacksVisible] = useState(false);

  useEffect(() => {
    setLupaStoreState(getLupaStoreState())
  }, [])

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

  const navigateToPickInterest = () => {
    navigation.push('PickInterest', {
      navFrom: 'Drawer'
    });
  }

  /**
   * Logs the user out.
   */
  const _handleLogout = async () => {
    await dispatch(logoutUser());
    await navigation.navigate('GuestView');
  }

  const togglePacksVisibility = () => {
    setPacksVisible(!packsAreVisible)
  }

  const navigateToPackChat = (uid) => {
    navigation.navigate('PackChat', {
      uid: uid
    })
  }

  const renderPacksDisplay = () => {
    if (packsAreVisible) {
      return null;
    }

    if (lupaStoreState.Packs.currUserPacksData.length === 0) {
      return (
        <View style={{height: 'auto', marginLeft: 50}}>
        <Text style={{fontSize: 13, fontFamily: 'Avenir', fontWeight: '500'}}> 
          Find a Pack
        </Text>
      </View>
      )
    }

    return lupaStoreState.Packs.currUserPacksData.map(pack => {
      return (
        <TouchableWithoutFeedback onPress={() => navigateToPackChat(pack.uid)}>
        <View style={{height: 'auto', marginLeft: 50}}>
        <Text style={{fontSize: 13, fontFamily: 'Avenir', fontWeight: '500'}}> 
        {pack.name}
        </Text>
      </View>
      </TouchableWithoutFeedback>
      )
    })
  }

  return (
    <View style={styles.container}>
    <SafeAreaView
      style={styles.safeAreaView}
      forceInset={{top: 'always', horizontal: 'never'}}>
        <View style={{flex: 1, justifyContent: 'space-between'}}>
<View>
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

<TouchableOpacity onPress={navigateToProfile}>
        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="file-text" color={ICON_COLOR} size={ICON_SIZE} style={styles.iconMargin}/>
          <Text style={styles.buttonText}>
           Profile
          </Text>
        </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePacksVisibility}>
        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="globe" color={ICON_COLOR} size={ICON_SIZE} style={styles.iconMargin}/>
          <Text style={styles.buttonText}>
           Packs
          </Text>
        </View>
        </TouchableOpacity>
        {
          renderPacksDisplay()
        }

        <TouchableOpacity onPress={navigateToPickInterest}>
        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="file-text" color={ICON_COLOR} size={ICON_SIZE} style={styles.iconMargin}/>
          <Text style={styles.buttonText}>
           Interest
          </Text>
        </View>
        </TouchableOpacity>

{/*

        <TouchableOpacity onPress={navigateToTrainerInformation}>
        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="file-text" color={ICON_COLOR} size={ICON_SIZE} style={styles.iconMargin}/>
          <Text style={styles.buttonText}>
           Register Trainer Account
          </Text>
        </View>
        </TouchableOpacity>

*/}

        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="settings" color={ICON_COLOR} size={ICON_SIZE} style={styles.iconMargin}/>
          <Text style={styles.buttonText}>
           Settings
          </Text>
        </View>
        </TouchableOpacity>
        

        {
          currUserData.isTrainer ?
          <>
          <TouchableOpacity onPress={() => navigation.push('MyClients')}>
        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="user" color={ICON_COLOR} size={ICON_SIZE} style={styles.iconMargin}/>
          <Text style={styles.buttonText}>
           My Clients
          </Text>
        </View>
        </TouchableOpacity>
          </>
          :
          null
        }

        </View>

        <View style={{paddingVertical: 50}}>
        <Divider style={{width: Dimensions.get('window').width}} />

        <TouchableOpacity onPress={() => Linking.openURL('https://rheasilvialupaheal.wixsite.com/lupahealth/')}>
        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="help-circle" color={ICON_COLOR} size={ICON_SIZE} style={styles.iconMargin}/>
          <Text style={styles.buttonText}>
           Support
          </Text>
        </View>
        </TouchableOpacity>


<View style={{width: '100%'}}>
<TouchableOpacity onPress={_handleLogout}>
        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="log-out" color={ICON_COLOR} size={ICON_SIZE} style={styles.iconMargin}/>
          <Text style={styles.buttonText}>
           Log out
          </Text>
        </View>
        </TouchableOpacity>
</View> 
        </View>



        </View>
    </SafeAreaView>
  </View>
  )
}

export default DrawerMenu;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF'
    },
    safeAreaView: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    drawerHeader: {
      margin: 15, 
      flexDirection: 'row', 
      paddingHorizontal: 10,
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
      fontFamily: 'Avenir-Black'
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
        fontSize: 15, 
        fontWeight: '300',
    }
  });

  /*
    Trainers should go through their own spaces first
    

  */