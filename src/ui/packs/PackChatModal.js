import React from 'react';

import {
    View,
    StyleSheet,
    Button
} from 'react-native';

import { Input } from 'react-native-elements';

import { GiftedChat } from 'react-native-gifted-chat';

import { Fire } from '../../controller/firebase/firebase';

import LupaController from '../../controller/lupa/LupaController';

import { connect } from 'react-redux'

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

class PackChatModal extends React.Component{
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            packUUID: this.props.packUUID,
            userUUID: thisUserUUID,
            messages: [],
            userAvatar: '',
            userDisplayName: '',
        }
    }

    
    componentDidMount = async () => {
        await this.setupFire();
      }

      setupFire = async () => {
        await Fire.shared.init( this.props.route.params.packUUID);

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
        let pageIndex = this.state.currentIndex;
        return (
            <View style={styles.modalContainer}>
                    <GiftedChat 
                    messages={this.state.messages} 
                    onSend={Fire.shared.send} 
                    user={Fire.shared.getUser()} 
                    showAvatarForEveryMessage={true} 
                    placeholder="Send a message to your pack!" 
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

export default connect(mapStateToProps)(PackChatModal)