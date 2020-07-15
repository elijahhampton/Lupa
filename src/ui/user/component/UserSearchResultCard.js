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

class UserSearchResultCard extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            uuid: this.props.uuid,
            profilePicture: this.props.avatar

        }
    }

    _handleViewProfile = () => {
        this.props.navigation.navigate('Profile', {
            userUUID: this.props.uuid,
            navFrom: 'SearchView',
        });
    }

    returnUserAvatar = () => {
            try {
                return <Avatar.Image source={{uri: this.props.user.photo_url }} size={45} style={{margin: 8}} />
            } catch(err)
            {
                return <Avatar.Icon icon={() => <FeatherIcon name="help-circle" size={45} color="#212121" />} size={45} style={{margin: 8}} />
            }
    }

    renderUsername = () => {
        try {
            return (
                <Text style={styles.titleText}>
                                {this.props.user.username}
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

    renderDisplayName = () => {
        try {
            return (
                <Text style={styles.subtitleText}>
                                {this.props.user.display_name}
                            </Text>
            )
        } catch(error) {
            return (
                <Text style={styles.subtitleText}>
                                
                            </Text>
            )
        }
    }

    render() {
        return (
            <>
                <TouchableOpacity onPress={() => this._handleViewProfile()} style={styles.touchableOpacity}>
                <View style={[styles.cardContainer]}>
                    <View style={styles.cardContent}>
                        <View style={styles.userInfoContent}>
                            {
                               this.renderUserAvatar()
                            }
                        <View style={{flexDirection: 'column'}}>
                        <Text style={styles.titleText}>
                             {this.renderUsername()}
                            </Text>
                            <Text style={styles.subtitleText}>
                                {this.renderDisplayName()}
                            </Text>
    
                        </View>
                            </View>
                    </View>
                </View>
                    </TouchableOpacity>
                </>
        );
    }
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