import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    View,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';

import {
    Avatar,
    Button,
    Appbar,
    Caption,
    Divider,
} from 'react-native-paper';
import LiveWorkout from '../../../workout/modal/LiveWorkout';

import ProgramInformationPreview from '../../../workout/program/ProgramInformationPreview';
import { getLupaUserStructure } from '../../../../controller/firebase/collection_structures';
import LupaController from '../../../../controller/lupa/LupaController';
import { useNavigation } from '@react-navigation/native';

const {windowWidth} = Dimensions.get('window').width


function ReceivedProgramNotification({ notificationData }) {
    const [showLiveWorkout, setShowLiveWorkout] = useState(false);
    const [programModalVisible, setProgramModalVisible] = useState(false);
    const [senderUserData, setSenderUserData] = useState(getLupaUserStructure())
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    const navigation = useNavigation()

    useEffect(() => {
        async function fetchData() {
            await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(notificationData.data.program_owner).then(data => {
                setSenderUserData(data)
            })
        }

        fetchData()
    }, [])

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const handleOnPress = () => {
        if (notificationData.data.program_participants.includes(currUserData.user_uuid))
        {
           navigation.navigate('LiveWorkout', {
                           programData: notificationData.data,
                       })

        }
        else
        {
            setProgramModalVisible(true)
        }
    }

    return (
                   <>
                   <TouchableWithoutFeedback style={{width: windowWidth, }} onPress={handleOnPress}>
                   <View style={{width: windowWidth, marginVertical: 15}}>
                       <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                           <Avatar.Image source={{uri: senderUserData.photo_url}} size={45} style={{marginHorizontal: 10}} />
                           <View>
                               <Text>
                               <Text style={{fontWeight: '500'}}>
       {senderUserData.display_name}{" "}
       </Text>
       <Text>
       sent you a program preview.
       </Text>
                               </Text>
       <Caption>
           {notificationData.data.program_name}
       </Caption>
                           </View>
                       </View>
                   </View>
                  
                   </TouchableWithoutFeedback>
                   <ProgramInformationPreview isVisible={programModalVisible} programData={notificationData.data} closeModalMethod={() => setProgramModalVisible(false)} />
                   <Divider />
                   </>
    )
}

export default ReceivedProgramNotification;