import React, { useState, useEffect } from 'react';

import {
    View,
    StyleSheet,
    Image,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
    SafeAreaView,
} from 'react-native';

import {
    Caption, FAB, Surface, Avatar, Divider, Chip, Badge, Button,
} from 'react-native-paper';

import Feather1s from 'react-native-feather1s/src/Feather1s';
import FeatherIcon from 'react-native-vector-icons/Feather'
import {
    Appbar
} from 'react-native-paper';
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
                    You have not acquired any clients yet.  Users will be added to your client list by completing sessions.
                </Text>
                </View>
                
                <View style={{marginVertical: 50, width: Dimensions.get('window').width, alignItems: 'center', justifyContent: 'center'}}>
                <Image style={{width: 300, height: 240}} source={require('../../images/myclientsvector.jpeg')} />
                </View>
    
                    
               
                </View>
            )
        }

        return (
            <View style={{flex: 1}}>
                <ScrollView>


                   
                    {
                        myClientData.map((clientData, index, arr) => {
                            return (
                                <View style={{paddingHorizontal: 20,width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10}}>
                                 
                        <View style={{marginVertical: 10}}>
                          <View style={{alignItems: 'center', flexDirection: 'row'}}>

              
                          <Avatar.Image size={45} source={{uri: clientData.photo_url}} />
              
                         
                          <View style={{paddingHorizontal: 10}}>
                            <Text style={{paddingVertical: 5, fontSize: 12, fontFamily: 'Avenir-Heavy'}}>
                              {clientData.display_name}
                            </Text>
                            <Text style={{fontFamily: 'Avenir-Roman', fontSize: 12}}>
                                #{index + 1}
                            </Text>
                          </View>
                          </View>
                        </View>

                     
                        <Button uppercase={false} mode="text" color="#1089ff" onPress={() => navigation.push('Profile', {
                            userUUID: clientData.user_uuid
                        })}>
                            View Client
                        </Button>
                               
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
            <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 0}}>
                <Appbar.Action onPress={() => navigation.pop()} icon={() => <Feather1s thin={true} name="arrow-left" size={20} />}/>
                <Appbar.Content title="My Clients" subtitle={`${myClientData.length} client(s)`}  titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20}} />

            </Appbar.Header> 

        {renderComponent()}
        <SafeAreaView />
        </View>
    )
}

export default MyClients;