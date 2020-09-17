import React, { useEffect, useState } from 'react';

import {
    View,
    StyleSheet,
    Text,
    Image,
    ScrollView,
    Dimensions
} from 'react-native';

import {
    Button,
    Appbar,
    Menu,
    Caption,
    Divider,
    Surface,
} from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native';
import { MenuIcon } from '../../../icons';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { useSelector } from 'react-redux/lib/hooks/useSelector';
import DashboardProgramCard from './DashboardProgramCard';
import { ListItem } from 'react-native-elements';
import DashboardPrograms from './DashboardPrograms';
import DashboardTrainers from './DashboardTrainers';

function UserDashboard(props) {
    const navigation = useNavigation();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    });

    const [programsModalIsOpen, setProgramModalIsOpen] = useState(false);
    const [trainersModalIsOpen, setTrainersModalIsOpen] = useState(false);

    const handleStartLiveWorkout = () => {
        navigation.push('LiveWorkout', {
            uuid: currUserData.last_workout_completed.workoutUUID,
            workoutType: 'WORKOUT'
        })
    }

    const renderLastCompletedWorkoutStatus = () => {
        try {
        if (typeof(currUserData.last_workout_completed) == 'undefined') {
            alert('hi')
            return (
                <Caption>
                You have not completed any workouts recently.
            </Caption>
            )
        } else {
            return (
                <View style={{width: '100%'}}>
                    <Text style={{fontWeight: '300'}}>
                        The last workout you completed was on {new Date(currUserData.last_workout_completed.dateCompleted).toDateString()}.  Would you like to launch it now?
                    </Text>

                    
                    <Button onPress={handleStartLiveWorkout} color="#1089ff" mode="contained" style={{marginTop: 20, width: '100%', alignSelf: 'flex-start'}}>
                        Start Live Workout
                    </Button>
                </View>
            )
        }
    } catch(error) {
        return (
            <Caption>
            You have not completed any workouts recently.
        </Caption>
        )
    }
    }

    const renderComponent = () => {
        return currUserData.program_data.length !== 0 ?
        <ScrollView contentContainerStyle={{marginTop: 5, backgroundColor: '#EEEEEE',}}>
                   <View style={{marginVertical: 10, backgroundColor: 'transparent'}} />
        <ListItem onPress={() => setProgramModalIsOpen(true)} title={"Programs " + '(' + currUserData.programs.length + ')'} rightIcon={() => <FeatherIcon name="arrow-right" size={20} />} titleStyle={{fontSize: 15, fontFamily: 'Avenir', fontWeight: '500', }} topDivider bottomDivider />

        <ListItem onPress={() => {}} title="My Data" rightIcon={() => <FeatherIcon name="arrow-right" size={20} />} titleStyle={{fontSize: 15, fontFamily: 'Avenir', fontWeight: '500', }} bottomDivider />
        
        <View style={{backgroundColor: '#FFFFFF', width: Dimensions.get('window').width, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E5E5E5', marginVertical: 20, padding: 20, backgroundColor: 'white'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 15, fontFamily: 'Avenir', fontWeight: '500', }}>
                Last Completed Workout
            </Text>
            <FeatherIcon name="activity" size={18} />
            </View>


            {renderLastCompletedWorkoutStatus()}
        </View>

        <View style={{backgroundColor: '#FFFFFF', width: Dimensions.get('window').width, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E5E5E5', flexDirection: 'row', alignItems: 'center', alignItems: 'center', justifyContent: 'space-evenly', marginVertical: 20, padding: 20, backgroundColor: 'white'}}>
          <View style={{flex: 3}}>
          <Text style={{color: '#1089ff', fontSize: 18, flexWrap: 'wrap',  fontFamily: 'Avenir-Light'}}>
                Invite your friends and get 1 free program.
            </Text>
          </View>
          

            <View style={{flex: 1}}>
            <Image source={require('../../../images/friends.jpeg')}  style={{width: 90, height: 90}}/>
            </View>

        </View>

        </ScrollView>
        :
        <ScrollView contentContainerStyle={{backgroundColor: '#FFFFFF', flexGrow: 2, justifyContent: 'space-evenly'}}>
             <View style={[{ backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }]}>
                <Image source={require('../../../images/Clipboard.jpeg')} style={{ marginVertical: 10, width: 150, height: 150, borderRadius: 150 }} />


                <View style={{ alignItems: 'center', paddingHorizontal: 10 }}>
                    <Text style={{ paddingVertical: 10, fontSize: 20, fontFamily: 'Avenir-Medium' }}>
                        You haven't signed up for any programs.{" "}
                    </Text>

                    <Text style={{ paddingVertical: 10, textAlign: 'center', fontFamily: 'Avenir-Light' }} >
                       Sign up for a program and you will be able to find details about it here.
                </Text>
                </View>

                <Button uppercase={false} color="#1089ff" mode="text" style={{ fontFamily: 'Avenir-Roman', marginVertical: 10 }} onPress={() => navigation.navigate('Train')}>
                    Find a program
</Button>

            </View>
        </ScrollView>
    }
    
    return (
        <View style={{
            flex: 1,
            backgroundColor: '#EEEEEE'
        }}>
            <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 0,}}>
            <MenuIcon onPress={() => navigation.openDrawer()} />
                <Appbar.Content title="Dashboard"  titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20}} />
                <Appbar.Action onPress={() => navigation.push('Messages')} icon={() => <Feather1s thin={true} name="mail" size={20} />}/>
              <Appbar.Action onPress={() => navigation.push('Notifications')} icon={() => <Feather1s thin={true} name="bell" size={20} />}/>
</Appbar.Header> 
            {renderComponent()}

            <DashboardPrograms isVisible={programsModalIsOpen} closeModal={() => setProgramModalIsOpen(false)} />
        </View>
    )
}

export default UserDashboard;