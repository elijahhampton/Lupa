import React from 'react';

import {
    ScrollView,
    Text,
    StyleSheet,
    Dimensions,
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

import Carousel from 'react-native-snap-carousel';

import UserDisplayCard from './PackModal/Components/UserDisplayCard';

const data = [
    {
        key: 'community',
        pack_type: 'Community',
        description: 'Community packs allow any users to join as long as they receive an invitation.  There are no limitations to the amount of users that can join a community pack.',
    },
    {
        key: 'active',
        pack_type: 'Active',
        description: 'Active packs are focused on group engagement and therefore only four members can join an active pack.',
    },
]

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
            currIndex: 0,
            searchResults: [],
            currentCarouselIndex: 0,

        }

        this._chooseImageFromCameraRoll = this._chooseImageFromCameraRoll.bind(this);
    }

    getPackType = (index) => {
        switch(index) {
            case 0:
                return 'Community'
            case 1:
                return 'Activity'
            default:
                return 'Community'
        }
    }

    createPack = async () => {
        let packLocation;
        const currUserUUID = await this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;
        const pack_leader = currUserUUID;


        await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(pack_leader, 'location').then(result => {
            packLocation = result;
        });

        this.LUPA_CONTROLLER_INSTANCE.createNewPack(pack_leader, this.state.pack_title, this.state.pack_description, packLocation, this.state.packImageSource, [pack_leader], this.state.invitedMembers, 0, 0, new Date(), this.state.subscriptionBasedPack, false, this.getPackType(this.state.currentCarouselIndex), this.state.packImageSource);
    }

    _chooseImageFromCameraRoll = async () => {
        packImageSource = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
        });

        if (!packImageSource.cancelled) {
            await this.setState({ packImageSource: packImageSource.uri });
        }

        
    }

    _returnTextInput = () => {
        return (
            <TextInput onChangeText={text => this.handleInviteMembersOnChangeText(text)} value={this.state.inviteMembersTextInputVal} mode="outlined" theme={{ roundness: 8 }} placeholder="Ex. John Smith" theme={{
                colors: {
                    primary: "#2196F3"
                }
            }} />
        )
    }

    handleInviteMembersOnChangeText = async (text) => {
        await this.setState({ inviteMembersTextInputVal: text })
        let searchQuery = await text;
        let searchQueryResults;

        await this.LUPA_CONTROLLER_INSTANCE.search(searchQuery).then(results => {
            searchQueryResults = results;
        });
        await this.setState({ searchResults: searchQueryResults });
    }
    
    mapSearchResults =() => {
        return this.state.searchResults.map(user => {
                return (
                    <TouchableOpacity onPress={() => this.handleInviteMember(user.user_uuid)}>
                                            <UserDisplayCard userUUID={user.user_uuid} size={45}/>
                    </TouchableOpacity>
                )
        })
    }

    mapInvitedMembers = () => {
        return this.state.invitedMembers.map(user => {
            return (
                <TouchableOpacity onPress={() => this.handleInviteMember(user.user_uuid)}>
                      <UserDisplayCard userUUID={user.user_uuid} size={25} optionalStyling={{}} />
                </TouchableOpacity>
            )
        })
    }

    handleInviteMember = (userID) => {
        let updatedMembers;
        updatedMembers = this.state.invitedMembers;
        if (this.state.invitedMembers.includes(userID))
        {
            updatedMembers = updatedMembers.splice(this.state.invitedMembers.indexOf(userID, 1));
            this.setState({ invitedMembers: updatedMembers })
        }
        else
        {
            updatedMembers.push(userID);
            this.setState({ invitedMembers: updatedMembers});
        }
    }

    _renderItem = ({item, index}) => {
        return (
                            <Surface style={{padding: 15, backgroundColor: "white", alignItems: 'center', justifyContent: 'center', height: 260, width: 190, borderRadius: 15, elevation: 6, margin: 20, shadowColor: '#2196F3', shadowRadius: 10}}>
                <Text style={{fontWeight: '600', fontSize: 25, margin: 5}}>
                    {item.pack_type}
                </Text>

                <Text style={{fontSize: 15, fontWeight: '200'}}>
                    {item.description}
                </Text>
            </Surface>
        )
    }

    _renderButtons = (index) => {
        return this.state.currIndex == 0 ?

        
<View style={{alignItems: "center", justifyContent: "space-around", padding: 10 }}>
                        <Caption>
                            Please take some time and read our <Caption style={{ color: "#2196F3" }}>
                                Terms of Service
                            </Caption> in regards to user packs.
                        </Caption>

                        <View style={{ flexDirection: "row" }}>

                            <Button mode="text" color="#2196F3" onPress={this.props.closeModalMethod}>
                                Cancel
                        </Button>

                            <Button mode="text" color="#2196F3" theme={{ roundness: 15 }} onPress={() => this.setState({ currIndex: 1})}>
                                Invite Members
                        </Button>
                        </View>
                    </View>

        :

        
<View style={{alignItems: "center", justifyContent: "space-around", padding: 10 }}>
                        <Caption>
                            Please take some time and read our <Caption style={{ color: "#2196F3" }}>
                                Terms of Service
                            </Caption> in regards to user packs.
                        </Caption>

                        <View style={{ flexDirection: "row" }}>

                            <Button mode="text" color="#2196F3" onPress={() => this.setState({ currIndex: 0})}>
                                Back
                        </Button>

                            <Button mode="contained" color="#2196F3" theme={{ roundness: 15 }} onPress={this.createPack}>
                                Create Pack
                        </Button>
                        </View>
                    </View>

    }

    _renderView = (index) => {
        return this.state.currIndex == 0 ? 

                        <ScrollView shouldRasterizeIOS={true} showsVerticalScrollIndicator={false} contentContainerStyle={{flexDirection: 'column', flexGrow: 2, justifyContent: 'space-around'}}>
                    <View style={{ flexDirection: 'column', justifyContent: "space-around", flexGrow: 2,  }}>
                        <View style={{ width: '100%', alignItems: "center", justifyContent: "center" }}>
                            <Avatar size="large" rounded showEditButton={true} source={{uri: this.state.packImageSource}} onPress={this._chooseImageFromCameraRoll} />
                        </View>
                        <Input placeholder="Choose a name for your pack" style={{alignSelf: 'center'}} inputContainerStyle={{borderBottomWidth: 0, alignSelf: 'center'}} inputStyle={{ fontSize: 25 }} value={this.state.pack_title} onChangeText={text => this.setState({ pack_title: text })}/>

                        <TextInput label="Write a short description for your pack" mode="outlined" placeholder="Ex. Cool example of a pack description." multiline style={{ height: 100, overflow: 'hidden' }} theme={{
                            colors: {
                                primary: "#2196F3"
                            }
                        }} returnKeyType="done" returnKeyLabel="done" value={this.state.pack_description} onChangeText={text => this.setState({ pack_description: text})}/>
                    </View>
                    
                    <View>
                    <Carousel 
                    ref={(c) => {this._carousel = c; }}
                    data={data}
                    renderItem={this._renderItem}
                    sliderWidth={Dimensions.get('screen').width}
                    itemWidth={190}
                    onSnapToItem={index => this.setState({ currentCarouselIndex: index})}
                    />
                    </View>

                    <View>
                   {/* <CheckBox
                                center
                                title='Require users to pay a monthly subscription to join my pack.'
                                iconRight
                                iconType='material'
                                checkedIcon='done'
                                uncheckedIcon='radio-button-unchecked'
                                checkedColor='green'
                                checked={this.state.subscriptionBasedPack}
                                onPress={() => this.setState({ subscriptionBasedPack: !this.state.subscriptionBasedPack })}
                   /> */}
                    </View>
                    </ScrollView>

                    :

                    <View style={{flexDirection: 'column', justifyContent: 'space-around', flex: 1}}>
                        <View>
                        <Text style={{fontSize: 30, fontWeight: '100', margin: 5}}>
                            Start by typing a user's name, username, or email.  Press the user's avatar to send a pack invite.
                        </Text>

                        <View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {this.mapInvitedMembers()}
                            </ScrollView>
                        </View>
                        {
                            this._returnTextInput()
                        }
                        </View>


                        <ScrollView contentContainerStyle={{padding: 10, flexDirection: 'row', justifyContent: 'space-evenly', flexDirection: 'wrap'}}>
                            {
                                this.mapSearchResults()
                            }
                        </ScrollView>
                    </View>
    }

    render() {
        return (
            <Modal presentationStyle="fullScreen" style={styles.modal} visible={this.props.isOpen}>
                <SafeAreaView style={styles.safeareaview}>
                    {
                   
                        this._renderView(this.state.currIndex)
                    }
                    {
                        this._renderButtons(this.state.currIndex)
                    }
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