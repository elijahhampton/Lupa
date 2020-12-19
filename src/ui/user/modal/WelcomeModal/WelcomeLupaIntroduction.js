import React from 'react';

import {
    Text,
    View,
    StyleSheet,
    Image,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import {
    Caption,
} from 'react-native-paper';

import _requestPermissionsAsync from '../../../../controller/lupa/permissions/permissions'
import FeatherIcon from 'react-native-vector-icons/Feather';

const OPTIONS = [
    {
        key: 0,
        optionTitle: 'User',
        optionSubtitle: 'Instantly find personal trainers for any fitness journey.'
    },
    {
        key: 1,
        optionTitle: 'Certified Trainer',
        optionSubtitle: 'Find, manage, and host training sessions with clients.  (Requires a valid NASM certification)'
    }
]


const WelcomeLupaIntroduction = ({ setUserAccountType }) => {
    const handleCheckOption = (optionData) => {
        const id = optionData.key;
        setUserAccountType(id);
    }

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
            <Image source={require('../../../images/logo.jpg')} style={{ width: 55, height: 55 }} />

            <View style={{ flex: 1, justifyContent: 'flex-start', backgroundColor: 'white' }}>
                <View style={{ alignItems: 'flex-start', padding: 20 }}>
                    <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'left', fontSize: 25, marginVertical: 10 }}>
                        How would you like to use Lupa?
        </Text>
                    <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: '500', color: 'rgb(142, 142, 147)', marginVertical: 5 }}>
                        Select one of the options below
        </Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                    {
                        OPTIONS.map((option, index, arr) => {
                            return (

                                <TouchableOpacity onPress={() => handleCheckOption(option)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', borderColor: '#EEEEEE', width: Dimensions.get('window').width - 20, borderWidth: 1, borderRadius: 12, alignSelf: 'flex-start', padding: 20 }}>
                                    <View style={{ flex: 1 }}>
                                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.optionText}>
                                                {option.optionTitle}
                                            </Text>

                                        </View>
                                        <Caption>
                                            {option.optionSubtitle}
                                        </Caption>
                                    </View>

                                    <FeatherIcon name="chevron-right" size={20} />
                                </TouchableOpacity>

                            )
                        })
                    }
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: "100%",
        width: "100%",
        borderRadius: 20,
        padding: 10,
        alignItems: "center",
        justifyContent: 'center',
    },
    activityIndicatorModal: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    optionText: {
        fontSize: 18,
        width: '90%',
        color: '#000000',
        fontFamily: 'Avenir-Medium',
    }
})

export default WelcomeLupaIntroduction;