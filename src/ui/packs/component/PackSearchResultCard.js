import React, { useState } from 'react';

import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';

import {
    Surface,
    Chip,
    Avatar
} from 'react-native-paper';

import LupaController from '../../../controller/lupa/LupaController';

import PackInformationModal from '../modal/PackInformationModal';

import { useSelector } from 'react-redux';
import { LOG_ERROR } from '../../../common/Logger';
import { useNavigation } from '@react-navigation/native';

function PackSearchResultCard(props) {
    const [packInformationModalIsOpen, setPackInformationModalOpen] = useState(false);
    const currUserData = useSelector(state => {
        return state.Users.currUserData
    })
    const navigation = useNavigation()

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    const _handleViewPack = async (uuid) => {
        let packInformation;

        await LUPA_CONTROLLER_INSTANCE.getPackInformationByUUID(uuid).then(result => {
            packInformation = result;
        });


        try {
            if (packInformation.pack_members.includes(currUserData.user_uuid))
            {
                navigation.navigate('PackModal', {
                    packUUID: uuid,
                    navFrom: 'SearchView',
                });
            }
            else
            {
                setPackInformationModalOpen(true)
            }
        } catch(error) {
            LOG_ERROR('PackSearchResultCard.js', 'Caught exception in _handleViewPack()', error)
            setPackInfofmationModalOpen(true)
        }
    }

    const renderPackAvatar = () => {
        try {
            return <Avatar.Image size={45} source={{uri: props.pack.pack_image}} style={{margin: 5}} />
        } catch(err)
        {
            LOG_ERROR('PackSearchResultCard.js', 'Caught exception in renderPackAvatar()', error)
            return <Avatar.Icon icon="group" size={45} style={{backgroundColor: "#212121", margin: 5}}/>
        }
    }

    const renderPackTitle = () => {
            try {
                return (
                    <Text style={styles.titleText}>
                    {props.pack.pack_title}
                </Text>
                )
        } catch(error) {
            LOG_ERROR('PackSearchResultCard.js', 'Caught exception in renderPackTitle()', error)

            return (
                <Text style={styles.titleText}>
                {props.pack.pack_title}
            </Text>
            )
        }
    }

    const renderPackLocation = () => {
        try {
            return (
                <Text style={styles.titleText}>
                Location Unknown
            </Text>
            )
    } catch(error) {
        LOG_ERROR('PackSearchResultCard.js', 'Caught exception in renderPackLocation()', error)
        return (
            <Text style={styles.titleText}>
            Location Unknown
        </Text>
        )
    }
}

    return (
        <>
        <TouchableOpacity onPress={() => _handleViewPack(props.uuid)} style={styles.touchableOpacity}>
        <View style={[styles.cardContainer]}>
            <View style={styles.cardContent}>
                <View style={styles.userInfoContent}>
                {renderPackAvatar()}
                <View style={{flexDirection: 'column'}}>
                {
                   renderPackTitle()
                }
                    {
                        xrenderPackLocation()
                    }
                </View>

                    </View>
            </View>
        </View>
            </TouchableOpacity>
            <PackInformationModal isOpen={packInformationModalIsOpen} packUUID={props.uuid} />
            </>
    )
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

export default (PackSearchResultCard);