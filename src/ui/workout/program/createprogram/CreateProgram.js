import React from 'react';

import {
    View,
    StyleSheet,
} from 'react-native';

import { connect, useDispatch } from 'react-redux';
import LupaController from '../../../../controller/lupa/LupaController';

import ProgramInformation from './component/ProgramInformation'
import PublishProgram from './component/PublishProgram';
import initializeNewProgram, { getLupaProgramInformationStructure } from '../../../../model/data_structures/programs/program_structures';
import BuildWorkoutController from './buildworkout/BuildWorkoutController';
import LOG, { LOG_ERROR } from '../../../../common/Logger';

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
            program_workout_days: [],
            uuid: 0,
        }
    }

    initializeProgram = async (programDuration, programDays) => {
       const { user_uuid } = this.props.lupa_data.Users.currUserData
       const newProgramData = await initializeNewProgram(0, user_uuid, [user_uuid], programDuration, programDays);
       await this.LUPA_CONTROLLER_INSTANCE.createNewProgram(newProgramData).then(programUUID => {
            this.setState({
                programData: initializeNewProgram(programUUID, user_uuid, [user_uuid], programDuration, programDays),
                uuid: programUUID
            }, () => console.log(this.state.programData.program_structure_uuid));
        }).catch(error => {
            LOG_ERROR('CreateProgram.js', 'initializeProgram::Caught exception creating program.', error)
            this.setState({
                componentDidErr: false
            })
        });
    }

    saveProgramInformation = (programDuration, programDays) => {
        this.initializeProgram(programDuration, programDays).then(() => {
            this.goToIndex(1)
        })
    }

    saveProgramWorkoutData = async (workoutData) => {
        LOG('CreateProgram.js', 'Updating workout data for program: ' + this.state.programData.program_structure_uuid);
        this.LUPA_CONTROLLER_INSTANCE.updateProgramWorkoutData(this.state.programData.program_structure_uuid, workoutData)
        this.goToIndex(2);
    }

    saveProgramMetadata = async (title, description, tags, price) => {
        LOG('CreateProgram.js', 'Updating program metadata: ' + this.state.uuid);

        await this.LUPA_CONTROLLER_INSTANCE.updateProgramMetadata(this.state.uuid, title, description, tags, price).then(async result => {
            if (result) {
                const programUUID = this.state.programData.program_structure_uuid;
                await this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('programs', programUUID, 'add');
                await this.LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(programUUID).then(data => {
                this.props.addProgram(data);
                });
                this.handleExitCreateProgram();
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
        this.props.navigation.navigate('Train');

        this.LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(this.state.programData.program_structure_uuid)
        .then(programData => {
            if (programData.completedProgram == false)  {
                this.LUPA_CONTROLLER_INSTANCE.deleteProgram(programData.program_structure_uuid);
            }
        }).catch(error => {
            //cleanup program and safely exit component

        })
    }

    renderAppropriateDisplay = () => {
        switch (this.state.currIndex) {
            case 0:
                return (
                    <ProgramInformation 
                    handleCancelOnPress={this.exit}
                    saveProgramInformation={(programDuration, programDays) => this.saveProgramInformation(programDuration, programDays)}
                     />
                )
            case 1:
                return <BuildWorkoutController 
                        navigation={this.props.navigation} 
                        programData={this.state.programData} 
                        program_workout_days={this.state.programData.program_workout_days}
                        goToIndex={this.goToIndex} 
                        saveProgramWorkoutData={workoutData => this.saveProgramWorkoutData(workoutData)} 
                        /> 
            case 2:
                return <PublishProgram uuid={this.state.programData.program_structure_uuid} saveProgramMetadata={this.saveProgramMetadata} goBack={this.prevIndex} exit={this.handleExitCreateProgram} />
            default:
        }
    }

    componentDidErr() {
        this.handleExitCreateProgram()
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