/* Create components for all notifications in this file */

import React, { useState } from 'react';

import {
    View,
    StyleSheet,
    Text
} from 'react-native';
import { Avatar, Caption, Button } from 'react-native-paper';

interface Notification {
    
}

export const GeneralNotificationCard = () => {
    return (
        <View>
            <Text>
                Hi
            </Text>
        </View>
    );
}

export const SessionNotificationCard = (props) => {
    return (
        <View style={{width: "100%", height: "20%", flexDirection: "column", alignItems: "center", padding: 10}}>
        
            <View style={{width: "100%", height: "75%", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}}>
            <Avatar.Text label="EH" size={35} />
            <View style={{flexDirection: "column", width: "80%"}}>
            <Text>
                {this.props.invitee} has requested a session with you.
            </Text>
            <Caption style={{flexWrap: 'wrap'}} ellipsizeMode="tail">
                {this.props.sessionDescription}
            </Caption>
            </View>

            </View>

            <View style={{flexDirection: "row", alignSelf: "flex-end"}}>
                <Button mode="text" color="rgba(33,150,243 ,1)" >
                    <Caption style={{color: "rgba(33,150,243 ,1)"}}>
                        Accept
                    </Caption>
                </Button>
                <Button mode="text" color="rgba(244,67,54 ,1)" >
                    <Caption style={{color: "rgba(244,67,54 ,1)"}}>
                        Deny
                    </Caption>
                </Button>
            </View>
        </View>
    );
}

export const PackNotificationCard = () => {
    return (
        <View>
            <Text>
                Hi
            </Text>
        </View>
    );
}