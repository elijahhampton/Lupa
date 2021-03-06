import React, { useEffect } from 'react';

import {
    View,
    Text,
    Dimensions,
    StyleSheet,
} from 'react-native';

import {
    Avatar,
    Chip,
    Button,
    Caption,
} from 'react-native-paper';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const userSearchResult = ({userData, hasButton, buttonTitle, buttonOnPress}) => {
    const navigation = useNavigation();
    return (
        <TouchableWithoutFeedback key={userData.user_uuid} style={{width: '100%'}} onPress={typeof(buttonOnPress) == 'undefined' ?  () => navigation.navigate('Profile', {userUUID: userData.user_uuid}) : buttonOnPress }>
        <View style={styles.root}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar.Image size={35} source={{ uri: userData.photo_url }} style={{margin: 5}}/>
                    <View style={styles.userContent}>
                        <Text style={{ color: 'white'}}>
                            {userData.display_name}
                        </Text>
                    </View>
                    </View>
                    {
                            hasButton == true ?
                            <Button uppercase={false} mode="outlined" style={{elevation: 0}} onPress={buttonOnPress} theme={{
                                colors: {
                                    primary: '#2196F3'
                                },
                                roundness: 5
                            }}>
                                <Text>
                                {buttonTitle}
                                </Text>
                            </Button>
                            :
                            null
                     }
                </View>
                </TouchableWithoutFeedback>
    )
};

const styles = StyleSheet.create({
    root: {
        flexDirection: "row", alignItems: "center", width: Dimensions.get('window').width, padding: 5, justifyContent: 'space-between'
    },
    userContent: {
        flexDirection: "column", justifyContent: "flex-start", margin: 3
    },
    chipIndicator: {
        width: 100,
        height: 25,
        alignItems: "center",
        justifyContent: "center",
        margin: 5,

    },
})

export default userSearchResult;