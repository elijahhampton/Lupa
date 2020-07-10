import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native'
import Color from '../../../common/Color';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window')

function CreateWorkoutIntroduction({ goToIndex}) {
    const navigation = useNavigation()
    return (
       <SafeAreaView style={styles.container}>
           <View style={{paddingLeft: 20}}>
               <Text onPress={() => navigation.navigate('App')}>
                   Cancel
               </Text>
           </View>
           <View style={styles.header}>
               <View>
               <Text style={styles.headerText}>
                    What would you like to create?
                </Text>
                <View style={{alignSelf: 'flex-start', width: 50, marginVertical: 10, height: 3, backgroundColor: 'black', borderBottomEndRadius: 0}} />
               </View>
           </View>
           <View style={styles.content}>
           <TouchableOpacity onPress={() => goToIndex(1)}>
           <View style={styles.designProgramContainer}>
               <Text style={styles.optionTitle}>
                  Program
               </Text>
               <Text style={styles.optionDescription}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
               </Text>
           </View>
           </TouchableOpacity>

           <TouchableOpacity onPress={() => console.log('Design a workout')}>
           <View style={styles.designProgramContainer}>
               <Text style={styles.optionTitle}>
                  Workout
               </Text>
               <Text style={styles.optionDescription}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
               </Text>
           </View>
           </TouchableOpacity>
           </View>
       </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.WHITE,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    content: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    bottomContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    designProgramContainer: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: width - 40,
        borderWidth: 0.5,
        padding: 15,
        borderRadius: 15,
        borderColor: 'rgb(174, 174, 178)'
    },
    optionTitle: {
        fontSize: 18,
        paddingVertical: 5,
        fontWeight: '600',
        color: '#1089ff'
    },
    optionDescription: {
        fontSize: 12
    }
})

export default CreateWorkoutIntroduction;