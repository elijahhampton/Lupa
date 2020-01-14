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

    _closeModal = () => {
        setShowPack(false);
    }

    return (
        <>
        <TouchableOpacity onPress={() => setShowPack(false)}>
        <View style={styles.cardContainer}>
            <Surface style={styles.bottomSurface}>
                    <Surface style={styles.imageSurface}>
                    <Image style={styles.image} 
                                resizeMode={ImageResizeMode.cover} 
                                source={{ uri: 'https://picsum.photos/700' }} />
                    </Surface>
                    <View style={styles.cardContentContainer}>
                    <Rating imageSize={5} style={styles.rating} ratingCount={3} ratingBackgroundColor="#FAFAFA" />
                    <Caption>
                        Announcements
                    </Caption>
                    </View>
            </Surface>
        </View>
        </TouchableOpacity>
        <PackModal isOpen={showPack} _handleClose={_closeModal} />
        </>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        margin: 10,
    },
    bottomSurface: {
        width: 160, height: 150, elevation: 2, borderRadius: 25
    },
    imageSurface: {
        flex: 2, alignSelf: "center",width: "80%", height: "55%", flexDirection: "column" , alignItems: "center", justifyContent: "center", elevation: 5, borderRadius: 20, marginTop: 8
    },
    image: {
        width: "100%", height: "100%", borderRadius: 15
    },
    cardContentContainer: {
        flex: 1, flexDirection: "column",alignSelf: "center", justifyContent: "center", alignItems: "center"
    },
    rating: {
        margin: 2
    }
});

export {
    MyPacksCard,
}