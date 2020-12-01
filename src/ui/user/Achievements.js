import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    Dimensions
} from 'react-native';
import { Appbar } from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather'

const ACHIEVEMENTS_LIST = [
    'Achievement',
    'Achievement',
    'Achievement',
    'Achievement',
    'Achievement',
    'Achievement',
    'Achievement',
    'Achievement',
    'Achievement',
    'Achievement',
    'Achievement',
    'Achievement',
    'Achievement',
    'Achievement',
    'Achievement',
    'Achievement',
    'Achievement',
    'Achievement',
    'Achievement',
    'Achievement',
    'Achievement',
    'Achievement',
]

function Achievements({ route, navigation }) {
    return (
        <View style={styles.container}>
            <Appbar.Header style={{justifyContent: 'space-between', backgroundColor: '#FFFFFF', elevation: 0}}>
                <Appbar.Action icon={() => <FeatherIcon name="arrow-left" size={20} />} onPress={() => navigation.pop()} />
            
                <Text style={{fontSize: 20, fontFamily: 'Avenir-Heavy', padding: 10}}>
                    0
                </Text>
            </Appbar.Header>
            <View style={styles.content}>
            {
                ACHIEVEMENTS_LIST.map((achievement, index, arr) => {
                    return (
                        <View style={{alignItems: 'center'}}>
                        <View style={{ width: 60, height: 60, borderRadius: 40, backgroundColor: 'rgb(244, 244, 244)', margin: 10, }} />
                        <Text style={{fontSize: 10, fontFamily: 'Avenir'}}>
                            {achievement}
                        </Text>
                        </View>
                    )
                })
            }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    }
})

export default Achievements;