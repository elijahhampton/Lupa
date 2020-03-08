import React, {useState} from 'react';

import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';

import {
    Surface,
    Caption
} from 'react-native-paper';
import { Rating } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PackModal from '../../../Modals/PackModal/PackModal';
import { withNavigation } from 'react-navigation';
import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

import LupaController from '../../../../../controller/lupa/LupaController';

import { Button } from 'react-native-elements';


class MyPacksCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            packUUID: this.props.packUUID,
            showPack: false,
            packProfileImage: '',
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    }

    handleShowPack = (uuid) => {
            this.props.navigation.navigate('PackModal', {
                navigation: this.props.navigation,
                packUUID: uuid
            })
    }

    handleClosePack = () => {
        this.setState({ showPack: false })
    }

    componentDidMount = async () => {
        await this.setupComponent();
    }

    setupComponent = async () => {
        await this.LUPA_CONTROLLER_INSTANCE.getPackImageFromUUID(this.state.packUUID).then(result => {
            packProfileImageIn = result;
        })

        await this.setState({
            packProfileImage: packProfileImageIn
        })
    }



    render() {
        return (
            <>
            <TouchableOpacity onPress={() => this.handleShowPack(this.state.packUUID)}>
                <Surface style={styles.bottomSurface}>
                        <Surface style={styles.imageSurface}>
                        <Image style={styles.image} 
                                    resizeMode={ImageResizeMode.cover} 
                                    source={{uri: this.state.packProfileImage}} />
                        </Surface>
                        <View style={styles.cardContentContainer}>
                        <View style={{flexDirection: 'column', alignItems: "flex-start"}}>
                        <Text style={{alignSelf: "flex-start", fontWeight: "600", fontSize: 15, color: "black"}}>
                            {this.props.title}
                        </Text>
                        <Text style={{alignSelf: "flex-start", fontWeight: "600", fontSize: 15, color: "black"}}>
                            Community
                        </Text>
                        <Caption>
                            {this.props.numMembers} member
                        </Caption>
                        </View>
                        </View>
                </Surface>
            </TouchableOpacity>
            </>
        )
    }
}

const styles = StyleSheet.create({
    cardContainer: {
        margin: 10,
    },
    bottomSurface: {
        margin: 10, 
        width: Dimensions.get('screen').width / 2, 
        height: 100, 
        elevation: 0, 
        borderRadius: 20, 
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F5F5F5",
        padding: 5,
    },
    imageSurface: {
        position: 'absolute', 
        top: 12, 
        right: 12, alignSelf: "center",width: 30, height: 30, alignItems: "center", justifyContent: "center", elevation: 5, borderRadius: 20
    },
    image: {
        width: 30,
        height: 30,
        borderRadius: 15
    },
    cardContentContainer: {
        flex: 1, flexDirection: "column", padding: 15
    },
    rating: {
        margin: 2
    }
});

export default withNavigation(MyPacksCard);