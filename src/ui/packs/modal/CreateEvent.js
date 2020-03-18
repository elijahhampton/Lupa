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

let globalEventImageURL;

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
            eventDate: new Date(),
            packUUID: this.props.packUUID,
            eventImage: '',
            creatingPackEventDialogIsVisible: false,
            datetime: "When will your event take place?",
            isDateTimePickerVisible: false,
        }
    }


    _chooseImageFromCameraRoll = async () => {
        let packImageSource = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
        });

        if (!packImageSource.cancelled) {
            globalEventImageURL = packImageSource.uri;
            await this.setState({ eventImage: packImageSource.uri });
        }
    }

    _handleDateTimeChange  = (datetime) => {
        let date = new Date(datetime).toLocaleString();
        this.setState({
            eventDate: date
        })
    }

    createEvent = async () => {
        await this.setState({ creatingPackEventDialogIsVisible: false })
        let eventUUID, eventImageURL;
        //convert date to locale string
        let datetime = await this.state.eventDate.toLocaleString();
        
        //create event
        await this.LUPA_CONTROLLER_INSTANCE.createNewPackEvent(this.state.packUUID, this.state.eventTitle, this.state.eventDescription, datetime, this.state.eventImage).then(dataResults => {
            eventUUID = dataResults.data.pack_event_uuid;
            eventImageURL = dataResults.photo_url;
        })

        await this.LUPA_CONTROLLER_INSTANCE.updatePackEvent(eventImageURL, "pack_event_image", this.state.eventImage, []);

        await this.setState({ creatingPackEventDialogIsVisible: false })
        //close modal
        this.props.closeModalMethod();
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

    handleConfirm = (date) => {
        this.setState({ datetime: date })
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
                        <NativeButton title={this.state.datetime} onPress={this.showDatePicker} />
                        {
                            this.state.isDateTimePickerVisible && (
                                <DateTimePicker
        mode="datetime"
                                value={new Date()}
                                is24Hour={true}
        onChange={date => this.handleConfirm(date)}

      />
                            )
                        }
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