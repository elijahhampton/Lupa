import React, { useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    Modal,
    SafeAreaView,
    KeyboardAvoidingView,
    TouchableOpacity,
} from 'react-native';
 
import {
    Headline,
    TextInput,
    Button,
    Surface,
    Paragraph,
} from 'react-native-paper';

import { Avatar, Input } from 'react-native-elements';

import FeatherIcon from 'react-native-vector-icons/Feather';
import ThinFeatherIcon from 'react-native-feather1s'

import ImagePicker from 'react-native-image-picker';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import DropDownPicker from 'react-native-dropdown-picker';

import _requestPermissionsAsync, { _checkCameraAndPhotoLibraryPermissions } from '../../../../controller/lupa/permissions/permissions';

import LupaController from '../../../../controller/lupa/LupaController';

import { getUpdateCurrentUserAttributeActionPayload } from '../../../../controller/redux/payload_utility'
import { connect, useDispatch, useSelector} from 'react-redux';

import { LOG_ERROR } from '../../../../common/Logger';
import { Constants } from 'react-native-unimodules';
import FullScreenLoadingIndicator from '../../../common/FullScreenLoadingIndicator';
import { UPDATE_CURRENT_USER_ATTRIBUTE_ACTION } from '../../../../controller/redux/actionTypes';

mapStateToProps = (state) => {
    return { 
      lupa_data: state
    }
  }
  
  mapDispatchToProps = dispatch => {
    return {
      updateCurrentUserAttribute: (payload) => {
          dispatch({
              type: "UPDATE_CURRENT_USER_ATTRIBUTE",
              payload: payload
          })
      }
    }
  }

  const certificationItems = [
    {label: 'National Association of Sports Medicine', value: 'NASM' },
    {label: 'American Council on Exercise', value: 'ACE'},
    {label: 'American College of Sports and Medicine', value: 'ACSM'},
    {label: 'National Council on Strength and Fitness', value: 'NCSF'},
]

function TrainerCertificationModal({ isVisible, closeModal }) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const [certificationNumber, setCertificationNumber] = useState("")
    const [verificationSubmitted, setVerificationSubmitted] = useState(false);
    const [certification, setCertification] = useState("");

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const handleOnSubmit = async () => {
        setIsLoading(true)
        if (certificationNumber.length === 0 || certificationNumber.length < 5) {
            setIsLoading(false);
            alert('You must enter a valid certification number!')
            return;
        }
        
        try {
            LUPA_CONTROLLER_INSTANCE.submitCertificationNumber(currUserData.user_uuid, certificationNumber);

         const payload = getUpdateCurrentUserAttributeActionPayload('isTrainer', true);
         const certificationUpdatePayload = getUpdateCurrentUserAttributeActionPayload('certification', certification);

         dispatch({type: UPDATE_CURRENT_USER_ATTRIBUTE_ACTION, payload: certificationUpdatePayload});
         dispatch({ type:  UPDATE_CURRENT_USER_ATTRIBUTE_ACTION, payload: payload });

        LUPA_CONTROLLER_INSTANCE.updateCurrentUser('certification', certification);
        LUPA_CONTROLLER_INSTANCE.updateCurrentUser('isTrainer', true);


        } catch(error) {
            LOG_ERROR('WelcomeLupaIntroduction.js', 'Caught unhandled exception in handleOnSubmit()', error);
            setIsLoading(false);
            handleOnClose();
        }

        //send email about certification
        setIsLoading(false);
        handleOnClose();
    }

    const handleOnClose = () => {
        closeModal();
    }
    
    return (
        <Modal visible={isVisible} presentationStyle="fullScreen" animated={true} animationType="slide">
            <SafeAreaView style={{flex: 1}}>
                <KeyboardAvoidingView style={{flex: 1, justifyContent: 'space-between',}}>
                   
                 <View style={{padding: 20}}>
                 <Image style={{width: 150, height: 150, alignSelf: 'center'}} source={require('../../../images/certificate.jpeg')} />

<View style={{alignItems: 'center'}}>
    <View style={{width: '100%', justifyContent: 'center', alignItems: 'center',}}>
    <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        Verify your certificate
    </Text>
    <Paragraph style={{color: 'rgb(137, 137, 138)', textAlign: 'center', fontWeight: '600'}}>
        After entering in your certification number it will take up 24 hours to verify your account.
    </Paragraph>
    </View>
                 </View>

   
 
    <TextInput
    value={certificationNumber} 
    onChangeText={text => setCertificationNumber(text)}
    keyboardAppearance="light"
    keyboardType="default"
    returnKeyLabel="done"
    returnKeyType="done"
    theme={{
        colors: {
            primary: '#1089ff'
        }
    }} style={{marginVertical: 10, fontSize: 12}} mode="flat" label="Certification Number" placeholder="Enter your certification number." />
<DropDownPicker
    items={certificationItems}
    defaultValue={certification}
    containerStyle={{height: 40}}
    style={{backgroundColor: '#fafafa'}}
    itemStyle={{
        justifyContent: 'flex-start'
    }}
    dropDownStyle={{backgroundColor: '#fafafa'}}
    onChangeItem={item => setCertification(item.value)}
/>
                    </View>

<Button onPress={handleOnSubmit} color="#1089ff" theme={{roundness: 5}} mode="contained" style={{alignSelf: 'center', height: 45, alignItems: 'center', marginVertical: 20, justifyContent: 'center', width: '90%'}}>
                        Submit Verification
                    </Button>
                  
        </KeyboardAvoidingView>
            </SafeAreaView> 
           <FullScreenLoadingIndicator isVisible={isLoading} />
        </Modal>

    )
}

