import React from 'react';

import {
    ScrollView,
    Text,
    StyleSheet,
    View,
    Image,
    Button as NativeButton,
    Modal,
    DatePickerIOS,
} from 'react-native';

import {
    Surface,
    Caption,
    IconButton,
    Button,
    ActivityIndicator,
    Divider,
    TextInput,
    Portal,
} from 'react-native-paper';

import DateTimePicker from '@react-native-community/datetimepicker';

import { Avatar } from 'react-native-elements';

import * as ImagePicker from 'expo-image-picker';

import SafeAreaView from 'react-native-safe-area-view';

import LupaController from '../../../controller/lupa/LupaController';

let packImageSource;

function CreatingPackEventActivityIndicator(props) {
    return (
            <Modal visible={props.isVisible} presentationStyle="overFullScreen" transparent={true} style={{backgroundColor: "rgba(133, 133, 133, 0.6)"}} >
                <View style={{flex: 1, backgroundColor: "rgba(133, 133, 133, 0.5)", alignItems: "center", justifyContent: 'center'}}>
                <ActivityIndicator animating={true} color="#2196F3" size="large" />
                </View>
            </Modal>

    )
}

export default class CreateEvent extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            eventTitle: '',
            eventDescription: '',
            packUUID: this.props.packUUID,
            eventImage: '',
            creatingPackEventDialogIsVisible: false,
            datetime: new Date(),
            isDateTimePickerVisible: false,
        }
    }

    _chooseImageFromCameraRoll = async () => {
        packImageSource = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
        });

        if (!packImageSource.cancelled) {
            console.log('and now: ' +  packImageSource.uri)
            await this.setState({ eventImage: packImageSource.uri });
        }
    }

    createEvent = async () => {
        await this.setState({ creatingPackEventDialogIsVisible: true })
        let eventUUID, eventImageURL;
        //convert date to locale string
        let datetime = await this.state.datetime.toLocaleString();
        
        //create event
        await this.LUPA_CONTROLLER_INSTANCE.createNewPackEvent(this.state.packUUID, this.state.eventTitle, this.state.eventDescription, datetime, this.state.eventImage).then(dataResults => {
            eventUUID = dataResults.data.pack_event_uuid;
            eventImageURL = dataResults.photo_url;
        })

        await this.LUPA_CONTROLLER_INSTANCE.updatePackEvent(eventUUID, "pack_event_image", eventImageURL, []);

        await this.props.refreshData();

        await this.setState({ creatingPackEventDialogIsVisible: false })
        //close modal
        await this.props.closeModalMethod();
    }

    getInitialDate = () => {
        return new Date().getDate();
    }

    handleCloseCreateEventModal = async () => {
         await this.props.refreshData();
         this.props.closeModalMethod();
    }

    showDatePicker = () => {
        this.setState({ isDateTimePickerVisible: true })
    }   

    handleConfirm = async (event, date) => {
        let updatedDate = new Date(date);
       await  this.setState({ datetime: updatedDate })
    }

    hideDatePicker = () => {
        this.setState({ isDateTimePickerVisible: false })
    }
    render() {
        return (
            <Modal presentationStyle="fullScreen" style={styles.modal} visible={this.props.isOpen}>
                <SafeAreaView style={styles.safeareaview}>
                    <View style={{width: "100%", alignItems: "center", justifyContent: "center"}}>
                    <Avatar rounded showEditButton={true} source={{ uri: this.state.eventImage }} size="large" onPress={this._chooseImageFromCameraRoll}/>
                    </View> 

                        <>
                            <Text style={styles.headerText}>
                                Give your event a title
                            </Text>
                        <TextInput underlineColor="#2196F3" selectionColor="black" textContentType="name" mode="outlined" value={this.state.eventTitle} onChangeText={text => this.setState({ eventTitle: text })} placeholder="Event Title" theme={{
                            roundness: 15,
                            colors: {
                            primary: "#2196F3"
                            },
                        }}/>
                        </>

                        <>  
                            <Text style={styles.headerText}>
                                Give your event a description
                            </Text>
                        <TextInput underlineColor="#2196F3" selectionColor="black" mode="outlined" style={{height: 100}} multiline value={this.state.eventDescription} onChangeText={text => this.setState({ eventDescription: text })} placeholder="Event Description" theme={{
                            roundness: 15,
                            colors: {
                            primary: "#2196F3",
                        }}}/>

                        </>
                
                        <>
                                <DateTimePicker
        mode="datetime"
                                value={this.state.datetime}
                                is24Hour={true}
                                display="default"
        onChange={(event, date) => this.handleConfirm(event, date)}
                        
      />
                        </>

                        <View style={{flexDirection: "row", alignSelf: 'center' }}>
                        <Button mode="text" color="#2196F3" onPress={this.handleCloseCreateEventModal}>
                                Cancel
                            </Button>
                            <Button mode="contained" theme={{roundness: 15}} color="#2196F3" onPress={() => this.createEvent()}>
                                Create Event
                            </Button>
                        </View>

                </SafeAreaView>
                <CreatingPackEventActivityIndicator isVisible={this.state.creatingPackEventDialogIsVisible}/>
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
        padding: 10,
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
        color: "#BDBDBD",
        padding: 10,
        marginLeft: 5, 
    }
})