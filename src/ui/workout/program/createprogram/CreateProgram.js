import React, { useEffect, useState } from 'react';

import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    Image,
    SafeAreaView,
    Modal,
    ActivityIndicator,
} from 'react-native';

import { connect } from 'react-redux';
import LupaController from '../../../../controller/lupa/LupaController';

import ProgramInformation from './component/ProgramInformation'
import BuildAWorkout from './BuildWorkout';
import { getLupaProgramInformationStructure } from '../../../../model/data_structures/programs/program_structures';
import { fromString } from 'uuidv4';
import FeatherIcon from 'react-native-vector-icons/Feather'
import LUPA_DB from '../../../../controller/firebase/firebase';
import { useNavigation } from '@react-navigation/native';

import { Button, Caption } from 'react-native-paper'
import { Constants } from 'react-native-unimodules';


const CreatingProgramModal = ({ uuid, closeModal, isVisible }) => {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    const [programData, setProgramData] = useState(getLupaProgramInformationStructure())
    const [componentReady, setComponentReady] = useState(false)

    const navigation = useNavigation();

    useEffect(() => {
        async function fetchData() {
            await LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(uuid).then(data => {
                setProgramData(data)
            }).then(() => {
                setComponentReady(true)
            })

            console.log(programData)
        }

        try {
        fetchData()
    } catch(err) {
        alert(err)
    }
    }, [])

    const handlePublishProgram =  async() => {
        await LUPA_CONTROLLER_INSTANCE.publishProgram(uuid)
        navigation.navigate('Train')
        closeModal()
    }

    const close = () => {
        closeModal()
    }

    const getComponentDisplay = () => {
        if (componentReady) {
            return (
                <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0, 0, 0, 0.9)'  }}>
                        <Button mode="text" color="white" onPress={closeModal} style={{position: 'absolute', top: Constants.statusBarHeight, left: 0, margin: 10}}>
                            Edit
                        </Button>
                        
                        <View style={{height: 300, justifyContent: 'space-evenly', marginVertical: 60, alignItems: 'center'}}>

                        <Text style={{fontSize: 25, color: 'white', textAlign: 'center', marginHorizontal: 10}}>
                            Your program is ready to publish
                        </Text>
                        <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', borderColor: '#1089ff', borderWidth: 1.5, width: 40, height: 40, borderRadius: 40}}>
                        <FeatherIcon name="check" size={20} color="#1089ff" />
                        </View>
  
                        </View>

                        <View style={{width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button color="#1089ff" mode="contained" style={{elevation: 8, width: Dimensions.get('window').width - 100, alignItems: 'center', justifyContent: 'center', height: 55, borderColor: 'white'}} onPress={handlePublishProgram}>
                            Publish
                        </Button>
                        

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
        lupa_data: state,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addProgram: (programPayload) => {
            dispatch({
                type: "ADD_CURRENT_USER_PROGRAM",
                payload: programPayload,
            })
        },
        deleteProgram: (programUUID) => {
            dispatch({
                type: "DELETE_CURRENT_USER_PROGRAM",
                payload: programUUID
            })
        },
    }
}

class CreateProgram extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            currIndex: 0,
            currProgramUUID: "",
            programData: getLupaProgramInformationStructure(),
            programImage: "",
            programComplete: false,
            creatingProgram: false,
        }

        this.nextIndex = this.nextIndex.bind(this);
    }

    async componentDidMount() {
        const UUID = fromString((Math.random() + this.props.lupa_data.Programs.currUserProgramsData.length).toString())
        await this.setState({ currProgramUUID: UUID }) 
        const programPayload = getLupaProgramInformationStructure(UUID, "", "" ,0, new Date(), new Date(), "", 0, 0, 0, {}, false, "", [], this.props.lupa_data.Users.currUserData.user_uuid, [this.props.lupa_data.Users.currUserData.user_uuid], "", false)
        await this.setState({ programData: programPayload })
        this.LUPA_CONTROLLER_INSTANCE.createNewProgram(UUID);
    }

    async componentWillUnmount() {
        if (this.state.programComplete == false) {
            //delete from database
            this.LUPA_CONTROLLER_INSTANCE.deleteProgram(this.props.lupa_data.Users.currUserData.user_uuid, this.state.currProgramUUID)

            if (typeof (this.state.currProgramUUID) != 'undefined' || this.state.currProgramUUID != '' || this.state.currProgramUUID == null) {
                //delete from redux
                this.props.deleteProgram(this.state.currProgramUUID)
            }
        }
    }

    captureProgramImage = (img) => {
        this.setState({
            programImage: img
        })
    }

    saveProgramInformation = async (programName, programDescription, numProgramSpots, programStartDate,
        programEndDate, programDuration, programTime, programPrice, programLocationData, programType,
        allowWaitlist, programImage, programTags, programAutomatedMessage, programDays) => {
        let updatedProgramData = this.state.programData;

        updatedProgramData.program_structure_uuid = this.state.currProgramUUID;
        updatedProgramData.program_name = programName;
        updatedProgramData.program_description = programDescription;
        updatedProgramData.program_slots = numProgramSpots;
        updatedProgramData.program_start_date = programStartDate;
        updatedProgramData.program_end_date = programEndDate;
        updatedProgramData.program_workout_days = programDays;
        updatedProgramData.program_duration = programDuration;
        updatedProgramData.program_time = programTime;
        updatedProgramData.program_price = programPrice;
        updatedProgramData.program_location = programLocationData;
        updatedProgramData.program_type = programType;
        updatedProgramData.program_allow_waitlist = allowWaitlist;
        updatedProgramData.program_image = this.state.programImage
        updatedProgramData.program_tags = programTags;
        updatedProgramData.program_participants = [this.props.lupa_data.Users.currUserData.user_uuid]
        updatedProgramData.program_owner = this.props.lupa_data.Users.currUserData.user_uuid;
        updatedProgramData.program_automated_message = programAutomatedMessage
        updatedProgramData.completedProgram = false;

        await this.LUPA_CONTROLLER_INSTANCE.updateProgramData(this.state.currProgramUUID, updatedProgramData);

        this.goToIndex(1)
    }

    saveProgramWorkoutData = async (workoutData) => {
        await this.LUPA_CONTROLLER_INSTANCE.updateProgramWorkoutData(this.state.currProgramUUID, workoutData)
        this.setState({ programComplete: true, creatingProgram: true });
    }

    handleSuccessfulReset = () => {
        this.setState({ 
            creatingProgram: false,
        })
    }

    saveProgram = async () => {
        await this.setState({
            programComplete: true
        })

        try {
            const programPayload = await this.LUPA_CONTROLLER_INSTANCE.saveProgram(this.props.lupa_data.Users.currUserData.user_uuid, this.state.programData);
            this.props.addProgram(programPayload);
        } catch (err) {
            await this.setState({
                programComplete: false
            })
        }
    }

    prevIndex = () => {
        this.setState({
            currIndex: this.state.currIndex - 1
        })
    }

    nextIndex = () => {
        this.setState({
            currIndex: this.state.currIndex + 1
        })
    }

    goToIndex = (index) => {
        this.setState({
            currIndex: index
        })
    }

    exit = () => {
        if (this.state.programComplete == false) {
            //delete from database
            this.LUPA_CONTROLLER_INSTANCE.deleteProgram(this.props.lupa_data.Users.currUserData.user_uuid, this.state.currProgramUUID)

            if (typeof (this.state.currProgramUUID) != 'undefined' || this.state.currProgramUUID != '' || this.state.currProgramUUID == null) {
                //delete from redux
                this.props.deleteProgram(this.state.currProgramUUID)
            }
        }

        this.props.navigation.navigate('Train');
    }

    getViewDisplay = () => {
        switch (this.state.currIndex) {
            case 0:
                return (
                    <ProgramInformation captureImage={img => this.captureProgramImage(img)} handleCancelOnPress={this.exit} goToIndex={this.nextIndex} saveProgramInformation={(
                        programName,
                        programDescription,
                        numProgramSpots,
                        programStartDate,
                        programEndDate,
                        programDuration,
                        programTime,
                        programPrice,
                        programLocationData,
                        programType,
                        allowWaitlist,
                        programImage,
                        programTags,
                        programAutomatedMessage,
                        programWorkoutDays) => this.saveProgramInformation(programName,
                            programDescription,
                            numProgramSpots,
                            programStartDate,
                            programEndDate,
                            programDuration,
                            programTime,
                            programPrice,
                            programLocationData,
                            programType,
                            allowWaitlist,
                            programImage,
                            programTags,
                            programAutomatedMessage,
                            programWorkoutDays
                        )} />
                )
            case 1:
                return <BuildAWorkout programData={this.state.programData} goToIndex={this.goToIndex} goBackToEditInformation={() => this.setState({ currIndex: this.state.currIndex - 1 })} saveProgramWorkoutData={workoutData => this.saveProgramWorkoutData(workoutData)} />
            default:
        }
    }


    render() {
        return (
            <View style={styles.root}>
                {
                    this.getViewDisplay()
                }
                <CreatingProgramModal uuid={this.state.currProgramUUID} isVisible={this.state.creatingProgram} closeModal={this.handleSuccessfulReset} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateProgram);