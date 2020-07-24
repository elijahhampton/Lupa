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

function FeaturedProgramCard({ currProgram }) {
    const [programModalVisible, setProgramModalVisible] = useState(false);
    const [programOwnerData, setProgramOwnerData] = useState(getLupaUserStructure())
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const navigation = useNavigation()

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const handleCardOnPress = (programData) => {
        if (currUserData.programs.includes(programData.program_structure_uuid)) {

            navigation.push('LiveWorkout', {
                programData: programData,
            });

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
        <>
            <Card key={Math.random()} 
            theme={{ roundness: 15 }} 
            style={styles.card} 
            onPress={() => handleCardOnPress(currProgram)}>
                <Card.Cover resizeMode='contain' defaultSource={require('../../../images/programs/sample_photo_two.jpg')} source={{ uri: currProgram.program_image }} style={styles.cardCover} />
                <Card.Actions style={styles.cardActions}>
                    <View style={styles.actionContent}>
                        <View style={styles.actionTopContent}>
                            <>
                                <Text style={styles.programNameText} numberOfLines={1}>
                                    {getProgramName()}
                                </Text>
                            </>
                            <Text style={styles.programOwnerNameText} >
                                {getProgramOwnerName()}
                            </Text>
                        </View>

                        <Divider style={styles.divider} />


                        <View style={styles.actionBottomContent}>
                            <Text style={styles.programLocationAddressText} numberOfLines={1}>
                                {getProgramLocation().address}
                            </Text>

                            <Text style={styles.programLocationNameText}>
                                ({getProgramLocation().name})
                            </Text>
                        </View>
                    </View>
                </Card.Actions>
            </Card>
            <ProgramInformationPreview isVisible={programModalVisible} programData={currProgram} closeModalMethod={() => setProgramModalVisible(false)} />
        </>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 15, elevation: 10, margin: 10, width: Dimensions.get('window').width / 1.2, height: 250, marginVertical: 5, marginBottom: 20, shadowOpacity: 0.1
    },
    cardCover: {
        height: '65%'
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
        fontFamily: 'avenir-roman', fontSize: 15, fontWeight: '800' 
    },
    programOwnerNameText: {
        fontSize: 12, fontWeight: '500', color: '#1089ff'
    },
    divider: {
        width: '100%'
    },
    actionBottomContent: {
        width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
    },
    programLocationAddressText: {
        fontSize: 10, fontWeight: '400', flexWrap: 'nowrap'
    },
    programLocationNameText: {
        fontSize: 10, fontWeight: '400', flexWrap: 'nowrap'
    }
})

export default FeaturedProgramCard