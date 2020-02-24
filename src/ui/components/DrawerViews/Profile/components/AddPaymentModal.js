import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Button,
    Modal,
    TextInput as NativeInput
} from 'react-native';

import {
    TextInput
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';

import { connect } from 'react-redux';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}



class AddPaymentModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal style={{flex: 1, margin: 0, backgroundColor: 'white'}} presentationStyle="overFullScreen" visible={this.props.isOpen}>
                <SafeAreaView style={{flex: 1, padding: 20}}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>
                            Add a payment
                        </Text>
                    </View>

                    <View style={{flex: 3, justifyContent: 'space-evenly'}}>
                        <TextInput placeholder="Credit Card Number" mode="outlined" />

                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <NativeInput placeholder="Month"/>
                            <NativeInput placeholder="Year" />
                        </View>

                        <View>
                            <NativeInput placeholder="CVC" />   
                         </View>
                        </View>
                    </View>

                    <View style={{flex: 0.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button title="Add Payment Method" onPress={() => 
                        
                        stripe.tokens.create(
                            {
                              card: {
                                number: '4242424242424242',
                                exp_month: 2,
                                exp_year: 2021,
                                cvc: '314',
                              },
                            },
                            function(err, token) {
                              // asynchronously called
                              console.log(err);
                            }
                          )
                        
                        }/>
                        <Button title="Cancel" onPress={this.props.closeModalMethod}/>
                    </View>
                </SafeAreaView>
            </Modal>
        )
    }
}

export default connect(mapStateToProps)(AddPaymentModal);