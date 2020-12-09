import React from 'react';

import {
    View,
    Text,
    StyleSheet
} from 'react-native';

const ProgramOfferJoinRequestMessage = ({ message }) => {
    return (
        <View style={{backgroundColor: 'rgb(12, 107, 255)',  alignSelf: 'flex-end', padding: 10,  margin: 10, borderRadius: 12}}>
            <Text style={{color: 'white'}}>
                {message}
            </Text>
        </View>
    )
} 

export default ProgramOfferJoinRequestMessage 