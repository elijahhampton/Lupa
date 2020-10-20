import React, { createRef, useState } from 'react';

import {
    Text,
    View,
    StyleSheet,
    Image,
    Dimensions,
    SafeAreaView,
    Modal,
    Alert,
    TouchableOpacity,
    StatusBar,
     KeyboardAvoidingView
} from 'react-native';

import {
    Surface,
    ActivityIndicator,
    Checkbox,
    Button,
    TextInput,
    Caption,
     Paragraph
} from 'react-native-paper';

import Map from '../../../images/map.png'
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LupaController from '../../../../controller/lupa/LupaController';

import Geolocation from '@react-native-community/geolocation';
import RBSheet from 'react-native-raw-bottom-sheet'
import getLocationFromCoordinates from '../../../../modules/location/mapquest/mapquest';
import { getUpdateCurrentUserAttributeActionPayload } from '../../../../controller/redux/payload_utility';

import _requestPermissionsAsync from '../../../../controller/lupa/permissions/permissions'

import { connect, useDispatch, useSelector } from 'react-redux';
import { getLupaUserStructure } from '../../../../controller/firebase/collection_structures';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { LOG_ERROR } from '../../../../common/Logger';

const OPTIONS = [
    {
        key: 0,
        optionTitle: 'User',
        optionSubtitle: 'Instantly find personal trainers for any fitness journey.'
    },
    {
        key: 1,
        optionTitle: 'Certified Trainer',
        optionSubtitle: 'Find, manage, and host training sessions with clients.  (Requires a valid NASM certification)'
    },
   /* {
        key: 2,
        optionTitle: 'I would like to learn more first',
    }*/
]
//Activity Indicator to show while fetching location data
const ActivityIndicatorModal = (props) => {
    return (
        <Modal presentationStyle="overFullScreen" style={styles.activityIndicatorModal} visible={props.isVisible}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator style={{ alignSelf: "center" }} animating={true} hidesWhenStopped={false} size='large' color="#2196F3" />
            </View>
        </Modal>
    );
}

mapStateToProps = (state, action) => {
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

const GEOLOCATION_CONFIG = {
    skipPermissionRequests: false,
    authorizationLevel: 'always',
}

function TrainerCeritifcationModal({ isVisible, closeModal }) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const [certificationNumber, setCertificationNumber] = useState("")
    const [verificationSubmitted, setVerificationSubmitted] = useState(false);

    const dispatch = useDispatch();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const handleOnSubmit = () => {
        if (certificationNumber.length === 0 || certificationNumber.length < 5) {
            alert('You must enter a valid NASM certification number!')
            return;
        }
        
        try {
            LUPA_CONTROLLER_INSTANCE.submitCertificationNumber(currUserData.user_uuid, certificationNumber);
        } catch(error) {
            LOG_ERROR('WelcomeLupaIntroduction.js', 'Caught unhandled exception in handleOnSubmit()', error);
            handleOnClose();
        }

        const payload = getUpdateCurrentUserAttributeActionPayload('isTrainer', true, []);
        dispatch({ type: "UPDATE_CURRENT_USER_ATTRIBUTE", payload: payload });
        LUPA_CONTROLLER_INSTANCE.updateCurrentUser('isTrainer', true);
        handleOnClose();
    }

    handleOnClose = () => {
        closeModal();
    }
    return (
        <Modal visible={isVisible} presentationStyle="fullScreen" animated={true} animationType="slide">
            <SafeAreaView style={{flex: 1}}>
                <KeyboardAvoidingView style={{flex: 1, justifyContent: 'space-evenly'}}>
                    <Feather1s style={{position: 'absolute', top: 0, left: 0, marginLeft: 22}} name="x" size={24} onPress={closeModal} />
                    <Image style={{width: 180, height: 180, alignSelf: 'center'}} source={require('../../../images/certificate.jpeg')} />

                    <View style={{width: Dimensions.get('window').width, padding: 20}}>
                        <View style={{width: '100%', justifyContent: 'center', alignItems: 'center',}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                            Verify your certificate
                        </Text>
                        <Paragraph style={{color: 'rgb(137, 137, 138)', textAlign: 'center', fontWeight: '600'}}>
                            After entering in your certification number it will take up 24 hours to verify your account.
                        </Paragraph>
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
    }} style={{marginVertical: 10}} mode="flat" label="Certification Number" placeholder="Please enter a valid NASM certification number." />

                    </View>

        <View style={{width: Dimensions.get('window').width - 50, alignSelf: 'center', borderRadius: 20, backgroundColor: 'rgb(245, 246, 247)', padding: 20, justifyContent: 'center', alignItems: 'flex-start'}}>
        <View style={{marginVertical: 20}}>
                        <Text style={{color: 'rgb(116, 126, 136)', fontFamily: 'Avenir-Medium', fontSize: 15, fontWeight: '800'}}>
                            Why should I verify certification?
                        </Text>
                        <Text style={{color: 'rgb(187, 194, 202)', fontFamily: 'Avenir-Medium'}}>
                            Lupa only allows certified trainers to create fitness programs and create distrituable fitness contnet.
                        </Text>
                    </View>

                    <Button onPress={handleOnSubmit} color="#1089ff" theme={{roundness: 5}} mode="contained" style={{alignSelf: 'center', height: 45, alignItems: 'center', justifyContent: 'center', width: '90%'}}>
                        Submit Verification
                    </Button>
        </View>
        </KeyboardAvoidingView>
            </SafeAreaView> 
        </Modal>

    )
}

