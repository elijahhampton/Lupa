import React, { useState, useEffect } from 'react';

import {
    Text,
    View,
    StyleSheet,
Image,
    Modal,
    SafeAreaView,
    Dimensions,
    ScrollView,
    Alert,
} from 'react-native';

import {request, PERMISSIONS, RESULTS, check, } from 'react-native-permissions';
 
import {
    ActivityIndicator, Surface, Avatar, Chip, Button,
} from 'react-native-paper';

import { ListItem } from 'react-native-elements'
import FeatherIcon from 'react-native-vector-icons/Feather'

import LupaController from '../../../controller/lupa/LupaController'

import Geolocation from '@react-native-community/geolocation';
import { RFValue } from 'react-native-responsive-fontsize'
import getLocationFromCoordinates from '../../../modules/location/mapquest/mapquest';
import { getUpdateCurrentUserAttributeActionPayload } from '../../../controller/redux/payload_utility';
import CuratedTrainerCard from '../trainer/component/CuratedTrainerCard'
import _requestPermissionsAsync from '../../../controller/lupa/permissions/permissions'
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Constants } from 'react-native-unimodules';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { Pagination } from 'react-native-snap-carousel';
import {getLupaStoreState} from '../../../controller/redux/index';

//Activity Indicator to show while fetching location data
const ActivityIndicatorModal = (props) => {
    return (
        <Modal presentationStyle="overFullScreen" style={styles.activityIndicatorModal} visible={props.isVisible}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator style={{ alignSelf: "center" }} animating={true} hidesWhenStopped={false} size='large' color="#2196F3" />
            </View>
        </Modal>
    );
}

const WelcomeContentDriver = (props) => {
    const [locationDataSet, setLocationDataIsSet] = useState(false)
    const [loadingIndicatorIsShowing, setLoadingIndicatorIsShowing] = useState(false)
    const navigation = useNavigation()
    const dispatch = useDispatch()

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    /**
     * Fetches the user's location and populates the user lat, 
     * long, city, state, and country in the database.
     * 
     * TODO: This methid is not working.  Throws an error due to the 'coords' key missing due to async
     * behavior.
     */
    const _getLocationAsync = async () => {
        let result;

        await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              Alert.alert('It looks like your location services are disabled for Lupa.  Navigate to your settings to enable them and return to the app to continue.')
             return;
            case RESULTS.DENIED:
                alert('It looks like your location services are disabled for Lupa.  Navigate to your settings to enable them and return to the app to continue.')
                return;
            case RESULTS.GRANTED:
              // nothing to do
            setLocationDataIsSet(true);
              break;
            case RESULTS.BLOCKED:
              // alert the user to change it from settings
              Alert.alert('It looks like your location services are disabled for Lupa.  Navigate to your settings to enable them and return to the app to continue.')
              return;
          }
        })
        .catch((error) => {
          // …
          Alert.alert('AIt looks like your location services are disabled for Lupa.  Navigate to your settings to enable them and return to the app to continue.')
            return;
        });

        setLoadingIndicatorIsShowing(true)
        try {
            await Geolocation.getCurrentPosition(
                async (locationInfo) => {
                    const locationData = await getLocationFromCoordinates(locationInfo.coords.longitude, locationInfo.coords.latitude);
                    await LUPA_CONTROLLER_INSTANCE.updateCurrentUser('location', locationData);
                    await setLocationDataIsSet(true)
                    //udpate user in redux
                    const payload = await getUpdateCurrentUserAttributeActionPayload('location', locationData, []);
                    await dispatch({ type: "UPDATE_CURRENT_USER_ATTRIBUTE", payload: payload })
                },
                async (error) => {
                    setLocationDataIsSet(true);
                    const errLocationData = {
                        city: 'Unknown',
                        state: 'Unknown',
                        country: 'USA',
                        latitude: '37.7749',
                        longitude: '122.4194',
                    }


                    //Update user location in database
                    await LUPA_CONTROLLER_INSTANCE.updateCurrentUser('location', errLocationData);

                    //udpate user in redux
                    const payload = await getUpdateCurrentUserAttributeActionPayload('location', errLocationData, []);
                    await dispatch({ type: "UPDATE_CURRENT_USER_ATTRIBUTE", payload: payload })
                    await setLocationDataIsSet(false)

                    setLoadingIndicatorIsShowing(false)
                },
            );
        } catch (error) {
       setLocationDataIsSet(true)
            const errLocationData = {
                city: 'Unknown',
                state: 'Unknown',
                country: 'USA',
                latitude: '37.7749',
                longitude: '122.4194',
            }


            //Update user location in database
            await LUPA_CONTROLLER_INSTANCE.updateCurrentUser('location', errLocationData);

            //udpate user in redux
            const payload = await getUpdateCurrentUserAttributeActionPayload('location', errLocationData, []);
            await dispatch({ type: "UPDATE_CURRENT_USER_ATTRIBUTE", payload: payload })
            await setLocationDataIsSet(true)
            setLoadingIndicatorIsShowing(false);
        }

        await setLoadingIndicatorIsShowing(false);
    }

    const handleGetStartedOnPress = () => {
        LUPA_CONTROLLER_INSTANCE.updateCurrentUser('has_completed_onboarding', true, "");
        navigation.navigate('App')
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerTextContainer}>
                <Text style={[styles.headerText, {fontWeight: 'bold'}]}>
                    Thank you for joining Lupa.
                                </Text>
            </View>

            <View style={{ flex: 1 }}>
                <ListItem
                    title='Terms of Service'
                    titleStyle={styles.titleStyle}
                    subtitle='Find the Lupa Terms of Service here.'
                    subtitleStyle={styles.subtitleStyle}
                    rightIcon={() => <FeatherIcon name="arrow-right" />}
                    bottomDivider
                />

