import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    SafeAreaView,
    Modal,
} from 'react-native';

import { Caption, Button, Paragraph, Appbar } from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather'
import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';
import LupaController from '../../../controller/lupa/LupaController';
import { getLupaStoreState } from '../../../controller/redux';
import { ADD_CURRENT_USER_PACK } from '../../../controller/redux/actionTypes';

const MatchMe = ({ isVisible, closeModal }) => {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    });

    const [curatedPacks, setCuratedPacks] = useState([]);
    const [toggleJoin, setToggleJoin] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchCuratedPacks() {
            await LUPA_CONTROLLER_INSTANCE.fetchCuratedPacks()
            .then(data => {
                setCuratedPacks(data)
            })
            .catch(error => {
                setCuratedPacks([])
            })
        }

        fetchCuratedPacks();
    }, [])

    const handleOnJoinPack = (packData) => {
        const updatedUserData = getLupaStoreState().Users.currUserData;
        LUPA_CONTROLLER_INSTANCE.addUserToPack(updatedUserData, packData)
        .then(() => {
            dispatch({ type: ADD_CURRENT_USER_PACK, payload: packData })
        })
        .catch(() => {
            alert('There was an error adding you to this pack. Try again!')
        })
    }

    const hasUserJoinedPack = (packData) => {
        const updatedUserPacks = getLupaStoreState().Packs.currUserPacksData
        for (let i = 0; i < updatedUserPacks.length; i++) {
            if (updatedUserPacks[i].uid == packData.uid) {
                return true;
            }
        }

        return false;
    }

    const renderCuratedPacks = () => {
        if (curatedPacks.length == 0) {
            return (
                <View style={{padding: 20, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Paragraph>
                        Sorry we could not find any packs that fit your profile.  Check back later.
                    </Paragraph>
                </View>
            )
        } else {
            return (
                <ScrollView contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}>
                    {
                        curatedPacks.map(pack => {
                            if (hasUserJoinedPack(pack) == true) {
                                return;
                            }

                            return (
                                <View style={{marginVertical: 10}}>
                                                                    <View style={{paddingHorizontal: 20, width: Dimensions.get('window').width, justifyContent: 'space-between',  flexDirection: 'row', alignItems: 'center'}}>
  <View>
                                    <Text style={{fontSize: 18, fontFamily: 'Avenir-Medium'}}>
                                        {pack.name}
                                    </Text>
                                    <Caption>
                                        {pack.members.length} members
                                    </Caption>
                                </View>

                                <Button 
                                onPress={() => handleOnJoinPack(pack)}
                                color="#23374d"
                                mode="contained">
                                    Join
                                </Button>
                                </View>
                                                                        <Text style={{fontFamily: 'Avenir', color: '#1089ff', paddingHorizontal: 20, paddingVertical: 5}}>
                                        {pack.members.length < 3 ? 'This pack needs one more member to go live!' : null}
                                    </Text>
                                </View>

                              
                            )
                        })
                    }
                </ScrollView>
            )
        }
    }

    return (
        <Modal presentationStyle="fullScreen" visible={isVisible} animated={true} animationType="slide">
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={closeModal} />
            </Appbar.Header>
               <View style={{ padding: 10, marginVertical: 20 }}>
          <Text style={{color: '#23374d', fontFamily: 'Avenir-Black', fontSize: 30 }}>
            Find workout partners with no effort
          </Text>
          <Paragraph style={{fontFamily: 'Avenir'}}>
           Allow us to find a pack for you curated through your location, interest, and workout style.
          </Paragraph>
        </View>
        <View style={{flex: 1}}>
            {renderCuratedPacks()}
        </View>
        </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    appbar: {
        backgroundColor: '#FFFFFF',
        elevation: 0,
    }
})

export default MatchMe;