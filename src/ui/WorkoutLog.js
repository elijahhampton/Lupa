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
    constructor(props) {
        super(props);

        this.calendarRBSheet = createRef();

        this.state = {
            currentDay: "",
            currentWorkout: getLupaWorkoutInformationStructure(),
            userWorkouts: [],
            selectedDate: new Date(),
        }
    }


    handleWorkoutOnPress = (workout) => {
        this.props.navigation.push('LiveWorkout', {
                uuid: workout.program_structure_uuid,
                workoutType: 'WORKOUT',
        })
    }

    renderWorkoutMessage = () => {
        if (typeof(this.state.currentWorkout) == 'undefined' || typeof(this.state.currentWorkout.program_structure_uuid) == "undefined") {
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
                <Text style={{fontSize: 18, paddingHorizontal: 20}}>
                    You did not create a workout on this day.
                </Text>
               </View>
            )
        } else {
           return (
               <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
                <Text style={{fontSize: 18, paddingHorizontal: 20}}>
                    Do you want to launch the workout you created on this day?
                </Text>

                <Button color="#1089ff" style={{fontWeight: '300', }} mode="text">
                    <Text>
                        Launch Workout
                    </Text>
                </Button>
               </View>
           )
        }
    }

    renderCalendarListRBSheet = () => {
        return (
            <RBSheet
                ref={this.calendarRBSheet}
                height={500}
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
        this.calendarRBSheet.current.open()
    }

    setRBSheetData = async (day) => {
        const dateString = day.month + "-" + day.day + "-" + day.year;
        const userWorkouts = this.props.lupa_data.Users.currUserData.workouts;

        if (typeof(userWorkouts[dateString]) != 'undefined') {
            await this.setState({
                selectedDate: new Date(day),
                currentWorkout: userWorkouts[dateString],
                currentDay: dateString
            })
        } else {
            await this.setState({
                selectedDate: new Date(day),
                currentWorkout: getLupaWorkoutInformationStructure(),
                currentDay: dateString
            })
        }
    }

    handleCalendarRBSheetOnOpen = async (day) => {
        await this.setRBSheetData(day)
        this.openRBSheet();
    }

render() {
    return (
     
        
<View style={{ height: Dimensions.get('window').height}}>

    <CalendarList
  // The list of items that have to be displayed in agenda. If you want to render item as empty date
  // the value of date key has to be an empty array []. If there exists no value for date key it is
  // considered that the date in question is not yet loaded
  horizontal={false}
  items={{}}
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
  minDate={'2015-05-30'}
  // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
  maxDate={'2090-05-30'}

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
  markedDates={{
    '2020-05-16': {
        selected: true, 
        marked: true
    },
    '2020-05-17': {
        marked: true
    },
    '2020-05-18': {
        disabled: true
    }
  }}
  // If disabledByDefault={true} dates flagged as not disabled will be enabled. Default = false
  disabledByDefault={true}
  // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
  onRefresh={() => console.log('refreshing...')}
  // Set this true while waiting for new data from a refresh
  refreshing={false}
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