class BasicInformation extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            chosenUsername: "",
            displayName: "",
            maketrainerAccount: false,
            isForwardPageChange: this.props.isForwardPageChange,
            location: '',
            locationText: 'Where are you located?',
         //   setHomeGymText: "Set a Home Gym",
            locationDataSet: false,
            showLoadingIndicator: false,
            displayNameIsInvalid: false,
            showMapView: false,
            surroundingGymLocations: [],
            firstName: '',
            lastName: '',
            gender: '',
            photoSource: '',
            showLoadingIndicator: false,
            displayNameSet: false,
            avatarSet: false,
            trainingStyles: [],
            verificationModalVisible: false,
        }
    }

    componentDidMount = async () => {
       this.setState({ verificationModalVisible: true })
       await this.disableNext();
       await _checkCameraAndPhotoLibraryPermissions()
    }

    enableNext = () => {
        this.props.setNextDisabled(false);
    }

    disableNext = () => {
        this.props.setNextDisabled(true);
    }


    _handleTrainerAccountUpdate = () => {
        this.setState({ makeTrainerAccount: !this.state.makeTrainerAccount });
        this.LUPA_CONTROLLER_INSTANCE.updateUser('isTrainer', this.state.maketrainerAccount);
    }

    _handleDisplayNameOnChangeText = text => {
        this.setState({ displayName: text })
    }

    _handleDisplayNameEndEditing = async () => {
        const display_name = await this.state.displayName.trim();
        const payload = await getUpdateCurrentUserAttributeActionPayload('display_name', display_name, []);
        await this.props.updateCurrentUserAttribute(payload);

        await this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('display_name', this.state.displayName);

        if (this.state.displayName.length >= 1)
        {
            this.setState({
                displayNameSet: true,
            })
        }

        await this.checkDisplayNameInputText();
    }

    checkDisplayNameInputText = () => {
        const currDisplayName = this.state.displayName.trim();



        this.setState({ displayNameIsInvalid: true })
    }

    _getAvatar = () => {
        let avatar = <Avatar quality={0} showEditButton rounded size={50} source={{ uri: this.state.photoSource}} onPress={this._chooseProfilePictureFromCameraRoll}/>
        return avatar;
    }

    _chooseProfilePictureFromCameraRoll = async () => {
       try {

        ImagePicker.showImagePicker({
            allowsEditing: true
        }, async (response) => {
            if (!response.didCancel)
            {
                await this.setState({ 
                    photoSource: response.uri,
                    avatarSet: true,
                });

            //Update field photo_url field
            this._handleUserPhotoUrlUpdate(response.uri);
            }
            else if (response.error)
            {
          
            }
        });

        } catch(error)
        {
         
            LOG_ERROR('BasicInformation.js', 'Unhandled exception in _chooseProfilePictureFromCameraRoll()', error);

            this.setState({
                avatarSet: false
            })
        }
    }

    _handleUserPhotoUrlUpdate = async (photoURI) => {
        try {
            let firebasePhotoURL;

            await this.LUPA_CONTROLLER_INSTANCE.saveUserProfileImage(photoURI).then(result => {
                firebasePhotoURL = result;
            });
    
            const reduxPayload = await getUpdateCurrentUserAttributeActionPayload('photo_url', firebasePhotoURL);
            await this.props.updateCurrentUserAttribute(reduxPayload);
    
            this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('photo_url', firebasePhotoURL);
        } catch(err) {
               LOG_ERROR('BasicInformation.js', 'Unhandled exception in _handleUserPhotoUrlUpdate', error);
        }

    }

    handleOnPickTrainingStyle = async (style) => {
        if (typeof(style) == 'undefined') {
            return;
        }

        let updatedTrainingStyleList = this.state.trainingStyles;
        if (updatedTrainingStyleList.includes(style)) {
            updatedTrainingStyleList.splice(updatedTrainingStyleList.indexOf(style), 1);
        } else {
            updatedTrainingStyleList.push(style);
        }

        await this.setState({ trainingStyles: updatedTrainingStyleList }, () => {
            const reduxPayload = getUpdateCurrentUserAttributeActionPayload('training_styles', this.state.trainingStyles);
            this.props.updateCurrentUserAttribute(reduxPayload)
        })

        let trainer_metadata;
        this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(this.props.lupa_data.Users.currUserData.user_uuid, 'trainer_metadata').then((data) => {
            trainer_metadata = data;
            trainer_metadata.trainer_styles = this.state.trainingStyles;
            this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('trainer_metadata', trainer_metadata);
        });
    } 


    render() {
       this.state.displayNameSet == true && this.state.displayNameIsInvalid == true && this.state.avatarSet == true && this.state.trainingStyles.length > 0 == true ? this.enableNext() : this.disableNext()
        return (
                <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
                    <View style={{ marginVertical: 20}}>
                    <View 
                        style={{
                            paddingHorizontal: 20,
                            width: '100%', 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            justifyContent: 'space-evenly'
                        }}>
                          <Avatar 
                        rounded 
                        icon={{
                            type: 'feather',
                            name: 'user',
                            size: 18
                        }} 
                        showEditButton={true} 
                        onPress={this._chooseProfilePictureFromCameraRoll} 
                        source={{ uri: this.state.photoSource }} 
                        size={60} /> 

                        <Text style={{width: '80%', paddingHorizontal: 15, fontFamily: 'Avenir-Heavy'}}>
                            Start by adding a profile picture and telling us your name.
                        </Text>
                        </View>

                        <Input 
    placeholder="What is your full name?" 
        onChangeText={text => this._handleDisplayNameOnChangeText(text)} 
        onSubmitEditing={text => this._handleDisplayNameEndEditing(text)}
        value={this.state.displayName}
        returnKeyType="done"
        editable={true}
        keyboardType="default"
        keyboardAppearance="light"
        returnKeyLabel="done"
        containerStyle={{borderRadius: 12, backgroundColor: '#EEEEEE', alignSelf: 'center', width: Dimensions.get('window').width - 20, marginVertical: 20}}
        inputContainerStyle={{borderWidth: 0, borderBottomWidth: 0}}
        inputStyle={{fontSize: 15, fontFamily: 'Avenir-Medium'}}
    />
                        </View>

                        <View style={{flex: 1,  justifyContent: 'space-evenly', alignItems: 'center'}}>
                            <Text style={{fontFamily: 'Avenir-Heavy', fontSize: 18}}>
                                Choose your desired training styles
                            </Text>

                            <TouchableOpacity onPress={() => this.handleOnPickTrainingStyle('In Home')}>
                            <View style={[styles.baseContainerStyle, this.state.trainingStyles.includes('In Home') ? styles.selectedContainerStyle : styles.unselectedContainerStyle]}>
                                <Text style={[styles.baseTextStyle, this.state.trainingStyles.includes('In Home') ? styles.selectedTextStyle : styles.unselectedTextStyle]}>
                                    In Home
                                </Text>
                                <Text style={[styles.baseSubTextStyle, this.state.trainingStyles.includes('In Home') ? styles.selectedTextStyle : styles.unselectedTextStyle]}>
                                    Host training sessions at your home.
                                </Text>
                            </View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity onPress={() => this.handleOnPickTrainingStyle('In Studio')}>
                            <View style={[styles.baseContainerStyle, this.state.trainingStyles.includes('In Studio') ? styles.selectedContainerStyle : styles.unselectedContainerStyle]}>
                            <Text style={[styles.baseTextStyle, this.state.trainingStyles.includes('In Studio') ? styles.selectedTextStyle : styles.unselectedTextStyle]}>
                                    In Studio
                                </Text>
                                <Text style={[styles.baseSubTextStyle, this.state.trainingStyles.includes('In Studio') ? styles.selectedTextStyle : styles.unselectedTextStyle]}>
                                    Host training sessions in a studio.
                                </Text>
                            </View>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={() => this.handleOnPickTrainingStyle('Virtual')}>
                            <View style={[styles.baseContainerStyle, this.state.trainingStyles.includes('Virtual') ? styles.selectedContainerStyle : styles.unselectedContainerStyle]}>
                            <Text style={[styles.baseTextStyle, this.state.trainingStyles.includes('Virtual') ? styles.selectedTextStyle : styles.unselectedTextStyle]}>
                                    Virtual
                                </Text>
                                <Text style={[styles.baseSubTextStyle, this.state.trainingStyles.includes('Virtual') ? styles.selectedTextStyle : styles.unselectedTextStyle]}>
                                    Host training sessions remotely.
                                </Text>
                            </View>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={() => this.handleOnPickTrainingStyle('Outdoor')}>
                            <View style={[styles.baseContainerStyle, this.state.trainingStyles.includes('Outdoor')  ? styles.selectedContainerStyle : styles.unselectedContainerStyle]}>
                            <Text style={[styles.baseTextStyle, this.state.trainingStyles.includes('Outdoor') ? styles.selectedTextStyle : styles.unselectedTextStyle]}>
                                    Outdoor
                                </Text>
                                <Text style={[styles.baseSubTextStyle, this.state.trainingStyles.includes('Outdoor') ? styles.selectedTextStyle : styles.unselectedTextStyle]}>
                                    Host training sessions at an outdoor venue.
                                </Text>
                            </View>
                            </TouchableOpacity>
                        </View>
                   <TrainerCertificationModal isVisible={this.state.verificationModalVisible} closeModal={() => this.setState({ verificationModalVisible: false })} />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flexFull: {
        flex: 1,
    },
    baseContainerStyle: {
        padding: 20, 
        width: Dimensions.get('window').width - 20, 
        borderWidth: 1, 
        borderColor: '#EEEEEE',
        borderRadius: 12,
    },
    selectedContainerStyle: {
        backgroundColor: '#1089ff', 
    },
    unselectedContainerStyle: {
        backgroundColor: 'white',
    },
    baseTextStyle: {
        fontFamily: 'Avenir-Heavy',
        fontSize: 15
    },
    selectedTextStyle: {
        color: 'white',
    },
    unselectedTextStyle: {
        color: 'black',
    },
    baseSubTextStyle: {
        fontFamily: 'Avenir-Medium',
        fontSize: 13
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(BasicInformation);