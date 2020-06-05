import React from 'react';
import { NavigationActions, withNavigation } from 'react-navigation';
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

const ICON_SIZE = 12;

/**
 * This component render a drawer menu. The drawer menu contains all of the content for the
 * drawer.
 * @param {Object} props Properties that this component receives.
 */
function DrawerMenu(props) {
  const currUserData = useSelector(state => {
    return state.Users.currUserData;
  })

  /**
   * Navigates to the ProfileView
   * @param userUUID String uuid of the user to show on the profile
   * @param navFrom String Location navigating from
   */
  const navigateToProfile = () => {
    props.navigation.dispatch(

NavigationActions.navigate({
routeName: 'Profile',
params: {userUUID: currUserData.user_uuid, navFrom: 'Drawer'},
action: NavigationActions.navigate({ routeName: 'Profile', params: {userUUID: currUserData.user_uuid, navFrom: 'Drawer'}})
})
        )
  }

  /**
   * Logs the user out.
   */
  const _handleLogout = () => {
    props.logoutMethod()
  }

  return (
    <View style={styles.container}>
    <SafeAreaView
      style={styles.safeAreaView}
      forceInset={{top: 'always', horizontal: 'never', padding: 20}}>

      <TouchableOpacity onPress={navigateToProfile}>
      <View style={styles.drawerHeader}>
        <View flexDirection="column">
              <Text style={styles.drawerHeaderText}>
                {currUserData.display_name}
              </Text>
              <Text style={styles.drawerHeaderText}>
                {currUserData.email}
              </Text>
            </View>

          <Avatar.Image source={{uri: currUserData.photo_url}} size={40} />
        </View>
      </TouchableOpacity>

        <Divider />

        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="clipboard" size={ICON_SIZE} style={styles.iconMargin}/>
        <Button mode="text" color="grey" compact onPress={() => props.navigation.navigate('Dashboard')}>
          <Text>
            Dashboard
          </Text>
        </Button>
        </View>


        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="file-text" size={ICON_SIZE} style={styles.iconMargin}/>
        <Button mode="text" color="grey" compact onPress={() => props.navigation.navigate('TrainerInformation', {
          navFrom: 'Drawer'
        })}>
          <Text>
          Register as a Lupa Trainer
          </Text>
        </Button>
        </View>

        <View style={styles.drawerFooter}>
          <Divider />
          <Caption style={styles.healthCareCaption}>
            Preventative Healthcare
          </Caption>
          <Divider />
          <View style={styles.footerSection}>
          <Caption style={{color: '#1565C0'}}>
            Terms of Service
          </Caption>
          <Caption style={{color: '#1565C0'}}>
            Privacy Policy
          </Caption>
          </View>
        </View>

        <Button mode="text" compact color="#1565C0" onPress={_handleLogout}>
    Log out
    </Button>
    </SafeAreaView>
  </View>
  )
}

export default withNavigation(DrawerMenu);

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
      margin: 10
    },
    drawerHeaderText: { 
      fontSize: 15,
      fontFamily: 'ARSMaquettePro-Regular'
    },
    iconMargin: {
      margin: 3
    },
    healthCareCaption: {
      alignSelf: 'center', 
      padding: 5
    }
  });

  /*
    Trainers should go through their own spaces first
    

  */