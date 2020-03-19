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
    Button,
    Provider,
    Colors,
    Portal,
    Modal as PaperModal,
    TextInput,
    Avatar as MaterialAvatar,
    ActivityIndicator
} from 'react-native-paper';

import * as ImagePicker from 'expo-image-picker';

import SafeAreaView from 'react-native-safe-area-view';
import { Input, CheckBox, Avatar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

var packImageSource = undefined;

import Color from '../../common/Color'

import LupaController from '../../../controller/lupa/LupaController';

import Carousel from 'react-native-snap-carousel';

import UserDisplayCard from '../component/UserDisplayCard';

import { connect } from 'react-redux';
import { StyleProvider } from 'native-base';

const data = [
    {
        key: 'Community',
        pack_type: 'Community',
        description: 'Community packs allow any users to join as long as they receive an invitation.  There are no limitations to the amount of users that can join a community pack.',
    },
    {
        key: 'Active',
        pack_type: 'Active',
        description: 'Active packs are focused on group engagement and therefore only four members can join an active pack.',
    },
]

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addCurrentUserIntoPack: (packData)  => {
            dispatch({
                type: "ADD_CURRENT_USER_PACK",
                payload: packData,
            })
        }
}
}

function CreatingPackActivityIndicator(props) {
    return (
            <Modal visible={props.isVisible} presentationStyle="overFullScreen" transparent={true} style={{backgroundColor: "rgba(133, 133, 133, 0.6)"}} >
                <View style={{flex: 1, backgroundColor: "rgba(133, 133, 133, 0.5)", alignItems: "center", justifyContent: 'center'}}>
                <ActivityIndicator animating={true} color="#2196F3" size="large" />
                </View>
            </Modal>

    )
}

class CreatePack extends React.Component {
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
            packType: "Community",
            searchQuery: "",
            creatingPackDialogIsVisible: false,
        }
    }

    isSelectedStyle = (key, item) => {

        if(key == "Community" && item == key)
        {
            return {
                 elevation: 6, shadowColor: '#2196F3', shadowRadius: 10, backgroundColor: "white"

            }
        }
        else if (key == "Active" && item == key)
        {
            return {
                elevation: 6, shadowColor: '#2196F3', shadowRadius: 10, backgroundColor: "white"
           }
        }
        else
        {
            return {}
        }
    }

    handleOnPressPackType = (key) => {
        this.setState({ packType: key })
    }

    createPack = async () => {
        await this.setState({ creatingPackDialogIsVisible: true });
        let packLocation, packUUID, pack_image;
        const currUserUUID = await this.props.lupa_data.Users.currUserData.user_uuid;

        await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(currUserUUID, 'location').then(result => {
            packLocation = result;
        });

        //Wait for the pack to be create before we return back to the main page
       await this.LUPA_CONTROLLER_INSTANCE.createNewPack(currUserUUID, this.state.pack_title, this.state.pack_description, packLocation, this.state.packImageSource, [currUserUUID], this.state.invitedMembers, 0, 0, new Date(), this.state.subscriptionBasedPack, false, this.state.packType, this.state.packImageSource).then(packData => {
        this.props.addCurrentUserIntoPack(packData.data);
        packUUID = packData.data.pack_uuid;
        pack_image = packData.photo_url;
       })

       await this.LUPA_CONTROLLER_INSTANCE.updatePack(packUUID, "pack_image", pack_image);
       await this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('packs', [packUUID], 'add');

       await this.setState({ creatingPackDialogIsVisible: false })
        //Close modal
       this.closeModal()
    }

    resetState = () => {

    }

    closeModal = () => {
        this.props.closeModalMethod();
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
            <TextInput onChangeText={text => this.handleInviteMembersOnChangeText(text)} value={this.state.searchValue} mode="outlined" theme={{ roundness: 8 }} placeholder="Ex. John Smith" theme={{
                colors: {
                    primary: "#2196F3"
                }
            }} />
        )
    }

    handleInviteMembersOnChangeText = async (searchQuery) => {
        let searchResultsIn;
        
        //If no search query then set state and return 
        if (searchQuery == "" || searchQuery == '')
        {
            await this.setState({
                searchValue: "",
                searchResults: []
            });

            return;
        }

        await this.setState({
            searchResults: []
        })

        await this.setState({
            searchValue: searchQuery
        })

        await this.LUPA_CONTROLLER_INSTANCE.search(searchQuery).then(searchData => {
            searchResultsIn = searchData;
        })

        await this.setState({ searchResults: searchResultsIn })
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

    handleInviteMember = async (userID) => {
        let updatedMembers = this.state.invitedMembers;
        if (this.state.invitedMembers.includes(userID))
        {
            console.log('removing member')
            await updatedMembers.splice(this.state.invitedMembers.indexOf(userID), 1);
            await this.setState({ invitedMembers: updatedMembers })
            console.log(this.state.invitedMembers.length)
        }
        else
        {
            console.log('adding member')
            await updatedMembers.push(userID);
            await this.setState({ invitedMembers: updatedMembers});
            console.log(this.state.invitedMembers.length)
        }
    }

    _renderItem = ({item, index}) => {
        return (
                            <Surface style={{padding: 15, backgroundColor: "white", alignItems: 'center', justifyContent: 'center', height: 260, width: 190, borderRadius: 15, elevation: 6, margin: 20, shadowColor: '#2196F3', shadowRadius: 10}}>
                <Text style={{fontWeight: "600", fontSize: 25, margin: 5}}>
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

                            <Button mode="text" color="#2196F3" onPress={() => this.setState({ currIndex: 0 })}>
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
                    
                    <View style={{alignItems: "center", flexDirection: 'height', width: Dimensions.get('screen').width}}>
                        {
                            data.map(item => {
                                return (
                                    <TouchableOpacity onPress={() => this.handleOnPressPackType(item.key)}>
                                                                            <Surface key={item.key} style={[{padding: 15, backgroundColor: "#F5F5F5", alignItems: 'center', justifyContent: 'center', height: "auto", width: Dimensions.get('screen').width / 1.1, borderRadius: 15, elevation: 0, margin: 12}, this.isSelectedStyle(this.state.packType, item.key)]}>
                                    <Text style={{alignSelf: "flex-start", fontWeight: "600", fontSize: 15, margin: 5}}>
                                        {item.pack_type}
                                    </Text>
                    
                                    <Text style={{alignSelf: "flex-start", fontSize: 15, fontWeight: '200'}}>
                                        {item.description}
                                    </Text>
                                </Surface>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                    </ScrollView>

                    :

                    <View style={{flexDirection: 'column', justifyContent: 'space-around', flex: 1}}>
                        <View>
                        <Text style={{fontSize: 30, fontWeight: '100', margin: 5}}>
                            Establish your pack members
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
            <Modal presentationStyle="fullScreen" style={styles.modal} visible={this.props.isOpen} onDismiss={() => this.props.closeModalMethod()}>
                <SafeAreaView style={styles.safeareaview}>
                    {
                   
                        this._renderView(this.state.currIndex)
                    }
                    {
                        this._renderButtons(this.state.currIndex)
                    }

                </SafeAreaView>
                <CreatingPackActivityIndicator isVisible={this.state.creatingPackDialogIsVisible}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreatePack);