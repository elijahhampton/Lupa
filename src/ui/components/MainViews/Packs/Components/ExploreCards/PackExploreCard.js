import React, { useState } from 'react';

import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';

import {
    Surface,
    Avatar,
    Card,
    Caption
} from 'react-native-paper';

import { Rating } from 'react-native-ratings';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

import { NavigationContext } from 'react-navigation';


import PackInformationModal from '../../../../Modals/Packs/PackInformationModal';
import ProfilePreviewModal from '../../../../DrawerViews/Profile/ProfilePreviewModal';


let contextType = NavigationContext;


export const SmallPackCard = (props) => {
    const [packUUID, setPackUUID] = useState(props.packUUID);
    const [showPack, setShowPack] = useState(false);

    _setShowPack = () => {
        setShowPack(true);
    }

    handleClosePack = () => {
        setShowPack(false)
    }

    return (
        <TouchableOpacity onPress={this._setShowPack}>
        <Surface style={styles.packCards}>
        <Image style={{width: "100%", height: "100%", borderRadius: 20}} resizeMode={ImageResizeMode.cover} source={{ uri: props.image }} />
        </Surface>
        <PackInformationModal isOpen={showPack} packUUID={packUUID} closeModalMethod={this.handleClosePack}/>
        </TouchableOpacity>
    );
}

export const SubscriptionPackCard = (props) => {
    const [packUUID, setPackUUID] = useState(props.packUUID);
    const [showPack, setShowPack] = useState(false);

    _setShowPack = () => {
        setShowPack(true);
    }

    handleClosePack = () => {
        setShowPack(false)
    }
    
    return (
        <TouchableOpacity onPress={this._setShowPack}>
        <Surface style={styles.offerCards}>
        <Image style={{width: "100%", height: "100%", borderRadius: 15}} 
            resizeMode={ImageResizeMode.cover} 
            source={{uri: props.image}} />
        </Surface>


        <PackInformationModal isOpen={showPack} packUUID={props.packUUID} closeModalMethod={this.handleClosePack}/>
        </TouchableOpacity>
    );   
}

export const TrainerFlatCard = (props) => {

    return (
                    <Card style={styles.card}>
<Card.Cover style={{height: 180}} source={{ uri: props.image }} />
<Card.Actions style={{height: "auto", flexDirection: "column", alignItems: "flex-start"}}>
    <View style={{paddingTop: 3, paddingBottom: 3}}>
    <Text style={styles.text}>
        {props.displayName}
    </Text>
    <Text style={[styles.text, {fontWeight: "bold"}]}>
        {props.location.city + ", " + props.location.state }
    </Text>
    </View>

    <Rating ratingCount={props.rating} showRating={false} imageSize={15} readonly/>

    <Caption>
        Elijah Hampton has completed over {props.sessionsCompleted} sessions on Lupa.
    </Caption>
</Card.Actions>
</Card>
    );
}

export const UserFlatCard = (props) => {

    return (
            <Avatar.Image source={{uri: props.avatarSrc }} size={60} style={{margin: 5}} />
    );
}

const styles = StyleSheet.create({
    packCards: {
        elevation: 1,
        width: 250,
        height: 120,
        borderRadius: 20,
        margin: 5,
    },
    offerCards: {
        elevation: 1,
        width: 120,
        height: 150,
        borderRadius: 15,
        margin: 5,
    },
    card: {
        width: 250,
        height: "auto",
        margin: 5,
    },
    text: {
        fontSize: 12,
    }
})