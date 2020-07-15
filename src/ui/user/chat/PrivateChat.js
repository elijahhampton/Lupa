import React from 'react';

import {
    View,
    StyleSheet,
    Button
} from 'react-native';

import { Input } from 'react-native-elements';

import { GiftedChat } from 'react-native-gifted-chat';

import { Fire } from '../../../controller/firebase/firebase';

import LupaController from '../../../controller/lupa/LupaController';


export default class PrivateChat extends React.Component{
    constructor(props) {
        super(props);


        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        const thisUserUUID = this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;

        this.state = {
            messages: [],
            userAvatar: '',
            userDisplayName: '',
        }
    }

    
    componentDidMount = async () => {
        await this.setupFire();
      }

      setupFire = async () => {
        let privateChatUUID;

        //check for shared chat uuid between users
        await this.LUPA_CONTROLLER_INSTANCE.getPrivateChatUUID( this.props.route.params.currUserUUID,  this.props.route.params.otherUserUUID).then(result => {
            privateChatUUID = result;
        })

         //init Fire
        await Fire.shared.init(privateChatUUID);

        await Fire.shared.on(message =>
          this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, message),
          }))
        );
      }

      componentWillUnmount() {
        Fire.shared.off();
      }

      renderTextInput = () => {
          return (
              <Input />
          )
      }


    render() {
        return (
            <View style={styles.modalContainer}>
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
                    <View style={{marginBottom: 5}}>
                    <Button title="Close" onPress={() => this.props.navigation.goBack()} />
                    </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: "#FAFAFA",
        flex: 1,
        margin: 0,
    },
});