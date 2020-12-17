import React, { useState, useEffect } from 'react';

import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';

import {
    Surface,
    Chip,
    Avatar
} from 'react-native-paper';

import LupaController from '../../../controller/lupa/LupaController';

import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { getLupaStoreState } from '../../../controller/redux';
import { verifyAuth } from '../../../controller/lupa/auth/auth';

function UserSearchResultCard(props) {
    const navigation = useNavigation()

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

   const _handleViewProfile = () => {
        const LUPA_STATE = getLupaStoreState();

        if (LUPA_STATE.Auth.isAuthenticated == false) {
            navigation.navigate('SignUp');
        } else {
            navigation.navigate('Profile', {
                userUUID: props.user.user_uuid,
                navFrom: 'SearchView',
            });
        }
    }

    const renderUserAvatar = () => {
            try {
                return <Avatar.Image source={{uri: props.user.photo_url }} size={45} style={{margin: 8}} />
            } catch(err)
            {
                return <Avatar.Icon icon={() => <FeatherIcon name="help-circle" size={45} color="#212121" />} size={45} style={{margin: 8}} />
            }
    }

    const renderUsername = () => {
        try {
            return (
                <Text style={styles.titleText}>
                                {props.user.username}
                            </Text>
            )
        } catch(error) {
            return (
                <Text style={styles.titleText}>
                                User not found
                            </Text>
            )
        }
    }

    const renderDisplayName = () => {
        try {
            return (
                <Text style={styles.subtitleText}>
                                {props.user.display_name}
                            </Text>
            )
        } catch(error) {
            return (
                <Text style={styles.subtitleText}>
                                
                            </Text>
            )
        }
    }
    
        return (
            <>
                <TouchableOpacity onPress={_handleViewProfile} style={styles.touchableOpacity}>
                <View style={[styles.cardContainer]}>
                    <View style={styles.cardContent}>
                        <View style={styles.userInfoContent}>
                            {
                               renderUserAvatar()
                            }
                        <View style={{flexDirection: 'column'}}>
                        <Text style={styles.titleText}>
                             {renderUsername()}
                            </Text>
                            <Text style={styles.subtitleText}>
                                {renderDisplayName()}
                            </Text>
    
                        </View>
                            </View>
                    </View>
                </View>
                    </TouchableOpacity>
                </>
        );
}

const styles = StyleSheet.create({
    touchableOpacity: {
        width: "98%",
        height: "auto",
        justifyContent: "center",
    },
    cardContainer: {
        elevation: 1,
        borderRadius: 5,
        width: "98%",
        height: "auto",
        margin: 5,
        padding: 10,
        backgroundColor: "transparent",
        alignSelf: 'center',
    },
    cardContent: {
        alignItems: "center", 
        flexDirection: "row", 
        justifyContent: "space-between", 
        width: "100%"
    },
    userInfoContent: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: 'flex-start'
    },
    titleText: {
        fontWeight: "600",
    },
    subtitleText: {
        fontWeight: '200',
        fontSize: 13,
         
        color: 'grey'
    },
    chipIndicator: {
        width: 100,
        height: 25,
        alignItems: "center",
        justifyContent: "center",
        margin: 5,

    },
    rating: {
        backgroundColor: "transparent",
    }
});

export default UserSearchResultCard;