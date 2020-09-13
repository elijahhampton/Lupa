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

function WorkoutLog(props) {
    const [userWorkouts, setUserWorkouts] = useState([])
    const navigation = useNavigation();
    const calendarRBSheet = createRef();
    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const handleWorkoutOnPress = (workout) => {
        navigation.push('LiveWorkout', {
                uuid: workout.program_structure_uuid,
                workoutType: 'WORKOUT',
        })
    }

    const renderWorkouts = () => {
        return userWorkouts.map((workout, index, arr) => {
            if (typeof(workout) == 'undefined' ||  typeof(workout.completedWorkout) == 'undefined' || typeof(workout.program_structure_uuid) == false) {
                return;
            }
            
            return (
                <TouchableWithoutFeedback key={index} onPress={() => handleWorkoutOnPress(workout)} style={{margin: 10}}>
                    <Text>
                        {workout.program_name}
                    </Text>
                </TouchableWithoutFeedback>
            )
        })
    }

    const renderCalendarListRBSheet = () => {
        return (
            <RBSheet
                ref={calendarRBSheet}
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
                    <Text style={{fontFamily: 'Avenir-Heavy', fontSize: 20, alignSelf: 'center'}}>
                        August 16, 2020
                    </Text>
            </RBSheet>
        )
    }

    const openRBSheet = () => {
        calendarRBSheet.current.open()
    }

    const handleCalendarRBSheetOnOpen = (day) => {
        //alter state
       // alert('hi');

        //open RBSheet
        setSelectedDate(new Date(day))
        openRBSheet();
    }

    useEffect(() => {
       // openRBSheet();

        let documents = []
        const workoutsObserver = LUPA_DB.collection('workouts').onSnapshot(documentQuery => {
            if (documentQuery.size > 0) {
                documentQuery.forEach(doc => {
                    const documentData = doc.data();
                    if (documentData.program_owner == currUserData.user_uuid) {
                        documents.push(documentData);
                    }
                });

                setUserWorkouts(documents);
                documents = [];
            }
        });

        return () => workoutsObserver();
    }, []) 

    const [selectedDate, setSelectedDate] = useState(new Date())

    return (
        <View style={styles.root}>
           {/* <ScrollView contentContainerStyle={{backgroundColor: '#FFFFFF'}}>
            {renderWorkouts()}
            </ScrollView>
    */}
<View style={{ height: Dimensions.get('window').height}}>

    <CalendarList
  // The list of items that have to be displayed in agenda. If you want to render item as empty date
  // the value of date key has to be an empty array []. If there exists no value for date key it is
  // considered that the date in question is not yet loaded
  horizontal={false}
  items={{
    '2012-05-22': [{name: 'item 1 - any js object'}],
    '2012-05-23': [{name: 'item 2 - any js object', height: 80}],
    '2012-05-24': [],
    '2012-05-25': [{name: 'item 3 - any js object'}, {name: 'any js object'}]
  }}
  // Callback that gets called when items for a certain month should be loaded (month became visible)
  loadItemsForMonth={(month) => {console.log('trigger items loading')}}
  // Callback that fires when the calendar is opened or closed
  onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
  // Callback that gets called on day press
  onDayPress={(day) => handleCalendarRBSheetOnOpen(day)}
  onDayLongPress={day => handleCalendarRBSheetOnOpen(day)}
  // Callback that gets called when day changes while scrolling agenda list
  onDayChange={(day)=> {handleCalendarRBSheetOnOpen(day)}}
  // Initially selected day
  selected={selectedDate}
  // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
  minDate={new Date()}
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
  style={{height: Dimensions.get('window').height, backgroundColor: 'red'}}
/>
{renderCalendarListRBSheet()}
</View>
        </View>

    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'blue',
    }
})

export default WorkoutLog;