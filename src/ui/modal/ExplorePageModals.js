import React, { useEffect, useState } from 'react'

import {
    View,
    Text,
    StyleSheet,
    Modal,
    FlatList
} from 'react-native'

import { Appbar, Divider } from 'react-native-paper'
import LupaController from '../../controller/lupa/LupaController'
import StandardTrainerCard from '../user/component/StandardTrainerCard'
import { ScrollView } from 'react-native-gesture-handler'

function ShowTrainersModal({ isVisible, closeModal }) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()
    
    const [trainers, setTrainers] = useState([])

    const handleRenderItem = (trainer) => {
        if (typeof (user) != 'object'
        || user == undefined || user.user_uuid == undefined ||
        user.user_uuid == "" || typeof (user.user_uuid) != 'string' || typeof (user.display_name) == 'undefined' || user.display_name == "") {
        return null;
    }

    return (
        <StandardTrainerCard user={trainer} />
    )
    }

    useEffect(() => {
        async function fetchData() {
            await LUPA_CONTROLLER_INSTANCE.getAllTrainers().then(result => {
                setTrainers(result)
            })
        }

        fetchData()
    }, [])
    return (
        <Modal visible={isVisible} presentationStyle="fullScreen" animated={true} animationType='slide'>
            <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: 'rgb(199, 199, 204)', borderBottomWidth: 0.8 }}>
                    <Appbar.BackAction onPress={closeModal} />
                    <Appbar.Content title="Trainers" titleStyle={{fontFamily: 'HelveticaNeue-Bold', fontSize: 20, fontWeight: '600'}} />
                </Appbar.Header>
                <View style={{flex: 1}}>
                <ScrollView>
                    {
                        trainers.map((user, index, arr) => {
                            if (typeof (user) != 'object'
                            || user == undefined || user.user_uuid == undefined ||
                            user.user_uuid == "" || typeof (user.user_uuid) != 'string' || typeof (user.display_name) == 'undefined' || user.display_name == "") {
                            return null;
                        }

                            return (
                                <>
                                <StandardTrainerCard user={user} />
                                <Divider />
                                </>
                            )
                        })
                    }
                </ScrollView>
                </View> 
               
        </Modal>
    )
}


function ShowTopPicksModal({ isVisible }) {
    return (
        <Modal visible={true} presentationStyle="fullScreen" animated={true} animationType='slide'>
            <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: 'rgb(199, 199, 204)', borderBottomWidth: 0.8 }}>
                    <Appbar.BackAction onPress={closeModal} />
                    <Appbar.Content title="Trainers" titleStyle={{fontFamily: 'HelveticaNeue-Bold', fontSize: 20, fontWeight: '600'}} />
                </Appbar.Header>
                <View style={{flex: 1}}>
                <ScrollView>
                    {
                        trainers.map((user, index, arr) => {
                            if (typeof (user) != 'object'
                            || user == undefined || user.user_uuid == undefined ||
                            user.user_uuid == "" || typeof (user.user_uuid) != 'string' || typeof (user.display_name) == 'undefined' || user.display_name == "") {
                            return null;
                        }

                            return (
                                <>
                                <StandardTrainerCard user={user} />
                                <Divider />
                                </>
                            )
                        })
                    }
                </ScrollView>
                </View> 
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
})

export {
    ShowTrainersModal,
    ShowTopPicksModal
}