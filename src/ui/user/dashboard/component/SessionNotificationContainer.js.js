import React, { useState } from 'react'

import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    Animated,
} from 'react-native';

import {
    Chip,
    Caption,
    Card,
    Portal,
    Badge,
    Button,
    IconButton,
    Surface,
    Modal,
    Avatar
} from 'react-native-paper';

import { Icon } from 'react-native-elements';

import PackEventModal from '../../../packs/modal/PackEventModal';

import LupaController from '../../../../controller/lupa/LupaController';
import Feather from 'react-native-vector-icons/Feather';

export const PackEventNotificationContainer = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [packEventObject, setPackEventObject] = useState(props.packEventObject);

    return (
            <TouchableOpacity style={{flexDirection: 'column', margin: 5, alignItems: 'center', justifyContent: 'center'}} onPress={() => setShowModal(true)}>
                <Surface style={{elevation: 3, width: 50, height: 50, borderRadius: 50}}>
                    <Image source={{uri: props.packEventObject.pack_event_image}} style={{flex:1, borderRadius: 50}}/>
                </Surface>
                            <Caption>
                               {props.numAttending} attending
                            </Caption>
                            <PackEventModal isOpen={showModal} closeModalMethod={() => setShowModal(false)} packEventTime={packEventObject.pack_event_time} packEventTitle={packEventObject.pack_event_title} packEventDescription={packEventObject.pack_event_description} packEventAttendees={packEventObject.attendees} packEventDate={packEventObject.pack_event_date} packEventUUID={packEventObject.pack_event_uuid} packEventAttendees={packEventObject.attendees}/>
                    </TouchableOpacity>
    )
}

