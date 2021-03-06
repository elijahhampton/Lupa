import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text} from 'react-native';
import { Modal } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import { getLupaUserStructurePlaceholder } from '../../../../controller/firebase/collection_structures';
import LupaController from '../../../../controller/lupa/LupaController';

function Comment({ comment }) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const [commenterData, setCommenterData] = useState(getLupaUserStructurePlaceholder);

    useEffect(() => {

        async function loadCommenterData(id) {
            await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(id).then(data => {
                setCommenterData(data);
            });
        }

        const userID = comment.user_uuid;
        loadCommenterData(userID);

    }, [])

    return (
        <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
            <Avatar.Image source={commenterData.photo_url} size={15} />
            <Text>
                {comment.comment_text}
            </Text>
        </View>
    )
}

function VlogCommentsModal({ comments }) {
    return (
        <Modal presentationStyle="fullScreen" visible={false}>
            <Appbar.Header style={{backgroundColor: 'white', elevation: 0}}>
                <Appbar.BackAction />
                <Appbar.Content title="Comments" />
            </Appbar.Header>
            <View style={{flex: 1, backgroundColor: 'white'}}>
            <ScrollView>

            </ScrollView>
            </View>
        </Modal>
    )
}

export default VlogCommentsModal;