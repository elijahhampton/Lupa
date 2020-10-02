import React, { useEffect, useState } from 'react';

import {
    View,
    Image,
    Text,
    StyleSheet,
    Modal,
    SafeAreaView, ScrollView, Dimensions
} from 'react-native';
import { Video } from 'expo-av'
import ThinFeatherIcon from 'react-native-feather1s'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { Constants } from 'react-native-unimodules';
import VlogFeedCard from '../../user/component/VlogFeedCard';
import { Appbar, Divider, Chip, Caption} from 'react-native-paper';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import LOG, { LOG_ERROR } from '../../../common/Logger';
import LupaController from '../../../controller/lupa/LupaController';
import { getLupaExerciseStructure } from '../../../model/data_structures/workout/exercise_collections';
import { getLupaUserStructure } from '../../../controller/firebase/collection_structures';
import LupaColor from '../../common/LupaColor';

function VlogFeedCardExpanded({ route, navigation }) {
    const [ready, setReady] = useState(false);
    const [playVideo, setPlayVideo] = useState(false);
    const [vlogOwnerData, setVlogOwnerData] = useState(getLupaUserStructure());
    const [vlogOwnerPrograms, setVlogOwnerPrograms] = useState([]);

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    useEffect(() => {
        async function fetchVlogOwnerPrograms() {
            let userData = getLupaUserStructure();
            if (typeof(route.params.vlogData.vlog_owner) == 'undefined') {
                return;
            }

            await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(route.params.vlogData.vlog_owner).then(data => {
                userData = data;
            });

            setVlogOwnerData(userData);

            let programsList = userData.programs;
            let programUUID = undefined;
            let programDataList = [];
            for (let i = 0; i < programsList.length; i++) {
                programUUID = programsList[i];
                if (typeof(programUUID) != 'undefined') {
                    await LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(programUUID).then(data => {
                        if (typeof (data) != 'undefined' && data.isPublic === true && data.completedProgram === true) {
                            programDataList.push(data);
                        }
                    });
                }
            }

            setVlogOwnerPrograms(programDataList);
        }

        fetchVlogOwnerPrograms();

        LOG('LiveWorkoutFullScreenContentModal.js', 'Fetching vlog owner programs.')
        return () => fetchVlogOwnerPrograms();
    }, [ready]);

    renderVlogOwnerPrograms = () => {
        if (vlogOwnerPrograms.length === 0) {
            return (
                <Caption style={{padding: 10}}>
                {vlogOwnerData.display_name} is not current offering any programs.
            </Caption>
            )
        }

        try {
            return vlogOwnerPrograms.map((program, index, arr) => {
                return (
                    <View style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                    <View style={{width: Dimensions.get('window').width  - 80, height: 200, borderRadius: 10, borderWidth: 0.5, borderColor: 'black'}}>
                        <Image source={{ uri: program.program_image }} style={{flex: 1, width: '100%', borderRadius: 10,  height: '100%'}} />
                        <Chip textStyle={{color: 'white', fontFamily: 'Avenir-Heavy', fontWeight: '600'}} style={{paddingHorizontal: 10, elevation: 8, position: 'absolute', top: 0, right: 0, alignSelf: 'center', borderRadius: 0, borderTopRightRadius: 10, borderBottomLeftRadius: 10, backgroundColor: '#1089ff', width: 'auto'}}>
                           ${program.program_price}
                       </Chip>
                    </View>

                    <View style={{width: Dimensions.get('window').width - 80, padding: 10}}>
                    <Text style={{fontWeight: '400', fontSize: 15}}>
                        {program.program_name}
                    </Text>
                    <Text style={{fontWeight: '300', fontSize: 13}}>
                        {program.program_duration} Weeks
                    </Text>
                    </View>
                    

               
    </View>
                )
            })

        } catch(error) {
            LOG_ERROR('LiveWorkoutFullScreenContentModal', 'Caught unhandled exception in renderVlogOwnerPrograms', error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header style={{backgroundColor: 'white', borderBottomWidth: 0.5, borderColor: 'rgb(174, 174, 178)', elevation: 0}}>
                <Appbar.Action icon={() =>  <Feather1s  size={22} name="x" color="black" onPress={() => navigation.pop()}/>} />
                <Appbar.Content title="Vlog"  titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20}} />
            </Appbar.Header>
           <ScrollView>
           <VlogFeedCard vlogData={route.params.vlogData} clickable={false} />

            <Divider style={{marginVertical: 10, marginHorizontal: 10}} />

            
           <View>
               <Text style={{fontSize: 15, fontFamily: 'Avenir-Heavy', padding: 10}}>
                   By {vlogOwnerData.display_name}
               </Text>
               {renderVlogOwnerPrograms()}
           </View>


           </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LupaColor.WHITE
    }
});

export default VlogFeedCardExpanded;