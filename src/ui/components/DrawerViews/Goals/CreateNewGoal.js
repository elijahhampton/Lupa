import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    Button
} from 'react-native';

import {
    Surface,
    Caption
} from 'react-native-paper';

import { Feather as Icon } from '@expo/vector-icons';
import SafeAreaView from 'react-native-safe-area-view';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class CreateNewGoal extends React.Component {
    render() {
        return (
            <View style={styles.root}>
                <SafeAreaView>
                    <View style={{alignSelf: "flex-start", alignItems: 'flex-start'}}>
                    <Button title="Cancel" onPress={() => this.props.navigation.goBack()}/>
                    </View>

                    <TouchableOpacity style={styles.touchableOpacity}>
                        <Surface style={styles.surface}>
                            <Text style={[styles.goalTypeText, {color: "black"}]}>
                                Create an Activity Goal
                            </Text>
                            <Icon name="activity" size={25} color="#2196F3" />
                            <Caption>
                                Set an activity goal because an activity goal is worth setting.
                            </Caption>
                        </Surface>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.touchableOpacity}>
                        <Surface style={styles.surface}>
                        <Text style={[styles.goalTypeText, {color: "black"}]}>
                                Create a Pack Goal
                            </Text>
                            <Icon name="users" size={25} color="#FFEB3B" />
                            <Caption>
                                Set an pack goal because a pack goal is worth setting.
                            </Caption>
                        </Surface>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.touchableOpacity}>
                        <Surface style={styles.surface}>
                        <Text style={[styles.goalTypeText, {color: "black"}]}>
                                Create a Health Goal
                            </Text>
                            <Icon name="heart" size={25} color="#f44336" />
                            <Caption>
                                Set an health goal because a health goal is worth setting.
                            </Caption>
                        </Surface>  
                        </TouchableOpacity>
                        </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#fafafa",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
    },

    surface: {
        width: "90%",
        height: 200,
        elevation: 2,
        borderRadius: 25,
        margin: 10,
        padding: 20,
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center"
    },
    touchableOpacity: {
    },
    goalTypeText: {
        fontSize: 30,
        fontWeight: "600",
    },
    goalDescriptionText: {

    }
})