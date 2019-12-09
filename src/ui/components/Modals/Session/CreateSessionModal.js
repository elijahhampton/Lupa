import React, { useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput,
    Image,
    Dimensions,
    ScrollView
} from 'react-native';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

import {
    IconButton,
    Button,
    Surface,
    Caption
} from 'react-native-paper';

import { BlurView } from 'expo-blur';

import { Input } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import SafeAreaView from 'react-native-safe-area-view';

import { MaterialIcons as Icon } from '@expo/vector-icons';
import LupaController from '../../../../controller/lupa/LupaController';

const days = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']

export default class CreateSessionModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        console.log(this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().photoURL)
        this.state = {
            isVisible: false,
            triggerStateChange: false,
            currIndex: 0,
        }

        this._closeModal = this._closeModal.bind(this);
        this.model = React.createRef();
    }

    _closeModal = () => {
        const ref = this.model.current;
        ref.props.isVisible = false;
        ref.props.visible = false;
        this.setState({
            triggerStateChange: !this.state.triggerStateChange
        })
    }

    render() {
        const { currIndex } = this.state;
        return (
            <Modal ref={this.model} style={styles.modalContainer} presentationStyle="fullScreen" visible={this.props.isVisible}>
                <SafeAreaView style={{ flex: 1, padding: 15 }}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <View style={{flex: 2, flexDirection: "row", alignItems: "center" , justifyContent: "space-between"}}>
                        <Surface style={{width: 100, height: 100, elevation: 1, borderRadius: 80}}>

</Surface>

<Icon name="compare-arrows" size={40} />

<Surface style={{width: 100, height: 100, elevation: 1, borderRadius: 80}}>
            <Image source={this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().photoURL} style={{borderRadius: 80}} />
</Surface>
                        </View>

                        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                            <Text style={{fontWeight: "500", color: "#E0E0E0", fontSize: 18}}>
                                Search for Lupa trainers or other users and invite them to a private workout session.
                            </Text>
                        </View>
                        
                    </View>
                    <View style={{ flex: 2, flexDirection: "row"}}>
                        <Input placeholder="Enter a username, email, or display name." 
                            placeholderTextStyle={styles.placeholderTextStyle} 
                            inputStyle={styles.inputStyle} 
                            containerStyle={{
                            height: "12%", alignItems: "center", justifyContent: "center",
                            borderBottomColor: '#E0E0E0',
                            borderLeftColor: '#E0E0E0',
                            borderRightColor: '#E0E0E0',
                            borderTopColor: '#E0E0E0',
                            borderWidth: 1
                        }} 
                        inputContainerStyle={styles.inputContainerStyle} 
                        />
                        <Button mode="text">
                            Search
                        </Button>
                    </View>

                    <View style={{alignSelf: "flex-start"}}>
                        <Caption>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 
                        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </Caption>
                        <Button mode="outlined" style={{margin: 5}} color="#2196F3">
                            Request
                        </Button>
                    </View>
                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        display: "flex",
        backgroundColor: "white",
        margin: 0,
        padding: 15,
    },
    placeholderTextStyle: {
        color: "#E0E0E0",
        fontSize: 25
    },
    inputContainerStyle: {
        borderColor: "white",
        borderWidth: 0,
    },
    inputStyle: {
        fontSize: 17,
        fontWeight: "500",
    },
    containerStyle: {

    },
});
