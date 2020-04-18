import React, { useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Modal,
    Image,
    Dimensions,
    ScrollView,
    DatePickerIOS,
    TouchableOpacity,
    Button as NativeButton,
} from 'react-native';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

import {
    IconButton,
    Button,
    Surface,
    Caption,
    TextInput,
    Title,
    Headline,
    Divider,
    Menu,
    Avatar,
    Chip
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';

import { MaterialIcons as Icon, Feather as FeatherIcon } from '@expo/vector-icons';
import LupaController from '../../controller/lupa/LupaController';

import { connect } from 'react-redux';

import LupaMapView from '../user/modal/LupaMapView';
import LupaCalendar from '../user/dashboard/calendar/LupaCalendar';

import { getPaymentTokenWithCard, initStripe, completePayment } from '../../modules/payments/stripe/index';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

const days = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
const years = [2020, 2021, 2022];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthsAsNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const century = 21; //This will need to be changed every year until we find a more suitable way to calculate the day of the week

//TODO: SHOW CONTAINED IF SESSIONS IS SELECTED
class CreateSessionModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            requestedUserUUID: this.props.navigation.state.params.userUUID,
            requestedUserData: [],
            preferred_workout_times: [],
            sessionName: "",
            sessionDescription: "",
            date: new Date().getDate(),
            sessionDay: new Date().getDate().toString(),
            sessionMonth: months[new Date().getMonth()],
            sessionYear: new Date().getFullYear().toString(),
            sessionDayOfTheWeek: "",
            sessionTimePeriods: [],
            requestedUserProfileImage: '',
            currUserProfileImage: '',
            activeDate: new Date(),
            sessionLocation: "Launch Map",
            mapViewVisible:  false,
            sessionLocationData: "",
            paymentSuccessful: false,
        }
    }

    componentDidMount = async () => {
        await this.setupRequestedUserInformation();
    }

    setupRequestedUserInformation = async () => {
        let requestedUserDataIn, requestedUserProfileImageIn, currUserProfileImageIn;
        //TODO: If it is the current user's UUID then pull user data from Redux Store
        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(this.props.navigation.state.params.userUUID).then(result => {
            requestedUserDataIn = result;
        })

        try {
            await this.LUPA_CONTROLLER_INSTANCE.getUserProfileImageFromUUID(this.props.navigation.state.params.userUUID).then(result => {
                requestedUserProfileImageIn = result;
            })

            if (requestedUserProfileImageIn == undefined)
            {
                requestedUserProfileImageIn = "";
            }
        } catch(err)
        {
            requestedUserProfileImageIn = "";
        }

        console.log('sdfsd')

        try {
            await this.LUPA_CONTROLLER_INSTANCE.getUserProfileImageFromUUID(this.props.lupa_data.Users.currUserData.user_uuid).then(result => {
                currUserProfileImageIn = result;
            })

            if (currUserProfileImageIn == undefined)
            {
                currUserProfileImageIn = ""
            }

        } catch(err)
        {
            currUserProfileImage = "";
        }
        console.log('dsfsd')

        await this.setState({ 
            requestedUserData: requestedUserDataIn, 
            preferred_workout_times: requestedUserDataIn.preferred_workout_times,
            requestedUserProfileImage: requestedUserProfileImageIn, 
            currUserProfileImage: currUserProfileImageIn,
         });
    }

    setActiveDate = (date) => {
        this.setState({ 
            activeDate: date, 
            sessionMonth: months[new Date(date).getMonth()], 
            sessionDay: new Date(date).getDate().toString(),
            sessionYear: new Date(date).getFullYear().toString()
        })
        console.log(this.state.sessionYear)
        console.log(this.state.sessionMonth);
        console.log(this.state.sessionDay);
        console.log(this.state.sessionDayOfTheWeek)
    }

    _getButtonMode = time => {
        return this.state.sessionTimePeriods.includes(time) ? "flat" : "outlined";
    }

    _handleNewSessionRequest = async () => {
        let paymentToken;

        let date = this.state.sessionMonth + "-" + this.state.sessionDay + "-" + this.state.sessionYear;
        const timestamp = {
            date: new Date().getDate(),
            time: new Date().getTime(),
        }
/*
        const amount = getPaymentAmountByTrainerTier(this.state.requestedUserData.trainer_tier);

        if (this.state.requestedUserData)
        {
            if (this.state.requestedUserData.isTrainer == true)
            {
                try 
                {
                    //initialize stripe
                    initStripe();

                    //Get a payment token with card data
                    await getPaymentTokenWithCard("", "", "", "", "", "", "", "").then(token => {
                        paymentToken = token;
                    });
                    
                    //complete payment
                    await completePayment("", "", paymentToken);

                    await this.setState({
                        paymentSuccessful: true
                    })
                }
                catch(err)
                {
                    alert('err handling payment')
                    await this.setState({
                        paymentSuccessful: false
                    })
                    return;
                }
            }
        }
*/
        this.LUPA_CONTROLLER_INSTANCE.createNewSession(this.props.lupa_data.Users.currUserData.user_uuid, this.state.requestedUserUUID, this.state.requestedUserUUID, date, this.state.sessionTimePeriods, this.state.sessionName, this.state.sessionDescription, timestamp, this.state.sessionLocationData);
        this.props.navigation.goBack();
    }

    handlePickSessionTime = (time) => {
        if (this.state.sessionTimePeriods.includes(time)) {
            let currentTimes = this.state.sessionTimePeriods;
            let updatedTimes  = currentTimes.slice(currentTimes.indexOf(time));
            this.setState({ sessionTimePeriods: updatedTimes });
        }
        else {
            let currentTimes = this.state.sessionTimePeriods;
            let updatedTimes = currentTimes.concat(time);
            this.setState({ sessionTimePeriods: updatedTimes });
        }
    }

    /**
     * Returns the available times a user has given a month, day, and year.
     * 
     * @param[in] month is an integer representing a month out of the year
     * @param[in] day is an integer representing a day out of the month
     * @param[in] year is an integer representing a year
     * @returns Collection of chips based on the day of the week calculated from the month, day, and year.
     * 
     * TODO: Reset time periods if you change the date 
     */
    _returnRequestedUserAvailableTimes = (month, day, year) => {
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let dayOfTheWeek = days[new Date(month + " " + day + "," + " " + year).getDay()];

        switch (dayOfTheWeek.toString()) {
            case 'Monday':
                return this.state.preferred_workout_times.Monday && this.state.preferred_workout_times.Monday.map(time => {
                    return <Chip style={{elevation: 2, margin: 5}} mode={this._getButtonMode(time)} color="#2196F3" key={time} onPress={() => this.handlePickSessionTime(time)}>
                        {time}
                    </Chip>
                })
            case 'Tuesday':
                return this.state.preferred_workout_times.Tuesday && this.state.preferred_workout_times.Tuesday.map(time => {
                    return <Chip  style={{elevation: 2, margin: 5}} mode={this._getButtonMode(time)} color="#2196F3" key={time} onPress={() => this.handlePickSessionTime(time)}>
                        {time}
                    </Chip>
                })
            case 'Wednesday':
                return this.state.preferred_workout_times.Wednesday && this.state.preferred_workout_times.Wednesday.map(time => {
                    return <Chip style={{elevation: 2, margin: 5}} mode={this._getButtonMode(time)} color="#2196F3" key={time} onPress={() => this.handlePickSessionTime(time)}>
                        {time}
                    </Chip>
                })
            case 'Thursday':

                return this.state.preferred_workout_times.Thursday && this.state.preferred_workout_times.Thursday.map(time => {
                    return <Chip style={{elevation: 2, margin: 5}} mode={this._getButtonMode(time)} color="#2196F3" key={time} onPress={() => this.handlePickSessionTime(time)}>
                        {time}
                    </Chip>
                })
            case 'Friday':

                return this.state.preferred_workout_times.Friday && this.state.preferred_workout_times.Friday.map(time => {
                    return <Chip style={{elevation: 2, margin: 5}} mode={this._getButtonMode(time)} color="#2196F3" key={time} onPress={() => this.handlePickSessionTime(time)}>
                        {time}
                    </Chip>
                })
            case 'Saturday':
                return this.state.preferred_workout_times.Saturday && this.state.preferred_workout_times.Saturday.map(time => {
                    return <Chip style={{elevation: 2, margin: 5}} mode={this._getButtonMode(time)} color="#2196F3" key={time} onPress={() => this.handlePickSessionTime(time)}>
                        {time}
                    </Chip>
                })
            case 'Sunday':

                return this.state.preferred_workout_times.Sunday && this.state.preferred_workout_times.Sunday.map(time => {
                    return <Chip style={{elevation: 2, margin: 5}} mode={this._getButtonMode(time)} color="#2196F3" key={time} onPress={() => this.handlePickSessionTime(time)}>
                        {time}
                    </Chip>
                })
        }
    }

    getCurrentUserAvatar = () => {
        let displayName = this.props.lupa_data.Users.currUserData.display_name.split(" ");
        let firstInitial = displayName[0].charAt(0);
        let secondInitial = displayName[1].charAt(0);
        if (this.state.currUserProfileImage == "" || this.state.currUserProfileImage == undefined)
        {
            return <Avatar.Text style={{backgroundColor: "#212121", flex: 1}} label={firstInitial+secondInitial}/>
        }
        else
        {
           return <Image source={{ uri: this.state.currUserProfileImage }} style={{ width: '100%', height: '100%', borderRadius: 80}} />
        }
    }

    getRequestedUserAvatar = () => {
        let displayName, firstInitial, secondInitial;
        if (this.state.requestedUserData.display_name)
        {
            displayName = this.state.requestedUserData.display_name.split(" ");
            firstInitial = displayName[0].charAt(0);
            secondInitial = displayName[0].charAt(1);
        }
        else
        {
            firstInitial="U"
            secondInitial="K"
        }

        if (this.state.requestedUserProfileImage == "" || this.state.requestedUserProfileImage == undefined)
        {
            return <Avatar.Text style={{backgroundColor: "#212121", flex: 1}} label={firstInitial+secondInitial}/>
        }
        else
        {
            return  <Image source={{ uri: this.state.requestedUserProfileImage }} style={{ width: '100%', height: '100%', borderRadius: 80 }} />
        }
    }

    closeMapView = () => {
        this.setState({
            mapViewVisible: false,
        })
    }

    openMapView = () => {
        this.setState({
            mapViewVisible: true,
        })
    }

    onMapViewClose = async (gymInformationIn) => {
        if (gymInformationIn == undefined) {
            return;
        }

        await this.setState({
            sessionLocation: gymInformationIn.name,
            sessionLocationData: gymInformationIn,
        })

        this.closeMapView();
    }

    render() {
        return (
                <ScrollView shouldRasterizeIOS={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, backgroundColor: "white", flexDirection: 'column', justifyContent: 'space-between'}}>
                    <SafeAreaView />
                    <View>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <Surface style={{ width: 90, height: 90, elevation: 3, borderRadius: 80, margin: 10 }}>
                                {
                                    this.getCurrentUserAvatar()
                                }
                            </Surface>

                            <Icon name="compare-arrows" size={40} />

                            <Surface style={{ width: 90, height: 90, elevation: 3, borderRadius: 80, margin: 10, }}>
                                {
                                    this.getRequestedUserAvatar()
                                }
                            </Surface>
                        </View>
                    </View>

                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'column', padding: 5, margin: 15 }}>
                        <TextInput value={this.state.sessionName} mode="outlined" placeholder="Session Name" style={{ margin: 5 }} onChangeText={text => this.setState({ sessionName: text })} returnKeyType="done" enablesReturnKeyAutomatically={true} theme={{
                            colors: {
                                primary: '#2196F3'
                            }
                        }} />
                        <TextInput value={this.state.sessionDescription} mode="outlined" placeholder="Session Description" multiline={true} style={{ margin: 5, height: 80 }} onChangeText={text => this.setState({ sessionDescription: text })} returnKeyType="done" enablesReturnKeyAutomatically={true} theme={{
                            colors: {
                                primary: '#2196F3'
                            }
                        }} />
                    </View>

                    <LupaCalendar elevation={0} onPress={(item) => this.setActiveDate(item)} />

                    <Divider/>

                        <View style={{margin: 15, flexDirection: 'column', justifyContent: 'space-evenly'}}>
                            <View style={{ padding: 10}}>
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Icon name="schedule" size={25} color="#2196F3" style={{margin: 5}} />
                                <Text style={{fontFamily: "avenir-roman", fontSize: 20,}}>
                                Choose a time
                                </Text>
                                </View>
                                <Caption>
                                    Choose times for your session(s) based on this user's available times.  If you want your session to last from 4:00 AM to 6:00 AM then choose 4:00 AM, 5:00 AM, and 6:00 AM.
                                </Caption>
                            </View>
                                <View style={{width: "100%", flexDirection: 'row', alignItems: "center",justifyContent: "center", flexWrap: 'wrap'}}>
                                {
                                this._returnRequestedUserAvailableTimes(this.state.sessionMonth, this.state.sessionDay, this.state.sessionYear)
                            }
                                </View>
                        </View>

                        <Divider/>

                        <View style={{margin: 15}}>
                        <View style={{ padding: 10}}>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Icon name="location-on" size={25} color="#2196F3" style={{margin: 5}}/>
                            <Text style={{fontFamily: "avenir-roman", fontSize: 20}}>
                                Choose a location
                                </Text>
                            </View>
                                <Caption>
                                    Press the button below to pick a location for your session.  Pick from a variety of gyms and parks in your area.
                                </Caption>
                            </View>
                            <TouchableOpacity onPress={this.openMapView}>
                            <Surface style={{alignSelf: "center", margin: 10, elevation: 8, width: "85%", height: "auto", padding: 15, borderRadius: 15, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
                                <View>
                                <Text style={{fontFamily: "avenir-roman", fontSize: 20}}>
                                    {this.state.sessionLocation}
                                </Text>
                                {
                                    this.state.sessionLocationData == "" ?
                                    null
                                    :
                                                                    <Text style={{fontFamily: "avenir-roman", fontSize: 15}}>
                                                                    {this.state.sessionLocationData.address}
                                                                </Text>
                                }
                                </View>
                            </Surface>
                            </TouchableOpacity>
                        </View>

                        <Divider style={{margin: 5}}/>

                        <View style={{width: "100%", justifyContent: "center", alignItems: "center"}}>
                            <TouchableOpacity onPress={this._handleNewSessionRequest} style={{width: "100%", alignItems: "center", justifyContent: "center"}}>
                            <View style={{marginLeft: 30, width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}}>
                                <FeatherIcon  style={{margin: 15}} name="calendar" color="rgba(33,150,243 ,1)" />
                                <Text style={{fontWeight: "400", fontFamily: "avenir-roman", fontSize: 18}}>
                                    Request Session
                                </Text>
                            </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} style={{width: "100%", alignItems: "center", justifyContent: "center"}}>
                            <View style={{marginLeft: 30, width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}}>
                                <FeatherIcon  style={{margin: 15}} name="x" color="rgba(33,150,243 ,1)" />
                                <Text style={{fontFamily: "avenir-book", fontSize: 18}}>
                                    Cancel
                                </Text>
                            </View>
                            </TouchableOpacity>
                        </View>

                        <Divider style={{margin: 5}} />
                        <SafeAreaView />

                        <LupaMapView 
                            initialRegionLatitude={this.props.lupa_data.Users.currUserData.location.latitude}
                            initialRegionLongitude={this.props.lupa_data.Users.currUserData.location.longitude}
                            closeMapViewMethod={gymData => this.onMapViewClose(gymData)}
                            isVisible={this.state.mapViewVisible}
                        />
                </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        display: "flex",
        backgroundColor: "white",
        margin: 0,
        padding: 15,
    },
    placeholderTextStyle: {
        color: "#E0E0E0",
        fontSize: 25
    },
    inputContainerStyle: {
        borderColor: "white",
        borderWidth: 0,
    },
    inputStyle: {
        fontSize: 17,
        fontWeight: "500",
    },
    containerStyle: {

    },
});

export default connect(mapStateToProps)(CreateSessionModal);
