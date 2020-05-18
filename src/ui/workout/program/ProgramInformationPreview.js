import React from 'react';

import {
    StyleSheet,
    View,
    Text,
    Image,
    Modal,
    Dimensions,
} from 'react-native';

import {
    Surface,
    Title,
    Button,
    Headline,
    Paragraph,
    Caption,
    Avatar
} from 'react-native-paper';

import ThinFeatherIcon from "react-native-feather1s";
import FeatherIcon from 'react-native-vector-icons/Feather'
import { Constants } from 'react-native-unimodules';
import LupaCalendar from '../../user/dashboard/calendar/LupaCalendar';
import LupaController from '../../../controller/lupa/LupaController';
import LiveWorkoutPreview from './LiveWorkoutPreview';
import ModalLiveWorkoutPreview from './ModalLiveWorkoutPreview';
import ModalProfileView from '../../user/profile/ModalProfileView';

import { connect } from 'react-redux';

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
    }
}

class ProgramInformationPreview extends React.Component {
 constructor(props) {
     super(props);

     this.state = {
         programOwnerData: {},
         ready: false,
         showProfileModal: false,
         showPreviewModal: false,
     }

     this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
     
 }

 componentDidMount = async () => {
     let programOwnerDataIn;
    await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(this.props.programData.program_owner).then(userData => {
        programOwnerDataIn = userData;
    });

    await this.setState({
        programOwnerData: programOwnerDataIn,
        ready: true,
    })
 }

 getOwnerDisplayName = () => {
     if (this.state.ready)
     {
         return this.state.programOwnerData.display_name
     }

      return ""

 }

 handlePurchaseProgram = async () => {
     //handle stripe

     //handle program in backend
    try {
        const updatedProgramData = await this.LUPA_CONTROLLER_INSTANCE.purchaseProgram(this.props.lupa_data.Users.currUserData.user_uuid, this.props.programData);  
        await this.props.addProgram(updatedProgramData);
    } catch (err) {
        console.log(err)
    }

    //close modal
    this.props.closeModalMethod()
 }

 render() {
     const program = this.props.programData;
     return (
         <Modal presentationStyle="fullScreen" visible={this.props.isVisible} style={{flex: 1}} animated={true} animationType="slide">
             <View style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height / 1.8, backgroundColor: '#212121'}}>
                    
                    <Image source={{uri: program.program_image}} style={{width: '100%', height: '100%'}} resizeMode="cover" resizeMethod="resize" />
                    <FeatherIcon name="x" onPress={() => this.props.closeModalMethod()} size={25} color="#FFFFFF" style={{position: 'absolute', top: Constants.statusBarHeight, left: 0, marginLeft: 16}} />
             </View>
             <Surface style={{justifyContent: 'space-around', padding: 10, elevation: 15, borderTopLeftRadius: 25, borderTopRightRadius: 25, position: 'absolute', bottom: 0, width: Dimensions.get('window').width, height: Dimensions.get('window').height / 2.1}}>
                <View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Title style={{fontFamily: 'ARSMaquettePro-Medium', fontSize: 30}}>
                    {program.program_name}
                </Title>
                <Avatar.Text label="EH" size={30} />
                </View>


                <Headline style={{fontSize: 20}}>
     NASM Trainer (${program.program_price}/hr)
                </Headline>
                </View>

                <View style={{alignItems: 'center'}}>
                <Paragraph style={{alignSelf: 'center'}}>
             {program.program_description}
                </Paragraph>
                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap'}}>
                    {
                        program.program_tags.map((tag, index, arr) => {
                            if (index == arr.length - 1)
                            {
                                return (
                                    <Caption>
                                    {tag}
                                </Caption>
                                )
                            }
                            return (
                                <Caption>
                                    {tag},
                                </Caption>
                                
                            )
                        })
                    }
                </View>
                </View>

                <View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Caption>
                        {program.program_type}
                    </Caption>

                    <Caption style={{color: '#2196F3', fontWeight: '600'}}>
                        See other programs by {this.getOwnerDisplayName()}
                    </Caption>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Caption>
                        In Person
                    </Caption>
                    
                    <View style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                    <Caption style={{fontWeight: '600'}}>
                        {program.program_location.name } 
                    </Caption>
                    <Caption style={{fontWeight: '600'}}>
                      (  {program.program_location.address } )
                    </Caption>
                    </View>
                </View>
                </View>
                
                <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                <Button mode="outlined" style={{marginHorizontal: 10, elevation: 0, flex: 1,  height: 55, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}} theme={{
                    roundness: 10,
                    colors: {
                        primary: '#2196F3'
                    }
                }} onPress={() => this.setState({ showPreviewModal: true })}>
                    <ThinFeatherIcon
name="eye"
size={35}
color="#2196F3"
thin={true}
onPress={() => this.setState({ showPreviewModal: true })}
/>

                </Button>
                <Button mode="contained" style={{marginHorizontal: 10, elevation: 0, flex: 7, height: 55, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}} theme={{
                    roundness: 10,
                    colors: {
                        primary: '#2196F3'
                    }
                }} onPress={() => this.handlePurchaseProgram()}>
                    <Text style={{fontFamily: 'ARSMaquettePro-Medium', fontSize: 20}}>
                        Purchase
                    </Text>

                </Button>
                </View>
                
             </Surface>
                {
                    this.state.ready == true ?
                    <ModalLiveWorkoutPreview programOwnerData={this.state.programOwnerData} programData={program} isVisible={this.state.showPreviewModal} closeModalMethod={() => this.setState({ showPreviewModal: false })} />
                    :
                    null
                }

                    <ModalProfileView uuid={program.progam_owner} isVisible={this.state.showProfileModal} closeModalMethod={() => this.setState({ showPreviewModal: false })} /> 
         </Modal>
     )
 }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgramInformationPreview);