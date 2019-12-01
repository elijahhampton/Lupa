import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { 
    IconButton,
    TextInput,
    Modal,
    Portal,
} from 'react-native-paper';

export default class ModifySessionModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            isVisible: false,
            currIndex: 0,
        }
    }
    
    render() {
        return (
            <Portal>
                <Modal visible={this.props.isVisible} contentContainerStyle={styles.viewContainer}>

                </Modal>
            </Portal>
        );
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        width: "80%",
        height: "50%",
       backgroundColor: "white",
       alignSelf: "center",
    },
});
