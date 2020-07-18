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
import WorkoutLogModal from '../../workout/modal/WorkoutLogModal';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { LUPA_AUTH } from '../../../controller/firebase/firebase';

const ICON_SIZE = 20;

/**
 * This component render a drawer menu. The drawer menu contains all of the content for the
 * drawer.
 * @param {Object} props Properties that this component receives.
 */
function DrawerMenu(props) {
  const navigation = useNavigation()
  const [trainerInsightsModalIsOpen, setTrainerInsightsModalOpen] = useState(false)
  const [workoutLogModalIsOpen, setWorkoutLogIsOpen] = useState(false)

  const currUserData = useSelector(state => {
    return state.Users.currUserData;
  })

  /**
   * Navigates to the ProfileView
   * @param userUUID String uuid of the user to show on the profile
   * @param navFrom String Location navigating from
   */
  const navigateToProfile = () => {
    navigation.dispatch(

      CommonActions.navigate({
        name: 'Profile',
        params: {userUUID: currUserData.user_uuid, navFrom: 'Drawer'},
      })
      )
  }

  const navigateToDashboard = () => {
   navigation.navigate('Dashboard')
  }

  const navigateToTrainerInformation = () => {
    navigation.navigate('RegisterAsTrainer', {
      navFrom: 'Drawer'
    })
  }

  /**
   * Logs the user out.
   */
  const _handleLogout = () => {
    LUPA_AUTH.signOut()
    navigation.navigate('Auth')
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

        <TouchableOpacity onPress={navigateToDashboard}>
        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="clipboard" size={ICON_SIZE} style={styles.iconMargin}/>
          <Text style={{fontSize: 16, fontWeight: '300'}}>
           Dashboard
          </Text>
        </View>
        </TouchableOpacity>


        <TouchableOpacity onPress={navigateToTrainerInformation}>
        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="file-text" size={ICON_SIZE} style={styles.iconMargin}/>
          <Text style={{fontSize: 16, fontWeight: '300'}}>
           Register Trainer Account
          </Text>
        </View>
        </TouchableOpacity>

        <Divider />

        <TouchableOpacity onPress={() => setWorkoutLogIsOpen(true)}>
        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="book-open" size={ICON_SIZE} style={styles.iconMargin}/>
          <Text style={{fontSize: 16, fontWeight: '300'}}>
           Workout Log
          </Text>
        </View>
        </TouchableOpacity>

        <TouchableOpacity>
        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="book-open" size={ICON_SIZE} style={styles.iconMargin}/>
          <Text style={{fontSize: 16, fontWeight: '300'}}>
         Assessments
          </Text>
        </View>
        </TouchableOpacity>


        {
          currUserData.isTrainer === true ?
          <TouchableOpacity onPress={() => setTrainerInsightsModalOpen(true)}>
          <View style={styles.navigationButtonContaner}>
            <DrawerIcon name="bar-chart" size={ICON_SIZE} style={styles.iconMargin}/>
            <Text style={{fontSize: 16, fontWeight: '300'}}>
             Trainer Insights
            </Text>
          </View>
          </TouchableOpacity>
          :
          null
        }
        
        <Divider />

        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="clipboard" size={ICON_SIZE} style={styles.iconMargin}/>
          <Text style={{fontSize: 16, fontWeight: '300'}}>
           Terms of Service and Privacy
          </Text>
        </View>

        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="clipboard" size={ICON_SIZE} style={styles.iconMargin}/>
          <Text style={{fontSize: 16, fontWeight: '300'}}>
           Settings
          </Text>
        </View>

        <View style={{position: 'absolute', bottom: 80, width: '100%'}}>
        <Button style={{alignSelf: 'center'}} mode="text" compact color="#1565C0" onPress={_handleLogout}>
    Log out
    </Button>
        </View> 

        <TrainerInsights isVisible={trainerInsightsModalIsOpen} closeModalMethod={() => setTrainerInsightsModalOpen(false)} />
       <WorkoutLogModal isVisible={workoutLogModalIsOpen} closeModalMethod={() => setWorkoutLogIsOpen(false)} />
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
      fontSize: 15,
       
    },
    iconMargin: {
      marginHorizontal: 8
    },
    healthCareCaption: {
      alignSelf: 'center', 
      padding: 5
    }
  });

  /*
    Trainers should go through their own spaces first
    

  */