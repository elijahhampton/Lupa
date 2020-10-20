import React, { useState, useEffect } from 'react';

import {
    View,
    StyleSheet,
    Image,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';

import {
    Caption, FAB, Surface, Avatar, Divider,
} from 'react-native-paper';

import Feather1s from 'react-native-feather1s/src/Feather1s';
import FeatherIcon from 'react-native-vector-icons/Feather'
import {
    Appbar
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import LupaController from '../../../controller/lupa/LupaController'
import { useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import LOG from '../../../common/Logger';

import moment from 'moment'

const MyClients = ({ navigation, route }) => {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const [myClientData, setMyClientData] = useState([]);

    useEffect(() => {
        async function fetchClientData(uuid) {
            LUPA_CONTROLLER_INSTANCE.fetchMyClients(uuid).then(data => {

                setMyClientData(data)
            })
            .catch(error => {
                alert(error)
                setMyClientData([])
            });

            LOG('MyClients.js', 'Fetching client data in useEffect.');
        }

        fetchClientData(currUserData.user_uuid);
    }, []);

    const renderComponent = () => {
        if (myClientData.length === 0) {
            return (
                <View style={{flex: 1}}>
            
                <View style={{width: Dimensions.get('window').width, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontFamily: 'Avenir-Heavy', marginTop: 80, fontSize: 16, alignSelf: 'center', paddingHorizontal: 20}}>
                    You have not acquired any clients yet.  Add your own clients by inviting them to the app or check out the search page.
                </Text>
                </View>
                
                <View style={{marginVertical: 50, width: Dimensions.get('window').width, alignItems: 'center', justifyContent: 'center'}}>
                <Image style={{width: 300, height: 240}} source={require('../../images/myclientsvector.jpeg')} />
                </View>
    
                    
               
                </View>
            )
        }

        /*

        myClientData.map((clientData, index, arr) => {

        })

        */

        return (
            <View style={{flex: 1}}>
                <ScrollView>


                   
                    {
                        myClientData.map((clientData, index, arr) => {
                            console.log(clientData)
                            return (
                                <View style={{paddingHorizontal: 20,width: '100%', marginVertical: 10}}>
                                  <TouchableWithoutFeedback /*onPress={() => this.navigateToProfile(clientData.user_uuid)}*/ key={clientData.user_uuid} style={{flex: 2, marginVertical: 10}}>
                        <View>
                          <View style={{alignItems: 'center', flexDirection: 'row'}}>

              
                          <Avatar.Image size={45} source={{uri: clientData.photo_url}} />
              
                         
                          <View style={{paddingHorizontal: 10}}>
                            <Text style={{paddingVertical: 5, fontSize: 12, fontFamily: 'Avenir-Heavy'}}>
                              {clientData.display_name}
                            </Text>
                            <Text style={{fontFamily: 'Avenir-Heavy', fontSize: 12}}>
                                #{index}
                            </Text>
                          </View>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                               
                                </View>
                            )
                        })
                    }
             

                </ScrollView>
            </View>
            
        )
            
    }

    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 0,}}>
                <Appbar.Action onPress={() => navigation.pop()} icon={() => <Feather1s thin={true} name="arrow-left" size={20} />}/>
                <Appbar.Content title="My Clients"  titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20}} />
            </Appbar.Header> 

        {renderComponent()}
        <SafeAreaView />
        </View>
    )
}

export default MyClients;