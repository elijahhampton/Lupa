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

import LupaController from '../../../../../controller/lupa/LupaController';

import PackInformationModal from '../../../Modals/Packs/PackInformationModal';

import { connect } from 'react-redux';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

class PackSearchResultCard extends React.Component {

    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            packUUID: this.props.uuid,
            packInformationModalIsOpen: false,
        }
    }

    _handleViewPack = async (uuid) => {
        let packInformation;
        await this.LUPA_CONTROLLER_INSTANCE.getPackInformationByUUID(uuid).then(result => {
            packInformation = result;
        });

        console.log(packInformation)

        if (packInformation.pack_members.includes(this.props.lupa_data.Users.currUserData.user_uuid))
        {
            this.props.navigation.navigate('PackModal', {
                packUUID: uuid
            });
        }
        else
        {
            this.setState({ packInformationModalIsOpen: true })
        }
    }

    render() {
        return (
            <>
                <TouchableOpacity onPress={() => this._handleViewPack(this.state.packUUID)} style={styles.touchableOpacity}>
                <Surface style={[styles.cardContainer]}>
                    <View style={styles.cardContent}>
                        <View style={styles.userInfoContent}>
                        <Avatar.Image source={{uri: this.props.avatarSrc }} size={30} style={{margin: 3}} />
                        <View style={{flexDirection: 'column'}}>
                        <Text style={styles.titleText}>
                                {this.props.title}
                            </Text>
                            <Text style={styles.subtitleText}>
                                {this.props.isSubscription == true ?                             <Text style={styles.subtitleText}>
                                    Premium                             </Text> : <Text style={styles.subtitleText}> Free </Text> }
                            </Text>
                        </View>
    
                            </View>
                            <Chip style={[styles.chipIndicator, { backgroundColor: "#2196F3" }]} mode="flat">
    Lupa Pack
    </Chip>
                    </View>
                </Surface>
                    </TouchableOpacity>
                    <PackInformationModal isOpen={this.state.packInformationModalIsOpen} />
                    </>
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

export default connect(mapStateToProps)(withNavigation(PackSearchResultCard));