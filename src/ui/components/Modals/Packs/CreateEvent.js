import React from 'react';

import {
    ScrollView,
    Text,
    StyleSheet,
    View,
    Image,
    Modal,
    DatePickerIOS,
} from 'react-native';

import {
    Surface,
    Caption,
    IconButton,
    Button,
    Divider,
    TextInput,
    Portal,
} from 'react-native-paper';

import { FormLabel, FormInput, FormValidationMessage, Avatar } from 'react-native-elements';

import { ImagePicker } from 'expo-image-picker';

import SafeAreaView from 'react-native-safe-area-view';

import LupaController from '../../../../controller/lupa/LupaController';

export default class CreateEvent extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            eventTitle: '',
            eventDescription: '',
            eventDate: new Date(),
            packUUID: this.props.packUUID,
            eventImage: '',
        }
    }


    _chooseImageFromCameraRoll = async () => {
      packImageSource = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
        });

        if (!packImageSource.cancelled) {
            this.setState({ eventImage: packImageSource.uri });
        }
    }

    createEvent = () => {
        this.LUPA_CONTROLLER_INSTANCE.createNewPackEvent(this.state.packUUID, this.state.eventTitle, this.state.eventDescription, this.state.eventDate, this.state.eventImage);
    }

    render() {
        return (
            <Modal presentationStyle="fullScreen" style={styles.modal} visible={this.props.isOpen}>
                <SafeAreaView style={styles.safeareaview}>
                    <View style={{width: "100%", alignItems: "center", justifyContent: "center"}}>
                    <Avatar rounded showEditButton={true} size="large" />
                    </View> 

                        <View>
                            <Text style={styles.headerText}>
                                Give your event a title
                            </Text>
                        <TextInput mode="outlined" value={this.state.eventTitle} onChangeText={text => this.setState({ eventTitle: text })} placeholder="Event Title" theme={{colors: {
                            primary: "#2196F3"
                        }}}/>
                        </View>

                        <View>  
                            <Text style={styles.headerText}>
                                Give your event a description
                            </Text>
                        <TextInput mode="flat" style={{height: 100}} multiline value={this.state.eventDescription} onChangeText={text => this.setState({ eventDescription: text })} placeholder="Event Description" theme={{color: {
                            primary: "#2196F3"
                        }}}/>

                        </View>
                
                        <View>
                        <Text style={styles.headerText}>
                            What time and day will this event take place?
                        </Text>
                        <DatePickerIOS onDateChange={dateValue => this.setState({ eventDate: dateValue })} date={this.state.eventDate}/>
                        </View>

                        <View style={{flexDirection: "column" }}>
                            <Button mode="contained" theme={{roundness: 15}} color="#2196F3" onPress={this.createEvent}>
                                Create Event
                            </Button>
                            <Button mode="text" color="#2196F3" onPress={this.props.closeModalMethod}>
                                Cancel
                            </Button>
                        </View>

                </SafeAreaView>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        display: "flex",
        backgroundColor: "white",
        margin: 0,
        flex: 1,
    },
    safeareaview: {
        display: "flex",
        flexDirection: 'column',
        justifyContent: "space-evenly",
        flex: 1,
        padding: 5
    },
    headerText: {
        fontSize: 20,
        fontWeight: '400',
        color: "#BDBDBD"
    }
})