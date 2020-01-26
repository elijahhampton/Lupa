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


const MyPacksCard = (props) => {
    const [showPack, setShowPack] = useState(false);
    const [packUUID, setPackUUID] = useState(props.packUUID);

    _closeModal = () => {
        setShowPack(false);
    }

    handleShowPack = () => {
        setShowPack(true);
    }

    captureDummyToggle = () => {
        const toggle = this.props.dummyToggle;
        toggle();
    }

    return (
        <>
        <TouchableOpacity onPress={this.handleShowPack}>
            <Surface style={styles.bottomSurface}>
                    <Surface style={styles.imageSurface}>
                    <Image style={styles.image} 
                                resizeMode={ImageResizeMode.cover} 
                                source={{uri: props.image}} />
                    </Surface>
                    <View style={styles.cardContentContainer}>
                    <View style={{flexDirection: 'column', alignItems: "flex-start", justifyContent: "flex-start"}}>
                    <Text style={{alignSelf: "flex-start", fontWeight: "600", fontSize: 15, color: "#9E9E9E"}}>
                        {props.title}
                    </Text>
                    <Caption>
                        {props.numMembers} members
                    </Caption>
                    </View>
                    </View>
            </Surface>
        </TouchableOpacity>
        <PackModal isOpen={showPack} packUUID={packUUID} isOpen={showPack} closeModalMethod={_closeModal} />
        </>
    );
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

export {
    MyPacksCard,
}