import React, { useState, useEffect } from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    Modal,
    SafeAreaView,
} from 'react-native';

import {
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

const CreatingWorkoutModal = ({ uuid, closeModal, isVisible }) => {
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
        //publish program
        await LUPA_CONTROLLER_INSTANCE.publishWorkout(uuid)

        //update current user
        await LUPA_CONTROLLER_INSTANCE.updateCurrentUser('workouts', uuid, 'add');

        await LUPA_CONTROLLER_INSTANCE.getWorkoutInformationFromUUID(uuid).then(data => {
            dispatch({ type: 'ADD_CURRENT_USER_WORKOUT', payload: data})
            setWorkoutData(data);
        })
        setComponentReady(true);
        setIsPublished(true);
    }

    const handleShareProgramOnPress = () => {
        closeModal()
        navigation.navigate('Train')
        navigation.navigate('ShareProgramModal', {
            programData: programData
        })
    }

    const handleStartLiveWorkout = () => {
        handleOnComplete();
        navigation.navigate('LiveWorkout', {
            uuid: workoutData.program_structure_uuid
        })
    }

    const handleOnComplete = () => {
        closeModal()
        navigation.navigate('Train')
    }

    const getComponentDisplay = () => {
        if (componentReady && isPublished === false) {
            return (
                <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)'  }}>
                        
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
                        <Button uppercase={false} color="#1089ff" mode="contained" theme={{roundness: 8}} style={{elevation: 8, width: Dimensions.get('window').width - 100, alignItems: 'center', justifyContent: 'center', height: 45, borderColor: 'white'}} onPress={handlePublishWorkout}>
                            Save
                        </Button>
                        </View>
                        <View style={{marginVertical: 10, width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button onPress={closeModal} uppercase={false} color="#1089ff" mode="contained" theme={{roundness: 8}} style={{elevation: 8, width: Dimensions.get('window').width - 100, alignItems: 'center', justifyContent: 'center', height: 45, borderColor: 'white'}}>
                            Edit
                        </Button>
                        </View>
    
                </SafeAreaView>
            )
        } else if (componentReady === true && isPublished === true) {
            return (
                <SafeAreaView style={{flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center',  backgroundColor: 'rgba(0, 0, 0, 0.9)'  }}>
                       <View style={{paddingHorizontal: 10, width: '100%',  marginHorizontal: 10, paddingVertical: 20, alignItems: 'flex-start',}}>
                       <Text style={{fontFamily: 'Avenir-Light', paddingVertical: 5,  fontSize: 20, color: 'white',}}>
                            Saved.
                        </Text>
                        <Text style={{color: 'white', fontFamily: 'Avenir', fontWeight: 'bold'}}>
                            You're all set.  Would you like to hop in a workout now?
                        </Text>
                       </View>
                       

  

                        <View style={{marginVertical: 10, width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button uppercase={false} color="#1089ff" mode="contained" theme={{roundness: 8}} style={{elevation: 8, width: Dimensions.get('window').width - 100, alignItems: 'center', justifyContent: 'center', height: 45, borderColor: 'white'}} onPress={handleStartLiveWorkout}>
                            Start Workout
                        </Button>
                        </View>

                        <View style={{marginVertical: 10, width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button uppercase={false} color="#1089ff" mode="contained" theme={{roundness: 8}} style={{elevation: 8, width: Dimensions.get('window').width - 100, alignItems: 'center', justifyContent: 'center', height: 45, borderColor: 'white'}} onPress={handleOnComplete}>
                            Complete
                        </Button>
                        </View>
                   
                </SafeAreaView>
            )
        }else {
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

class CreateWorkout extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            currPage: 0,
            workoutData: getLupaWorkoutInformationStructure(),
            currWorkoutUUID: "",
            workoutComplete: false, 
            creatingWorkout: false
        }
    }

    componentDidMount = async () => {
        const UUID = Math.random().toString()
        await this.setState({ currWorkoutUUID: UUID }) 
        await this.setState({ programData: getLupaWorkoutInformationStructure('', UUID, {Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []}, [], this.props.lupa_data.Users.currUserData.user_uuid) })
        this.LUPA_CONTROLLER_INSTANCE.createNewWorkout(UUID);
    }

    handleSuccessfulReset = () => {
        this.setState({ 
            creatingProgram: false,
        })
    }

    goToIndex = (index) => {
        this.setState({ currPage: index, ...this.state });
    }

    saveProgramInformation = (workoutName, workoutDays) => {
        let updatedProgramData = this.state.programData;
        updatedProgramData.program_name = workoutName;
        updatedProgramData.program_workout_days = workoutDays;

        this.setState({ programData: updatedProgramData, ...this.state })
        this.LUPA_CONTROLLER_INSTANCE.updateWorkoutInformation(workoutUUID, updatedProgramData);
        this.goToIndex(1);
    }

    saveProgramWorkoutData = async (workoutData) => {
        await this.LUPA_CONTROLLER_INSTANCE.updateWorkoutData(this.state.currWorkoutUUID, workoutData)
        this.setState({ workoutComplete: true, creatingWorkout: true });
    }

    renderComponentDisplay = () => {
        const currPage = this.state.currPage;
        switch(currPage) {
            case 0:
                <WorkoutInformation saveProgramInformation={this.saveProgramInformation} goToIndex={this.goToIndex} />
                break;
            case 1:
                <BuildWorkoutTool navigation={this.props.navigation} programData={this.state.workoutData} goToIndex={this.goToIndex} programUUID={this.state.currWorkoutUUID} />
                break;
            default:
        }
    }

    render() {
        return (
            <View style={styles.root}>
                {this.renderComponentDisplay()}
                <CreatingWorkoutModal uuid={this.state.currWorkoutUUID} isVisible={this.state.creatingWorkout} closeModal={this.handleSuccessfulReset} />
            </View>
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