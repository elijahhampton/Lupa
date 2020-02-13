import React, {useState} from 'react';

import {
    View,
    Text,
    StyleSheet,
    Image,
} from 'react-native';

import {
    Surface,
    Caption
} from 'react-native-paper';
import { Rating } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PackModal from '../../../Modals/PackModal/PackModal';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'


export default class MyPacksCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            packUUID: this.props.packUUID,
            showPack: false,
        }

        console.log('pack modal received: ' + this.state.packUUID)

    }

    handleShowPack = () => {
        this.setState({ showPack: true })
    }

    handleClosePack = () => {
        this.setState({ showPack: false })
    }

    render() {
        return (
            <>
            <TouchableOpacity onPress={this.handleShowPack}>
                <Surface style={styles.bottomSurface}>
                        <Surface style={styles.imageSurface}>
                        <Image style={styles.image} 
                                    resizeMode={ImageResizeMode.cover} 
                                    source={{uri: this.props.image}} />
                        </Surface>
                        <View style={styles.cardContentContainer}>
                        <View style={{flexDirection: 'column', alignItems: "flex-start", justifyContent: "flex-start"}}>
                        <Text style={{alignSelf: "flex-start", fontWeight: "600", fontSize: 15, color: "#9E9E9E"}}>
                            {this.props.title}
                        </Text>
                        <Caption>
                            {this.props.numMembers} members
                        </Caption>
                        </View>
                        </View>
                </Surface>
            </TouchableOpacity>
            <PackModal isOpen={this.state.showPack} packUUID={this.state.packUUID} closeModalMethod={this.handleClosePack} />
            </>
        )
    }
}

const styles = StyleSheet.create({
    cardContainer: {
        margin: 10,
    },
    bottomSurface: {
        margin: 10, width: 160, height: 150, elevation: 2, borderRadius: 25
    },
    imageSurface: {
        flex: 2, alignSelf: "center",width: "80%", height: "55%", flexDirection: "column" , alignItems: "center", justifyContent: "center", elevation: 5, borderRadius: 20, marginTop: 8
    },
    image: {
        width: "100%", height: "100%", borderRadius: 15
    },
    cardContentContainer: {
        flex: 1, flexDirection: "column", padding: 15
    },
    rating: {
        margin: 2
    }
});