import React, { useEffect, useCallback, useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Appbar, Avatar , Button, Dialog, Surface, Paragraph, IconButton, Divider, Caption} from 'react-native-paper';
import { GiftedChat } from 'react-native-gifted-chat';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Fire, LUPA_DB_FIREBASE } from '../../controller/firebase/firebase';
import { initializeNewPack } from '../../model/data_structures/packs/packs';
import LupaController from '../../controller/lupa/LupaController';
import LOG from '../../common/Logger';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgramOfferInviteMessage from './component/ProgramOfferInviteMessage';

function PackChat({route, navigation}) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const [packData, setPackData] = useState({uid: 0, members: []})
    const [packMemberData, setPackMemberData] = useState([]);
    const [showUnLivePackDialog, setShowUnLivePackDialogVisible] = useState(false);
    const [componentDidErr, setComponentDidErr] = useState(false);
    const [messagesState, setMessagesState] = useState([])
    const [ready, setReady] = useState(false);

    const dbString =  `messages/${route.params.uid}`;
    const firebaseDBRef = LUPA_DB_FIREBASE.ref(dbString);

    useEffect(() => {
        async function fetchPackData() {
            const packUID = route.params.uid;
            await LUPA_CONTROLLER_INSTANCE.getPackInformationFromUUID(packUID)
            .then(packData => {
                setPackData(packData);
                console.log(packUID)
                console.log('checking!!!')
                console.log(packData)

                if (packData.members.length < 3) {
                    setShowUnLivePackDialogVisible(true);
                }
            })
            .catch(error => {

                setComponentDidErr(true)
            })
        }

        async function fetchPackMemberData() {
            await LUPA_CONTROLLER_INSTANCE.getUserInformationFromArray(packData.members)
            .then(data => {
                setPackMemberData(data)
            })
            .catch(error => {
                setPackMemberData([])
                setComponentDidErr(true)
            })
        }

        LOG('PackChat.js', 'Running useEffect::Fetching pack data, pack member data, and initializing Fire.');

        fetchPackData()
        fetchPackMemberData()
        setupFire()
        setReady(true);

        firebaseDBRef.on('child_added', (snapshot) => {

        })

        
        return () => Fire.shared.off()
    }, [route.params.uid])


    const setupFire = async () => {
        const packUID = route.params.uid;

         //init Fire
        await Fire.shared.init(packUID)
        .then(() => {

        })
        .catch(err => {
            setComponentDidErr(true)
            setReady(false)
        })

        setMessagesState([])

        await Fire.shared.on(message =>
        setMessagesState(messages => GiftedChat.append(messages, message))
        )
      }

    const renderUnLivePackDialog = () => {
        return (
            <Dialog visible={showUnLivePackDialog}>
                <Dialog.Title>
                    Waiting for invitations...
                </Dialog.Title>
                <Dialog.Content>
                    <Paragraph>
                        Once atleast three members you invited to your pack have accepted your invite your pack will go live!
                    </Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button 
                    uppercase={false}
                    theme={{roundness: 8}}
                    mode="contained"
                    color="#1089ff"
                    contentStyle={{height: 45, width: 110}}
                    style={{elevation: 0,}}
                    onPress={() => navigation.pop()}
                    >
                        Okay
                    </Button>
                </Dialog.Actions>
            </Dialog>
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

    const renderSystemMessage = (props) => {
        
        const  { extraData, timestamp} = props.currentMessage
    if (extraData.type) {
        switch (extraData.type) {
            case 'PROGRAM_OFFER_INVITE':
                return <ProgramOfferInviteMessage messageData={extraData} timeCreated={timestamp} />
        }
    }

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
                    <Appbar.BackAction onPress={() => navigation.pop()} />
               
                </View>
                
                <Button mode="text" color="red">
                    Leave Pack
                </Button>
            </Appbar.Header>
            <GiftedChat 
            renderSystemMessage={renderSystemMessage}
            messages={messagesState}
            onSend={Fire.shared.send} 
            user={Fire.shared.getUser()} 
            showAvatarForEveryMessage={true} 
            placeholder="Begin typing here" 
            renderUsernameOnMessage={true}
            showUserAvatar={true}
            alwaysShowSend={true}
            />
        </View>
            )
        }
    }
    return (
        <>
        {renderComponent()}
        {renderUnLivePackDialog()}
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

//click to share in program preview

//send system message (attach message as system)

//if is sytem message render appropriate me