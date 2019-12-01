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
                <BlurView intensity={100} tint="dark" style={styles.blur}>
                    <Image source={require('./images/session_one.jpg')} resizeMode={ImageResizeMode.contain} style={styles.image} />
                    <LinearGradient colors={['#181617', '#fafafa']} style={styles.gradient}>

                    </LinearGradient>
                </BlurView>
                <Surface style={styles.surface}>
                    <View style={styles.controlsAndTitle}>
                        <IconButton icon="clear" onPress={this._closeModal}/>
                        <Text style={{fontWeight: "600", alignSelf: "center"}}>
                            Create Session
                        </Text>
                        <Button color="#2196F3" mode="text">
                            Create
                        </Button>
                    </View>

                    <ScrollView contentContainerStyle={styles.sectionContainer}>
                    <View style={styles.section}>
                        <Text style={styles.sectionHeaderText}>
                                Session Name
                            </Text>
                            <Input placeholder="Enter a name for your session." 
                            placeholderTextColor="black" 
                            inputStyle={styles.inputStyle} 
                            inputContainerStyle={styles.inputContainerStyle} />
                        </View>

                        <View style={styles.section}>
                        <Text style={styles.sectionHeaderText}>
                                Purpose
                            </Text>
                            <Input placeholder="Enter the purpose of your session." 
                            placeholderTextColor="black" 
                            inputStyle={styles.inputStyle} 
                            inputContainerStyle={styles.inputContainerStyle} />
                        </View>

                        <View style={styles.section}>
                        <Text style={styles.sectionHeaderText}>
                                Invite People
                        </Text>
                        <View style={{borderRadius: 5, width: "100%", borderWidth: 1, padding: 3}}>
                            <Input inputContainerStyle={styles.inputContainerStyle} leftIcon={<Feather name="search" />} leftIconContainerStyle={{padding: 3}} />
                        </View>
                        <View>
                            <Caption>
                                You currently have no users set to invite.
                            </Caption>
                        </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={[styles.sectionHeaderText]}>
                                Session Visibility
                            </Text>
                            <View style={{alignItems: "flex-start", flexDirection: "column", justifyContent: 'space-around', padding: 3, width: "100%",}}>
                                <Text style={{fontWeight: 'bold'}}>
                                    Public
                                </Text>
                                <Caption style={{flexShrink: 1}}>
                                People that follow you will be able to see information about this session and join.
                                </Caption>
                            </View>
                            <View style={{alignItems: "flex-start", flexDirection: "column", justifyContent: 'space-around', width: "100%", padding: 3}}>
                            <Text style={{fontWeight: 'bold'}}>
                                    Private
                                </Text>
                                <Caption style={{flexShrink: 1}}>
                                 Only you and people you invite will be able to see information about this session.
                                </Caption>
                            </View>
                        </View>

                        <View style={styles.section}>
                        <Text style={styles.sectionHeaderText}>
                               Time and Date
                            </Text>
                        </View>
                    </ScrollView>
                </Surface>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        display: "flex",
        backgroundColor: "white",
        margin: 0,
        padding: 15
    },
    placeholderTextStyle: {
        color: "black",
    },
    sectionContainer: {
        flexDirection: "column",
        justifyContent: "space-around",
        flex: 1,
    },
    section: {
        flexDirection: "column",
        justifyContent: "flex-start",
        width: "100%",
    },
    controlsAndTitle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    inputContainerStyle: {
        borderBottomColor: 'white',
        borderWidth: 0,
        padding: 0,
        margin: 0,
    },
    blur: {
        ...StyleSheet.absoluteFillObject
    },
    surface: {
        position: "absolute",
        top: Dimensions.get('screen').height / 5,
        alignSelf: "center",
        elevation: 8,
        width: Dimensions.get('screen').width - 15,
        height: 500,
        padding: 10,
        borderRadius: 10
    },
    image: {
        height: "60%",
        width: "100%",
    },
    gradient: {
        height: "40%",
    },
    sectionHeaderText: {
        fontSize: 17,
        fontWeight: "500",
        color: "#E0E0E0",
    },
    inputStyle: {
        fontSize: 17,
        fontWeight: "500"
    },
    descriptionInputStyle: {
        fontSize: 15,
        fontWeight: "700"
    },
    daysStyle: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center"
    },
});
