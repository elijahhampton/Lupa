import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Button,
    Dimensions,
    SafeAreaView,
    TouchableNativeFeedbackBase,
    Modal
} from 'react-native';

import { connect } from 'react-redux';
import LupaController from '../../../../controller/lupa/LupaController';

import Swiper from 'react-native-swiper';
import { ProgressBar } from 'react-native-paper';

import ProgramInformation from './component/ProgramInformation'
import BuildAWorkout from './BuildWorkout';
import ProgramPreview from './component/ProgramPreview';
import { getLupaProgramInformationStructure } from '../../../../model/data_structures/programs/program_structures';
import CreateWorkoutIntroduction from './CreateWorkoutIntroduction';

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
        }

        this.nextIndex = this.nextIndex.bind(this);
    }

    async componentDidMount() {
            const programPayload = await this.LUPA_CONTROLLER_INSTANCE.createNewProgram(this.props.lupa_data.Users.currUserData.user_uuid);
            this.setState({ currProgramUUID: programPayload.program_structure_uuid })
            this.setState({ programData: programPayload})
    }

    async componentWillUnmount() {
        console.log('enable swipe');
        if (this.state.programComplete == false)
        {
            //delete from database
            this.LUPA_CONTROLLER_INSTANCE.deleteProgram(this.props.lupa_data.Users.currUserData.user_uuid, this.state.programData.program_structure_uuid)
            
            if (typeof(this.state.currProgramUUID) != 'undefined' || this.state.currProgramUUID != '')
            {
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
        programAutomatedMessage,
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
        updatedProgramData.program_owner = {
            uuid:  this.props.lupa_data.Users.currUserData.user_uuid,
            displayName:  this.props.lupa_data.Users.currUserData.display_name,
            photo_url:  this.props.lupa_data.Users.currUserData.photo_url,
            certification:  this.props.lupa_data.Users.currUserData.certification
        }
        updatedProgramData.program_automated_message = programAutomatedMessage
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
        await this.setState({
            programComplete: true
        })

        try {
            const programPayload = await this.LUPA_CONTROLLER_INSTANCE.saveProgram(this.props.lupa_data.Users.currUserData.user_uuid, this.state.programData);
            await this.props.addProgram(programPayload);
        } catch(err) {
           await this.setState({
               programComplete: false
           })
        }

        this.exit();
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
        if (this.state.programComplete == false)
        {   
            //delete from database
            this.LUPA_CONTROLLER_INSTANCE.deleteProgram(this.props.lupa_data.Users.currUserData.user_uuid, this.state.programData.program_structure_uuid)
            
            if (typeof(this.state.currProgramUUID) != 'undefined' || this.state.currProgramUUID != '')
            {
                            //delete from redux
            this.props.deleteProgram(this.state.currProgramUUID)
            }
        }
        this.props.navigation.goBack();
    }

    getViewDisplay = () => {
        switch(this.state.currIndex) {
            case 0:
                return (
                    <ProgramInformation captureImage={img => this.captureProgramImage(img)} handleCancelOnPress={this.exit} goToIndex={this.nextIndex} saveProgramInformation={(programName,
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
                )
            case 1:
                return <BuildAWorkout goToIndex={this.goToIndex} goBackToEditInformation={() => this.setState({ currIndex: this.state.currIndex - 1})} saveProgramWorkoutData={workoutData => this.saveProgramWorkoutData(workoutData)} />
            case 2:
                return <ProgramPreview goBackToEditWorkout={() => this.setState({ currIndex: this.state.currIndex - 1})} saveProgram={this.saveProgram} handleExit={this.exit} programData={this.state.programData} />
            default:
        }
    }


    render() {
        return (
            <View style={styles.root}>
                 {
                     this.getViewDisplay()
                 }
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