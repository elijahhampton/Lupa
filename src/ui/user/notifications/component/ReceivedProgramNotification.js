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
import ProgramOptionsModal from '../../../workout/program/modal/ProgramOptionsModal';

const {windowWidth} = Dimensions.get('window').width


function ReceivedProgramNotification({ notificationData }) {
    const [programModalVisible, setProgramModalVisible] = useState(false);
    const [programOptionsVisible, setProgramOptionsModalVisible] = useState(false)
    const [senderUserData, setSenderUserData] = useState(getLupaUserStructure())
    const [componentDidErr, setComponentDidErr] = useState(false);

    const programPreviewRef = createRef();
    const openProgramPreview = () => programPreviewRef.current.open();
    const closeProgramPreview = () => programPreviewRef.current.close();

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()


    useEffect(() => {
        async function fetchData() {
            await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(notificationData.data.program_owner)
            .then(data => {
                setSenderUserData(data)
            })
            .catch(() => {
                setComponentDidErr(true);
            })
        }

        fetchData().catch(() => {
            setComponentDidErr(true)
        })
    }, [])

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const handleOnPress = () => {
        try {
        if (notificationData.data.program_participants.includes(currUserData.user_uuid))
        {
            setProgramOptionsModalVisible(true)

        }
        else
        {
            openProgramPreview()
         //   LUPA_CONTROLLER_INSTANCE.addProgramView(notificationData.data.program_structure_uuid);
        }
    } catch(error) {
        setComponentDidErr(true)
    }
    }

    const renderComponentDisplay = () => {
        if (typeof(senderUserData) == 'undefined') {
            return (
                <Text style={{alignSelf: 'flex-start'}}>
                     Error loading notification.
                </Text>             
            )
        }
        
        if (componentDidErr == true) {
            return (
                <View style={{width: '100%', marginVertical: 15, padding: 20, alignItems: 'center', justifyContent: 'center'}}>
                <Text>
                    Error loading notificaiton
                </Text>
            </View>
            )

        } else {
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
                <ProgramInformationPreview ref={programPreviewRef} program={notificationData.data}  />
                <ProgramOptionsModal program={notificationData.data} isVisible={programOptionsVisible} closeModal={() => setProgramOptionsModalVisible(false)} />
                <Divider />
                </>
            )
           
        }
    }


    return renderComponentDisplay()
}

export default ReceivedProgramNotification;