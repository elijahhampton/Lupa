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
    Button as NativeButton,
    TouchableOpacity
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
    Menu
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';

import { MaterialIcons as Icon, Feather as FeatherIcon } from '@expo/vector-icons';
import LupaController from '../../../../controller/lupa/LupaController';

import { connect } from 'react-redux';

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

class CreateSessionModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            requestedUserUUID: this.props.navigation.state.params.userUUID,
            requestedUserData: {},
            sessionName: "",
            sessionDescription: "",
            date: new Date().getDate(),
            sessionDay: new Date().getDate().toString(),
            sessionMonth: months[new Date().getMonth()],
            sessionYear: new Date().getFullYear().toString(),
            sessionDayOfTheWeek: "",
            dayMenuActive: false,
            monthMenuActive: false,
            yearMenuActive: false,
            sessionTimePeriods: []
        }
    }

    componentDidMount = async () => {
        console.log('did this work: ' + this.state.requestedUserUUID)
       await this.setupRequestedUserInformation();
    }

    setupRequestedUserInformation = async () => {
        console.log('the uuid is: ' + this.state.requestedUserUUID)
        let requestedUserDataIn;
        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(this.state.requestedUserUUID).then(result => {
            requestedUserDataIn = result;
        })

        await this.setState({ requestedUserData: requestedUserDataIn });
    }

    _handleNewSessionRequest = () => {
        let date = this.state.sessionMonth + "-" + this.state.sessionDay + "-" + this.state.sessionYear;
        let timestamp = {
            date: new Date().getDate(),
            time: new Date().getTime(),
        }
        this.LUPA_CONTROLLER_INSTANCE.createNewSession(this.props.lupa_data.Users.currUserData.user_uuid, this.state.requestedUserUUID, this.state.requestedUserUUID, date, this.state.sessionTimePeriods, this.state.sessionName, this.state.sessionDescription, timestamp);
        this.props.navigation.goBack();
    }

    _returnRequestedUserAvailableTimes = (month, day, year) => {
        const dayOfTheWeek = (5 + 6 + 2020 + (2020 / 4) + century) % 7
        console.log('DAY OF THE WEK: ' + dayOfTheWeek)
        let dayOfTheWeekString;
        switch(dayOfTheWeek)
        {
            case 1:
                dayOfTheWeekString = "Sunday";
                break;
            case 2:
                console.log('Declaring as Monday')
                dayOfTheWeekString = "Monday";
                break;
            case 3:
                dayOfTheWeekString = "Tuesday";
                break;
            case 4:
                dayOfTheWeekString = "Wednesday";
                break;
            case 5:
                dayOfTheWeekString = "Thursday";
                break;
            case 6:
                dayOfTheWeekString = "Friday";
                break;
            case 7:
                dayOfTheWeekString = "Saturday";
                break;
            default:
                dayOfTheWeekString = "Sunday";
                break;
        }

       // const timeDataFromDay = this.state.requestedUserData.preferred_workout_times.dayOfTheWeekString;
      // const timeDataFromDay = this.state.requestedUserData.preferred_workout_times;
        /*const beginningTimePeriod = timeDataFromDay

        //get the length of the timeData
        let timeDataFromDayLength = timeDataFromDay.length;

        //array to store all times
        let timesArray = [];

        //for each item in the array extract beginning and ending time period
        timeDataFromDay.forEach((item, index, arr) => { //Ex Item -> 3:00 PM - 8:00 PM
            let beginningTimePeriod = item.substr(item.indexOf('A', 2));
            let endingTimePeriod = tiem.substr(item.indexOf('P', 2));

            let hour = item;
            let split = item.split('-');
            let beginningTime = parseInt(split[0].charAt(0));
            let endingTime = parseInt(split[1].charAt(0));
            let numbersBetween = abs(beginningTime - endingTime);

            if (beginningTimePeriod == 'AM')
            {
                let modifier = 'AM';
                for (let i = 0; i < numbersBetween; ++i)
                {

                    timesArray.push(toString(beginningTime) + ':00' + " " + modifier);
                    beginningTime += 1;

                    if (beginningTime == 12)
                    {
                        modifier = "PM"
                    }
                }
            }

            if (beginningTimePeriod == 'PM')
            {
                let modifier = 'PM';
                for (let i = 0; i < numbersBetween; ++i)
                {

                    timesArray.push(toString(beginningTime) + ':00' + " " + modifier);
                    beginningTime += 1;

                    if (beginningTime == 12)
                    {
                        modifier = "AM"
                    }
                }
            }

        });

        timesArray.sort();

        console.log(timesArray);*/
    }

    render() {
        const { currIndex } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <SafeAreaView style={{ flex: 1, backgroundColor: '#1A237E', padding: 10, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    <Headline style={{ alignSelf: 'center', color: 'white', textAlign: 'center', }}>
                        You are about to request a session with: {this.state.requestedUserData.display_name}
                    </Headline>

                    <View>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <Surface style={{ width: 90, height: 90, elevation: 10, borderRadius: 80, margin: 10 }}>
                                <Image source={{ uri: this.props.lupa_data.Users.currUserData.photo_url }} style={{ flex: 1, borderRadius: 80 }} />
                            </Surface>

                            <Icon name="compare-arrows" size={40} />

                            <Surface style={{ width: 90, height: 90, elevation: 10, borderRadius: 80, margin: 10, }}>
                                <Image source={{ uri: this.state.requestedUserData.photo_url }} style={{ flex: 1, borderRadius: 80 }} />
                            </Surface>
                        </View>
                    </View>
                </SafeAreaView>
                <ScrollView shouldRasterizeIOS={false} showsVerticalScrollIndicator={true} contentContainerStyle={{ flexGrow: 2, backgroundColor: "#FAFAFA", flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Headline style={{ padding: 5 }}>
                        Session Information
                            </Headline>


                    <View style={{ flex: 1, justifyContent: 'space-evenly', flexDirection: 'column', padding: 5, margin: 5 }}>
                        <Title style={{ alignSelf: 'center' }}>
                            Session name and description
                            </Title>
                        <TextInput value={this.state.sessionName} mode="outlined" placeholder="Session Name" style={{ margin: 5 }} onChangeText={text => this.setState({ sessionName: text })} />
                        <TextInput value={this.state.sessionDescription} mode="outlined" placeholder="Session Description" multiline={true} style={{ margin: 5, height: 80 }} onChangeText={text => this.setState({ sessionDescription: text })} />
                    </View>

                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', margin: 5 }}>



                        {/* date selector */}
                        <View style={{ flexDirection: 'column', justifyContent: 'space-evenly' }}>
                            <Title style={{ alignSelf: 'center' }}>
                                Pick a date
                                </Title>

                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                <Menu
                                    anchor={
                                        <Button mode="contained" color="#1A237E" onPress={() => this.setState({ dayMenuActive: true })}>
                                            {this.state.sessionDay}
                                        </Button>
                                    } visible={this.state.dayMenuActive} onDismiss={() => this.setState({ dayMenuActive: false })} style={{height: '65%'}}>
                                        <ScrollView>
                                            {
                                                                                        days.map(day => {
                                                                                            return (
                                                                                                <Menu.Item key={day} title={day} onPress={() => this.setState({ sessionDay: day }) } />
                                                                                            )
                                                                                        })
                                            }
                                        </ScrollView>
                                    <Divider />
                                    <Menu.Item title="Cancel" />
                                </Menu>

                                <Menu

                                    anchor={
                                        <Button mode="contained" color="#1A237E" onPress={() => this.setState({ monthMenuActive: true })}>
                                            {this.state.sessionMonth}
                                        </Button>
                                    } visible={this.state.monthMenuActive} onDismiss={() => this.setState({ monthMenuActive: false })} style={{height: '65%'}}>
                                    <ScrollView>
                                    {
                                        months.map(month => {
                                            return (
                                                <Menu.Item key={month} title={month} onPress={() => this.setState({ sessionMonth: month})}/>
                                            )
                                        })
                                    }
                                    </ScrollView>
                                     <Divider />
                                    <Menu.Item title="Cancel" />
                                </Menu>


                                <Menu
                                    anchor={
                                        <Button mode="contained" color="#1A237E" onPress={() => this.setState({ yearMenuActive: true })}>
                                            {this.state.sessionYear}
                                        </Button>
                                    } visible={this.state.yearMenuActive} onDismiss={() => this.setState({ yearMenuActive: false })}>
                                    {
                                        years.map(year => {
                                            return (
                                                <Menu.Item key={year} title={year} onPress={() => this.setState({ sessionYear: year })} />
                                            )
                                        })
                                    }
                                    <Divider />
                                    <Menu.Item title="Cancel" />
                                </Menu>
                            </View>
                        </View>

                    </View>


                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                            <Title>
                                Pick a time or multiple
                                </Title>
                                {
                                   // this._returnRequestedUserAvailableTimes(this.state.sessionMonth, this.state.sessionDay, this.state.sessionYear)
                                }
                                <Button mode="text" onPress={() => this.setState({ sessionTimePeriods: this.state.sessionTimePeriods.concat("4:00 PM - 5:00 PM")})}>
                                    4:00 PM
                                </Button>

                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
                            <Button mode="text" color="#1A237E">
                                Back
                                </Button>
                            <Button mode="contained" color="#1A237E" onPress={this._handleNewSessionRequest}>
                                Request
                                </Button>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        display: "flex",
        backgroundColor: "#FAFAFA",
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
