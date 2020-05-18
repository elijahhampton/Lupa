import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Button,
    Dimensions,
    SafeAreaView
} from 'react-native';

import { connect } from 'react-redux';
import LupaController from '../../../controller/lupa/LupaController';

import { withNavigation } from 'react-navigation';
import Swiper from 'react-native-swiper';
import { throwIfAudioIsDisabled } from 'expo-av/build/Audio/AudioAvailability';
import { ProgressBar } from 'react-native-paper';

import ProgramInformation from './components/ProgramInformation'
import BuildAWorkout from '../BuildWorkout';
import ProgramPreview from './components/ProgramPreview';
import { getLupaProgramInformationStructure } from '../../../model/data_structures/programs/program_structures';

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

        this.props.disableSwipe();

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            currIndex: 0,
            currProgramUUID: "",
            programData: getLupaProgramInformationStructure(),
            programImage: "",

        }

        this.nextIndex = this.nextIndex.bind(this);
    }

    async componentDidMount() {
        this.props.disableSwipe();

        const programPayload = await this.LUPA_CONTROLLER_INSTANCE.createNewProgram(this.props.lupa_data.Users.currUserData.user_uuid);
        this.setState({ currProgramUUID: programPayload.program_structure_uuid })
        this.setState({ programData: programPayload})
    }

    captureImage = (img) => {
        this.setState({
            programImage: img
        })
    }

    saveProgramInformation = async (
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
    ) => {
       let updatedProgramData = this.state.programData;

        updatedProgramData.program_structure_uuid = this.state.currProgramUUID;
        updatedProgramData.program_name = programName;
        updatedProgramData.program_description = programDescription;
        updatedProgramData.program_slots = numProgramSpots;
        updatedProgramData.program_start_date = programStartDate;
        updatedProgramData.program_end_date = programEndDate;
        updatedProgramData.program_duration = programDuration;
        updatedProgramData.program_time =programTime;
        updatedProgramData.program_price = programPrice;
        updatedProgramData.program_location = programLocationData;
        updatedProgramData.program_type = programType;
        updatedProgramData.program_allow_waitlist = allowWaitlist;
        updatedProgramData.program_image = this.state.programImage
        updatedProgramData.program_tags = programTags;
        updatedProgramData.program_participants = [this.props.lupa_data.Users.currUserData.user_uuid]
        updatedProgramData.program_owner = this.props.lupa_data.Users.currUserData.user_uuid;
        await this.setState({
            programData: updatedProgramData
        })
    }

    saveProgramWorkoutData = async (workoutData) => {
        let updatedProgramData = this.state.programData;
        updatedProgramData.program_workout_structure = workoutData;

        await this.setState({
            programData: updatedProgramData
        })
    }

    saveProgram = async () => {
        try {
            const programPayload = await this.LUPA_CONTROLLER_INSTANCE.saveProgram(this.props.lupa_data.Users.currUserData.user_uuid, this.state.programData);
            await this.props.addProgram(programPayload);
        } catch(err) {
           
        }

        this.exit();
    }

    nextIndex = () => {

        this.setState({
            currIndex: this.state.currIndex + 1
        })
    }

    exit = () => {
        this.props.navigation.state.params.setPageIsPrograms()
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={styles.root}>
                <Swiper index={this.state.currIndex} showsPagination={false} scrollEnabled={false}>
                    <ProgramInformation captureImage={img => this.captureImage(img)} handleCancelOnPress={this.exit} goToIndex={this.nextIndex} saveProgramInformation={(programName,
        programDescription,
        numProgramSpots,
        programStartDate,
        programEndDate,
        programDuration,
        programTime,
        programPrice,
        programLocationData,
        programType,
        allowWaitlist) => this.saveProgramInformation(programName,
            programDescription,
            numProgramSpots,
            programStartDate,
            programEndDate,
            programDuration,
            programTime,
            programPrice,
            programLocationData,
            programType,
            allowWaitlist)} />


                    <BuildAWorkout goToIndex={this.nextIndex} saveProgramWorkoutData={workoutData => this.saveProgramWorkoutData(workoutData)} />
                    <ProgramPreview goToIndex={this.nextIndex} goBackToEditWorkout={() => this.setState({ currIndex: 1})} saveProgram={this.saveProgram} handleExit={this.exit} programData={this.state.programData} />
                </Swiper>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F2F2F2'
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(CreateProgram));