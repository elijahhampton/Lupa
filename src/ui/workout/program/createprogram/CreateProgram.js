import React, { useEffect, useState } from 'react';

import {
    View,
    StyleSheet,
    Text,
    SectionList,
    Dimensions,
    Image,
    Modal,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
 
import {
    Icon 
} from 'react-native-elements';

import { connect, useDispatch } from 'react-redux';
import LupaController from '../../../../controller/lupa/LupaController';

import ProgramInformation from './component/ProgramInformation'
import PublishProgram from './component/PublishProgram';
import { getLupaProgramInformationStructure, initializeNewProgram } from '../../../../model/data_structures/programs/program_structures';
import FeatherIcon from 'react-native-vector-icons/Feather'
import LUPA_DB from '../../../../controller/firebase/firebase';
import { useNavigation } from '@react-navigation/native';

import { Button, Caption, Appbar } from 'react-native-paper'
import { Constants } from 'react-native-unimodules';
import BuildWorkoutController from './buildworkout/BuildWorkoutController';
import LOG, { LOG_ERROR } from '../../../../common/Logger';
import moment from 'moment'

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
            programData: getLupaProgramInformationStructure(),
            componentDidErr: false,
        }
    }

    initializeProgram = async (programDuration, programDays) => {
        const newProgramData = initializeNewProgram(0, this.props.lupa_data.Users.currUserData.user_uuid, [this.props.lupa_data.Users.currUserData.user_uuid], programDuration, programDays);
        await this.LUPA_CONTROLLER_INSTANCE.createNewProgram(programData).then(programUUID => {
            this.setState({
                programData: {
                    program_structure_uuid: programUUID,
                    ...newProgramData
                }
            });
        }).catch(error => {
            LOG_ERROR('CreateProgram.js', 'initializeProgram::Caught exception creating program.', error)
            this.setState({
                componentDidErr: false
            })
        })
    }

    saveProgramInformation = async (programDuration, programDays) => {
        await initializeNewProgram(programDuration, programDays);
        this.goToIndex(1)
    }

    saveProgramWorkoutData = async (workoutData) => {
        await this.LUPA_CONTROLLER_INSTANCE.updateProgramWorkoutData(this.state.programData.program_structure_uuid, workoutData);
        this.goToIndex(2);
    }

    saveProgramMetadata = async (title, description, tags, image, price) => {
        await this.LUPA_CONTROLLER_INSTANCE.updateProgramMetadata(this.state.programData.program_structure_uuid, title, description, tags, image, price).then(async result => {
            if (result) {
                const programUUID = this.state.programData.program_structure_uuid;
                await LUPA_CONTROLLER_INSTANCE.updateCurrentUser('programs', programUUID, 'add');
                await LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(programUUID).then(data => {
                this.props.addProgramdispatch(data);
                })
                handleExitCreateProgram();
            } else {
                //show problem  dialog
            }
        })
    }

    handleExitCreateProgram = () => {
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
        this.props.navigation.goBack();
    }

    renderAppropriateDisplay = () => {
        switch (2) {
            case 0:
                return (
                    <ProgramInformation 
                    handleCancelOnPress={this.exit}
                    saveProgramInformation={(this.saveProgramInformation)}
                     />
                )
            case 1:
                return <BuildWorkoutController 
                        navigation={this.props.navigation} 
                        programData={this.state.programData} 
                        goToIndex={this.goToIndex} 
                        saveProgramWorkoutData={workoutData => this.saveProgramWorkoutData(workoutData)} 
                        /> 
            case 2:
                return <PublishProgram saveProgramMetadata={this.saveProgramMetadata} goBack={this.prevIndex} />
            default:
        }
    }


    render() {
        return (
            <View style={styles.root}>
                {
                    this.renderAppropriateDisplay()
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