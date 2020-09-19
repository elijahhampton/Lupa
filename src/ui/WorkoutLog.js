import React, { useEffect, createRef, useState } from 'react'

import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
} from 'react-native'

import {
    Card,
    Button,
    IconButton,
} from 'react-native-paper'

import { useSelector } from 'react-redux'
import LupaController from '../controller/lupa/LupaController'
import FeatherIcon from 'react-native-vector-icons/Feather'
import ProgramOptionsModal from './workout/program/modal/ProgramOptionsModal'
import { getLupaProgramInformationStructure } from '../model/data_structures/programs/program_structures'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import LUPA_DB from '../controller/firebase/firebase'
import {Calendar, CalendarList } from 'react-native-calendars'
import RBSheet from 'react-native-raw-bottom-sheet'
import { getLupaWorkoutInformationStructure } from '../model/data_structures/workout/workout_collection_structures'
import { connect } from 'react-redux'

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}


class WorkoutLog extends React.Component {
    WORKOUT_LOG_OBSERVER = undefined;
    constructor(props) {
        super(props);

        this.calendarRBSheet = createRef();

        this.state = {
            currentDay: "",
            currentWorkout: getLupaWorkoutInformationStructure(),
            userWorkouts: [],
            forceUpdate: false,
            selectedDate: new Date(),
        }
    }

    async componentDidMount() {
       this.WORKOUT_LOG_OBSERVER = await LUPA_DB.collection('users').doc(this.props.lupa_data.Users.currUserData.user_uuid).onSnapshot(async querySnapshot => {
            const data = querySnapshot.data();
            const workouts = data.workouts;
            
            if (typeof(data) == 'undefined') {
                await this.setState({ userWorkouts: {} });
            } else {
                await this.setState({ userWorkouts: workouts })
            }
      
            await this.setMarkedDate(workouts)
        });
    }


    componentWillUnmount() {
        return () => this.WORKOUT_LOG_OBSERVER();
    }

    setMarkedDate = async (userWorkouts) => {
        if (Object.keys(userWorkouts).length === 0) {
            this.setState({ markedDates: {} })
            return;
        }

        let updatedMarkedDates = {}

        for (key in userWorkouts) {
            let keySplit = key.split("-");
            let updatedKey = this.generateMarkedDateString(keySplit[2], keySplit[0], keySplit[1])
            updatedMarkedDates[updatedKey] = { marked: true, selected: true, dotColor: 'blue' }
        }

        await this.setState({ markedDates: updatedMarkedDates})
    }


    handleLaunchWorkout = async () => {
        await this.calendarRBSheet.current.close();

        const currentWorkout = this.state.currentWorkout;

        if (typeof(currentWorkout) == 'undefined') {
            return;
        }

        this.props.navigation.push('LiveWorkout', {
                programData: currentWorkout
        });
    }

