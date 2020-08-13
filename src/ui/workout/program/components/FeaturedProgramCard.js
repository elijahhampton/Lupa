import React, { useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';

import {
    Card, Divider
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import LupaController from '../../../../controller/lupa/LupaController';

import { useNavigation } from '@react-navigation/native'
import { getLupaUserStructure } from '../../../../controller/firebase/collection_structures';
import ProgramInformationPreview from '../ProgramInformationPreview';

import { RFValue } from 'react-native-responsive-fontsize'
import ProgramOptionsModal from '../modal/ProgramOptionsModal';
import { titleCase } from '../../../common/Util';

function FeaturedProgramCard({ currProgram, keyProp }) {
    const [programModalVisible, setProgramModalVisible] = useState(false);
    const [programOwnerData, setProgramOwnerData] = useState(getLupaUserStructure())
    const [programOptionsVisible, setProgramOptionsModalVisible] = useState(false)
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const navigation = useNavigation()

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const handleCardOnPress = (programData) => {
        if (currUserData.programs.includes(programData.program_structure_uuid)) {

           setProgramOptionsModalVisible(true)

        }
        else {
            setProgramModalVisible(true);
        }
    }

    const getProgramName = () => {
        try {
            return currProgram.program_name
        }
        catch (error) {
            LOG_ERROR('FeaturedProgramCard.js', 'Unhandled exception in getProgramName()', error)
            return 'Unknown Program Title'
        }

    }

    const getProgramLocation = () => {
        try {
            return currProgram.program_location
        }
        catch (error) {
            LOG_ERROR('FeaturedProgramCard.js', 'Unhandled exception in getProgramLocation()', error)
            return 'Unknown Location'
        }
    }

    const getProgramOwnerName = () => {
        try {
            return programOwnerData.display_name
        }
        catch (error) {
            LOG_ERROR('FeaturedProgramCard.js', 'Unhandled exception in getProgramOwnerData()', error)
            return 'Unknown Location'
        }
    }

    useSelector(() => {
        async function fetchData() {
            await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(currProgram.program_owner).then(data => {
                setProgramOwnerData(data)
            })
        }

        fetchData()
    }, [])

    return (
            <Card
            key={keyProp}
            theme={{ roundness: 5 }} 
            style={styles.card} 
            onPress={() => handleCardOnPress(currProgram)}>
                <Card.Cover resizeMode='cover' source={{ uri: currProgram.program_image }} style={styles.cardCover} />
                <Card.Actions style={styles.cardActions}>
                    <View style={styles.actionContent}>
                        <View style={styles.actionTopContent}>
                            <>
                                <Text style={styles.programNameText} numberOfLines={1}>
                                    {titleCase(getProgramName())}
                                </Text>
                            </>
                            <Text style={styles.programOwnerNameText} >
                                {getProgramOwnerName()}
                            </Text>
                        </View>

                        <Divider style={styles.divider} />


                        <View style={styles.actionBottomContent}>
                            <View style={styles.programLocationAddressTextContainer}>
                            <Text style={styles.programLocationAddressText} numberOfLines={1}>
                                {getProgramLocation().address}
                            </Text>
                            </View>

                            <View style={styles.programLocationNameTextContainer}>
                            <Text style={styles.programLocationNameText}>
                                ({getProgramLocation().name})
                            </Text>
                            </View>
                        </View>
                    </View>
                </Card.Actions>
                <ProgramInformationPreview isVisible={programModalVisible} programData={currProgram} closeModalMethod={() => setProgramModalVisible(false)} />
            <ProgramOptionsModal program={currProgram} isVisible={programOptionsVisible} closeModal={() => setProgramOptionsModalVisible(false)} />
            </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 15, elevation: 3, margin: 10, width: Dimensions.get('window').width - 30, height: 250, marginVertical: 5, marginBottom: 20, shadowOpacity: 0.1
    },
    cardCover: {
        height: '65%',
        width: '100%',
        borderRadius: 5,
    },
    cardActions: {
        width: '100%', height: '35%', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'
    },
    actionContent: {
        width: '100%', height: '100%', alignItems: 'flex-start', justifyContent: 'space-around'
    },
    actionTopContent: {
        width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
    },
    programNameText: {
        fontFamily: 'HelveticaNeue', fontSize: 15, fontWeight: '600'
    },
    programOwnerNameText: {
        fontSize: 15, fontWeight: '400', color: '#1089ff'
    },
    divider: {
        width: '100%'
    },
    actionBottomContent: {
        width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'
    },
    programLocationAddressTextContainer: {
        width: '60%',
        justifyContent: 'flex-end'
    },
    programLocationAddressText: {
        fontSize: RFValue(10) ,fontWeight: '400', flexWrap: 'nowrap', width: '100%',alignSelf: 'flex-start', fontFamily: 'Helvetica-Light'
    },
    programLocationNameTextContainer: {
        width: '35%',
        justifyContent: 'flex-start'
        
    },
    programLocationNameText: {
        fontSize: RFValue(10), fontWeight: '400', flexWrap: 'nowrap',  flex: 1, width: '100%', alignSelf: 'flex-end', fontFamily: 'Avenir-Medium'
    }
})

export default FeaturedProgramCard