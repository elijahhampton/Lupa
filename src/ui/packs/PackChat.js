import React, { useEffect, useState } from 'react';

import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import { Appbar, Avatar , Button} from 'react-native-paper';
import { GiftedChat } from 'react-native-gifted-chat';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Fire } from '../../controller/firebase/firebase';
import { initializeNewPack } from '../../model/data_structures/packs/packs';
import LupaController from '../../controller/lupa/LupaController';
import LOG from '../../common/Logger';

function PackChat({route, navigation}) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const [packData, setPackData] = useState({members: []})
    const [packMemberData, setPackMemberData] = useState([]);
    const [componentDidErr, setComponentDidErr] = useState(false);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        async function fetchPackData() {
            const packUID = route.params.uid;
            await LUPA_CONTROLLER_INSTANCE.getPackInformationFromUUID(packUID)
            .then(packData => {
                setPackData(packData);
            })
            .catch(error => {
                alert(error)
                setComponentDidErr(true)
            })
        }

        async function fetchPackMemberData() {
            await LUPA_CONTROLLER_INSTANCE.getUserInformationFromArray(packData.members)
            .then(data => {
                setPackMemberData(data)
            })
            .catch(error => {
                alert(error)
                setPackMemberData([])
                setComponentDidErr(true)
            })
        }

        LOG('PackChat.js', 'Running useEffect');

        fetchPackData()
        fetchPackMemberData()
        setupFire()
        setReady(true);
        return () => Fire.shared.off()
    }, [])

    const setupFire = async () => {
        const packUID = route.params.uid;

         //init Fire
        await Fire.shared.init(packUID);

        await Fire.shared.on(message =>
        setMessages(messages => GiftedChat.append(messages, message))
        );  
      }

    const renderChatFooter = () => {
        return (
            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>

            </View>
        )
    }

    const renderUserAvatars = () => {
        return (
        <View style={{flexDirection: 'row', alignSelf: 'center', alignItems: 'center'}}>
            {
                packMemberData.map(user => {
                    return (
                        <Avatar.Image source={{uri: user.photo_url}} size={25} />
                    )
                })
            }
        </View>
        )
    }

    const renderComponent = () => {
        if (componentDidErr || ready == false) {
            return (
                <View style={styles.container}>
              
            </View>
            )
        } else {
            return (
            <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 0,}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Appbar.Action onPress={() => navigation.pop()} icon={() => <FeatherIcon name="arrow-left" size={20} />} />
                    {renderUserAvatars()}
                </View>
                
                <Button mode="text" color="red">
                    Leave Pack
                </Button>
            </Appbar.Header>
            <GiftedChat renderChatFooter={renderChatFooter} />
        </View>
            )
        }
    }
    return (
        <>
        {renderComponent()}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    }
})

export default PackChat;