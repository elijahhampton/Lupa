import React, { useEffect, useState} from 'react';
import  {
    TouchableOpacity,
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet
} from 'react-native';
import { Surface, Button, Divider } from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather'
import { getLupaProgramInformationStructure } from '../../../../model/data_structures/programs/program_structures';
import LupaCalendar from '../../profile/component/LupaCalendar';
import LupaController from '../../../../controller/lupa/LupaController';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { useNavigation } from '@react-navigation/native';

function DashboardProgramCard({ uuid }) {
    const [programData, setProgramData] = useState(getLupaProgramInformationStructure());
    const [contentHeight, setContentHeight] = useState(0)
    const [contentExpanded, setContentExpanded] = useState(false)
    const navigation = useNavigation();
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    useEffect(() => {
        async function fetchProgramData() {
            LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(uuid).then(data => {
                setProgramData(data);
            });
        }

        fetchProgramData();

    }, [programData.program_structure_uuid]);

    const handleOnPress = () => {
        if (contentHeight === 0) {
            setContentExpanded(true);
            setContentHeight('auto');
        } else {
            setContentExpanded(false);
            setContentHeight(0)
        }
    }

    return (
        <View>

        <TouchableOpacity onPress={handleOnPress}>
        <Surface style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, margin: 10, elevation: 0, width: Dimensions.get('window').width-20, height: 120, backgroundColor: 'transparent'}} >
                                
        <View style={{flex: 1, padding: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Surface style={{width: '80%', height: '70%', elevation: 15, borderRadius: 10}}>
                <Image style={{width: '100%', height: '100%', borderRadius: 10}} source={{uri: programData.program_image}} />
            </Surface>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',justifyContent: 'flex-start'}}>
                <Text style={{alignSelf: 'flex-end',  fontSize: 12}}>
                    One on One 
                </Text>
            </View>
        </View>

        <View style={{flex: 3, height: '100%', justifyContent: 'space-evenly'}}>
            <View style={{justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                <Text style={{fontSize: 15, fontFamily: 'Avenir-Heavy', color: '#212121'}}>
                    {programData.program_name}
                </Text>

                <FeatherIcon name={contentExpanded === true ? 'chevron-up' : 'chevron-down'} size={20} />
            </View>

        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 12, fontFamily: 'Avenir-Roman', width: '100%', flex: 1, flexWrap: 'wrap'}} numberOfLines={4}>
                {programData.program_description}
                </Text>
        </View>
        </View>


      </Surface>
      </TouchableOpacity>

        <View style={{height: contentHeight, padding: 10}}>
        <Text style={{marginVertical: 5}}>
                Date Purchased: {new Date().toString()}
            </Text>
            <Text style={{marginVertical: 5}}>
                Workouts Completed: 0
            </Text>
            <Text onPress={() => navigation.push('LiveWorkout', {
                uuid: programData.program_structure_uuid,
                workoutType: 'PROGRAM'
            })} style={{marginVertical: 5, fontWeight: '500', color: '#1089ff', letterSpacing: 1}}>
                Launch Live Workout
            </Text>
        </View>
        <Divider />
      </View>
    )
}

export default DashboardProgramCard;