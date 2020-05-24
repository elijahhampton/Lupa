import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import stripe from 'tipsi-stripe'
import Button from '../components/Button'
import testID from '../utils/testID'
import { initStripe } from '../../../modules/payments/stripe/index'
import axios from 'axios'

import { withNavigation } from 'react-navigation';
class CardFormScreen extends PureComponent {
  static title = 'Card Form'

  state = {
    loading: false,
    token: null,
  }

  handleCardPayPress = async (amount, currency, token, customerName="", lineOneAddress="", lineTwoAddress="", city="", state="", country="", postalCode="", email="") => {
    initStripe()
    try {
      this.setState({ loading: true, token: null })
      const token = await stripe.paymentRequestWithCardForm({
        //Only iOS supports this option
        smsAutofillDisabled: true,
        requiredBillingAddressFields: 'full',
        prefilledInformation: {
            billingAddress: {
                name: customerName,
                line: lineOneAddress,
                line2: lineTwoAddress,
                city: city,
                state: state,
                country: country,
                postalCode: postalCode,
                email: email,
            },
        },
    });

      this.setState({ loading: false, token })
    } catch (error) {
      console.log(Error);
   
      this.setState({ loading: false })
    }

    fetch('https://us-central1-lupa-cd0e3.cloudfunctions.net/payWithStripe', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amount,
      currency: currency,
      token: this.state.token
    }),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
    })
    .catch((error) => {
      console.error(error);
    });

    } 

  render() {
    const { loading, token } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Card Form Example
        </Text>
        <Text style={styles.instruction}>
          Click button to show Card Form dialog.
        </Text>
        <Button
          text="Enter you card and pay"
          loading={loading}
          onPress={this.handleCardPayPress(this.props.navigation.state.params.amount, this.props.navigation.state.params.currency, this.state.token)}
        />
        <View
          style={styles.token}>
          {token &&
            <Text style={styles.instruction}>
              Token: {token.tokenId}
            </Text>
          }
        </View>
      </View>
    )
  }
}

export default withNavigation(CardFormScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  token: {
    height: 20,
  },
})
