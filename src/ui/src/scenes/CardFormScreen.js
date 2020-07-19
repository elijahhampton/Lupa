import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import stripe from 'tipsi-stripe'
import Button from '../components/Button'
import testID from '../utils/testID'
import { initStripe } from '../../../modules/payments/stripe/index'
import axios from 'axios'

class CardFormScreen extends PureComponent {
  static title = 'Card Form'

  state = {
    loading: false,
    token: null,
  }

  handleCardPayPress = async (amount, currency, token) => {
    initStripe()
    try {
      this.setState({ loading: true, token: null })
      const token = await stripe.paymentRequestWithCardForm({
        
        
    });

      this.setState({ loading: false, token })
    } catch (error) {
   
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

    })
    .catch((error) => {
      console.error(error);
    });

    } 

  render() {
    const { loading, token } = this.state
    const amount =  this.props.route.params.amount;
    const currency =  this.props.route.currency;
    return (
      <View style={styles.container}>
        {
          this.handleCardPayPress(amount, currency, token)
        }
      </View>
    )
  }
}

export default CardFormScreen

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
