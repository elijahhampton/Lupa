import React from 'react';

import {
    Surface,
    Caption
} from 'react-native-paper';

import {
    View,
    Text,
    StyleSheet,
    Image,
} from 'react-native';

import { Rating } from 'react-native-elements';

import PackModal from '../../../Modals/PackModal/PackModal';

const MyPacksCard = () => {
    return (
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    <Surface style={styles.surface}>
            <Image resizeMethod="resize" resizeMode="cover" source={{ uri: 'https://picsum.photos/700' }} style={{width: "100%", height: "100%", borderRadius: 20}}/>
        </Surface>
         <View style={{margin: 2, flexDirection: 'column', alignItems: 'center'}}>
             <Caption>
                 Announcements
             </Caption>
         </View>
        </View>
    )
}

export default MyPacksCard;

const styles = StyleSheet.create({
    surface: {
        margin: 10, 
        width: 100, 
        height: 100, 
        borderRadius: 20, 
        elevation: 3
    }
})

