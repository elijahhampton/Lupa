import React, { useState, useEffect } from 'react'
import {
    TouchableWithoutFeedback,
    View,
    ImageBackground,
    Dimensions,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet
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

function ProgramInformationComponent({ program }) {
    const [programModalVisible, setProgramModalVisible] = useState(false);
    const [programOwnerData, setProgramOwnerData] = useState(getLupaUserStructure())
    const [programOptionsVisible, setProgramOptionsModalVisible] = useState(false)
    const [newCurrUserData, setNewCurrUserData] = useState(getLupaUserStructure())

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const handleCardOnPress = (programData) => {
        if (newCurrUserData.programs.includes(programData.program_structure_uuid)) {
            setProgramOptionsModalVisible(true)
        }
        else {
            setProgramModalVisible(true);
            LUPA_CONTROLLER_INSTANCE.addProgramView(programData.program_structure_uuid);
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
        <View style={{backgroundColor: 'transparent', width: Dimensions.get('window').width, padding: 20}}>
                            <Surface style={{backgroundColor: 'transparent', elevation: 0, flexDirection: 'row', width: Dimensions.get('window').width, height: 'auto',}} >
                                                    
                            <View style={{width: 60, height: 60, alignItems: 'flex-start', justifyContent: 'center' }}>
                                <Surface style={{width: '100%', height: '100%', elevation: 0, borderRadius: 3}}>
                                    <Image style={{width: '100%', height: '100%', borderRadius: 3}} source={{uri: program.program_image}} />
                                </Surface>
                            </View>
                    
                            <View style={{height: '80%', justifyContent: 'space-between' }}>
                                <View style={{justifyContent: 'space-between', flexDirection: 'row',}}>
                                <View style={{paddingHorizontal: 10}} >
                                    <Text style={{fontSize: 15, color: '#212121'}}>
                                        {program.program_name}
                                    </Text>
                                    <Text style={{paddingVertical: 10, fontSize: 10,flexWrap: 'wrap'}} numberOfLines={4}>
                                    {program.program_description}
                                    </Text>


                                </View>

                                </View>

                           
                         
                            </View>
                    
                    
                          </Surface>
                        
                          <Text style={{ paddingVertical: 10, color: '#1089ff', fontWeight: '500', letterSpacing: 1}}>
                              Preview Program
                          </Text>
                 
                          </View>
    )
}

export default ProgramInformationComponent