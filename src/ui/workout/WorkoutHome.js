import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Button,
    ScrollView,
    TouchableOpacity,
    Modal
} from 'react-native';

import {
    Surface,
    Title,
    Appbar,
    Avatar,
    FAB,
    IconButton,
} from 'react-native-paper';

import {
    Header,
    Left,
    Container,
    Right,
    Body,
} from 'native-base'

var stripe = require('stripe-client')('pk_test_I5wTNl4jS6l9KzproBFvHe4t00OVqp7wjO')

import WebView from 'react-native-webview';

import StripeCheckout from 'expo-stripe-checkout'

import {Pagination } from 'react-native-snap-carousel';

import { Feather as FeatherIcon, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-navigation';

import LiveWorkout from './modal/LiveWorkout';

import { connect } from 'react-redux';

import MapView from 'react-native-maps';


onPaymentSuccess = () => {

}

function ModalView(props) {
  
    function onLoadStart() {
        var information = {
            bank_account: {
              country: 'US',
              currency: 'usd',
              account_holder_name: 'Noah Martinez',
              account_holder_type: 'individual',
              routing_number: '110000000',
              account_number: '000123456789'
            }
          }

          var token;

          stripe.createToken(information).then(result => {
              console.log(result.id)
            token = result.id
          })
          
          console.log(token);
          alert(token);
    }

    return (
        <Modal presentationStyle="fullScreen" visible={true}>
                    <WebView
                    style={{flex: 1}}
        originWhitelist={['*']}
        source={{ uri: 'https://www.google.com' }}
        onLoadStart={onLoadStart}
      />
        </Modal>
    )
}

mapStateToProps = (state) => {
    return {
        lupa_data: state
    }
}


const PurchaseProduct = () => {
    
    function onLoadStart() {

    }

    return (
      <WebView
      style={{flex: 1}}
        originWhitelist={['*']}
        source={{ uri: 'https://www.google.com' }}
        onLoadStart={onLoadStart}
      />
    );
    
  };

class WorkoutHome extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showLiveWorkout: false,
            programUUID: "",
            workoutData: {},
        }
    }

    handleShowLiveWorkout = async (program) => {
        await this.setState({ showLiveWorkout: true })
    }

    handleCloseLiveWorkout = () => {
         this.setState({ showLiveWorkout: false })
    }

    
onPaymentSuccess = (token) => {
    // send the stripe token to your backend!
  }
  
  onClose = () => {
    // maybe navigate to other screen here?
  }

    render() {
        return (
            /*
                <View style={{flex: 1}}>
                                    <Header transparent style={{alignItems: "center"}}>
                    <Left>
                        <Avatar.Image size={25} source={{uri: 'https://picsum.photos/200/300'}} />
                    </Left>

                    <Body>
                        <Title>
                           {this.props.lupa_data.Users.currUserData.display_name}
                        </Title>
                    </Body>

                    <Right>
                        <FeatherIcon name="send" size={20} onPress={() => this.props.navigation.navigate('MessagesView')}/>
                    </Right>
                </Header>
                <View style={{flex: 5}}>
                    {
                        this.props.lupa_data.Programs.currUserProgramsState.map(program => {
                            
                            return (
                            <TouchableOpacity onPress={() => this.handleShowLiveWorkout(program)}> 
                                                            <Surface style={{backgroundColor: "red", margin: 10}}>
                                <Text>
                                    Click Me
                                </Text>
                                               <LiveWorkout isVisible={this.state.showLiveWorkout} programData={program} closeModalMethod={this.handleCloseLiveWorkout} />
                            </Surface>
                            </TouchableOpacity>
                            )
                        })
                    }
                </View>


                <ModalView />
            


                <View style={{flex: 1.5}}>
                <Text style={{marginLeft: 20,fontSize: 25, fontWeight: "800"}}>
                        Quick start
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} centerContent={true} contentContainerStyle={{alignItems: "center", justifyContent: "center"}}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('BuildAWorkout')}>
                        <Surface 
                        style={{width: Dimensions.get("window").width / 1.1,
                        height: Dimensions.get("window").height / 7.5,
                        borderRadius: 20,
                        margin: 20,
                        elevation: 0,  
                        padding: 10, 
                        backgroundColor: "#f5f5f5"}}>
                            <View style={{padding: 5, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                                <Text style={{fontWeight: "bold", fontSize: 20}}>
                                    Build a workout
                                </Text>
                                <FeatherIcon name="activity" size={20}/>
                            </View>
                            <View style={{width: "100%", padding: 10}}>
                                <Text numberOfLines={3}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </Text>
                            </View>
                        </Surface>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
<SafeAreaView />
                </View>*/
<View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
<StripeCheckout
    publicKey="pk_test_I5wTNl4jS6l9KzproBFvHe4t00OVqp7wjO"
    amount={100000}
    imageUrl=""
    storeName="Stripe Checkout"
    description="Test"
    currency="USD"
    allowRememberMe={false}
    prepopulatedEmail="test@test.com"
    onClose={this.onClose}
    onPaymentSuccess={this.onPaymentSuccess}
    
  />
</View>
                
        );
    }
}

const styles = StyleSheet.create({

});

export default connect(mapStateToProps)(WorkoutHome);

/*
<>
                <StripeCheckout
    publicKey="pk_test_I5wTNl4jS6l9KzproBFvHe4t00OVqp7wjO"
    amount={100000}
    imageUrl=""
    storeName="Stripe Checkout"
    description="Test"
    currency="USD"
    allowRememberMe={false}
    prepopulatedEmail="test@test.com"
    onClose={this.onClose}
    onPaymentSuccess={this.onPaymentSuccess}
    
  />
  </>
  */


  /*

                <MapView
                style={{flex: 1}}
                    initialRegion={{
                      latitude: 37.78825,
                      longitude: -122.4324,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}>

<Surface style={{alignItems: "center", justifyContent: "center", elevation: 10, width: 60, height: 120, position: "absolute", bottom: 25, alignSelf: "center", left: -18, top: Dimensions.get('window').height / 2, borderTopRightRadius: 140, borderBottomRightRadius: 140}}>
                    <MaterialIcons name="chevron-left" size={20} color="black" />
                </Surface>

                <Surface style={{alignItems: "center", justifyContent: "center", elevation: 10, width: 60, height: 120, position: "absolute", bottom: 25, alignSelf: "center", right: -18, top: Dimensions.get('window').height / 2, borderTopLeftRadius: 140, borderBottomLeftRadius: 140}}>
                    <MaterialIcons name="chevron-right" size={20} color="black" />
                </Surface>
                
                <Surface style={{alignItems: "center", justifyContent: "center", elevation: 10, width: 60, height: 60, position: "absolute", bottom: 25, marginLeft: 70, left: 0, borderRadius: 15}}>
                    <MaterialIcons name="gps-fixed" size={20} color="black" />
                </Surface>

                <FAB icon="menu" color="white" style={{color: "white", alignSelf: "center", position: "absolute", bottom: 25, backgroundColor: '#170078'}} />
            
                <Surface style={{alignItems: "center", justifyContent: "center", elevation: 10, width: 60, height: 60, position: "absolute", bottom: 25, marginRight: 70, right: 0, borderRadius: 15}}>
                <MaterialIcons name="filter-list" size={20} color="black" />
</Surface>
            </MapView>
                */