import React from 'react';

import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import {
    Surface,
    Caption, 
} from 'react-native-paper';

import { withNavigation } from 'react-navigation'

import { connect } from 'react-redux';
import ProgramInformationPreview from '../program/ProgramInformationPreview';

mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

class ProgramListComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            programModalVisible: false,
        }

    }

    setPageIsNotPrograms = () => {
        this.props.setPageIsNotPrograms();
    }

    handleOnPress = () => {
        this.setPageIsNotPrograms();

        if (this.props.programData.program_participants.includes(this.props.lupa_data.Users.currUserData.user_uuid))
        {
           this.props.navigation.push('LiveWorkout', {
                programData: this.props.programData,
                programOwnerData: this.props.programData.program_owner == this.props.lupa_data.Users.currUserData.user_uuid ? this.props.lupa_data.Users.currUserData : undefined,
                setPageIsNotPrograms: this.setPageIsNotPrograms.bind(this)
            });
        }
        else
        {
            this.setState({ programModalVisible: true })
        }
    }

    handleCloseProgramInformationModal = () => {
        this.setPageIsNotPrograms();
        this.setState({ programModalVisible: false })
    }

    
    getProgramImage = () => {
        try {
            return <Image style={{width: '100%', height: '100%', borderRadius:16 }} source={{uri: this.props.programData.program_image}} />
        } catch(err) {
            return <View style={{width: '100%', height: '100%', borderRadius: 16, backgroundColor: '#212121' }}>

            </View>
        }
    }
    render() {
        const programData = this.props.programData;
        return (
                <View>
                    <TouchableOpacity onPress={this.handleOnPress}>
                    <Surface style={{elevation: 0, width: Dimensions.get('screen').width /1.3, height: 200, borderRadius: 16, margin: 15}}>
                    {
                        this.getProgramImage()
                    }
                </Surface>
                    </TouchableOpacity>

                <View style={{marginLeft: 15, width: Dimensions.get('screen').width /1.3}}>
                    <View style={{padding: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Text style={{fontFamily: 'ARSMaquettePro-Medium'}}>
                        {this.props.programData.program_name}
                    </Text>
                    <Caption>
                        {this.props.programData.program_type == 'Single' ? 'One on One' : null}
                    </Caption>
                    </View>
                    <Text style={{fontWeight: '300', fontSize: 12}}>
                   {this.props.programData.program_description}
                    </Text>

                    <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10, width: 120, alignSelf: 'flex-end'}}>
                        {
                            this.props.programData.length == undefined ?
                            null
                            :
                            this.props.programData.program_tags.map((tag, index, arr)=> {
                                if (index == arr.length - 1)
                                {
                                    return (
                                        <Caption key={index}>
                                            {tag}
                                        </Caption>
                                    )
                                }
                                return (
                                    <Caption key={index} >
                                        {tag},
                                    </Caption>
                                )
                            })
                        }
                    </View>
                </View>

                <ProgramInformationPreview isVisible={this.state.programModalVisible} programData={this.props.programData} closeModalMethod={this.handleCloseProgramInformationModal} />
                </View>
        )
    }
}

const styles = StyleSheet.create({
    whiteText: {
        color: '#FFFFFF'
    },
    blackText: {
        color: '#212121'
    }
})
export default connect(mapStateToProps)(withNavigation(ProgramListComponent));