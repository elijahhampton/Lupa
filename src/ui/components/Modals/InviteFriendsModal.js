import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Modal
} from 'react-native';

import { 
    IconButton,
    TextInput,
    Portal,
} from 'react-native-paper';

export default class InviteFriends extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            isVisible: false,
            currIndex: 0,
        }
    }
    
    render() {
        return (
                <Modal presentationStyle="fullScreen" visible={this.props.isVisible} contentContainerStyle={styles.viewContainer}>
                    <Text>
                        Test
                    </Text>
                </Modal>
        );
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        display: "flex",
       margin: 0,
    },
});
