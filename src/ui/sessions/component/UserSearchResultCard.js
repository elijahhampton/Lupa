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

import {
    withNavigation
} from 'react-navigation';

import LupaController from '../../../controller/lupa/LupaController';

class UserSearchResultCard extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            uuid: this.props.uuid,
            profilePicture: this.props.avatar

        }
    }

    componentDidMount = async () => {
        await this.setupComponent();
    }

    setupComponent = async () => {

    }

    _handleViewProfile = () => {
        this.props.navigation.navigate('Profile', {
            userUUID: this.props.uuid,
            navFrom: 'SearchView',
        });
    }

    _handleSessionRequest = () => {
        this.props.navigation.navigate('SessionsView', {
            userUUID: this.props.uuid,
            navFrom: 'SearchView',
        })
    }

    returnUserAvatar = () => {
        if (this.state.profilePicture == "" || this.state.profilePicture == "undefined" 
         || this.state.profilePicture == '')
        {
            try {
                let userDisplayName = this.props.title.split(" ");
                let firstName = userDisplayName[0].charAt(0);
                let lastName = userDisplayName[1].charAt(0);
                return <Avatar.Text label={firstName+lastName} size={30} style={{margin: 3}}/>
            } catch(err)
            {
                return <Avatar.Image source={{uri: this.props.avatar }} size={30} style={{margin: 3}} />
            }
        }
        else
        {
            return <Avatar.Image source={{uri: this.props.avatar }} size={30} style={{margin: 3}} />
        }
    }

    render() {
        return (
            <>
                <TouchableOpacity onPress={() => this._handleViewProfile()} style={styles.touchableOpacity}>
                <Surface style={[styles.cardContainer]}>
                    <View style={styles.cardContent}>
                        <View style={styles.userInfoContent}>
                            {
                               this.returnUserAvatar()
                            }
                        <View style={{flexDirection: 'column'}}>
                        <Text style={styles.titleText}>
                                {this.props.title}
                            </Text>
                            <Text style={styles.subtitleText}>
                                {this.props.email}
                            </Text>
    
                        </View>
                            </View>
                        <Chip style={[styles.chipIndicator, { backgroundColor: "#2196F3" }]} mode="flat">
                        Lupa User
                        </Chip>
                    </View>
                </Surface>
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
        justifyContent: 'space-between'
    },
    titleText: {
        fontWeight: "600",
    },
    subtitleText: {
        fontWeight: '500',
        fontSize: 12
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

export default withNavigation(UserSearchResultCard);