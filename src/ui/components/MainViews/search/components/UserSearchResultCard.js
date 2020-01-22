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
    Caption
} from 'react-native-paper';

import {
    Avatar,
    Rating
} from 'react-native-elements';

import {
    withNavigation
} from 'react-navigation';

import UserProfileModal from '../../../DrawerViews/Profile/UserProfileModal'

const contentUnexpandedHeight = 0;
const contentExpandedHeight = "auto";


const UserSearchResultCard = (props) => {
    const [isModalOpen, setModalOpen] = useState(false);

    _handleViewProfile = () => {
        console.log('Registering button click')
        setModalOpen(true);
    }

    handleModalClose = () => {
        setModalOpen(false);
    }

    return (
        <>
            <TouchableWithoutFeedback onPress={() => this._handleViewProfile()} style={styles.touchableOpacity}>
            <Surface style={[styles.cardContainer]}>
                <View style={styles.cardContent}>
                    <View style={styles.userInfoContent}>
                    <Avatar label={props.title} rounded size="small" containerStyle={{marginRight: 5}}/>
                    <View style={{flexDirection: 'column'}}>
                    <Text style={styles.titleText}>
                            {props.title}
                        </Text>
                        <Text style={styles.subtitleText}>
                            {props.email}
                        </Text>

                    </View>
                        </View>
                    <Chip style={[styles.chipIndicator, { backgroundColor: "#2196F3" }]} mode="flat">
                    Lupa User
                    </Chip>
                </View>
            </Surface>
                </TouchableWithoutFeedback>
                <UserProfileModal isOpen={isModalOpen} uuid={props.uuid} closeModalMethod={this.handleModalClose}/>
            </>
    );
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

export default withNavigation(UserSearchResultCard);