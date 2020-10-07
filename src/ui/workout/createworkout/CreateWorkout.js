import React, { useState, useEffect } from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    Modal,
    SafeAreaView,
    ActivityIndicator
} from 'react-native';

import {
    Appbar,
    Button
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather'
import WorkoutInformation from './component/WorkoutInformation';
import BuildWorkoutTool from '../program/createprogram/buildworkout/BuildWorkoutController'
import LupaController from '../../../controller/lupa/LupaController';
import { getLupaWorkoutInformationStructure } from '../../../model/data_structures/workout/workout_collection_structures';
import { connect, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native'
import LOG from '../../../common/Logger';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import moment from 'moment';

const CreatingWorkoutModal = ({ uuid, closeModal, isVisible, workoutDataProp }) => {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    const [workoutData, setWorkoutData] = useState(getLupaWorkoutInformationStructure())
    const [changedUUID, setChangedUUID] = useState(0);
    const [componentReady, setComponentReady] = useState(true)
    const [isPublished, setIsPublished] = useState(false);

    const navigation = useNavigation();
    const dispatch = useDispatch()

    useEffect(() => {
        if (uuid == null || typeof(uuid) == 'undefined') {
            setComponentReady(false);
        }

    
        LOG('CreateWorkout.js', 'Running useEffect.');
        setComponentReady(true);
    }, [uuid])

    const handlePublishWorkout =  async() => {
        setComponentReady(false);
        //TODO: new Date().getMonth() + 1 because the month count starts at 0 - need to handle the case for December(12)
        let year, month, day;
        year = new Date().getFullYear();
        month = new Date().getMonth() + 1;
        if (month.toString().length == 1) {
            month = "0" + month.toString();
        }
        day = new Date().getDate()
        if (day.toString().length == 1) {
            day = "0" + day.toString();
        }

        const dateString = `${year}-${month}-${day}`;
        //publish program
        await LUPA_CONTROLLER_INSTANCE.publishWorkout(uuid, dateString)

        dispatch({ type: 'ADD_CURRENT_USER_WORKOUT', payload: workoutDataProp})

        setComponentReady(true);
        setIsPublished(true);
    }

    const handleStartLiveWorkout = async () => {
        handleOnComplete();

        navigation.navigate('LiveWorkout', {
            programData: workoutDataProp
        })
    }

    const handleOnComplete = () => {
        closeModal()
        navigation.navigate('Train')
    }

    const getComponentDisplay = () => {
        if (componentReady) {
            return (
                <SafeAreaView style={{flex: 1,  backgroundColor: 'rgba(0, 0, 0, 0.9)'  }}>
                        <Appbar.Header style={{backgroundColor: 'transparent'}}>
                            <Appbar.Action icon={() => <Feather1s color='white' name="arrow-left" size={20} />} />
                        </Appbar.Header>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',}}>

             
                       <View style={{flexDirection: 'row', alignItems: 'center'}}>
                       <View style={{ paddingHorizontal: 10, paddingVertical: 20, alignItems: 'flex-start',}}>
                       <View style={{flexDirection: 'row', alignItems :'center', justifyContent: 'space-evenly'}}>
                       <View style={{marginRight: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', borderColor: '#1089ff', borderWidth: 1.5, width: 25, height: 25, borderRadius: 40}}>
                        <FeatherIcon name="check" size={15} color="#1089ff" />
                        </View>
                       <Text style={{fontFamily: 'Avenir-Light', paddingVertical: 5,  fontSize: 20, color: 'white',}}>
                            Your workout is complete.
                        </Text>
                       </View>
                        <Text style={{color: 'white', fontFamily: 'Avenir', fontWeight: 'bold'}}>
                          Once you save your workout you will be able to access it from your profile
                        </Text>
                       </View>
                       
                       </View>

  

                        <View style={{marginVertical: 10, width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button onPress={isPublished === false ? () => handlePublishWorkout() : null} uppercase={false} color="#1089ff" mode="contained" theme={{roundness: 8}} style={{elevation: 8, width: Dimensions.get('window').width - 100, alignItems: 'center', justifyContent: 'center', height: 45, borderColor: 'white'}} onPress={handlePublishWorkout}>
                            {isPublished === true ? 'Saved to Workout Log!' : 'Save to Workout Log'}
                        </Button>
                        </View>
                        <View style={{marginVertical: 10, width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button onPress={handleStartLiveWorkout} uppercase={false} color="#1089ff" mode="contained" theme={{roundness: 8}} style={{elevation: 8, width: Dimensions.get('window').width - 100, alignItems: 'center', justifyContent: 'center', height: 45, borderColor: 'white'}}>
                            Start Workout
                        </Button>
                        </View>
                        <View style={{marginVertical: 10, width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button uppercase={false} color="#1089ff" mode="contained" theme={{roundness: 8}} style={{elevation: 8, width: Dimensions.get('window').width - 100, alignItems: 'center', justifyContent: 'center', height: 45, borderColor: 'white'}} onPress={handleOnComplete}>
                            Complete
                        </Button>
                        </View>
                        </View>
                </SafeAreaView>
            )
        } else {
            return (
                <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)'  }}>
                    <ActivityIndicator animating={true} color="white" />
                </SafeAreaView>
            )
        }
    }
    return (
        <Modal 
        animationType="fade"
        transparent={true}
        visible={isVisible}
        >
                {getComponentDisplay()}
        </Modal>
           
    )
}


const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
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

class CreateWorkout extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            currPage: 0,
            workoutData: getLupaWorkoutInformationStructure('', '', {Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []}, [DAY], this.props.lupa_data.Users.currUserData.user_uuid),
            currWorkoutUUID: "",
            workoutComplete: false, 
            creatingWorkout: false,
            workoutComplete: false,
            ready: false
        }
    }

    componentDidMount = async () => {
        const UUID = Math.random().toString()
        var d = new Date();
        let weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        
        const DAY = await weekday[d.getDay()];

        await this.setState({ currWorkoutUUID: UUID }) 
        let updatedProgramData = getLupaWorkoutInformationStructure(this.props.lupa_data.Users.currUserData.user_uuid, UUID, {Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []}, [DAY], this.props.lupa_data.Users.currUserData.user_uuid, [DAY])

        let newState = {
            program_owner: this.props.lupa_data.Users.currUserData.user_uuid,
            program_workout_days: [DAY]
        }

        await this.setState({ programData: Object.assign(newState, updatedProgramData, {})})
        await this.LUPA_CONTROLLER_INSTANCE.createNewWorkout(UUID);
        
       await this.LUPA_CONTROLLER_INSTANCE.updateWorkoutInformation(this.state.currWorkoutUUID, this.state.programData);

        await this.setState({ ready: true })
    }

    async componentWillUnmount() {
        if (this.state.workoutComplete === false) {
            //delete from database
            this.LUPA_CONTROLLER_INSTANCE.deleteWorkout(this.props.lupa_data.Users.currUserData.user_uuid, this.state.currProgramUUID);

            if (typeof(this.state.currWorkoutUUID) != 'undefined') {
                //delete from redux
                //this.props.deleteProgram(this.state.currProgramUUID)
            }
        }
    }

    handleSuccessfulReset = () => {
        this.setState({ 
            creatingProgram: false,
        })
    }

    goToIndex = (index) => {
        this.setState({ currPage: index });
    }

    saveProgramWorkoutData = async (workoutData) => {
        const oldState = this.state.programData

        const updatedState = {
            ...this.state.programData,
            program_workout_structure: workoutData
        }
    
        await this.LUPA_CONTROLLER_INSTANCE.updateWorkoutData(this.state.currWorkoutUUID, workoutData)
        this.setState({programData: Object.assign(oldState, updatedState, {}), workoutComplete: true, creatingWorkout: true });
    }

    renderComponentDisplay = () => {
        if (!this.state.ready) {
            return (
                <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
                     <ActivityIndicator size="large" color="#23374d" animating={true} />
                </View>
            )
        }
        return (
            <>
             <BuildWorkoutTool program_workout_days={[DAY]} toolIsFirstScreen={true} saveProgramWorkoutData={this.saveProgramWorkoutData} navigation={this.props.navigation} programData={this.state.workoutData} goToIndex={this.goToIndex} programUUID={this.state.currWorkoutUUID} />
                <CreatingWorkoutModal workoutDataProp={this.state.programData} uuid={this.state.currWorkoutUUID} isVisible={this.state.creatingWorkout} closeModal={this.handleSuccessfulReset} />
            </>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.root}>
            {this.renderComponentDisplay()}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    }
})

export default connect(mapStateToProps)(CreateWorkout);