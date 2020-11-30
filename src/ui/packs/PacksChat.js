import React from 'react';

import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import { Appbar } from 'react-native-paper';
import { GiftedChat } from 'react-native-gifted-chat';
import FeatherIcon from 'react-native-vector-icons/Feather';

function PacksChat(props) {
    const renderChatFooter = () => {
        return (
            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>

            </View>
        )
    }
    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Packs Chat" />
            </Appbar.Header>
            <GiftedChat renderChatFooter={renderChatFooter} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    }
})

export default PacksChat;