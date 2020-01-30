import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Button
} from 'react-native';

import CreditCard from 'react-native-credit-card';

export default class PaymentSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type: 'mastercard',
            focused: false,
            number: '5555555555555555',
            name: 'Elijah Hampton',
            expiry: '1040',
            cvc: '2222'
        }
    }
    onChange = (form) => {
        
    }

    render() {
        return (
            <View style={styles.root}>
                                <CreditCard
            type={this.state.type}
            imageFront={require('../../../../../images/card.png')}
            imageBack={require('../../../../../images/card.png')}
            shiny={true}
            bar={false}
            focused={this.state.focused}
            number={this.state.number}
            name={this.state.name}
            expiry={this.state.expiry}
            cvc={this.state.cvc}
            style={{borderColor: 'black'}}
            />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        justifyContent: 'center'
    }
})