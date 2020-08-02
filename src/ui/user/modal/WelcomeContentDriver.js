import React, { useState } from 'react';

import {
    Text,
    View,
    StyleSheet,
 
    Modal,
} from 'react-native';

import {
    ActivityIndicator,
} from 'react-native-paper';

import { ListItem} from 'react-native-elements'
import FeatherIcon from 'react-native-vector-icons/Feather'

import LupaController from '../../../controller/lupa/LupaController'

import Geolocation from '@react-native-community/geolocation';

import getLocationFromCoordinates from '../../../modules/location/mapquest/mapquest';
import { getUpdateCurrentUserAttributeActionPayload } from '../../../controller/redux/payload_utility';

import _requestPermissionsAsync from '../../../controller/lupa/permissions/permissions'
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
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
                    alert(error)
                    const errLocationData = {
                        city: 'San Francisco',
                        state: 'CA',
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
            alert(error)
            const errLocationData = {
                city: 'San Francisco',
                state: 'CA',
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


            setLoadingIndicatorIsShowing(false)
        }


        await setLoadingIndicatorIsShowing(false)

    }

    return (
        <View style={styles.container}>
                            <View style={styles.headerTextContainer}>
                                <Text style={styles.headerText}>
                                   Thank you for joining Lupa.
                                </Text>
                                
                                <View>
                                <ListItem
        title='Report'
        titleStyle={styles.titleStyle}
        subtitle='Remember to report suspicious behavior.'
        subtitleStyle={styles.subtitleStyle}
        bottomDivider
      />
                                <ListItem
        title='Train Safely'
        titleStyle={styles.titleStyle}
        subtitle='Always meet trainers in a public area.'
        subtitleStyle={styles.subtitleStyle}
        bottomDivider
      />
                             <ListItem
        title='Terms of Service'
        titleStyle={styles.titleStyle}
        subtitle='Find the Lupa Terms of Service here.'
        subtitleStyle={styles.subtitleStyle}
        rightIcon={() => <FeatherIcon name="arrow-right" />}
        bottomDivider
      />

<ListItem
        title='Enable Location'
        titleStyle={styles.highlightedTitleStyle}
        subtitle='Lupa uses your location to suggest local trainers.'
        bottomDivider
        rightIcon={() => <FeatherIcon name="arrow-right" />}
        onPress={_getLocationAsync}
      />

      <ListItem
        title='Get started'
        titleStyle={styles.highlightedTitleStyle}

        bottomDivider
        rightIcon={() => <FeatherIcon name="arrow-right" />}
        onPress={() => navigation.navigate('App')}
      />
                               
                            </View>
                            </View>

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
        fontSize: 15, fontWeight: '500'
    },
    headerText: {
        alignSelf: 'center', fontFamily: 'avenir-roman', fontSize: 20, color: 'rgb(58, 58, 60)', fontWeight: '700'
    },
    headerTextContainer: {
        flex: 0.5, justifyContent: "space-evenly"
    },
    highlightedTitleStyle: {
        color: '#1089ff', fontWeight: '500'
    }
})