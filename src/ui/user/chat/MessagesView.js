import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    Button,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    ScrollView
} from 'react-native';

import {
    Appbar, Divider, Avatar
} from 'react-native-paper';

import { Input } from 'react-native-elements';

import { GiftedChat } from 'react-native-gifted-chat';

import { Fire } from '../../../controller/firebase/firebase';
import { SearchBar } from 'react-native-elements';

import LupaController from '../../../controller/lupa/LupaController';

import FeatherIcon from 'react-native-vector-icons/Feather'
import { connect } from 'react-redux';
import Feather1s from 'react-native-feather1s/src/Feather1s';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}


class MessagesView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: [],
            userMessageData: [],
            currMessagesIndex: undefined,
            inboxEmpty: true,
            searchValue: "",
            viewReady: false,
            showChat: false,
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    }

    componentDidMount = async () => {
        await this.setupUserMessageData();
      }

      setupUserMessageData = async () => {
          let currUserChats, userMessageDataIn = [];
        await this.LUPA_CONTROLLER_INSTANCE.getAllCurrentUserChats().then(chats => {
            currUserChats = chats;
        });

        if (currUserChats.length >= 1)
        {
            for (let i = 0; i < currUserChats.length; ++i)
            {
                await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(currUserChats[i].user).then(userData => {
                    userMessageDataIn.push(userData);
                });
            }
        }

        if (userMessageDataIn.length >= 1)
        {
            await this.setState({ userMessageData: userMessageDataIn, inboxEmpty: false })
        }
      }

      setupFire = async () => {
        //clear messages
        await this.setState({
            messages: [],
        })
        let privateChatUUID;

        try {
                    //check for shared chat uuid between users
        await this.LUPA_CONTROLLER_INSTANCE.getPrivateChatUUID(this.props.lupa_data.Users.currUserData.user_uuid, this.state.userMessageData[this.state.currMessagesIndex].user_uuid).then(result => {
            privateChatUUID = result;
        });

        this.setState({
            viewReady: true
        })
        }
        catch(err)
        {
            
            await this.setState({
                viewReady: false,
            })
        }

        try {
                     //init Fire
        await Fire.shared.init(privateChatUUID);

        await Fire.shared.on(message =>
          this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, message),
           // viewReady: true,
          }))
        );
        } catch(err) {
            this.setState({
                viewReady: false
            })
        }
      }

      async componentWillUnmount() {
        await Fire.shared.off();
      }

      renderTextInput = () => {
          return (
              <Input editable={this.state.viewReady} />
          )
      }

      handleAvatarOnPress = async (avatarIndex) => {
        await this.setState({ showChat: true, avatarIndex: avatarIndex })
        await this.setupFire();
      }

      renderAvatarList = () => {
          if (this.state.userMessageData)
          {
              if (this.state.userMessageData.length == 0)
              {
                return;
              }
              else
              {
               return this.state.userMessageData.map((userData, index, arr) => {
                    return (
                        <TouchableOpacity style={{marginVertical: 10, alignItems: 'flex-start'}} onPress={() => this.handleAvatarOnPress(index)}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Avatar.Image source={{uri: userData.photo_url}} key={index} size={50}  style={{ elevation: 10, marginHorizontal: 20 }}  />
                            <View>
                                <Text style={{fontSize: 16, fontFamily: 'Avenir-Heavy'}}>
                                    {userData.display_name}
                                </Text>
                            </View>
                            </View>
                         
                        </TouchableOpacity>
                    )
                })
              }
          }
        
      }

    renderChatComponent = () => {
        if (this.state.showChat === true) {
            return (
                <View style={{flex: 1}}>
                {
                    this.state.showChat === false ?
                    <SearchBar
                    onStartShouldSetResponder={event => false}
                    onStartShouldSetResponderCapture={event => false}
                    placeholder="Search "
                    placeholderTextColor="rgb(199, 201, 203)"
                    value={this.state.searchValue}
                    inputStyle={styles.inputStyle}
                    platform="ios"
                    rightIconContainerStyle={{backgroundColor: 'transparent'}}
                    containerStyle={{ backgroundColor: 'white', borderColor: 'white' }}
                    inputContainerStyle={{ padding: 5, borderColor: 'white', backgroundColor: 'rgb(245, 246, 249)' }}
                    searchIcon={() => <FeatherIcon name="search" color="black" size={20} onPress={() => this.setState({ searchBarFocused: true })} />}
                    />
                    :
                    null
                }
               
                       <GiftedChat 
    messages={this.state.messages} 
    onSend={Fire.shared.send} 
    user={Fire.shared.getUser()} 
    showAvatarForEveryMessage={true} 
    placeholder="Begin typing here" 
    isTyping={true} 
    renderUsernameOnMessage={true}
    showUserAvatar={true}
    alwaysShowSend={true}
    />
    </View>
         
            )
        } else {
            return (
                <ScrollView  shouldRasterizeIOS={true} showsHorizontalScrollIndicator={false}>
                 {
                    this.state.showChat === false ?
                    <SearchBar
                    onStartShouldSetResponder={event => false}
                    onStartShouldSetResponderCapture={event => false}
                    placeholder="Search "
                    onChangeText={text => this.setState({ searchValue: text})}
                    placeholderTextColor="rgb(199, 201, 203)"
                    value={this.state.searchValue}
                    inputStyle={styles.inputStyle}
                    platform="ios"
                    rightIconContainerStyle={{backgroundColor: 'transparent'}}
                    containerStyle={{ backgroundColor: 'white', borderColor: 'white' }}
                    inputContainerStyle={{ padding: 5, borderColor: 'white', backgroundColor: 'rgb(245, 246, 249)' }}
                    searchIcon={() => <FeatherIcon name="search" color="black" size={20} onPress={() => this.setState({ searchBarFocused: true })} />}
                    />
                    :
                    null
                }
                {this.renderAvatarList()}
</ScrollView>
            )
        }
    }


    render() {
        return (
            <View style={styles.root}>
                <Appbar.Header style={{elevation: 0, alignItems: "center"}} theme={{
                    colors: {
                        primary: 'white'
                    }
                }}>
                    {
                        this.state.showChat === true ?
                        <Appbar.Action icon={() => <FeatherIcon thin={true} name="arrow-left" size={20} />} onPress={() => this.setState({ showChat: false })} />
                        :
                        null
                    }
                    
                    <Appbar.Content title="Messages" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 25}} />
                    <Appbar.Action onPress={() => {}} icon="delete" disabled={!this.state.showChat === true}  color={!this.state.viewReady ? "black" : "grey"} />

                </Appbar.Header>
                <View style={{flex: 1, backgroundColor: 'white'}}>
                {this.renderChatComponent()}

</View>
<Divider />

                    <SafeAreaView />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    inputStyle: {
        fontSize: 15, fontFamily: 'Avenir-Medium'
      },
})

export default connect(mapStateToProps)(MessagesView);