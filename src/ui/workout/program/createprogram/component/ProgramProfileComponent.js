import React, { useState, useEffect, useRef } from 'react';

import {
    TouchableHighlight,
    View,
    StyleSheet,
    Text,
    ImageBackground,
    Dimensions,
} from 'react-native';

import {
    Surface,
    Chip
} from 'react-native-paper';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import ProgramInformationPreview from '../../ProgramInformationPreview';
import { useSelector, useDispatch } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getUpdateCurrentUserProgramAttributeActionPayload } from '../../../../../controller/redux/payload_utility';
import { getLupaProgramInformationStructure } from '../../../../../model/data_structures/programs/program_structures'
import LupaController from '../../../../../controller/lupa/LupaController'
import { connect } from 'react-redux';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateProgramAttribute: (payload)  => {
            dispatch({
                type: "UPDATE_CURRENT_USER_PROGRAM_ATTRIBUTE",
                payload: payload
            })
        }
}
}

class ProgramProfileComponent extends React.PureComponent {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            programModalVisible: false,
            programData: this.props.programData
        }
    }

    componentDidMount = async () => {

            let programInformationIn;

            try {
                await this.LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(this.props.programData.program_structure_uuid).then(result => {
                    programInformationIn = result;
                });
        
                await this.setState({
                    programData: programInformationIn,
                })
            } catch(error) {
                this.setState({
                    programData: []
                })
            }
    }

    /**
     * Returns the program image
     * @return URI Returns a uri for the program image, otherwise ''
     */
    getProgramImage = () => {
        try {
            return this.state.programData.program_image;
        } catch(err) {
            return ''
        }
    }

     /**
     * Returns the program name
     * @return URI Returns a string for the name, otherwise ''
     */
    getProgramName = () => {
        try {
            return this.state.programData.program_name;
        } catch(err) {
            return ''
        }
    }

     /**
     * Returns the program description
     * @return URI Returns a string for the description, otherwise ''
     */
    getProgramDescription = () => {
        try {
            return this.state.programData.program_description;
        } catch(err) {
            return ''
        }
    }


    handleOnPress = async () => {
        if (this.state.programData.program_participants.includes(this.props.lupa_data.Users.currUserData.user_uuid))
        {
           this.props.navigation.push('LiveWorkout', {
                programData: this.props.programData,
            });
        }
        else
        {
            this.setState({
                programModalVisible: true
            })
        }
    }

    closeModalMethod = () => {
        this.setState({
            programModalVisible: false
        })
    }

    render() {
        return (
            <View style={{marginBottom: 12}}>
            <TouchableOpacity onPress={this.handleOnPress}>
            <Surface style={{elevation: 0, width: Dimensions.get('screen').width /1.3, height: 120, borderRadius: 16, margin: 5}}>
          <View style={{position: 'absolute', 
            flex: 1,
            top: 0, left: 0, right:0, 
            borderRadius: 16, 
            backgroundColor: 'rgba(0,0,0,0.7)'}} />               
          <ImageBackground 
           imageStyle={{borderRadius: 16}} 
           style={{alignItems: 'flex-start', justifyContent: 'center', width: '100%', height: '100%', borderRadius:16 }} 
           source={{uri: this.getProgramImage() }}>
           </ImageBackground>
            <MaterialIcon size={30} name="info" color="#FAFAFA" style={{ position: 'absolute', right: 0, top: 0, margin: 5}} />
        </Surface>
            </TouchableOpacity>
            <View style={{paddingLeft: 10, width: Dimensions.get('screen').width /1.3-10, alignItems: 'flex-start', justifyContent: 'center' }}>
               <Text style={{color: '#000000', fontSize: 20,fontFamily: 'ARSMaquettePro-Medium' }}>
                    {this.getProgramName()}
                    </Text>
                    <Text  numberOfLines={3} style={{ color: '#000000', fontSize: 12, fontFamily: 'ARSMaquettePro-Regular'}}>
                    {this.getProgramDescription()}
                    </Text>
               </View>
    
            <ProgramInformationPreview isVisible={this.state.programModalVisible} programData={this.state.programData} closeModalMethod={this.closeModalMethod} />
        </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgramProfileComponent);