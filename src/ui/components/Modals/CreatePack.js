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
    IconButton,
    Button,
    Divider,
    TextInput,
    Avatar as MaterialAvatar
} from 'react-native-paper';

import * as ImagePicker from 'expo-image-picker';

import SafeAreaView from 'react-native-safe-area-view';
import { Input, CheckBox, Avatar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Feather as FeatherIcon } from '@expo/vector-icons';

var packImageSource = undefined;

import Background from '../../images/background-one.jpg';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

import LupaController from '../../../controller/lupa/LupaController';

import Autocomplete from 'react-native-autocomplete-input'

export default class CreatePack extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            packImageSource: '',
            subscriptionBasedPack: false,
            pack_title: '',
            pack_description: '',
            invitedMembers: [],
            checked: false,
            autoCompleteData: [],
            inviteMembersTextInputVal: '',
        }

        this._chooseImageFromCameraRoll = this._chooseImageFromCameraRoll.bind(this);
    }

    createPack = async () => {
        let packLocation;
        const currUserUUID = await this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;
        const pack_leader = currUserUUID;


        await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(pack_leader, 'location').then(result => {
            packLocation = result;
        });

        this.LUPA_CONTROLLER_INSTANCE.createNewPack(pack_leader, this.state.pack_title, this.state.pack_description, packLocation, this.state.packImageSource, [pack_leader], this.state.invitedMembers, 0, 0, new Date(), this.state.subscriptionBasedPack, false);
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

    _returnTextInput = () => {
        return (
            <TextInput onChangeText={text => this.setState({ inviteMembersTextInputVal: text })} value={this.state.inviteMembersTextInputVal} mode="outlined" theme={{ roundness: 8 }} placeholder="Ex. John Smith" theme={{
                colors: {
                    primary: "#2196F3"
                }
            }} />
        )
    }

    handleInviteMembersOnChangeText = async (text) => {
        await this.setState({ inviteMembersTextInputVal: text })

        console.log('asa' + text)

        let searchQuery = await text;
        let searchQueryResults;

        await this.LUPA_CONTROLLER_INSTANCE.searchUserByPersonalName(searchQuery).then(results => {
            searchQueryResults = results;
        });

        await this.setState({ autoCompleteData: searchQueryResults });
    }

    mapInvitedMembers = () => {
        return this.state.invitedMembers.map(member => {
            return <MaterialAvatar.Image source={member.photo_url} size={20} style={{ margin: 5 }} />
        })
    }

    render() {
        return (
            <Modal presentationStyle="fullScreen" style={styles.modal} visible={this.props.isOpen}>
                <SafeAreaView style={styles.safeareaview}>
                    <FeatherIcon size={30} name="users" style={{ alignSelf: "center" }} />

                    <View style={{ flex: 1.5, flexDirection: 'column', justifyContent: "space-around" }}>
                        <View style={{ width: '100%', alignItems: "center", justifyContent: "center" }}>
                            <Avatar size="medium" rounded showEditButton={true} source={{uri: this.state.packImageSource}} onPress={this._chooseImageFromCameraRoll} />
                        </View>
                        <Input placeholder="Choose a name for your pack" inputStyle={{ fontSize: 20 }} value={this.state.pack_title} onChangeText={text => this.setState({ pack_title: text })}/>

                        <TextInput label="Write a short description for your pack" mode="flat" placeholder="Ex. Cool example of a pack description." multiline style={{ height: 100, overflow: 'hidden' }} theme={{
                            colors: {
                                primary: "#2196F3"
                            }
                        }} returnKeyType="done" returnKeyLabel="done" value={this.state.pack_description} onChangeText={text => this.setState({ pack_description: text})}/>
                    </View>

                    <Divider />

                    <View style={{ display: "flex", flex: 1.5 }}>
                        <View style={{ flex: 3, padding: 5 }}>
                            <Text style={{ fontSize: 20, color: "black", fontWeight: "400" }}>
                                Invite members to your pack
                        </Text>
                            <Autocomplete
                                data={this.state.autoCompleteData}
                                onChangeText={text => this.handleInviteMembersOnChangeText(text)}
                                renderItem={({ item, i }) => (
                                    <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => this.setState({ invitedMembers: this.state.invitedMembers.concat(item.uid) })}>
                                        <MaterialAvatar.Text label="EH" size={20} style={{ margin: 5 }} />
                                        <Text style={{ fontSize: 20, fontWeight: "300" }}>{item.display_name}</Text>
                                    </TouchableOpacity>
                                )}
                                containerStyle={{ borderColor: 'transparent' }}
                                inputContainerStyle={{ borderColor: 'transparent' }}
                                listContainerStyle={{ width: "100%", borderColor: "transparent" }}
                                listStyle={{ width: "100%", borderColor: "transparent" }}
                                renderTextInput={this._returnTextInput}
                                value={this.state.inviteMembersTextInputVal}
                            />
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} shouldRasterizeIOS={true} contentContainerStyle={{ padding: 10 }}>
                            {this.state.invitedMembers.length == 0 ? <Text style={{ fontSize: 15 }}>
                                    Members that you invite to your pack will appear here.
                            </Text> : this.mapInvitedMembers()}
                            </ScrollView>
                        </View>

                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <CheckBox
                                center
                                title='Require users to pay a monthly subscription to join my pack.'
                                iconRight
                                iconType='material'
                                checkedIcon='done'
                                uncheckedIcon='radio-button-unchecked'
                                checkedColor='green'
                                checked={this.state.subscriptionBasedPack}
                                onPress={() => this.setState({ subscriptionBasedPack: !this.state.subscriptionBasedPack })}
                            />
                        </View>
                    </View>

                    <View style={{ flex: 0.5, alignItems: "center", justifyContent: "space-around", padding: 10 }}>
                        <Caption>
                            Please take some time and read our <Caption style={{ color: "#2196F3" }}>
                                Terms of Service
                            </Caption> in regards to user packs.
                        </Caption>

                        <View style={{ flexDirection: "row" }}>

                            <Button mode="text" color="#2196F3" onPress={this.props.closeModalMethod}>
                                Cancel
                        </Button>

                            <Button mode="contained" color="#2196F3" theme={{ roundness: 15 }} onPress={this.createPack}>
                                Create Pack
                        </Button>
                        </View>
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
    sectionText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#BDBDBD",
    },
    safeareaview: {
        display: "flex",
        flex: 1,
        padding: 5
    },
    header: {
        flex: 1.5,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 15,
    }
})