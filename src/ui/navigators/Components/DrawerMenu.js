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

/**
 * This component render a drawer menu. The drawer menu contains all of the content for the
 * drawer.
 * @param {Object} props Properties that this component receives.
 */
function DrawerMenu(props) {
  const currUserData = useSelector(state => {
    return state.Users.currUserData;
  })

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

      <TouchableOpacity onPress={() => props.navigation.dispatch(

NavigationActions.navigate({
routeName: 'Profile',
params: {userUUID: currUserData.user_uuid, navFrom: 'Drawer'},
action: NavigationActions.navigate({ routeName: 'Profile', params: {userUUID: currUserData.user_uuid, navFrom: 'Drawer'}})
})
        )}>
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
          <DrawerIcon name="activity" size={12} style={styles.iconMargin}/>
        <Button mode="Dashboard" color="grey" compact onPress={() => props.navigation.navigate('Dashboard')}>
          Dashboard
        </Button>
        </View>

        <Divider />

        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="heart" size={12} style={styles.iconMargin}/>
        <Button mode="Dashboard" color="grey" compact onPress={() => props.navigation.navigate('TrainerInformation', {
          navFrom: 'Drawer'
        })}>
          Register as a Lupa Trainer
        </Button>
        </View>

        <View style={styles.drawerFooter}>
          <Divider />
          <Caption style={styles.healthCareCaption}>
            Preventative Healthcare
          </Caption>
          <Divider />
          <View style={styles.footerSection}>
          <Caption>
            Terms of Service
          </Caption>
          <Caption>
            Privacy Policy
          </Caption>
          </View>
        </View>

        <Button mode="text" compact color="#2196F3" onPress={_handleLogout}>
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
      bottom: 20
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
      fontWeight: '500', 
      fontSize: 15
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