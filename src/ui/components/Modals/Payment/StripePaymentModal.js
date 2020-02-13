import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    Modal
} from 'react-native';

import StripePaymentComponent from '../../../../modules/payments/stripe/ui/stripe-ui';

class StripePaymentModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <Modal presentationStyle="overFullScreen" visible={true} style={styles.modal} transparent={true}>
                <StripePaymentComponent />
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        display: 'flex',
        margin: 0,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default StripePaymentModal;