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
import { getUpdateCurrentUserAttributeActionPayload } from '../../../../controller/redux/payload_utility';
import { UPDATE_CURRENT_USER_ATTRIBUTE_ACTION } from '../../../../controller/redux/actionTypes';
import LUPA_DB from '../../../../controller/firebase/firebase';

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
        updateUserAttribute: (payload) => {
            dispatch({
                type: UPDATE_CURRENT_USER_ATTRIBUTE_ACTION,
                payload: payload
            })
        }
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

    initializeProgram = async (programType, programDuration, programStructure) => {
        console.log('init')
        console.log(programStructure)
       const { user_uuid } = this.props.lupa_data.Users.currUserData
       const newProgramData = await initializeNewProgram(0, user_uuid, [user_uuid], programType, programDuration, programStructure);
       console.log('The structure')
       console.log(newProgramData);
       await this.LUPA_CONTROLLER_INSTANCE.createNewProgram(newProgramData).then(programUUID => {
            this.setState({
                programType: programType,
                programData: initializeNewProgram(programUUID, user_uuid, [user_uuid], programType, programDuration, programStructure),
                uuid: programUUID
            }, () => console.log(this.state.programData.program_structure_uuid));
        }).catch(error => {
            LOG_ERROR('CreateProgram.js', 'initializeProgram::Caught exception creating program.', error)
            this.setState({
                componentDidErr: false
            })
        });
    }

    saveProgramInformation = (programType, programDuration, initialStructure) => {
        this.initializeProgram(programType, programDuration, initialStructure).then(() => {
            this.goToIndex(1)
        })
    }

    saveProgramWorkoutData = async (workoutData, numWorkoutsAdded, equipmentList) => {
        LOG('CreateProgram.js', 'Updating workout data for program: ' + this.state.programData.program_structure_uuid);
        this.LUPA_CONTROLLER_INSTANCE.updateProgramWorkoutData(this.state.programData.program_structure_uuid, workoutData, numWorkoutsAdded, equipmentList)
        this.goToIndex(2);
    }

    saveProgramMetadata = async (title, description, tags, price) => {
        LOG('CreateProgram.js', 'Updating program metadata: ' + this.state.uuid);
        await this.LUPA_CONTROLLER_INSTANCE.updateProgramMetadata(this.state.uuid, title, description, tags, price).then(async result => {
            if (result) {
                const programUUID = this.state.uuid;
                await this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('programs', programUUID, 'add');
                await this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('program_data', this.state.programData, 'add');
                await this.LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(programUUID).then(async data => {
                this.props.addProgram(data);

                let updatedProgramData = this.props.lupa_data.Users.currUserData.program_data;
                updatedProgramData.push(data);

                const payload = await getUpdateCurrentUserAttributeActionPayload('program_data', updatedProgramData);
                this.props.updateUserAttribute(payload);
                });
                this.exit();
            } else {
                //show problem  dialog
            }
        })
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

    handleUnfinishedProgram = () => {
        this.LUPA_CONTROLLER_INSTANCE.eraseProgram(this.state.programData.program_structure_uuid)
    }

    exit = () => {
        this.props.navigation.navigate('Train')
    }

    renderAppropriateDisplay = () => {
        switch (this.state.currIndex) {
            case 0:
                return (
                    <ProgramInformation 
                    handleCancelOnPress={this.exit}
                    saveProgramInformation={(programType, programDuration, programDays) => this.saveProgramInformation(programType, programDuration, programDays)}
                     />
                )
            case 1:
                return <BuildWorkoutController 
                        isEditing={false}
                        closeModal={() => {}}
                        navigation={this.props.navigation} 
                        programType={this.state.programType}
                        programData={this.state.programData} 
                        
                        goToIndex={this.goToIndex} 
                        saveProgramWorkoutData={(workoutData, numWorkoutsAdded, equipmentList) => this.saveProgramWorkoutData(workoutData, numWorkoutsAdded, equipmentList)} 
                        /> 
            case 2:
                return <PublishProgram uuid={this.state.programData.program_structure_uuid} saveProgramMetadata={this.saveProgramMetadata} goBack={this.prevIndex} exit={this.exit} />
            default:
        }
    }

    componentDidErr(error, info) {
        alert(error)
        console.log(error)
        console.log(info)
       // this.exit();
        LUPA_DB.collection('programs').doc(this.state.uuid).delete();
    }

    componentWillUnmount() {
        if (this.state.currIndex == 0) {
            this.exit();
            return;
        }
        
        this.exit();
        this.LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(this.state.uuid).then(data => {
            if (data.program_name == "" || typeof(data.program_name) == 'undefined') {
                LUPA_DB.collection('programs').doc(this.state.uuid).delete();
            }
        })
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