import React, { useEffect, createRef, useState } from 'react'

import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
     SectionList, useWindowDimensions
} from 'react-native'

import {
    Card,
    Button,
    Caption,
    IconButton,
     Divider,
     Surface
} from 'react-native-paper'

import { useSelector } from 'react-redux'
import LupaController from '../controller/lupa/LupaController'
import FeatherIcon from 'react-native-vector-icons/Feather'
import ProgramOptionsModal from './workout/program/modal/ProgramOptionsModal'
import { getLupaProgramInformationStructure } from '../model/data_structures/programs/program_structures'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import LUPA_DB from '../controller/firebase/firebase'
import {Agenda, Calendar, CalendarList } from 'react-native-calendars'
import RBSheet from 'react-native-raw-bottom-sheet'
import { getLupaWorkoutInformationStructure } from '../model/data_structures/workout/workout_collection_structures'
import { connect } from 'react-redux'
import Feather1s from 'react-native-feather1s/src/Feather1s'

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
            items: {},
            markedDates: {}
        }
    }

    async componentDidMount() {
       this.WORKOUT_LOG_OBSERVER = await LUPA_DB.collection('users').doc(this.props.lupa_data.Users.currUserData.user_uuid).onSnapshot(async querySnapshot => {
            const data = querySnapshot.data();
            const workouts = data.workouts;
            
            if (typeof(data) == 'undefined') {
                await this.setState({ userWorkouts: {}, items: {} });
            } else {
                await this.setState({ userWorkouts: workouts, items: workouts })
            }
      
            await this.setMarkedDate(workouts)
          //  const dateString = day.month + "-" + day.day + "-" + day.year;
            let day  = {
                month: new Date().getMonth() + 1,
                day: new Date().getDate(),
                year: new Date().getFullYear(),
            }

            await this.handleCalendarRBSheetOnOpen(day)
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
            let updatedKey = this.generateMarkedDateString(keySplit[0], keySplit[1], keySplit[2])
            updatedMarkedDates[updatedKey] = { marked: true, selected: true, dotColor: 'blue' }
        }

        await this.setState({ markedDates: updatedMarkedDates})
    }


    handleLaunchWorkout = async () => {
        const currentWorkout = this.state.currentWorkout;

        if (typeof(currentWorkout) == 'undefined') {
            return;
        }

        this.props.navigation.push('LiveWorkout', {
                programData: currentWorkout
        });
    }

    renderCalendarListRBSheet = () => {
        return (
            <RBSheet
                ref={this.calendarRBSheet}
                height={600}
                dragFromTopOnly={true}
                closeOnDragDown={true}
                customStyles={{
                    wrapper: {
                        
                    },
                    container: {
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0
                    },
                    draggableIcon: {
                        backgroundColor: 'rgb(220, 220, 220)',
                    }
                }}
                >
                    <View style={{flex: 1}}>
                   
                    </View>
            </RBSheet>
        )
    }

    openRBSheet = () => {
        this.calendarRBSheet.current.open();
    }

    closeRBSheet = () => {
        this.calendarRBSheet.current.close();
    }

    renderWorkoutInformation = (item={}) => {
        //we dont actually use the items object.. it is just a check to see if there
        //are actually any workouts for this day or any day really
        if (Object.keys(item).length === 0) {
            alert('hi')
            return (
                <View style={{flex: 1, backgroundColor: 'blue'}}>
                    <Text>
                        Hi
                    </Text>
                </View>
            )
        }

        let weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

const DAY = weekday[new Date().getDay()];

        return (
                <ScrollView contentContainerStyle={{flex: 1, padding: 10}}>
                <View style={{height: 40, width: Dimensions.get('window').width, marginVertical: 10, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontFamily: 'Avenir-Heavy', fontSize: 18, alignSelf: 'center'}}>
            {this.renderCommonDateTitle(this.state.currentDay)}
        </Text>
        <Button mode="text" color="#1089ff" onPress={this.handleLaunchWorkout}>
            Launch
        </Button>
            </View>
                <Text style={{fontFamily: 'Avenir-Medium', fontWeight: '700', fontSize: 15}}>
                   Workout Information
               </Text>

               <View style={{marginVertical: 10, padding: 10, borderRadius: 10, backgroundColor: 'rgb(245, 246, 247)', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
               <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontFamily: 'Avenir-Roman'}}>
                        Monday
                    </Text>
                    <Surface style={{width: 30, height: 30, borderRadius: 35, alignItems: 'center', justifyContent: 'center'}}>
                    <FeatherIcon name="activity" size={15} color="#1089ff" />
                    </Surface>
                  
                    </View>
                    {
                        this.state.currentWorkout.program_workout_structure.Monday.length === 0 ? 
                        <Caption> No workouts were added for this day </Caption>
                        :
                        this.state.currentWorkout.program_workout_structure.Monday.map((exercise, index, arr) => {
                            return this.renderBasicExerciseInformation(exercise);
                        })
                      
                    }
                 
               </View>

               <View style={{marginVertical: 10, padding: 10, borderRadius: 10, backgroundColor: 'rgb(245, 246, 247)', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
               <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontFamily: 'Avenir-Roman'}}>
                        Tuesday
                    </Text>
                    <Surface style={{width: 30, height: 30, borderRadius: 35, alignItems: 'center', justifyContent: 'center'}}>
                    <FeatherIcon name="activity" size={15} color="#1089ff" />
                    </Surface>
                  
                    </View>
                    {
                        this.state.currentWorkout.program_workout_structure.Tuesday.length === 0 ? 
                        <Caption> No workouts were added for this day </Caption>
                        :
                        this.state.currentWorkout.program_workout_structure.Tuesday.map((exercise, index, arr) => {
                            return this.renderBasicExerciseInformation(exercise);
                        })
                      
                    }
                 
               </View>

               <View style={{marginVertical: 10, padding: 10, borderRadius: 10, backgroundColor: 'rgb(245, 246, 247)', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
               <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontFamily: 'Avenir-Roman'}}>
                        Wednesday
                    </Text>
                    <Surface style={{width: 30, height: 30, borderRadius: 35, alignItems: 'center', justifyContent: 'center'}}>
                    <FeatherIcon name="activity" size={15} color="#1089ff" />
                    </Surface>
                  
                    </View>
                    {
                        this.state.currentWorkout.program_workout_structure.Wednesday.length === 0 ? 
                        <Caption> No workouts were added for this day </Caption>
                        :
                        this.state.currentWorkout.program_workout_structure.Wednesday.map((exercise, index, arr) => {
                            return this.renderBasicExerciseInformation(exercise);
                        })
                      
                    }
                 
               </View>

               <View style={{marginVertical: 10, padding: 10, borderRadius: 10, backgroundColor: 'rgb(245, 246, 247)', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
               <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontFamily: 'Avenir-Roman'}}>
                        Thursday
                    </Text>
                    <Surface style={{width: 30, height: 30, borderRadius: 35, alignItems: 'center', justifyContent: 'center'}}>
                    <FeatherIcon name="activity" size={15} color="#1089ff" />
                    </Surface>
                  
                    </View>
                    {
                        this.state.currentWorkout.program_workout_structure.Thursday.length === 0 ? 
                        <Caption> No workouts were added for this day </Caption>
                        :
                        this.state.currentWorkout.program_workout_structure.Thursday.map((exercise, index, arr) => {
                            return this.renderBasicExerciseInformation(exercise);
                        })
                      
                    }
                 
               </View>

               <View style={{marginVertical: 10, padding: 10, borderRadius: 10, backgroundColor: 'rgb(245, 246, 247)', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
               <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontFamily: 'Avenir-Roman'}}>
                        Friday
                    </Text>
                    <Surface style={{width: 30, height: 30, borderRadius: 35, alignItems: 'center', justifyContent: 'center'}}>
                    <FeatherIcon name="activity" size={15} color="#1089ff" />
                    </Surface>
                  
                    </View>
                    {
                        this.state.currentWorkout.program_workout_structure.Friday.length === 0 ? 
                        <Caption> No workouts were added for this day </Caption>
                        :
                        this.state.currentWorkout.program_workout_structure.Friday.map((exercise, index, arr) => {
                            return this.renderBasicExerciseInformation(exercise);
                        })
                      
                    }
                 
               </View>


               <View style={{marginVertical: 10, padding: 10, borderRadius: 10, backgroundColor: 'rgb(245, 246, 247)', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
               <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontFamily: 'Avenir-Roman'}}>
                        Saturday
                    </Text>
                    <Surface style={{width: 30, height: 30, borderRadius: 35, alignItems: 'center', justifyContent: 'center'}}>
                    <FeatherIcon name="activity" size={15} color="#1089ff" />
                    </Surface>
                  
                    </View>
                    {
                        this.state.currentWorkout.program_workout_structure.Saturday.length === 0 ? 
                        <Caption> No workouts were added for this day </Caption>
                        :
                        this.state.currentWorkout.program_workout_structure.Saturday.map((exercise, index, arr) => {
                            return this.renderBasicExerciseInformation(exercise);
                        })
                      
                    }
                 
               </View>

               <View style={{marginVertical: 10, padding: 10, borderRadius: 10, backgroundColor: 'rgb(245, 246, 247)', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                    <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontFamily: 'Avenir-Roman'}}>
                        Sunday
                    </Text>
                    <TouchableWithoutFeedback onPress={this.openRBSheet} style={{margin: 10, width: 30, height: 30}}>
                    <Surface style={{width: 30, height: 30, borderRadius: 35, alignItems: 'center', justifyContent: 'center'}}>
                    <FeatherIcon name="activity" size={15} color="#1089ff" />
                    </Surface>
                    </TouchableWithoutFeedback>
                    
                  
                    </View>

                    {
                        this.state.currentWorkout.program_workout_structure.Sunday.length === 0 ? 
                        <Caption> No workouts were added for this day </Caption>
                        :
                        this.state.currentWorkout.program_workout_structure.Sunday.map((exercise, index, arr) => {
                            return this.renderBasicExerciseInformation(exercise);
                        })
                    }     
               </View>
                </ScrollView>
        )
    }

    renderEmptyData = () => {
        return (
            <View style={{flex: 1, justifyContent: 'space-evenly'}}>
                 <View style={{width: Dimensions.get('window').width - 50, alignSelf: 'center', borderRadius: 20, backgroundColor: 'rgb(245, 246, 247)', padding: 20, justifyContent: 'center', alignItems: 'flex-start'}}>
        <View style={{marginVertical: 20}}>
                        <Text style={{color: 'rgb(116, 126, 136)', fontFamily: 'Avenir-Medium', fontSize: 15, fontWeight: '800'}}>
                            You didnt create a workout on this day.
                        </Text>
                        <Text style={{color: 'rgb(187, 194, 202)', fontFamily: 'Avenir-Medium'}}>
                            Create a workout and log it to save it to your workout log.
                        </Text>
                    </View>

                    <Button onPress={() => this.props.navigation.push('CreateWorkout')} color="#1089ff" theme={{roundness: 5}} mode="contained" style={{alignSelf: 'center', height: 45, alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                        Log a Workout
                    </Button>
        </View>
            </View>
        )
    }

    renderBasicExerciseInformation = (exercise) => {
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontFamily: 'Avenir-Light'}}>
                                    {exercise.workout_name}
                                </Text>
                                <View style={{marginHorizontal: 10, flexDirection: 'row', alignItems: 'center'}}>
                                <Caption>
                                    Sets {exercise.workout_sets}
                                </Caption>
                                    <Caption>
                                      {" "}  / {" "}
                                    </Caption>
                                
                                <Caption>
                                    Reps {exercise.workout_reps}
                                </Caption>
                                </View>


            </View>
        )
    }

    renderCommonDateTitle = (dateString) => {
        const keys = dateString.split("-");
        let month = keys[0]
        let day = keys[1];
        let year = keys[2]

        switch (Number(month)) {
            case 1:
                month = "January"
                break;
                case 2:
                    month = "February"
                    break;
                    case 3:
                        month = "March";
                        break;
                        case 4:
                            month = "April"
                            break;
                            case 5:
                                month = "May"
                                break;
                                case 6:
                                    month = "June"
                                    break;
                                    case 7:
                                        month = "July";
                                        break;
                                        case 8:
                                            month = "August";
                                            break;
                                            case 9:
                                                month = "September"
                                                break;
                                                case 10:
                                                    month = "October"
                                                    break;
                                                    case 11:
                                                        month = "November"
                                                        break;
                                                        case 12:
                                                            month = "December;"
                                                            break;
                                                        default:
                                                          
                                                
        }
        let string = month + " " + day + ", " + year
        return string
    }


    handleCalendarRBSheetOnOpen = async (day) => {
        const dateString = day.month + "-" + day.day + "-" + day.year;
        const checkedMarkedDateString = this.generateMarkedDateString(day.year, day.month, day.day)
    
        const userWorkouts = this.state.userWorkouts

        if (Object.keys(this.state.markedDates).includes(checkedMarkedDateString)) {
            await this.setState({
            
                currentWorkout: userWorkouts[checkedMarkedDateString][0],
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
<>
    <Agenda
  // The list of items that have to be displayed in agenda. If you want to render item as empty date
  // the value of date key has to be an empty array []. If there exists no value for date key it is
  // considered that the date in question is not yet loaded
  horizontal={false}
  items={this.state.items}
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
  minDate={'2020-08-31'}
  // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
  maxDate={'2025-05-30'}

  // Max amount of months allowed to scroll to the past. Default = 50
  pastScrollRange={50}
  // Max amount of months allowed to scroll to the future. Default = 50
  futureScrollRange={50}
  // Specify how each item should be rendered in agenda
  renderItem={(item, firstItemInDay) => {return (<View />);}}
  // Specify how each date should be rendered. day can be undefined if the item is not first in that day.
  renderDay={(day, item) =>  { return this.renderWorkoutInformation(item) }}
  // Specify how empty date content with no items should be rendered
  renderEmptyDate={() => { return <View /> }}
  // Specify how agenda knob should look like
  renderKnob={() => {return (<View style={{width: 80, height: 10, backgroundColor: '#E5E5E5', borderRadius: 10}} />);}}
  // Specify what should be rendered instead of ActivityIndicator
  renderEmptyData = {() => {return this.renderEmptyData()}}
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
/>
{this.renderCalendarListRBSheet()}
</>
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