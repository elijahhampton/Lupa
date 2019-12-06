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

const days = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']

export default class CreateSessionModal extends React.Component {
    constructor(props) {
        super(props);

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
        ref.props.isVisible=false;
        ref.props.visible = false;
        this.setState({
            triggerStateChange: !this.state.triggerStateChange
        })
    }

    render() {
        const { currIndex } = this.state;
        return (
            <Modal ref={this.model} style={styles.modalContainer} presentationStyle="fullScreen" visible={this.props.isVisible}>
                <SafeAreaView style={{flex: 1, padding: 15}}>
                <View style={{flex: 1}}>

</View>
<View style={{flex: 2, flexDirection: "row", alignItems: "center"}}>
    <Input placeholder="Search by name" placeholderTextStyle={styles.placeholderTextStyle} inputStyle={styles.inputStyle} containerStyle={{height: "12%", alignItems: "center", justifyContent: "center", 
    borderBottomColor: '#E0E0E0',
borderLeftColor: '#E0E0E0',
borderRightColor: '#E0E0E0',
borderTopColor: '#E0E0E0',
borderWidth: 1}} inputContainerStyle={styles.inputContainerStyle} />
<Button mode="text">
Search
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
        borderBottomColor: 'white',
        borderLeftColor: "white",
        borderWidth: 0,
    },
    inputStyle: {
        fontSize: 17,
        fontWeight: "500",
    },
    containerStyle: {

    },
    inputContainerStyle: {
        borderColor: 'black',
        borderWidth: 2,
        borderBottomColor: 'black',
        borderLeftColor: 'black',
        borderRightColor: 'black',
        borderTopColor: 'black'
    }
});
