import React, { useState, useEffect } from 'react'
import {
    TouchableWithoutFeedback,
    View,
    ImageBackground,
    Dimensions,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet, Pressable
} from 'react-native'

import {
    Surface,
    Caption,
    Button,
    Divider,
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

function ProgramInformationComponent({ program }) {
    const [programModalVisible, setProgramModalVisible] = useState(false);
    const [programOwnerData, setProgramOwnerData] = useState(getLupaUserStructure())
    const [programOptionsVisible, setProgramOptionsModalVisible] = useState(false)
    const [newCurrUserData, setNewCurrUserData] = useState(getLupaUserStructure())

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const handleCardOnPress = () => {
        if (newCurrUserData.programs.includes(program.program_structure_uuid)) {
            setProgramOptionsModalVisible(true)
        }
        else {
            setProgramModalVisible(true);
            LUPA_CONTROLLER_INSTANCE.addProgramView(program.program_structure_uuid);
        }
    }

    useEffect(() => {
        const currUserSubscription = LUPA_DB.collection('users').doc(LUPA_AUTH.currentUser.uid).onSnapshot(documentSnapshot => {
            let userData = documentSnapshot.data()
                setNewCurrUserData(userData)
            });
    
            return () => currUserSubscription()
    }, [])

    return (
        <TouchableOpacity onPress={handleCardOnPress}>
        <View style={{width: Dimensions.get('window').width, marginVertical: 10}}>
                            <Surface style={{ elevation: 0, justifyContent: 'center', flexDirection: 'row', width: Dimensions.get('window').width, height: 'auto',}} >             
                            <View style={{width: 60, height: 60, alignItems: 'flex-start', justifyContent: 'center' }}>
                                <Surface style={{width: '100%', height: '100%', elevation: 0, borderRadius: 3}}>
                                    <Image style={{width: '100%', height: '100%', borderRadius: 3}} source={{uri: program.program_image}} />
                                </Surface>
                            </View>
                                <View style={{paddingHorizontal: 20, width: '80%'}} >
                                    <Text style={{fontSize: 15, color: '#212121', fontFamily: 'Avenir-Medium'}}>
                                        {program.program_name}
                                    </Text>
                                    <Text style={{fontSize: 12,flexWrap: 'wrap', fontWeight: '300'}} numberOfLines={3}>
                                    {program.program_description}
                                    </Text>
                                </View>
                          </Surface>

                          <ProgramOptionsModal isVisible={programOptionsVisible} closeModal={() => setProgramOptionsModalVisible(false)} program={program} />
                          <ProgramInformationPreview isVisible={programModalVisible} closeModalMethod={() => setProgramModalVisible(false)} program={program}  />
                          </View>
                          </TouchableOpacity>
    )
}

export default ProgramInformationComponent