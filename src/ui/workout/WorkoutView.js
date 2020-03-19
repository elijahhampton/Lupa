/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  16, 2019
 * 
 * Workout View
 */

import React from 'react';

import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
    RefreshControl,
} from "react-native";

import {
    Headline,
    Surface,
    Button,
    Portal,
    Menu,
    Title,
    Paragraph,
    Divider,
} from 'react-native-paper';


import {
    Header,
    Left,
    Right,
    Body
} from 'native-base';
import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

import WorkoutComponent from './component/WorkoutComponent';
import { WORKOUT_MODALITY } from '../../controller/lupa/common/types'
import {GOAL_UID} from '../../model/data_structures/workout/common/types'

import { connect } from 'react-redux';

import { getPathwaysForGoalUUID } from '../../model/data_structures/workout/goal_pathway_structures';

import { getAllGoalStructures } from '../../model/data_structures/workout/goal_structures'
const STAMINA_IMAGE = require('../images/bike.png');
const POWER_IMAGE = require('../images/power.png');
const FLEXIBILITY_IMAGE = require('../images/wellness.png');
const STRENGTH_IMAGE = require('../images/weightlifting.png');

import LupaController from '../../controller/lupa/LupaController';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

class WorkoutView extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            isRefreshing: false,
            currUserData: this.props.lupa_data.Users.currUserData,
            currUserHealthData: [],
            sortMenuVisible: false,
            goals: getAllGoalStructures(),
            userGoalsDataUpdated: [],
        }
    }

    componentDidMount = async () => {
       await this.setupWorkoutView();
    }

    setupWorkoutView = async () => {
        let healthDataIn;

        await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserHealthData().then(result => {
            healthDataIn = result.goals;
        })


        await this.setState({ currUserHealthData: healthDataIn })
    }

    getDefaultImage = (uuid) =>
{
    switch(uuid)
    {
        case GOAL_UID.IMPROVE_POWER:
            return POWER_IMAGE;
        case GOAL_UID.IMPROVE_FLEXIBILITY:
            return FLEXIBILITY_IMAGE;
        case GOAL_UID.IMPROVE_STAMINA:
            return STAMINA_IMAGE;
        case GOAL_UID.IMPROVE_STRENGTH:
            return STRENGTH_IMAGE;
    }
}

    _handleOnRefresh = () => {
        this.setState({ isRefreshing: true })
        alert('Refreshing Workouts');
        this.setState({ isRefreshing: false })
    }

    _mapUserGoals =  () => {
        let pathways = [];
        let arr = [];
             arr = this.state.currUserHealthData

        for (let i = 0; i < arr.length; i++)
        {
            let currGoal = arr[i];
            for (let j = 0; j < currGoal.pathways.length; j++)
            {
                pathways.push(currGoal.pathways[j])
            }
        }

        return pathways.length == 0 ?
        <>
        <Headline style={{alignSelf: 'center'}}>
        Modules
    </Headline>
    <Divider />
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10}}>
                    <Paragraph style={{fontWeight: "500", fontSize: 20}}>
            You don't have any goals selected! Click one of the modules above to get started.
        </Paragraph>
        </View>
        </>
        :
        
        <ScrollView shouldRasterizeIOS={true} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this._handleOnRefresh}/>}>
        <View style={{padding: 10, width: '100%', height: '100%', flex: 1, borderTopLeftRadius: 25, borderTopRightRadius: 25,}}>
            <Headline style={{alignSelf: 'center'}}>
                Modules
            </Headline>
        </View>
        <Divider />
        {
            pathways.map(path => {
               return (
                <>
                    <WorkoutComponent navigateMethod={() => this.props.navigation.navigate('WorkoutModal', { goalPathwayUUID: path.uid, goalUUID: path.goal_uid, modality: path.modality})} pathwayName={path.name} pathwayDescription={path.description} workoutModality={path.modality} iterationsCompleted={path.iteration}/>
                    </>
               ) 
            })
        }
    </ScrollView>
    }

              /**
     * 
     */
    _getGoalCaptionColor = (uid) => {
        let goalsArray = [];
        if (this.state.currUserHealthData && true)
        {
             goalsArray = this.state.currUserHealthData;
        }
 
         for (let i = 0; i < goalsArray.length; i++)
         {
             if (goalsArray[i].goal_uuid == uid)
             {
                 return "#2196F3"
             }
             else
             {

                 return "#E0E0E0"
             }
         }
     }
 
     mapGoalsWithSurface = () => {
         return this.state.goals.map((val, index, arr) => {
             return (
                 <TouchableOpacity onPress={() => this.handleGoalOnPress(val.uid)}>
                                             <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', borderWidth: 0.5, borderRadius: 10, width: 120, height: 120, margin: 10, borderColor: this._getGoalCaptionColor() }}>
                            <Image style={{width: '30%', height: '30%'}} defaultSource={this.getDefaultImage(val.uid)}/>
                            <Text style={{padding: 3}}>
                                {val.name}
                            </Text>
                        </View>
                 </TouchableOpacity>
             )
         })
     }
 
         /**
      * handleGoalOnPress
      * 
      * Defines what happens when the onPress method for a goal.
      * param[in] uuid UUID for the goal
      */
     handleGoalOnPress = async (uuid) => {
         if (this.state.currUserHealthData.includes(uuid))
         {
             let currArr = this.state.currUserHealthData;
             let updatedArr = currArr.splice(this.state.currUserHealthData.indexOf(uuid), 1);
             await this.setState({ currUserHealthData: updatedArr });
             await  this.LUPA_CONTROLLER_INSTANCE.removeGoalForCurrentUser(uuid);
         }
         else if (!this.state.currUserHealthData.includes(uuid))
         {
             let currArr = this.state.currUserHealthData;
             currArr.push(uuid);
             await this.setState({ currUserHealthData: currArr });
             await this.LUPA_CONTROLLER_INSTANCE.addGoalForCurrentUser(uuid);
         }
         
     }

    render() {
        return (
            <View style={styles.root}>
                <Header span style={{backgroundColor: 'white', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>

                        <Image style={{width: '30%', height: '40%'}} defaultSource={require('../images/logo.png')} />
                        <Text style={{margin: 10, alignSelf: 'center', fontSize: 20, fontWeight: "600", color: "black"}}>
                            {this.state.currUserData.display_name}
                        </Text>
                </Header>
                <View style={{backgroundColor: 'white', flex: 1}}>
                    <ScrollView contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}} horizontal shouldRasterizeIOS={true}>
                    {
                        this.mapGoalsWithSurface()
                    }
                    </ScrollView>
                </View>
                <View style={styles.workoutSurface}>
    
                    <View style={{width: '100%', height: '100%', flex: 1, backgroundColor: '#f5f5f5'/*"#2196F3"*/}}>
                    {
                        this._mapUserGoals()
                    }
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        display: "flex",
        backgroundColor: "white",
    },
    buttonScroll: {
       
    },
    contentView: {
        display: "flex",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    workoutSurface: {
        flex: 3,
        backgroundColor: "white",
        alignItems: "center",
        flexDirection: "column",
        elevation: 0,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
    },
    imageView: {
        width: "100%",
        height: "65%",
    },
    overlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: "rgba(0,111,230,0.2)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        padding: 10
    }
});

export default connect(mapStateToProps)(WorkoutView);