class WelcomeLupaIntroduction extends React.Component {
    constructor(props) {
        super(props);

        this.trainerCerticationRBSheet = createRef();
        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            location: getLupaUserStructure().location,
            locationText: '',
            locationDataSet: false,
            showLoadingIndicator: false,
            userCheck: 'unchecked',
            trainerCheck: 'unchecked',
            learnCheck: 'unchecked',
            permissionsRequested: false,
            verificationModalVisible: false,
        }

        this.handleCheckOption = this.handleCheckOption.bind(this);
    }

    componentDidMount = async () => {
        await this.disableNext();
        await Geolocation.setRNConfiguration(GEOLOCATION_CONFIG);
    }

    enableNext = () => {
        this.props.setNextDisabled(false);
    }

    disableNext = () => {
        this.props.setNextDisabled(true)
    }

    setAccountType = (type) => {
        this.props.setUserAccountType(type)
    }

    myPromise = (ms, callback) => {
        return new Promise(function (resolve, reject) {
            // Set up the real work
            callback(resolve, reject);

            // Set up the timeout
            setTimeout(function () {
                reject('Promise timed out after ' + ms + ' ms');
            }, ms);
        });
    }

    handleAllowPermissionsOnPress = () => {
        _requestPermissionsAsync()
        this.setState({ permissionsRequested: true })
    }

   handleCheckOption = (id) => {
       switch(id) {
           case 0:
               if (this.state.userCheck == 'checked') {
                    this.setState({ userCheck: 'unchecked' })
               } else {
                this.setState({ userCheck: 'checked', trainerCheck: 'unchecked', learnCheck: 'unchecked' })
               }
               this.setAccountType(1)
              // this.props.setUserAccountIsSelected(true);
               break;
           case 1:
          //  this.showVerificationModal()
            this.setState({ trainerCheck: 'checked', userCheck: 'unchecked', learnCheck: 'unchecked' });
            this.setAccountType(0)
           // this.props.setUserAccountIsSelected(true);
           default:
           }
       
       }

    renderCheckBox = (index) => {
        switch(index) {
            case 0:
                return (
                    <Checkbox.IOS key={index} color="#1089ff" onPress={() => this.handleCheckOption(index)} status={this.state.userCheck} />
                )
                case 1:
                return (
                    <Checkbox.IOS key={index} color="#1089ff" onPress={() => this.handleCheckOption(index)} status={this.state.trainerCheck} />
                )
                case 1:
                return (
                    <Checkbox.IOS key={index} color="#1089ff" onPress={() => this.handleCheckOption(index)} status={this.state.learnCheck} />
                )
                    default:
        }
    }

   showVerificationModal = () => {
       this.setState({ verificationModalVisible: true })
   }

   hideVerificationModal = () => {
       this.setState({ verificationModalVisible: false })
   }
    
    render() {
        this.state.permissionsRequested == true && this.state.userCheck == 'checked' || this.state.trainerCheck == 'checked' || this.state.learnCheck == 'checked' ? this.enableNext() : this.disableNext()
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <StatusBar networkActivityIndicatorVisible={false} hidden={true} />

                <View style={{ flex: 2, justifyContent: 'center' }}>
                    <View style={{alignItems: 'flex-start', padding: 20}}>
                    <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'left', fontSize: 25, marginVertical: 10 }}>
                        Which type of account do you want to create?
                    </Text>
                    <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: '500', color: 'rgb(142, 142, 147)', marginVertical: 5 }}>
                        Select one of the options below
                    </Text>
                    </View>

                    <View style={{ height: 300, justifyContent: 'space-evenly'}}>
                        
                        {
                            OPTIONS.map((option, index, arr) => {
                                return (
                            
                                    <TouchableOpacity onPress={() => this.handleCheckOption(index)} style={{alignSelf: 'flex-start', paddingLeft: 20}}>
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={styles.optionText}>
                                      {option.optionTitle}
                                    </Text>
                                    {this.renderCheckBox(index)}
                                </View>
                                <Caption>
                                    {option.optionSubtitle}
                                </Caption>
                                </TouchableOpacity>
                             
                                )
                            })
                        }
                    </View>


                </View>
                    
                <TrainerCeritifcationModal isVisible={this.state.verificationModalVisible} closeModal={this.hideVerificationModal} />
                <ActivityIndicatorModal isVisible={this.state.showLoadingIndicator} />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: "100%",
        width: "100%",
        borderRadius: 20,
        padding: 10,
        alignItems: "center",
        justifyContent: 'center',
    },
    activityIndicatorModal: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    optionText: {
        fontSize: 15,
        width: '90%',
        fontFamily: 'Avenir-Medium'
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeLupaIntroduction);