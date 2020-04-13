import React, { useState } from "react";

import { Video } from 'expo-av';

import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    Easing,
    ScrollView,
    Animated,
    SafeAreaView,
    Modal,
    ListView,
    FlatList,
    Button as NativeButton,
} from 'react-native';

import {
    FAB,
    IconButton,
    Caption,
    Surface,
    Title,
    Headline,
    Divider,
    Button,
    Paragraph
} from 'react-native-paper'

import { SearchBar, Overlay } from 'react-native-elements';

function WorkoutPreview(props) {
    return (
        <Overlay visible={props.isVisible} borderRadius={20}>
            <NativeButton title="Done" onPress={() => props.closeModalMethod()}/>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Surface style={{ width: "80%", height: "65%", elevation: 8, borderRadius: 30 }}>
                <Video
                    source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                    rate={1.0}
                    volume={0}
                    isMuted={true}
                    resizeMode="cover"
                    shouldPlay={false}
                    isLooping={false}
                    style={{ width: "100%", height: "100%", borderRadius: 30 }}
                />
            </Surface>
        </View>

        <View style={{ flex: 1, alignItems: "center", justifyContent: "space-evenly" }}>
            <View style={{ top: 0, alignItems: "center", justifyContent: "center" }}>
                <Title>
                    Workout Title
            </Title>
                <Paragraph>
                    Workout Description
            </Paragraph>
            </View>

            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text>
                    Logging Inputs
                </Text>
            </View>
        </View>

        <View style={{ flex: 1 }}>
            <Title style={{padding: 10}}>
                Workout Variations
            </Title>
            <View style={{ flex: 1, width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
                <Surface style={{ backgroundColor: "white", width: "30%", height: "50%", elevation: 3, borderRadius: 10 }}>
                <Video
                    source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                    rate={1.0}
                    volume={0}
                    isMuted={true}
                    resizeMode="cover"
                    shouldPlay={false}
                    isLooping={false}
                    style={{ width: "100%", height: "100%", borderRadius: 10 }}
                />
                </Surface>

                <Surface style={{ backgroundColor: "white", width: "30%", height: "50%", elevation: 3,  borderRadius: 10 }}>
                <Video
                    source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                    rate={1.0}
                    volume={0}
                    isMuted={true}
                    resizeMode="cover"
                    shouldPlay={false}
                    isLooping={false}
                    style={{ width: "100%", height: "100%", borderRadius: 10 }}
                />
                </Surface>

                <Surface style={{ backgroundColor: "white", width: "30%", height: "50%", elevation: 3,  borderRadius: 10 }}>
                <Video
                    source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                    rate={1.0}
                    volume={0}
                    isMuted={true}
                    resizeMode="cover"
                    shouldPlay={false}
                    isLooping={false}
                    style={{ width: "100%", height: "100%", borderRadius: 10 }}
                />
                </Surface>
            </View>
        </View>
    </Overlay>
    )
}

export default WorkoutPreview;