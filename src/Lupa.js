/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  22, 2019
 *
 * Lupa App
 */
import React, { useEffect } from "react";
import {
  Text,
  StyleSheet,
  AsyncStorage,
  View,
  StatusBar,

} from "react-native";
import LupaController from './controller/lupa/LupaController';
import LupaDrawerNavigator from "./ui/navigators/LupaDrawerNavigator";
import { connect, useSelector } from 'react-redux'
import { generateMessagingToken, requestNotificationPermissions, registerAppWithFCM, } from "./controller/firebase/firebase";
import { fcmService } from './controller/firebase/service/FCMService'
import WelcomeModal from './ui/user/modal/WelcomeModal/WelcomeModal'
import WelcomeContentDriver from "./ui/user/modal/WelcomeContentDriver";
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import getLocationFromCoordinates from './modules/location/mapquest/mapquest'
import Geolocation from '@react-native-community/geolocation';
import LOG from "./common/Logger";
import CreateNewPost from "./ui/user/profile/modal/CreateNewPost";

Geolocation.setRNConfiguration({
  authorizationLevel: 'whenInUse',
  skipPermissionRequests: false,
});

const mapStateToProps = (state, action) => {
  return {
    lupa_data: state
  }
}

class Lupa extends React.Component {
  constructor(props) {
    super(props);
    
    this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    this.state = {
      initialPosition: '',
      lastPosition: '',
      locationPermissionStatus: '',
    }
  }

  async componentDidMount() {
    LOG('Lupa.js', 'Checking location permissions.');
    await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
    
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          alert('Location Services Unavailable')
          this.setState({ locationPermissionStatus: 'unavailable' })
          break;
        case RESULTS.DENIED:
          alert('Location Services Denied')
          this.setState({ locationPermissionStatus: 'denied' })
          break;
        case RESULTS.GRANTED:
          this.setState({ locationPermissionStatus: 'granted' })
          break;
        case RESULTS.BLOCKED:
          alert('Location Services Blocked')
          this.setState({ locationPermissionStatus: 'blocked' })
          break;
        default:
       
      }
    })
    .catch((error) => {
      // …
      alert(error)
    });

    generateMessagingToken(this.props.lupa_data.Users.currUserData.user_uuid)

  if (this.state.locationPermissionStatus == 'granted') {
    LOG('Lupa.js', 'Retrieving the current users position');
    Geolocation.getCurrentPosition(
      async (position) => {
        const locationData = await getLocationFromCoordinates(position.coords.longitude, position.coords.latitude);
        await this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('location', locationData);
         const initialPosition = JSON.stringify(position);
         this.setState({ initialPosition : initialPosition });
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
   );

    this.watchID = Geolocation.watchPosition(async (position) => {
      const locationData = await getLocationFromCoordinates(position.coords.longitude, position.coords.latitude);
      await this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('location', locationData);
      const lastPosition = await JSON.stringify(position);
      this.setState({ lastPosition: lastPosition });
   });
  }

  this.LUPA_CONTROLLER_INSTANCE.indexApplicationData()
}

  componentWillUnmount() {
    LOG('Lupa.js', 'Clearing subscription to Geolocation');
    Geolocation.clearWatch(this.watchID);
  }

  render() {
    return (
      <View style={{flex: 1}}>
  <StatusBar barStyle="dark-content" networkActivityIndicatorVisible={true} />
        <LupaDrawerNavigator />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  appContainer: {
    display: 'flex'
  }
});


export default connect(mapStateToProps)(Lupa);
