import React from 'react'

import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    ScrollView,
    TouchableOpacity
} from 'react-native';

import {
    List,
    Surface,
    IconButton
} from 'react-native-paper';

import {
    CheckBox
} from 'react-native-elements';

import { 
    timesOfDay 
} from '../../../controller/lupa/common/lupa_pre';

import LupaController from '../../../controller/lupa/LupaController';

import { connect } from 'react-redux';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function convertDay(index)
{
    return days[index + 1];
}

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}


/**
 * TimeslotSelector
 * 
 * Problems:
 * 1. Using so many async/await calls.. Not sure if this is normal or there is another underlying design issue.
 * 
 * 
 */
class TimeslotSelector extends React.Component {
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
            currentDay: 'Monday',
            userData: this.props.lupa_data.Users.currUserData,
            timeSelected: false,
        }

    }

    componentDidMount = async () => {
       // await this._refreshUserData();
    }

    _refreshUserData = async () => {
        let userDataIn;
        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid).then(result => {
            userDataIn = result;
        });

        await this.setState({ userData: userDataIn})
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
            currentDay: days[this.state.dayIndex + 1]
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
        let newTimes;
        let timesArr;
        switch(this.state.currentDay) {
            case 'Monday':
                    if (this.state.mondayTimes.indexOf(times) > -1) {
                        return;
                    };

                    if (this.state.mondayTimes.includes(times[0]))
                    {
                        let monArr = this.state.mondayTimes;
                        for (let i = 0; i < times.length; i++)
                        {
                            let index = monArr.indexOf(times[i]);
                            newTimes = await monArr.splice(index, 1);
                            
                        }

                        await this.setState({
                            mondayTimes: newTimes,
                        });

                        this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('preferred_workout_times', this.state.mondayTimes, 'Monday')

                        return;
                    }
                    
                    await this.setState({
                        mondayTimes: this.state.mondayTimes.concat(times)
                    });

                    this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('preferred_workout_times', this.state.mondayTimes, 'Monday')
                    break;
            case 'Tuesday':
                timesArr = this.state.tuesdayTimes;
                if (timesArr.indexOf(times) > -1) {
                    return;
                };

                if (timesArr.includes(times[0]))
                {
                    let monArr = timesArr;
                    for (let i = 0; i < times.length; i++)
                    {
                        let index = monArr.indexOf(times[i]);
                        newTimes = await monArr.splice(index, 1);
                        
                    }

                    await this.setState({
                        tuesdayTimes: newTimes,
                    });

                    this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('preferred_workout_times', this.state.tuesdayTimes, this.state.currentDay)

                    return;
                }
                
                await this.setState({
                    tuesdayTimes: this.state.tuesdayTimes.concat(times)
                });

                this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('preferred_workout_times', this.state.tuesdayTimes, this.state.currentDay)
                break;
            case 'Wednesday':
                timesArr = this.state.wednesdayTimes;
                if (timesArr.indexOf(times) > -1) {
                    return;
                };

                if (timesArr.includes(times[0]))
                {
                    let monArr = timesArr;
                    for (let i = 0; i < times.length; i++)
                    {
                        let index = monArr.indexOf(times[i]);
                        newTimes = await monArr.splice(index, 1);
                        
                    }

                    await this.setState({
                        wednesdayTimes: newTimes,
                    });

                    this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('preferred_workout_times', this.state.wednesdayTimes, this.state.currentDay)

                    return;
                }
                
                await this.setState({
                    wednesdayTimes: this.state.wednesdayTimes.concat(times)
                });

                this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('preferred_workout_times', this.state.wednesdayTimes, this.state.currentDay)
                break;
            case 'Thursday':
                timesArr = this.state.thursdayTimes;
                if (timesArr.indexOf(times) > -1) {
                    return;
                };

                if (timesArr.includes(times[0]))
                {
                    let monArr = timesArr;
                    for (let i = 0; i < times.length; i++)
                    {
                        let index = monArr.indexOf(times[i]);
                        newTimes = await monArr.splice(index, 1);
                        
                    }

                    await this.setState({
                        thursdayTimes: newTimes,
                    });

                    this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('preferred_workout_times', this.state.thursdayTimes, this.state.currentDay)

                    return;
                }
                
                await this.setState({
                    thursdayTimes: this.state.thursdayTimes.concat(times)
                });

                this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('preferred_workout_times', this.state.thursdayTimes, this.state.currentDay)
                break;
            case 'Friday':
                timesArr = this.state.fridayTimes;
                if (timesArr.indexOf(times) > -1) {
                    return;
                };

                if (timesArr.includes(times[0]))
                {
                    let monArr = timesArr;
                    for (let i = 0; i < times.length; i++)
                    {
                        let index = monArr.indexOf(times[i]);
                        newTimes = await monArr.splice(index, 1);
                        
                    }

                    await this.setState({
                        fridayTimes: newTimes,
                    });

                    this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('preferred_workout_times', this.state.fridayTimes, this.state.currentDay)

                    return;
                }
                
                await this.setState({
                    fridayTimes: this.state.fridayTimes.concat(times)
                });

                this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('preferred_workout_times', this.state.fridayTimes, this.state.currentDay)
                break;
            case 'Saturday':
                timesArr = this.state.saturdayTimes;
                if (timesArr.indexOf(times) > -1) {
                    return;
                };

                if (timesArr.includes(times[0]))
                {
                    let monArr = timesArr;
                    for (let i = 0; i < times.length; i++)
                    {
                        let index = monArr.indexOf(times[i]);
                        newTimes = await monArr.splice(index, 1);
                        
                    }

                    await this.setState({
                        saturdayTimes: newTimes,
                    });

                    this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('preferred_workout_times', this.state.saturdayTimes, this.state.currentDay)

                    return;
                }
                
                await this.setState({
                    saturdayTimes: this.state.saturdayTimes.concat(times)
                });

                this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('preferred_workout_times', this.state.saturdayTimes, this.state.currentDay)
                break;
            case 'Sunday':
                timesArr = this.state.sundayTimes;
                if (timesArr.indexOf(times) > -1) {
                    return;
                };

                if (timesArr.includes(times[0]))
                {
                    let monArr = timesArr;
                    for (let i = 0; i < times.length; i++)
                    {
                        let index = monArr.indexOf(times[i]);
                        newTimes = await monArr.splice(index, 1);
                        
                    }

                    await this.setState({
                        sundayTimes: newTimes,
                    });

                    this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('preferred_workout_times', this.state.sundayTimes, this.state.currentDay)

                    return;
                }
                
                await this.setState({
                    sundayTimes: this.state.sundayTimes.concat(times)
                });

                this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('preferred_workout_times', this.state.sundayTimes, this.state.currentDay)
                break;
            default:
                alert('LUPA: No default case');
        }

        this._refreshUserData();
    }

    _getListItemBackgroundColor = () => {

    }
    
    checkIfUserHasSelectedDates(time)
    {
        let day = this.state.currentDay;
        switch(day)
        {
            case 'Monday':
                if (this.state.mondayTimes.includes(time))
                {
                    return true;
                }
            case 'Tuesday':
                if (this.state.tuesdayTimes.includes(time))
                {
                    return true;
                }
            case 'Wednesday':
                if (this.state.wednesdayTimes.includes(time))
                {
                    return true;
                }
            case 'Thursday':
                if (this.state.thursdayTimes.includes(time))
                {
                    return true;
                }
            case 'Friday':
                if (this.state.fridayTimes.includes(time))
                {
                    return true;
                }
            case 'Saturday':
                if (this.state.saturdayTimes.includes(time))
                {
                    return true;
                }
            case 'Sunday':
                if (this.state.sundayTimes.includes(time))
                {
                    return true;
                }
        }
    }

    render() {
        let currentDay = this._getDay(this.state.dayIndex);
        return (
            <>
                <View style={{width: '100%', alignSelf: 'center', margin: 15, alignItems: "center", flexDirection: "row", justifyContent: "space-between"}}>
                    
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
                        <List.Subheader textBreakStrategy="balanced" numberOfLines={2} lineBreakMode="tail">
                            Choose the times of day that you prefer working out.
                        </List.Subheader>
                    <ScrollView>
                        {
                            timesOfDay.map(obj => {
                                let selectedTimes = obj.values;

                                    return (
                                        <TouchableOpacity onPress={obj => {this._handleUpdatePreferredWorkoutTimes(selectedTimes)}}>
                                            <List.Item  style={{alignItems: "center" }} title={obj.title} description={obj.times} right={() =>
                                                                    <CheckBox
                                                                    center
                                                                    iconRight
                                                                    iconType='material'
                                                                    checkedIcon='done'
                                                                    uncheckedIcon='radio-button-unchecked'
                                                                    checkedColor='green'
                                                                    checked={this.checkIfUserHasSelectedDates(obj.values[0])}
                                                                />
                                            } />
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
        width: "80%",
        height: 'auto',
        elevation: 15,
        borderRadius: 15,
        alignSelf: 'center',
        position: 'absolute',
        top: Dimensions.get('window').height / 3
    },
    instructionalText: {
        fontWeight: '500',
        fontSize: 20
    },
});

export default connect(mapStateToProps)(TimeslotSelector);