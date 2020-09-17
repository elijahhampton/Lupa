import React, { useEffect, useState } from 'react'

import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native'

import {
    Button,
    Surface,
    Card,
    Divider,
    Avatar,
} from 'react-native-paper'

import { useSelector } from 'react-redux'
import ProgramInformationComponent from './ProgramInformationComponent'

import ProgramInformationPreview from '../ProgramInformationPreview'
import { getLupaUserStructure } from '../../../../controller/firebase/collection_structures'
import LupaController from '../../../../controller/lupa/LupaController'
import ProgramOptionsModal from '../modal/ProgramOptionsModal'

function LargeProgramSearchResultCard({ program }) {
    const [programOwnerData, setProgramOwnerData] = useState(getLupaUserStructure())
    const [programModalVisible, setProgramModalVisible] = useState(false);
    const [programOptionsVisible, setProgramOptionsModalVisible] = useState(false)
    const LUPA_USER_CONTROLLER = LupaController.getInstance()

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const handleOnPress = () => {

        if (program.program_participants.includes(currUserData.user_uuid))
        {
            setProgramOptionsModalVisible(true);
        }
        else
        {
            setProgramModalVisible(true);
            LUPA_CONTROLLER_INSTANCE.addProgramView(programData.program_structure_uuid);
        }
    }

    useEffect(() => {
        async function fetchProgramOwnerUserData() {
            try {
                await LUPA_USER_CONTROLLER.getUserInformationByUUID(program.program_owner).then(result => {
                    setProgramOwnerData(result)
                })
            } catch(err) {
                alert(err)
            }
        }

        fetchProgramOwnerUserData()
    }, [])

    return (
       <ProgramInformationComponent program={program} />
    )
}

export default LargeProgramSearchResultCard