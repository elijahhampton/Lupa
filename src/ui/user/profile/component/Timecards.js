import React from 'react';

import {
    StyleSheet,
    Text,
    View,
    Modal,
    ScrollView,
    Button as NativeButton,
    Dimensions
} from 'react-native';

import {
    Surface,
    Menu,
    Title,
    Button,
    Caption,
    Chip,
    IconButton
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather';

import LupaController from '../../../../controller/lupa/LupaController';

import TimeslotSelector from '../../component/TimeslotSelector';

import { connect } from 'react-redux';

import { LinearGradient } from 'expo-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';

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

function ChangeTimesModal(props) {
    return (
       <Modal onDismiss={props.closeModalMethod} visible={props.isVisible} animated={true} animationType="slide" presentationStyle="overFullScreen" style={{backgroundColor: 'white'}}>
           <LinearGradient style={{position: 'absolute', padding: 15, top: 0, left: 0, right: 0, height: Dimensions.get('window').height}} colors={['#FFFFFF', 'rgba(33,150,243 ,1)']} >
           <TimeslotSelector />


           <NativeButton onPress={props.closeModalMethod} title="Done" />
           </LinearGradient>
       </Modal>
    )
}

/**
 * Timecards Component
 * 
 * @todo: Make current day show current day (handle edge case for Sunday)
 */
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
            currDayToShow: daysOfTheWeek[new Date().getDay()],
            showTimeMenu: false,
            showChangeTimeModal: false,
            data: ['a', 'b', 'c'],
        }

       // this._getTimecardInformationByDay();
    }

    handleShowChangeTimeModal = () => {
        this.setState({ 
            showChangeTimeModal: true
        })
    }

    handleCloseChangeTimeModal = () => {
        this.setState({
            showChangeTimeModal: false
        })
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
                return this.state.mondayTimes.length == 0 ?
                <Caption style={styles.caption}>
                    You have no added any available session time for {this.state.currDayToShow}.
                </Caption>
                 :
                  this.state.mondayTimes.map(time => {

                      return <Button color="#2196F3" mode="text" compact style={styles.captionStyle}>{time}</Button>
                  })
            case 'Tuesday':
                return this.state.tuesdayTimes.length == 0 ?                     <Caption style={styles.caption}>
                        You have no added any available session time for {this.state.currDayToShow}.
                    </Caption> :
                      this.state.tuesdayTimes.map(time => {

                        return <Button color="#2196F3" mode="text" compact style={styles.captionStyle}>{time}</Button>
                      })
            case 'Wednesday':
                return this.state.wednesdayTimes.length == 0 ?                     <Caption style={styles.caption}>
                You have no added any available session time for {this.state.currDayToShow}.
            </Caption> :
              this.state.wednesdayTimes.map(time => {

                return <Button color="#2196F3" mode="text" compact style={styles.captionStyle}>{time}</Button>
              })
            case 'Thursday':
                {
                    return this.state.thursdayTimes.length == 0 ?                     <Caption style={styles.caption}>
                    You have no added any available session time for {this.state.currDayToShow}.
                </Caption> :
                  this.state.thursdayTimes.map(time => {

                    return <Button color="#2196F3" mode="text" compact style={styles.captionStyle}>{time}</Button>
                  })
                }
            case 'Friday':
               return this.state.fridayTimes.length == 0 ?                     <Caption style={styles.caption}>
                You have no added any available session time for {this.state.currDayToShow}.
            </Caption> :
              this.state.fridayTimes.map(time => {

                return <Button color="#2196F3" mode="text" compact style={styles.captionStyle}>{time}</Button>
              })
            case 'Saturday':
               return this.state.saturdayTimes.length == 0 ?                     <Caption style={styles.caption}>
                You have no added any available session time for {this.state.currDayToShow}.
            </Caption> :
              this.state.saturdayTimes.map(time => {

                return <Button color="#2196F3" mode="text" compact style={styles.captionStyle}>{time}</Button>
              })
            case 'Sunday':
               return this.state.sundayTimes.length == 0 ?                     <Caption style={styles.caption}>
                You have no added any available session time for {this.state.currDayToShow}.
            </Caption> :
              this.state.sundayTimes.map(time => {

                return <Button color="#2196F3" mode="text" compact style={styles.captionStyle}>{time}</Button>
              })
        }
    }


    componentDidMount = async () => {
        let timecardData;

            await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(this.props.userUUID, 'preferred_workout_times').then(result => {
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
        <View style={{ width: "100%", alignItems: 'center', justifyContent: 'center'}}>
            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Menu visible={this.state.showTimeMenu} anchor={<IconButton icon="expand-more" style={{margin: 3}} onPress={() => this.setState({ showTimeMenu: true })}/>}>
                {
                    daysOfTheWeek.map(day => {
                        return <Menu.Item title={day} key={day} onPress={() => this.handleOnPressMenuItem(day)} />
                    })
                }
            </Menu>
            <Text style={{color: "#212121", fontSize: 15, fontWeight: 'bold'}} color="#2196F3">
                        {this.state.currDayToShow}
                    </Text>
            </View>
                {
                    this.props.userUUID == this.props.lupa_data.Users.currUserData.user_uuid ?
                    <Button onPress={this.handleShowChangeTimeModal} style={{fontSize: 12}} mode="text" theme={{
                        colors: {
                            primary: "#2196F3"
                        }
                    }}>
                        Edit Available Times
                    </Button>
                    :
                    null
                }
            </View>
            <ScrollView horizontal>
                {
                    this.getTimeViewContent()
                }
            </ScrollView> 
            <ChangeTimesModal isVisible={this.state.showChangeTimeModal} closeModalMethod={this.handleCloseChangeTimeModal}/>
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
    marginLeft: 10, 
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