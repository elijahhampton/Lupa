import React, { useState } from 'react';

import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';

import {
    Surface,
    Title,
    Button,
    FAB,
} from 'react-native-paper';

import PackInformationModal from '../../../../packs/modal/PackInformationModal'
import UserReviewModal from '../../UserReviewModal';

function PackContentDriverCard(props) {
    const packObject = props.pack;
    const [informationModalIsVisible, setInformationModalVisible] = useState(false);

    return (
        <TouchableOpacity style={{alignItems: "center"}} onPress={() => setInformationModalVisible(true)}>
            <Surface style={{elevation: 8, borderRadius: 30, width: Dimensions.get('window').width / 1.5, height: 100, margin: 5}}>
                <Image source={{uri: packObject.pack_image}} style={{borderRadius: 30, width: "100%", height: "100%"}} />
            </Surface>
            <Title>
                {packObject.pack_title}
            </Title>
            <Text>
                {packObject.pack_location.city + ", " + packObject.pack_location.state}
            </Text>
            <PackInformationModal packUUID={packObject.id} closeModalMethod={() => setInformationModalVisible(false)} isOpen={informationModalIsVisible} />
        </TouchableOpacity>
    )
}

function TrainerContentDriverCard(props) {
    const trainerObject = props.trainer;
    const [showProfile, setShowProfile] = useState(false);
    const [showReviewPreview, setShowReviews] = useState(false);

    function showProfilePreview() {
        setShowProfile(true);
    }

    function hideProfilePreview() {
        setShowProfile(false);
    }
return (
            <Surface style={{backgroundColor: "rgba(13,71,161 ,0.2)", elevation: 15, width: Dimensions.get('window').width /2.5, height: 250, borderRadius: 20, margin: 5}}>
                <Surface style={{elevation: 15, borderRadius: 20, width: '80%', height: '40%', alignSelf: 'center', marginTop: 10, }}>
                <Image source={{uri: trainerObject.photo_url} } style={{borderRadius: 20, width: '100%', height: '100%'}} />
                </Surface>

                <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start', padding: 15, }}>
                <Text style={{fontSize: 15, color: 'white', fontWeight: '600'}}>
                {trainerObject.display_name}
            </Text>
            <Text style={{fontSize: 15, color: 'white', fontWeight: '400'}}>
                {trainerObject.location.city + ", " + trainerObject.location.state }
            </Text>
            <Text style={{fontSize: 12, color: 'white', fontWeight: '400'}}>
                Tier 1 Trainer
            </Text>
                </View>

                <FAB onPress={() => setShowProfile(true)} color="#0084EC" icon="event-available" small style={{backgroundColor: "white", position: 'absolute', right: 0, bottom: 0, marginBottom: 15, marginRight: 15 }} />
                <FAB onPress={() => setShowReviews(true)} color="white" icon="toc" small style={{backgroundColor: "#0084EC", position: 'absolute', left: 0, bottom: 0, marginBottom: 15, marginLeft: 15 }} />
                <UserReviewModal userUUID={trainerObject.user_uuid} isVisible={showReviewPreview} closeModalMethod={() => setShowReviews(false)}/>
            </Surface>
)
}

export {
    PackContentDriverCard,
    TrainerContentDriverCard,
}

const styles = StyleSheet.create({
    packContentDriverSurface: {

    }
})

//<FAB color="white" icon="check" small style={{backgroundColor: "#0084EC", position: 'absolute', right: 0, top: 0, marginTop: 15, marginRight: 15 }} />