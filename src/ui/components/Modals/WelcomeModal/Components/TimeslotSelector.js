import React from 'react'

import {
    View,
    StyleSheet,
    Text,
    ScrollView
} from 'react-native';

import {
    List,
    Surface
} from 'react-native-paper';

import { Feather as Icon } from '@expo/vector-icons';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default class TimeslotSelector extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <>
                <View style={{width: "100%", height: 20, margin: 15, alignItems: "center", flexDirection: "row", justifyContent: "space-between"}}>
                    <Icon name="chevron-left" size={15} />
                        <Text style={styles.instructionalText}>
                            Monday
                        </Text>
                        <Icon name="chevron-right" size={15} />
                </View>

                <Surface style={styles.menuSurface}>
                    <ScrollView>
                        <List.Item
                            title="Monday"
                            description="6:00 - 6:15 AM"
                            left={props => <List.Icon {...props} icon="schedule" />} />
                             <List.Item
                            title="Monday"
                            description="6:15 - 6:30 AM"
                            left={props => <List.Icon {...props} icon="schedule" />} />
                             <List.Item
                            title="Monday"
                            description="6:30 - 6:45 AM"
                            left={props => <List.Icon {...props} icon="schedule" />} />
                             <List.Item
                            title="Monday"
                            description="6:45 - 7:00 AM"
                            left={props => <List.Icon {...props} icon="schedule" />} />
                    </ScrollView>
                </Surface>
            </>
        );
    }
}

const styles = StyleSheet.create({
    menuSurface: {
        width: "100%",
        height: 350,
        elevation: 5,
        borderRadius: 15
    },
});