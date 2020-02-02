import React from 'react';

import {
    StyleSheet,
    Text,
    View,
    ScrollView
} from 'react-native';

import {
    Surface,
    Caption,
    IconButton
} from 'react-native-paper';

import { Feather as FeatherIcon } from '@expo/vector-icons';

import LupaController from '../../../../../controller/lupa/LupaController';

import { connect } from 'react-redux';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

class Timecards extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        

        this.state = {
            mondayTimes: [],
            tuesdayTimes: [],
            wednesdayTimes: [],
            thursdayTimes: [],
            fridayTimes: [],
            saturdayTimes: [],
            sundayTimes: [],
        }

       // this._getTimecardInformationByDay();
    }

    
    _showEditingButtons = () => {
        return true && this.props.isEditing ?          
                        <>
                        <IconButton onPress={() => alert('Presse')} icon="edit" size={15} color="white" style={{color: "white", backgroundColor: "green"}} />
                        </> : null
    }

    componentDidMount = async () => {
        let timecardData;
        await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid, 'preferred_workout_times').then(result => {
            timecardData = result;
            });



        await this.setState({
            mondayTimes: timecardData.Monday,
            tuesdayTimes: timecardData.Tuesday,
            wednesdayTimes: timecardData.Wednesday,
            thursdayTimes: timecardData.Thursday,
            fridayTimes: timecardData.Friday,
            saturdayTimes: timecardData.Saturday,
            sundayTimes: timecardData.Sunday
        });
        }

    render() {
    return (
        <View style={{ width: "100%", }}>
            <ScrollView contentContainerStyle={styles.container} 
                horizontal={true} 
                showsHorizontalScrollIndicator={false}>

                <Surface style={styles.timecard}>
                    <Text style={styles.timecardHeaderText}>
                        Monday
                    </Text>
                    <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    {
                        this.state.mondayTimes.length == 0 ?                     <Caption style={styles.caption}>
                        You have not added any time slots for availability in your fitness profile.
                    </Caption> :
                      this.props.lupa_data.Users.currUserData.preferred_workout_times.Monday.map(time => {

                          return <Caption style={{color: "white"}}>{time}</Caption>
                      })
                    }
                    </View>
                </Surface>

                
                <Surface style={styles.timecard}>
                    <Text style={styles.timecardHeaderText}>
                        Tuesday
                    </Text>
                    <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    {
                        this.state.tuesdayTimes.length == 0 ?                     <Caption style={styles.caption}>
                        You have not added any time slots for availability in your fitness profile.
                    </Caption> :
                      this.state.tuesdayTimes.map(time => {

                          return <Caption style={{color: "white"}}>{time}</Caption>
                      })
                    }
                    </View>
                </Surface>

                
                <Surface style={styles.timecard}>
                    <Text style={styles.timecardHeaderText}>
                        Wednesday
                    </Text>
                    <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    {
                        this.state.wednesdayTimes.length == 0 ?                     <Caption style={styles.caption}>
                        You have not added any time slots for availability in your fitness profile.
                    </Caption> :
                      this.state.wednesdayTimes.map(time => {

                          return <Caption style={{color: "white"}}>{time}</Caption>
                      })
                    }
                    </View>
                </Surface>

                
                <Surface style={styles.timecard}>
                    <Text style={styles.timecardHeaderText}>
                        Thursday
                    </Text>
                    <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    {
                        this.state.thursdayTimes.length == 0 ?                     <Caption style={styles.caption}>
                        You have not added any time slots for availability in your fitness profile.
                    </Caption> :
                      this.state.thursdayTimes.map(time => {

                          return <Caption style={{color: "white"}}>{time}</Caption>
                      })
                    }
                    </View>
                </Surface>

                
                <Surface style={styles.timecard}>
                    <Text style={styles.timecardHeaderText}>
                        Friday
                    </Text>
                    <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    {
                        this.state.fridayTimes.length == 0 ?                     <Caption style={styles.caption}>
                        You have not added any time slots for availability in your fitness profile.
                    </Caption> :
                      this.state.fridayTimes.map(time => {

                          return <Caption style={{color: "white"}}>{time}</Caption>
                      })
                    }
                    </View>
                </Surface>

                
                <Surface style={styles.timecard}>
                    <Text style={styles.timecardHeaderText}>
                        Saturday
                    </Text>
                    <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    {
                        this.state.saturdayTimes.length == 0 ?                     <Caption style={styles.caption}>
                        You have not added any time slots for availability in your fitness profile.
                    </Caption> :
                      this.state.saturdayTimes.map(time => {

                          return <Caption style={{color: "white"}}>{time}</Caption>
                      })
                    }
                    </View>
                </Surface>

                
                <Surface style={styles.timecard}>
                    <Text style={styles.timecardHeaderText}>
                        Sunday
                    </Text>
                    <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    {
                        this.state.sundayTimes.length == 0 ?                     <Caption style={styles.caption}>
                        You have not added any time slots for availability in your fitness profile.
                    </Caption> :
                      this.state.sundayTimes.map(time => {

                          return <Caption style={{color: "white"}}>{time}</Caption>
                      })
                    }
                    </View>
                </Surface>

                
            </ScrollView>
        </View>
    );
    }
    }

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
    },
    caption: {
        color: 'white',
    },
    timecard: {
        width: 180,
        height: 120,
        borderRadius: 10,
        elevation: 3,
        margin: 10,
        backgroundColor: "#2196F3",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
    timecardHeaderText: {
        fontSize: 20,
        fontWeight: "500",
        alignSelf: "center",
        color: "white",
    },
    timeslots: {
        alignSelf: "center",
        justifyContent: "center",
    },
    timecardContent: {
        flexDirection: "column",
        alignSelf: "center",
    },
    column: {
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
    },
    bullet: {
        width: 10
    },
    bulletText: {
        width: "100%",
    },
    boldText: {
        fontWeight: 'bold'
    },
    column: {
        flex: 1,
        flexDirection: "column",
    }
})

export default connect(mapStateToProps)(Timecards);