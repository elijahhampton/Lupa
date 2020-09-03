import React from 'react';

import {
    View,
    Text,
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

const userSearchResult = ({userData, hasButton, buttonTitle}) => {
    const navigation = useNavigation();

    return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Profile', {userUUID: userData.user_uuid})}>
        <View style={styles.root}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar.Image size={40} source={{uri: userData.photo_url}} style={{margin: 5}}/>
                    <View style={styles.userContent}>
                        <Text style={{fontSize: 13, fontFamily: 'Avenir-Heavy'}}>
                           {userData.username}
                        </Text>
                        <Caption style={{}}>
                            {userData.display_name}
                        </Caption>
                    </View>
                    </View>
                    {
                            hasButton == true ?
                            <Button uppercase={false} mode="outlined" style={{elevation: 0}} onPress={props.buttonOnPress} theme={{
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
        flexDirection: "row", alignItems: "center", width: "100%", padding: 5, justifyContent: 'space-between'
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