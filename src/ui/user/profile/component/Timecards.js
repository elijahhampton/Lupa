import React from 'react';

import {
    StyleSheet,
    Text,
    View,
    ScrollView
} from 'react-native';

import {
    Surface,
    Menu,
    Title,
    Button,
    Caption,
    IconButton
} from 'react-native-paper';

import { Feather as FeatherIcon } from '@expo/vector-icons';

import LupaController from '../../../../controller/lupa/LupaController';

import { connect } from 'react-redux';

daysOfTheWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
]

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
            currDayToShow: daysOfTheWeek[new Date().getDay() - 1],
            showTimeMenu: false,
        }

       // this._getTimecardInformationByDay();
    }

    handleOnPressMenuItem = (key) => {
        this.setState({ currDayToShow: key})
        this.handleCloseTimeMenu();
    }

    handleCloseTimeMenu = () => {
        this.setState({ showTimeMenu: false })
    }

    getTimeViewContent = () => {
        switch (this.state.currDayToShow)
        {
            case 'Monday':
                return this.state.mondayTimes.length == 0 ?                     <Caption style={styles.caption}>
                    There have been no times added for {this.state.currDayToShow}.
                </Caption> :
                  this.props.lupa_data.Users.currUserData.preferred_workout_times.Monday.map(time => {

                      return <Button color="#2196F3" mode="text" compact style={styles.captionStyle}>{time}</Button>
                  })
            case 'Tuesday':
                return this.state.tuesdayTimes.length == 0 ?                     <Caption style={styles.caption}>
                        You have not added any time slots for availability in your fitness profile.
                    </Caption> :
                      this.state.tuesdayTimes.map(time => {

                        return <Button color="#2196F3" mode="text" compact style={styles.captionStyle}>{time}</Button>
                      })
            case 'Wednesday':
                return this.state.wednesdayTimes.length == 0 ?                     <Caption style={styles.caption}>
                You have not added any time slots for availability in your fitness profile.
            </Caption> :
              this.state.wednesdayTimes.map(time => {

                return <Button color="#2196F3" mode="text" compact style={styles.captionStyle}>{time}</Button>
              })
            case 'Thursday':
                {
                    return this.state.thursdayTimes.length == 0 ?                     <Caption style={styles.caption}>
                    You have not added any time slots for availability in your fitness profile.
                </Caption> :
                  this.state.thursdayTimes.map(time => {

                    return <Button color="#2196F3" mode="text" compact style={styles.captionStyle}>{time}</Button>
                  })
                }
            case 'Friday':
               return this.state.fridayTimes.length == 0 ?                     <Caption style={styles.caption}>
                You have not added any time slots for availability in your fitness profile.
            </Caption> :
              this.state.fridayTimes.map(time => {

                return <Button color="#2196F3" mode="text" compact style={styles.captionStyle}>{time}</Button>
              })
            case 'Saturday':
               return this.state.saturdayTimes.length == 0 ?                     <Caption style={styles.caption}>
                You have not added any time slots for availability in your fitness profile.
            </Caption> :
              this.state.saturdayTimes.map(time => {

                return <Button color="#2196F3" mode="text" compact style={styles.captionStyle}>{time}</Button>
              })
            case 'Sunday':
               return this.state.sundayTimes.length == 0 ?                     <Caption style={styles.caption}>
                You have not added any time slots for availability in your fitness profile.
            </Caption> :
              this.state.sundayTimes.map(time => {

                return <Button color="#2196F3" mode="text" compact style={styles.captionStyle}>{time}</Button>
              })
        }
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
            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
            <Menu visible={this.state.showTimeMenu} anchor={<IconButton icon="expand-more" style={{margin: 3}} onPress={() => this.setState({ showTimeMenu: true })}/>}>
                {
                    daysOfTheWeek.map(day => {
                        return <Menu.Item title={day} key={day}  onPress={() => this.handleOnPressMenuItem(day)} />
                    })
                }
            </Menu>
            <Title style={{color: "#2196F3"}} color="#2196F3">
                        {this.state.currDayToShow}
                    </Title>
            </View>
            <ScrollView horizontal>
                {
                    this.getTimeViewContent()
                }
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
        width: 200,
        height: 180,
        borderRadius: 10,
        elevation: 3,
        margin: 10,
        backgroundColor: "#2196F3",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
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
    },
    timecardContentStyle: {
        flexDirection: "column", flexWrap: 'wrap', alignItems: "center"
    },
    captionStyle: {
        color: "white", padding: 2
    }
})

export default connect(mapStateToProps)(Timecards);