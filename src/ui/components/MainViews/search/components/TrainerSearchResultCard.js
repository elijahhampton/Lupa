import React, { useState } from 'react';

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
    Button,
    Caption,
    Avatar
} from 'react-native-paper';

import {
    Rating
} from 'react-native-elements';

import {
    withNavigation,
    NavigationInjectedProps
} from 'react-navigation';

class TrainerSearchResultCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userUUID: this.props.uuid
        }
    }

    _handleViewProfile = (uuid) => {
        this.props.navigation.navigate('UserProfileView', {
            userUUID: uuid
        });
    }

    render() {
        return (
                <TouchableOpacity onPress={() => this._handleViewProfile(this.state.userUUID)} style={styles.touchableOpacity}>
                <Surface style={[styles.cardContainer]}>
                    <View style={styles.cardContent}>
                        <View style={styles.userInfoContent}>
                        <Avatar.Image source={{uri: this.props.avatarSrc }} size={30} style={{margin: 3}} />
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
    Lupa Trainer
    </Chip>
                    </View>
                </Surface>
                    </TouchableOpacity>
        );
    }
   
}

const styles = StyleSheet.create({
    touchableOpacity: {
        width: "100%",
        height: "auto",
        justifyContent: "center",
    },
    cardContainer: {
        elevation: 3,
        borderRadius: 0,
        width: "100%",
        height: "auto",
        margin: 5,
        padding: 10,
        backgroundColor: "transparent"
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

export default withNavigation(TrainerSearchResultCard);