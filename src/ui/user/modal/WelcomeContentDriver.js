import React, { useState, useEffect } from 'react';

import {
    Text,
    View,
    StyleSheet,

    Modal,
    Dimensions,
    ScrollView,
} from 'react-native';

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
    const [curatedTrainers, setCuratedTrainers] = useState([])
    const navigation = useNavigation()
    const dispatch = useDispatch()

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    const generateCuratedTrainers = async () => {
        await LUPA_CONTROLLER_INSTANCE.generateCuratedTrainers(currUserData.user_uuid, ['location']).then(data => {
            setCuratedTrainers(data);
        })
    }

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
                    console.log(locationInfo)
                    const locationData = await getLocationFromCoordinates(locationInfo.coords.longitude, locationInfo.coords.latitude);
                    await LUPA_CONTROLLER_INSTANCE.updateCurrentUser('location', locationData);
                    await setLocationDataIsSet(true)
                    //udpate user in redux
                    const payload = await getUpdateCurrentUserAttributeActionPayload('location', locationData, []);
                    await dispatch({ type: "UPDATE_CURRENT_USER_ATTRIBUTE", payload: payload })
                    console.log(payload)
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

    const renderCuratedTrainers = () => {
        return curatedTrainers.map(trainer => {
            console.log(trainer)
            return (
                <CuratedTrainerCard key={trainer.user_uuid} trainer={trainer} />
            )
        });

    }

    useEffect(() => {
        async function fetchData() {
            await generateCuratedTrainers();
        }

        fetchData();
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>
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

                <ListItem
                    title='Enable Location'
                    titleStyle={styles.highlightedTitleStyle}
                    subtitle='Lupa uses your location to suggest local trainers.'
                    subtitleStyle={styles.subtitleStyle}
                    bottomDivider
                    rightIcon={() => <FeatherIcon name="arrow-right" />}
                    onPress={_getLocationAsync}
                />

                <ListItem
                    title='Get started'
                    titleStyle={[styles.highlightedTitleStyle, { color: locationDataSet === true ? '#1089ff' : '#E5E5E5' }]}
                    disabled={locationDataSet === false}
                    style={{ color: '#E5E5E5' }}
                    bottomDivider
                    rightIcon={() => <FeatherIcon name="arrow-right" />}
                    onPress={() => navigation.navigate('App')}
                />

            </View>
            {
                locationDataSet === true ?
                    <View style={{ flex: 1.5, justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <Text style={[styles.headerText, { fontSize: 15, color: 'black', paddingVertical: 5 }]}>
                            Before we take you into the app we have curated a list of trainers based on your location and goals.
                                </Text>

                        <ScrollView
                            centerContent
                            contentContainerStyle={{ alignItems: 'center' }}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            pagingEnabled={true}
                            decelerationRate={0}
                            snapToAlignment='center'
                            snapToInterval={Dimensions.get('window').width}>
                            {renderCuratedTrainers()}
                        </ScrollView>




                    </View>

                    :
                    null
            }

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
        alignSelf: 'center', fontSize: 18, fontFamily: 'Avenir-Roman', paddingHorizontal: 10
    },
    headerTextContainer: {
        justifyContent: "space-evenly",
        marginTop: Constants.statusBarHeight
    },
    highlightedTitleStyle: {
        color: '#1089ff', fontFamily: 'Avenir'
    }
})