import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    Button
} from 'react-native';

import {
    Surface,
    Avatar,
    Caption,
    Paragraph,
} from 'react-native-paper';

import { Rating } from 'react-native-elements';

export default function ReviewSegment(props) {
    return (
        <View style={{margin: 5}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Avatar.Image source={{ uri: props.avatarSource }} size={40} style={{margin: 5}} />
                    <View style={{alignItems: 'flex-start', justifyContent: 'center'}}>
                    <View style={{padding: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Text>
                            {props.reviewBy}
                        </Text>
                        <Text>
                            gave a rating of 
                        </Text>
                        <Rating ratingCount="5" ratingBackgroundColor="white" imageSize={10} style={{padding: 5}} />
                        <Caption>
                            5.0
                        </Caption>
                </View>
                <Caption style={{padding: 0}}>
                    May 27, 2019
                </Caption>
                </View>
            </View>

            <Surface style={{margin: 5, borderRadius: 10, alignItems: 'center', justifyContent: 'center', elevation: 0, backgroundColor: "#f2f2f2"}}>
                <Paragraph>
                    {props.reviewText}
                </Paragraph>
            </Surface>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {

    }
})