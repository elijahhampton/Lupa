import React, { useState } from 'react';

import {
    Text,
    View,
    StyleSheet,
    Image,
    Dimensions,
    SafeAreaView,
    Modal,
    TouchableOpacity,
    StatusBar,
    TextInput,
} from 'react-native';

import {
    Surface,
    ActivityIndicator,
    Checkbox,
    Button,
} from 'react-native-paper';

import Map from '../../../images/map.png'
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LupaController from '../../../../controller/lupa/LupaController';

import Geolocation from '@react-native-community/geolocation';

import getLocationFromCoordinates from '../../../../modules/location/mapquest/mapquest';
import { getUpdateCurrentUserAttributeActionPayload } from '../../../../controller/redux/payload_utility';

import _requestPermissionsAsync from '../../../../controller/lupa/permissions/permissions'

import { connect } from 'react-redux';
import { getLupaUserStructure } from '../../../../controller/firebase/collection_structures';
const OPTIONS = [
    {
        key: 0,
        optionTitle: 'User (Find personalized workout programs from local trainers)',
    },
    {
        key: 1,
        optionTitle: 'Certified Trainer (Create and sell workout programs)',
    },
    {
        key: 2,
        optionTitle: 'I would like to learn more first',
    }
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

class WelcomeLupaIntroduction extends React.Component {
    constructor(props) {
        super(props);

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
               break;
           case 1:
            if (this.state.trainerCheck == 'checked') {
                this.setState({ trainerCheck: 'unchecked' })
           } else {
            this.setState({ trainerCheck: 'checked', userCheck: 'unchecked', learnCheck: 'unchecked' })
           }
               break;
           case 2:
            if (this.state.learnCheck == 'checked') {
                this.setState({ learnCheck: 'unchecked' })
           } else {
            this.setState({ learnCheck: 'checked', trainerCheck: 'unchecked', userCheck: 'unchecked' })
           }
               break;
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
    
    render() {
        this.state.permissionsRequested == true && this.state.userCheck == 'checked' || this.state.trainerCheck == 'checked' || this.state.learnCheck == 'checked' ? this.enableNext() : this.disableNext()
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <StatusBar networkActivityIndicatorVisible={false} hidden={true} />

                <View style={{ flex: 2, justifyContent: 'center' }}>
                    <View style={{alignItems: 'flex-start', padding: 20}}>
                    <Text style={{ fontFamily: 'avenir-roman', textAlign: 'left', fontSize: 25, fontWeight: '500', marginVertical: 10 }}>
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
                                    <>
                                    <TouchableOpacity onPress={() => this.handleCheckOption(index)} style={{alignSelf: 'flex-start', paddingLeft: 20}}>
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={styles.optionText}>
                                      {option.optionTitle}
                                    </Text>
                                    {this.renderCheckBox(index)}
                                </View>
                                </TouchableOpacity>

                                {this.state.trainerCheck === 'checked' && option.key === 1 ?
                                 <View style={{height: 'auto', paddingLeft: 25}}>
                                    <TextInput returnKeyType="done" returnKeyLabel="done" enablesReturnKeyAutomatically={true} placeholderTextColor="#1089ff" placeholder='Enter your certification number here.' />
                                </View>
                                :
                                null
                                }
                                </>
                                )
                            })
                        }
                    </View>


                </View>
                
                <View style={{flex: 0.3}}>
                <TouchableOpacity style={{alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width}}  onPress={this.handleAllowPermissionsOnPress}>

<LinearGradient
// Button Linear Gradient
colors={['#8ac5ff', '#1089ff', '#589ee8']}
start={{ x: 0, y: 1 }} 
end={{ x: 1, y: 1 }}
style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 25, width: '80%', height: 55}}
>
    <Text style={{color: '#FFFFFF', fontSize: 20, }}>
        Allow Permissions
        </Text>

</LinearGradient>
</TouchableOpacity >
                </View>

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
        width: '90%'
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeLupaIntroduction);