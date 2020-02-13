import React from 'react';
import StripeCheckout from 'expo-stripe-checkout';

import { onClose, onPaymentSuccess } from '../stripe';
//import { Currency } from '..'

const StripeComponent = (props) => {
    return (
    <StripeCheckout
    publicKey="" //Need to register a public key
    amount={props.amount}
    imageUrl={props.imageUrl}
    storeName="Lupa"
    description="Test"
    currency="USD"
    allowRememberMe={false}
    prepopulatedEmail={props.prepopulatedEmail}
    onClose={onClose}
    onPaymentSuccess={onPaymentSuccess}
  />
    )
}

export default StripeComponent;