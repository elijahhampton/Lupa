import React from 'react'

import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity
} from 'react-native';

import {
    List,
    Surface,
    IconButton
} from 'react-native-paper';

import { 
    timesOfDay 
} from '../../../../../controller/lupa/lupa_pre';

import LupaController from '../../../../../controller/lupa/LupaController';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']


/**
 * TimeslotSelector
 * 
 * Problems:
 * 1. Using so many async/await calls.. Not sure if this is normal or there is another underlying design issue.
 * 
 * 
 */
export default class TimeslotSelector extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            dayIndex: 0,
            mondayTimes: [],
            tuesdayTimes: [],
            wednesdayTimes: [],
            thursdayTimes: [],
            fridayTimes: [],
            saturdayTimes: [],
            sundayTimes: [],
            currentDay: 'Monday'
        }

    }

    _getNextDay = async () => {
        let currIndex = this.state.dayIndex;
        if (currIndex == 6) { 
            this.setState({
                dayIndex: 0
            })
            return;
        }

        await this.setState({ 
            dayIndex: this.state.dayIndex + 1, 
            currentDay: days[this.state.dayIndex]
        })
    }

    _getPrevDay = async() => {
        let currIndex = this.state.dayIndex;

        if (currIndex == 0) { 
            this.setState({
                dayIndex: 6
            })
            return;
        }
        await this.setState({ 
            dayIndex: this.state.dayIndex - 1,
            currentDay: days[this.state.dayIndex]
        })
    }

    _getDay = index => {
        return days[index];
    }

    _handleUpdatePreferredWorkoutTimes = async (times) => {
        switch(this.state.currentDay) {
            case 'Monday':
                    if (this.state.mondayTimes.indexOf(times) > -1) {
                        return;
                    };

                    await this.setState({
                        mondayTimes: this.state.mondayTimes.concat(times)
                    });

                    this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('preferred_workout_times', this.state.mondayTimes, 'Monday')
                    break;
            case 'Tuesday':
                    if (this.state.tuesdayTimes.indexOf(times) > -1) {
                        return;
                    }

                    await this.setState({
                        tuesdayTimes: this.state.tuesdayTimes.concat(times)
                    });

                    this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('preferred_workout_times', this.state.tuesdayTimes, 'Tuesday')
                    break;
            case 'Wednesday':
                    if (this.state.wednesdayTimes.indexOf(times) > -1) {
                        return;
                    }

                    await this.setState({
                        wednesdayTimes: this.state.wednesdayTimes.concat(times)
                    });
                    this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('preferred_workout_times', this.state.wednesdayTimes, 'Wednesday')
                    break;
            case 'Thursday':
                    if (this.state.thursdayTimes.indexOf(times) > -1) {
                        return;
                    }

                    await this.setState({
                        thursdayTimes: this.state.thursdayTimes.concat(times)
                    });
                    this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('preferred_workout_times', this.state.thursdayTimes, 'Thursday')
                    break;
            case 'Friday':
                    if (this.state.fridayTimes.indexOf(times) > -1) {
                        return;
                    }

                    await this.setState({
                        fridayTimes: this.state.fridayTimes.concat(times)
                    });
                    this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('preferred_workout_times', this.state.fridayTimes, 'Friday')
                    break;
            case 'Saturday':
                    if (this.state.saturdayTimes.indexOf(times) > -1) {
                        return;
                    }

                    await this.setState({
                        saturdayTimes: this.state.saturdayTimes.concat(times)
                    });
                    this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('preferred_workout_times', this.state.saturdayTimes, 'Saturday')
                    break;
            case 'Sunday':
                    if (this.state.sundayTimes.indexOf(times) > -1) {
                        return;
                    }

                    await this.setState({
                        sundayTimes: this.state.sundayTimes.concat(times)
                    });
                    this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('pref erred_workout_times', this.state.sundayTimes, 'Sunday')
                    break;
            default:
                alert('LUPA: No default case');
        }
    }

    render() {
        return (
            <>
                <View style={{width: "100%", height: 20, margin: 15, alignItems: "center", flexDirection: "row", justifyContent: "space-between"}}>
                    
                    <IconButton icon="arrow-back" size={20} onPress={this._getPrevDay}/>
                        <Text style={styles.instructionalText}>
                            {
                                this._getDay(this.state.dayIndex)
                            }
                        </Text>
                        <IconButton icon="arrow-forward" size={20} onPress={this._getNextDay}/>
                </View>

                <Surface style={styles.menuSurface}>
                    <List.Section>
                        <List.Subheader>
                            Choose the times of day that you prefer working out.
                        </List.Subheader>
                    <ScrollView>
                        {
                            timesOfDay.map(obj => {
                                let hell = obj.times;
                                console.log('HELL' + hell)
                                return (
                                    <TouchableOpacity onPress={obj => {this._handleUpdatePreferredWorkoutTimes(hell)}}>
                                        <List.Item style={{alignItems: "center"}} title={obj.title} description={obj.times} />
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>
                    </List.Section>
                </Surface>
            </>
        );
    }
}

const styles = StyleSheet.create({
    menuSurface: {
        width: "100%",
        height: 350,
        elevation: 5,
        borderRadius: 15
    },
});