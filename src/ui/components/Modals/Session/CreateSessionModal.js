import React, { useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Modal,
    Image,
    Dimensions,
    ScrollView,
    DatePickerIOS
} from 'react-native';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

import {
    IconButton,
    Button,
    Surface,
    Caption,
    TextInput
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

        this.state = {
            isVisible: false,
            triggerStateChange: false,
            currIndex: 0,
            date: new Date(),
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

    _handleNewSessionRequest = () => {
        
    }

    render() {
        const { currIndex } = this.state;
        return (
            <Modal ref={this.model} style={styles.modalContainer} presentationStyle="fullScreen" visible={this.props.isVisible}>
                <SafeAreaView style={{ flex: 1, padding: 8 }}>
                    <View style={{ height: "20%", justifyContent: "center", alignItems: "center", }}>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                            <Surface style={{ width: 70, height: 70, elevation: 10, borderRadius: 80, margin: 10 }}>

                            </Surface>

                            <Icon name="compare-arrows" size={40} />

                            <Surface style={{ width: 70, height: 70, elevation: 10, borderRadius: 80, margin: 10, }}>
                                <Image source={this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().photoURL} style={{ borderRadius: 80 }} />
                            </Surface>
                        </View>

                        <View style={{padding: 5, flexDirection: "row", justifyContent: "center", flexWrap: 'wrap', alignSelf: "center" }}>
                            <Text style={{ fontWeight: "500", color: "#9E9E9E", fontSize: 18 }}>
                                You are about to request a session with {" "}
                            </Text>
                            <Text style={{ fontWeight: "bold", color: "#9E9E9E", fontSize: 18 }}>
                                Elijah Hampton
                            </Text>
                        </View>
                    </View>

                    <View style={{height: "60%"}}>

<View style={{height: "100%", flexDirection: "column"}}>

<TextInput mode="outlined" label="Session Title" placeholder="Give your session a name" style={{margin: 10}} 
theme={{
    colors: {
        primary: '#2196F3'
    }
}}>

</TextInput>

<TextInput mode="outlined" label="Session Description" placeholder="Write a short description for your session" multiline={true} style={{margin: 10, height: "20%"}} theme={{
    colors: {
        primary: '#2196F3'
    }
}}>

</TextInput>

<DatePickerIOS date={this.state.date}/>
</View>

</View>

<View style={{height: "20%", alignSelf: "flex-start"}}>
                        <Caption>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 
                        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </Caption>
                        <Button mode="outlined" style={{margin: 5}} color="#2196F3" onPress={() => this._handleNewSessionRequest}>
                            Request
                        </Button>
                        <Button mode="outlined" style={{margin: 5}} color="red" onPress={() => this._closeModal}>
                            Cancel
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