    renderWorkoutMessage = () => {
        const currentWorkout = this.state.currentWorkout;
        if (this.state.workoutLoaded === false) {
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
                <Text style={{fontSize: 18, paddingHorizontal: 20}}>
                    You did not create a workout on this day.
                </Text>
               </View>
            )
        } else if (this.state.workoutLoaded === true) {
           return (
               <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
                
                
                <Text onPress={this.handleLaunchWorkout} style={{fontSize: 18, paddingHorizontal: 20, color: '#1089ff'}}>
                   It looks like you created a workout on this day.  Click here to launch it.
                </Text>

               
               </View>
           )
        } else {
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
                <Text style={{fontSize: 18, paddingHorizontal: 20}}>
                    You did not create a workout on this day.
                </Text>
               </View>
            )
        }
    }

    renderCalendarListRBSheet = () => {
        return (
            <RBSheet
                ref={this.calendarRBSheet}
                height={400}
                dragFromTopOnly={true}
                closeOnDragDown={true}
                customStyles={{
                    wrapper: {
                        
                    },
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20
                    },
                    draggableIcon: {
                        backgroundColor: 'rgb(220, 220, 220)',
                    }
                }}
                >
                    <View style={{flex: 1}}>
                    <Text style={{fontFamily: 'Avenir-Heavy', fontSize: 20, alignSelf: 'center'}}>
                        {this.state.currentDay}
                    </Text>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                           {this.renderWorkoutMessage()}
                        </View>
                    </View>
            </RBSheet>
        )
    }

    openRBSheet = () => {
        if (this.state.workoutLoaded === true) {
            this.calendarRBSheet.current.open()
        }
    }

    setRBSheetData = async (day) => {
        if (typeof(this.state.currentWorkout) == 'undefined') {
            return;
        }

        const dateString = day.month + "-" + day.day + "-" + day.year;
        const checkedMarkedDateString = this.generateMarkedDateString(day.year, day.month, day.day)

        const userWorkouts = this.state.userWorkouts

        if (Object.keys(this.state.markedDates).includes(checkedMarkedDateString)) {
            await this.setState({
                currentWorkout: userWorkouts[dateString][0],
                selectedDate: new Date(),
                currentDay: dateString,
                workoutLoaded: true,
            });
        } else {
            await this.setState({
                selectedDate: new Date(),
                currentWorkout: getLupaWorkoutInformationStructure(),
                currentDay: dateString,
                workoutLoaded: false,
            });
        }

        await this.setState({ forceUpdate: !this.state.forceUpdate })
        this.openRBSheet();
    }

    handleCalendarRBSheetOnOpen = async (day) => {
        await this.setRBSheetData(day)
    }

    generateMarkedDateString = (year, month, day) => {
        let dateString = year + "-";
        let newMonth;
        let newDay;
        if (month.toString().length == 1) {
            newMonth = "0" + month;
        } else {
            newMonth = month;
        }

        dateString =  dateString +  newMonth + "-"

        if (day.toString().length == 1) {
            newDay = "0" + day;
        } else {
            newDay = day;
        }
        
        dateString = dateString + newDay;

        return dateString;
    }

render() {
    return (
<View style={{ height: Dimensions.get('window').height}}>

    <CalendarList
  // The list of items that have to be displayed in agenda. If you want to render item as empty date
  // the value of date key has to be an empty array []. If there exists no value for date key it is
  // considered that the date in question is not yet loaded
  horizontal={false}
  items={this.props.lupa_data.Users.currUserData.workouts}
  // Callback that gets called when items for a certain month should be loaded (month became visible)
  loadItemsForMonth={(month) => {console.log('trigger items loading')}}
  // Callback that fires when the calendar is opened or closed
  onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
  // Callback that gets called on day press
  onDayPress={(day) => this.handleCalendarRBSheetOnOpen(day)}
  onDayLongPress={day => this.handleCalendarRBSheetOnOpen(day)}
  // Callback that gets called when day changes while scrolling agenda list
  onDayChange={(day)=> {this.handleCalendarRBSheetOnOpen(day)}}
  // Initially selected day
  selected={this.state.selectedDate}
  // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
  minDate={new Date()}
  // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
  maxDate={'2025-05-30'}

  // Max amount of months allowed to scroll to the past. Default = 50
  pastScrollRange={50}
  // Max amount of months allowed to scroll to the future. Default = 50
  futureScrollRange={50}
  // Specify how each item should be rendered in agenda
  renderItem={(item, firstItemInDay) => {return (<View />);}}
  // Specify how each date should be rendered. day can be undefined if the item is not first in that day.
  renderDay={(day, item) => {return (<View />);}}
  // Specify how empty date content with no items should be rendered
  renderEmptyDate={() => {return (<View />);}}
  // Specify how agenda knob should look like
  renderKnob={() => {return (<View />);}}
  // Specify what should be rendered instead of ActivityIndicator
  renderEmptyData = {() => {return (<View />);}}
  // Specify your item comparison function for increased performance
  rowHasChanged={(r1, r2) => {return true}}
  // Hide knob button. Default = false
  hideKnob={false}
  // By default, agenda dates are marked if they have at least one item, but you can override this if needed
  markedDates={this.state.markedDates}
  // If disabledByDefault={true} dates flagged as not disabled will be enabled. Default = false
  disabledByDefault={true}
  // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
  onRefresh={() => console.log('refreshing...')}
  // Set this true while waiting for new data from a refresh
  markingType="multi-period"
  // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView.
  refreshControl={null}
  // Agenda theme
  // Agenda container style
  style={{height: Dimensions.get('window').height}}
/>
{this.renderCalendarListRBSheet()}
</View>
      

    )
}
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    }
})

export default connect(mapStateToProps)(WorkoutLog);