{
                    getLupaStoreState().Users.currUserData.isTrainer === true ?
                    null
                    :
                    <ListItem
                    title='Enable Location'
                    titleStyle={styles.highlightedTitleStyle}
                    subtitle='Lupa uses your location to suggest local trainers.'
                    subtitleStyle={styles.subtitleStyle}
                    bottomDivider
                    rightIcon={() => <FeatherIcon name="arrow-right" />}
                    onPress={_getLocationAsync}
                />
                }


                {
                    getLupaStoreState().Users.currUserData.isTrainer === true ?
                    <ListItem
                    title='Get started'
                    titleStyle={{ color: '#1089ff' }}
                    disabled={false}
                    style={{ color: '#E5E5E5' }}
                    bottomDivider
                    rightIcon={() => <FeatherIcon name="arrow-right" />}
                    onPress={handleGetStartedOnPress}
                />
                    :
                    <ListItem
                    title='Get started'
                    titleStyle={[styles.highlightedTitleStyle, { color: locationDataSet === true ? '#1089ff' : '#E5E5E5' }]}
                    disabled={getLupaStoreState().Users.currUserData.isTrainer === false && locationDataSet === false}
                    style={{ color: '#E5E5E5' }}
                    bottomDivider
                    rightIcon={() => <FeatherIcon name="arrow-right" />}
                    onPress={handleGetStartedOnPress}
                />

                }
               

            </View>
            <ActivityIndicatorModal isVisible={loadingIndicatorIsShowing} />
        </View>
    )
}

export default WelcomeContentDriver;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleStyle: {
        fontSize: 15, fontWeight: '400', color: 'rgb(72, 72, 74)'
    },
    subtitleStyle: {
        fontSize: 15, fontFamily: 'Avenir-Medium'
    },
    headerText: {
        alignSelf: 'center', fontSize: 18, color: '#212121', fontFamily: 'Avenir-Roman', paddingHorizontal: 10
    },
    headerTextContainer: {
        justifyContent: "space-evenly",
        marginTop: Constants.statusBarHeight
    },
    highlightedTitleStyle: {
        color: '#1089ff', fontFamily: 'Avenir'
    }
})