import React, { useEffect, useState } from 'react';

import {
    View,
    Modal,
    Text,
    Dimensions,
    Image,
    SafeAreaView,
} from 'react-native';
import LupaCalendar from '../../profile/component/LupaCalendar';
import LupaController from '../../../../controller/lupa/LupaController';
import { useSelector } from 'react-redux'
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { ScrollView } from 'react-native-gesture-handler';
/**
 * Renders a user's trainers.
 * @param {} param0 
 */
const DashboardTrainers = ({ isVisible, closeModal, programs }) => {
    const PROGRAMS = useSelector(state => {
        return state.Users.currUserData.program_data
    })

    const [dashboardTrainers, setDashboardTrainers] = useState([])

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    useEffect(() => {
        async function fetchData() {
            let trainers = [];
            for(let i = 0; i < PROGRAMS.length; i++) {
                if (trainers.includes(PROGRAMS[i].program_owner)) {

                }
                else
                {
                    trainers.push(PROGRAMS[i].program_owner)
                }
            }

            for (let j = 0; j < trainers.length; j++) {
                await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(trainers[j]).then(data => {
                    const updatedDashboardTrainers = dashboardTrainers;
                    updatedDashboardTrainers.push(data);
                    setDashboardTrainers(updatedDashboardTrainers);
                })
            }
            
        }

        fetchData();
    }, [dashboardTrainers.length])
    return (
        <Modal animated={true} animationType="slide" visible={isVisible} presentationStyle="fullScreen" onDismiss={closeModal}>
            <SafeAreaView style={{flex: 1}}>
                <Feather1s onPress={closeModal} name="arrow-left" style={{paddingLeft: 20}} size={20} />
                <ScrollView>
            {
                dashboardTrainers.map(trainer => {
                    return ( 
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, width: Dimensions.get('window').width}}>
                           
<View style={{flexDirection: 'row', alignItems: 'center'}}>
<Image source={{uri: trainer.photo_url }} style={{marginRight: 10, borderRadius: 50, width: 50, height: 50}} />
<Text style={{paddingVertical: 3, fontWeight: '700', color: '#212121', fontFamily: 'Avenir'}}>
                                    Elijah Hampton
                                </Text>
                               
</View>
              
                                <View style={{ justifyContent: 'flex-start', flexDirection: 'row', }}>
                                    <Feather1s name="mail" size={20} style={{paddingHorizontal: 10}} />
                                    <Feather1s name="share" size={20} style={{paddingHorizontal: 10}} />
                                </View>
                        
                        </View>
                    )
                })
            }
                            </ScrollView>
                        </SafeAreaView>
        </Modal>
    )
}

export default DashboardTrainers;
