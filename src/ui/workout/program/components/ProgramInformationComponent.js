import React, { useState, useEffect } from 'react'
import {
    View,
    ImageBackground,
    Dimensions,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native'

import {
    Surface,
    Chip,
    Avatar
} from 'react-native-paper'

import LupaController from '../../../../controller/lupa/LupaController'
import { getLupaUserStructure } from '../../../../controller/firebase/collection_structures';
import { useSelector } from 'react-redux/lib/hooks/useSelector';
import { titleCase } from '../../../common/Util';
import ProgramOptionsModal from '../modal/ProgramOptionsModal';
import ProgramInformationPreview from '../ProgramInformationPreview';
import LUPA_DB, { LUPA_AUTH } from '../../../../controller/firebase/firebase';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { getLupaStoreState } from '../../../../controller/redux';
import { useNavigation } from '@react-navigation/native';

function ProgramInformationComponent({ program }) {
    const [programModalVisible, setProgramModalVisible] = useState(false);
    const [programOwnerData, setProgramOwnerData] = useState(getLupaUserStructure())
    const [programOptionsVisible, setProgramOptionsModalVisible] = useState(false)
    const [newCurrUserData, setNewCurrUserData] = useState(getLupaUserStructure())
    const [userPurchased, setUserPurchased] = useState(false)

    const programPreviewRef = createRef();
    const openProgramPreview = () => programPreviewRef.current.open();
    const closeProgramPreview = () => programPreviewRef.current.close();

    const navigation = useNavigation();

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const handleCardOnPress = () => {
        const LUPA_STATE = getLupaStoreState();
        if (LUPA_STATE.Auth.isAuthenticated == false) {
            navigation.navigate('SignUp');
            return;
        }

        if (newCurrUserData.programs.includes(program.program_structure_uuid)) {
            setProgramOptionsModalVisible(true)
        }
        else {
            setProgramModalVisible(true);
          //  LUPA_CONTROLLER_INSTANCE.addProgramView(program.program_structure_uuid);
        }
    }

    useEffect(() => {
    
        const currUserSubscription = LUPA_DB.collection('users').doc(currUserData.user_uuid).onSnapshot(documentSnapshot => {
            let userData = documentSnapshot.data()
            setNewCurrUserData(userData)

            
        });

        async function checkUserPurchased() {
            let userProgramData = newCurrUserData.program_data;
            for (let i = 0; i < userProgramData.length; i++) {
                if (userProgramData[i].program_structure_uuid == program.program_structure_uuid) {
                   setUserPurchased(true);
                   return;
                }
            }

            setUserPurchased(false)
        }

        checkUserPurchased()

        return () => currUserSubscription()
    }, [])

    return (
        <TouchableOpacity key={program.program_structure_uuid} style={{ width: '100%' }} onPress={handleCardOnPress}>
            <View style={{ backgroundColor: 'white', width: Dimensions.get('window').width, marginVertical: 10 }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', height: 'auto', padding: 5, }} >
                    <Avatar.Image style={{margin: 5}} source={{ uri: program.program_image }}  size={35} />
                    <View style={{ paddingHorizontal: 10, width: '100%' }} >
                       <Text>
                            <Text style={{ fontSize: 15, color: '#212121', fontFamily: 'Avenir-Medium' }}>
                            {program.program_name}
                            
                        </Text>
                       {userPurchased === true ? <Text style={{ alignSelf: 'flex-end', paddingVertical: 10, color: '#1089ff', fontFamily: 'Avenir-Heavy', fontSize: 12}}> PURCHASED </Text> : null }
                       </Text>
                       
                        <Text style={{ fontSize: 12, flexWrap: 'wrap', fontWeight: '300', width: '88%' }} numberOfLines={2}>
                            {program.program_description}
                        </Text>
                        
                       
                    </View>
                </View>

                <ProgramOptionsModal isVisible={programOptionsVisible} closeModal={() => setProgramOptionsModalVisible(false)} program={program} />
                <ProgramInformationPreview ref={programPreviewRef} program={program} />
            </View>
        </TouchableOpacity>
    )
}

export default ProgramInformationComponent