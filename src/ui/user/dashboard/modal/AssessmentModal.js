import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Modal,
} from 'react-native';

class AssessmentModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <Modal visible={this.props.isVisible} onDismiss={this.props.closeModal} presentationStyle="pageSheet">
                
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    root: {

    }
})

export default AssessmentModal;