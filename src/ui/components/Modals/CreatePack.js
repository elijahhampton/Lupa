import React from 'react';

import {
    ScrollView,
    Text,
    StyleSheet,
    Modal,
    View,
    Image
} from 'react-native';

import {
    Surface, 
    Caption, 
    IconButton
} from 'react-native-paper';

import { ImagePicker } from 'expo-image-picker';

import SafeAreaView from 'react-native-safe-area-view';
import { Input } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

var packImageSource = undefined;

import Background from '../../images/background-one.jpg';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

export default class CreatePack extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            packImageSource: Background,
            visible: true
        }

        this._chooseImageFromCameraRoll = this._chooseImageFromCameraRoll.bind(this);
        this._closeModal = this._closeModal.bind(this);
    }

    _closeModal = () => {
        this.setState({
            visible: false
        })
    }

    _chooseImageFromCameraRoll = async () => {
        packImageSource = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
        });

        if (!packImageSource.cancelled) {
            this.setState({ packImageSource: packImageSource.uri });
        }
    }

    render() {
        return (
            <Modal presentationStyle="fullScreen" style={styles.modal} visible={false}>
                <SafeAreaView style={styles.safeareaview}>
                    <ScrollView>
                        <View style={styles.header}>
                        <Text style={[styles.sectionText, {fontSize: 25}]}>
                            Create new pack
                        </Text>
                        <IconButton icon="clear" onPress={() => this._closeModal} />
                        </View>

                        <View style={[styles.packImage, styles.spaceAround]}>
                            <Surface style={{ borderRadius: 15, width: 280, height: 150, elevation: 8 }}>
                            <TouchableOpacity style={{borderRadius: 15, width: 280, height: 150, elevation: 8}} onPress={this._chooseImageFromCameraRoll}>
                                <Image source={this.state.packImageSource} style={styles.image} resizeMode={ImageResizeMode.cover} resizeMethod="auto" />
                                </TouchableOpacity>
                            </Surface>
                        </View>

                        <View style={[styles.spaceAround, styles.packName]}>
                            <Text style={styles.sectionText}>
                                Pack Name
                    </Text>
                            <View style={styles.packNameInput}>
                            <Input containerStyle={styles.containerStyle} 
                                inputStyle={styles.inputStyle} 
                                inputContainerStyle={styles.inputContainerStyle} 
                                placeholder="Enter a name for your pack" 
                                placeholderTextColor="rgba(189,189,189 ,1)" />
                            </View>
                        </View>

                        <View style={[styles.spaceAround, styles.packMemberInvites]}>
                            <Text style={styles.sectionText}>
                                Invite Members
                    </Text>
                            <View style={styles.packNameInput}>
                                <Input containerStyle={styles.containerStyle} 
                                inputStyle={styles.inputStyle} 
                                inputContainerStyle={styles.inputContainerStyle} 
                                placeholder="Invite members to your pack" 
                                placeholderTextColor="rgba(189,189,189 ,1)" />
                            </View>
                            <View style={styles.membersInvited}>

                            </View>
                        </View>

                        <View style={styles.packPreferencesContainer}>
                            <Text style={styles.sectionText}>
                                Pack Preferences
                    </Text>
                            <View style={styles.packPreferences}>
                                <View style={styles.preference}>
                                    <Text>
                                        Private
                                    </Text>
                                    <Caption>
                                        Only people that you will follow will be able to see this pack.
                                    </Caption>
                                </View>

                                <View style={styles.preference}>
                                    <Text>
                                        Public
                                    </Text>
                                    <Caption>
                                        This pack will be visible in all common areas. (i.e. Explore Page, Lupa Database)
                                    </Caption>
                                </View>

                                <View style={styles.preference}>
                                    <Text>
                                        Free
                                    </Text>
                                    <Caption>
                                        Your pack will remain free and members will not need to pay a subcription fee to participate.
                                    </Caption>
                                </View>

                                <View style={styles.preference}>
                                    <Text>
                                        Subscription Based
                                    </Text>
                                    <Caption>
                                        In order to participate in this pack members will need to pay a subscription fee.
                                    </Caption>
                                </View>
                            </View>
                        </View>

                    </ScrollView>
                </SafeAreaView>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        display: "flex",
        backgroundColor: "#FAFAFA",
        margin: 0,
    },
    safeareaview: {
        flex: 1,
        flexDirection: "column",
        padding: 10,
    },
    packImage: {
        flex: 2,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    packName: {
        flex: 1,
        padding: 10,
    },
    packNameInput: {
        width: "100%",
        borderRadius: 10,
        borderWidth: 1,
    },
    packPreferencesContainer: {
        width: "100%",
        height: "auto",
        padding: 10,
    },
    packPreferences: {
        flexDirection: "row",
        flexWrap: 'wrap',
        justifyContent: "space-evenly"
    },
    preference: {
        width: "45%",
        height: 105,
        borderRadius: 20,
        borderWidth: 1,
        margin: 5,
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        padding: 5,
    },
    packMemberInvites: {
        width: "100%",
        padding: 10,
        height: "auto",
    },
    membersInvited: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: 'wrap',
    },
    sectionText: {
        fontSize: 20,
        fontWeight: "700",
        color: 'rgba(33,33,33 ,1)',
    },
    spaceAround: {
        justifyContent: "space-around",
        flexDirection: "column"
    },
    inputContainerStyle: {
        borderBottomColor: "#fafafa",
    },
    inputStyle: {

    },
    contaienrStyle: {
        
    },
    header: {
        width: "100%",
        height: "auto",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 15,
    }
})