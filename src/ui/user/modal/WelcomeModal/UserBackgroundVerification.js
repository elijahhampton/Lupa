import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
} from 'react-native';
import {
    Appbar,
    Checkbox,
    Surface,
    Caption,
    RadioButton,
    Button,
    Divider,
    Paragraph,
    TextInput,
    Chip,
} from 'react-native-paper';
import { check, RESULTS, PERMISSIONS } from 'react-native-permissions';
import { useSelector } from 'react-redux';
import LupaController from '../../../../controller/lupa/LupaController'
import LupaMapView from '../LupaMapView';

import getLocationFromCoordinates from '../../../../modules/location/mapquest/mapquest'
import Geolocation from '@react-native-community/geolocation';
import { SearchBar } from 'react-native-elements';
import { FULLSCREEN_UPDATE_PLAYER_DID_PRESENT } from 'expo-av/build/Video';
import Feather1s from 'react-native-feather1s/src/Feather1s';
Geolocation.setRNConfiguration({
    authorizationLevel: 'whenInUse',
    skipPermissionRequests: false,
  });

function UserBackgroundVerification(props) {
    const LUPA_STATE = useSelector(state => {
        return state;
    });

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const [userIsActive, setUserIsActive] = useState('unchecked');
    const [userIsModeratelyActive, setUserIsModeratelyActive] = useState('unchecked');
    const [userIsNonActive, setUserIsNonActive] = useState('unchecked');
    const [hoursMovingPerDayResponse, setHoursMovingPerDayResponse] = useState("");
    const [heartRateElevatesDuringPhysicalActivity, setHeartRateElevatesDuringPhysicalActivity] = useState('unchecked');
    const [userCurrentlyExercises, setUserCurrentlyExercises] = useState('unchecked');
    const [daysPerWeekExercise, setDaysPerWeekExercise] = useState("");
    const [averageExerciseTime, setAverageExerciseTime] = useState("");
    const [userHasNegativeExperienceWithExercise, setUserHasNegativeExperienceWithExercise] = useState('unchecked');
    const [currentDislikedActivity, setCurrentDislikedActivity] = useState("");
    const [dislikedActivities, setDislikedActivities] = useState([]);
    const [userHasSeenAFitnessProfessionalBefore, setUserHasSeenAFitnessProfessionalBefore] = useState('unchecked')
    const [userHasNegativeExperienceWithProfessional, setUserHasNegativeExperienceWithProfessional] = useState('unchecked');
    const [shortAndLongTermGoalResponse, setShortAndLongTermGoalResponse] = useState("");
    const [fitnessInjuriesResponse, setFitnessInjuriesResponse] = useState("");

    const handlePhysicalActivityCheckBox = (response) => {
        switch(response) {
            case 'Active':
                userIsActive === 'checked' ? 
                setUserIsActive('unchecked')
                :
                setUserIsActive('checked')
                setUserIsModeratelyActive('unchecked')
                setUserIsNonActive('unchecked')
                break;
            case 'Moderately Active':
                userIsModeratelyActive === 'checked' ? 
                setUserIsActive('unchecked')
                :
                setUserIsActive('unchecked')
                setUserIsModeratelyActive('checked')
                setUserIsNonActive('unchecked')
                break;
            case 'Non Active':
                userIsNonActive === 'checked' ? 
                setUserIsActive('unchecked')
                :
                setUserIsActive('unchecked')
                setUserIsModeratelyActive('unchecked')
                setUserIsNonActive('checked')
                break;
            default:
        }

        //update database
        handleUpdateUserFitnessBackground()
    }

    const handleDislikedActivitesOnChangeText = (text) => {
        let updatedDislikedActivites = dislikedActivities;
        if (text.toString().charAt(text.length - 1) === ",") {
            updatedDislikedActivites.push(text);
            setCurrentDislikedActivity("");

            //updatedatabase
            handleUpdateUserFitnessBackground();

            //return
            return;
        }

        setCurrentDislikedActivity(text);
    }

    const handleRemoveDislikedActivity = (activityName) => {
        if (dislikedActivities.includes(activityName)) {
            let updatedDislikedActivites = dislikedActivities;
            updatedDislikedActivites.splice(updatedDislikedActivites.indexOf(activityName), 1);
            setDislikedActivities(updatedDislikedActivites);
            handleUpdateUserFitnessBackground()
        }
    }

    const handleUpdateUserFitnessBackground = async () => {
        let updatedFitnessBackground = LUPA_STATE.Users.currUserData.client_metadata;

        if (userIsActive === 'checked') {
            updatedFitnessBackground.physicalActivityStatus = "Active"
        } else if (userIsModeratelyActive === 'checked') {
            updatedFitnessBackground.physicalActivityStatus = "Moderately Active"
        } else if (userIsNonActive === 'checked') {
            updatedFitnessBackground.physicalActivityStatus = "Non Active"
        } else {
            updatedFitnessBackground.physicalActivityStatus = "Non Active"
        }

        updatedFitnessBackground.hoursMovingPerDay = Number(hoursMovingPerDayResponse);
        
        if (heartRateElevatesDuringPhysicalActivity === 'checked') {
            updatedFitnessBackground.hasElevatedHeartRateDuringPhysicalActivity = true;
        } else {
            updatedFitnessBackground.hasElevatedHeartRateDuringPhysicalActivity = false;
        }
        
        if ( userCurrentlyExercises == 'checked') {
            updatedFitnessBackground.currentlyExercises = true;
        } else {
            updatedFitnessBackground.currentlyExercises = false;
        }

        updatedFitnessBackground.daysPerWeekExercise = daysPerWeekExercise;
        updatedFitnessBackground.averageExerciseTime = averageExerciseTime;

        if (userHasNegativeExperienceWithExercise === 'checked') {
            updatedFitnessBackground.hasNegativeExperienceWithExercise = true;
        } else {
            updatedFitnessBackground.hasNegativeExperienceWithExercise = false;
        }

        updatedFitnessBackground.dislikedActivities = dislikedActivities;

        if (userHasSeenAFitnessProfessionalBefore === 'checked') {
            updatedFitnessBackground.hasSeenAFitnessProfessionalBefore = true;
        } else {
            updatedFitnessBackground.hasSeenAFitnessProfessionalBefore = false;
        }

        if (userHasNegativeExperienceWithProfessional === 'checked') {
            updatedFitnessBackground.hasNegativeExperienceWithProfessional = true;
        } else {
            updatedFitnessBackground.hasNegativeExperienceWithProfessional = false;
        }



        updatedFitnessBackground.shortAndLongTermGoalResponse = shortAndLongTermGoalResponse;
        updatedFitnessBackground.fitnessInjuriesResponse = fitnessInjuriesResponse;

        await LUPA_CONTROLLER_INSTANCE.updateCurrentUser('client_metadata', updatedFitnessBackground);
        
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF', }}>
            <Appbar.Header style={{ backgroundColor: 'white', elevation: 0,  }}>
                <Appbar.Content title="Fitness Background" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 25}} />
            </Appbar.Header>
            <ScrollView contentContainerStyle={{ padding: 0, alignItems: 'center', backgroundColor: '#F2F2F2' }}>
                <Surface style={styles.surface}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={require('../../../images/official_icon.jpeg')} style={{width: 25, height: 25}} />
                    <Text style={{padding: 5, fontFamily: 'Avenir-Medium',  fontSize: 13, color: "#1089ff" }}>
                        Provided to trainers
                    </Text>
                </View> 
                    
                    <Text style={styles.surfaceTitle}>
                       How much physical activity is involved with your day?
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{fontFamily: 'Avenir-Roman', fontSize: 12, color: '#23374d'}}>
                            Active
                            </Text>
                        <RadioButton.Android 
                            color="#1089ff" 
                            status={userIsActive} 
                            onPress={() => handlePhysicalActivityCheckBox("Active")}/>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{fontFamily: 'Avenir-Roman', fontSize: 12, color: '#23374d'}}>
                            Moderately Active
                            </Text>
                            <RadioButton.Android 
                            color="#1089ff" 
                            status={userIsModeratelyActive} 
                            onPress={() => handlePhysicalActivityCheckBox("Moderately Active")}  
                            />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{fontFamily: 'Avenir-Roman', fontSize: 12, color: '#23374d'}}>
                            Non Active
                            </Text>
                            <RadioButton.Android 
                            color="#1089ff" 
                            status={userIsNonActive} 
                            onPress={() => handlePhysicalActivityCheckBox("Non Active")}  
                            />
                    </View>

                </Surface>

                <Divider style={{height: 2}} />

        {
            userIsNonActive === 'checked' ?
            null
            :
            <>
            <Surface style={styles.surface}>
                    <Text style={styles.surfaceTitle}>
                        How many hours a day are you moving?
                        </Text>
                        <TextInput 
                            value={hoursMovingPerDayResponse} 
                            onChangeText={text => setHoursMovingPerDayResponse(text)} 
                            theme={{
                                colors: {
                                    primary: '#23374d' 
                                }
                            }}
                            returnKeyLabel="done"
                            returnKeyType="done"
                            keyboardType="number-pad"
                            onSubmitEditing={() => handleUpdateUserFitnessBackground()} 
                            style={{marginVertical: 10}} />
                </Surface>
                <Divider style={{height: 2}} />
                </>
        }

        {
            userIsNonActive === 'checked' ?
            null
            :
            <>
<Surface style={styles.surface}>
<View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={require('../../../images/official_icon.jpeg')} style={{width: 25, height: 25}} />
                    <Text style={{padding: 5, fontFamily: 'Avenir-Medium',  fontSize: 13, color: "#1089ff" }}>
                        Provided to trainers
                    </Text>
                </View> 
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    
                        <Text style={{fontFamily: 'Avenir-Roman', fontSize: 12, color: '#23374d'}}>
                        My heart rate often gets elevated during physical activity.
                            </Text>
                            <RadioButton.Android 
                            color="#1089ff" 
                            status={heartRateElevatesDuringPhysicalActivity} 
                            onPress={heartRateElevatesDuringPhysicalActivity === 'checked' ? 
                            () => {
                                setHeartRateElevatesDuringPhysicalActivity('unchecked')
                                handleUpdateUserFitnessBackground()
                            }
                            :
                            () => {
                                setHeartRateElevatesDuringPhysicalActivity('checked')
                               handleUpdateUserFitnessBackground()
                            }}  
                            />
                    </View>
                </Surface>
                <Divider style={{height: 2}} />
                </>
        }

                <Surface style={styles.surface}>
                    <Text style={styles.surfaceTitle}>
                      Do you currently exercise?
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{fontFamily: 'Avenir-Roman', fontSize: 12, color: '#23374d'}}>
                            Yes
                            </Text>
                            <RadioButton.Android 
                            color="#1089ff" 
                            status={userCurrentlyExercises === 'checked' ? 'checked' : 'unchecked'} 
                            onPress={() => {
                                setUserCurrentlyExercises('checked')
                               handleUpdateUserFitnessBackground()
                            }}/>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{fontFamily: 'Avenir-Roman', fontSize: 12, color: '#23374d'}}>
                            No
                            </Text>
                            <RadioButton.Android 
                            color="#1089ff" 
                            status={userCurrentlyExercises === 'checked' ? 'unchecked' : 'checked'} 
                            onPress={() => {
                                setUserCurrentlyExercises('unchecked')
                               handleUpdateUserFitnessBackground()
                            }}/>
                    </View>
                </Surface>

                <Divider style={{height: 2}} />

                {
            userCurrentlyExercises === 'checked' ?
            <>
            <Surface style={styles.surface}>
                    <Text style={styles.surfaceTitle}>
                        How many days per week do you exercise?
                        </Text>
                        <TextInput 
                        value={daysPerWeekExercise} 
                        onSubmitEditing={() => handleUpdateUserFitnessBackground()} 
                        onChangeText={text => setDaysPerWeekExercise(text)} 
                        theme={{
                            colors: {
                                primary: '#23374d' 
                            }
                        }}
                        returnKeyLabel="done"
                        returnKeyType="done"
                        keyboardType="number-pad"
                        style={{marginVertical: 10}} 
                        />
                </Surface>
                <Divider style={{height: 2}} />
                </>
                :
                null
        }

        {
            userCurrentlyExercises === 'checked' ?
            <>
            <Surface style={styles.surface}>
            <Text style={styles.surfaceTitle}>
                How long do you exercise on average? (hours)
                </Text>
                <TextInput 
                value={averageExerciseTime}
                onChangeText={text => setAverageExerciseTime(text)}
                onSubmitEditing={() => handleUpdateUserFitnessBackground()} 
                theme={{
                    colors: {
                        primary: '#23374d' 
                    }
                }}
                returnKeyLabel="done"
                returnKeyType="done"
                keyboardType="number-pad"
                style={{marginVertical: 10}} 
                />
        </Surface>
        <Divider style={{height: 2}} />
        </>
        :
        null
        }

        {
            userCurrentlyExercises === 'checked' ?
            <>
            <Surface style={styles.surface}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={require('../../../images/official_icon.jpeg')} style={{width: 25, height: 25}} />
                    <Text style={{padding: 5, fontFamily: 'Avenir-Medium',  fontSize: 13, color: "#1089ff" }}>
                        Provided to trainers
                    </Text>
                </View> 
            <Text style={styles.surfaceTitle}>
                    What activities do you dislike?
                </Text>
                {/* Disliked activities view */}
                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}}>
                    {
                        dislikedActivities.map((activity, index, arr) => {
                            return (
                                <Chip style={{marginHorizontal: 10}} icon={() => <Feather1s onPress={() => handleRemoveDislikedActivity(activity)} name="x" style={{backgroundColor: '#E5E5E5', padding: 3}} />} style={{minWidth: 80, maxWidth: 120, alignItems: 'center', justifyContent: 'center'}} key={index}>
                                    {activity}
                                </Chip>
                            )
                        })
                    }
                </View>
                <TextInput 
                value={currentDislikedActivity}
                onChangeText={text => handleDislikedActivitesOnChangeText(text)}
                theme={{
                    colors: {
                        primary: '#23374d' 
                    }
                }}
                returnKeyLabel="done"
                returnKeyType="done"
                keyboardType="default"
                style={{marginVertical: 10}} />
        </Surface>
        <Divider style={{height: 2}} />
        </>
        :
        null
        }

        {
            userCurrentlyExercises === 'checked' ?
            <>
            <Surface style={styles.surface}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={require('../../../images/official_icon.jpeg')} style={{width: 25, height: 25}} />
                    <Text style={{padding: 5, fontFamily: 'Avenir-Medium',  fontSize: 13, color: "#1089ff" }}>
                        Provided to trainers
                    </Text>
                </View> 
            <Text style={styles.surfaceTitle}>
                Do you have any negative experiences with exercise?
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{fontFamily: 'Avenir-Roman', fontSize: 12, color: '#23374d'}}>
                    Yes
                    </Text>
                    <RadioButton.Android 
                    color="#1089ff" 
                    status={userHasNegativeExperienceWithExercise == 'checked' ? 'checked' : 'unchecked'} 
                    onPress={() => {
                        setUserHasNegativeExperienceWithExercise('checked')
                        handleUpdateUserFitnessBackground()
                    }}/>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{fontFamily: 'Avenir-Roman', fontSize: 12, color: '#23374d'}}>
                    No
                    </Text>
                    <RadioButton.Android 
                    color="#1089ff" 
                    status={userHasNegativeExperienceWithExercise == 'checked' ? 'unchecked' : 'checked'} 
                    onPress={() => {
                        setUserHasNegativeExperienceWithExercise('unchecked')
                       handleUpdateUserFitnessBackground()
                    }}/>
            </View>
        </Surface>
        <Divider style={{height: 2}} />
        </>
        :
        null
        }

<Surface style={styles.surface}>
<View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={require('../../../images/official_icon.jpeg')} style={{width: 25, height: 25}} />
                    <Text style={{padding: 5, fontFamily: 'Avenir-Medium',  fontSize: 13, color: "#1089ff" }}>
                        Provided to trainers
                    </Text>
                </View> 
                    <Text style={styles.surfaceTitle}>
                      Have you ever worked out with a fitness professional before?
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{fontFamily: 'Avenir-Roman', fontSize: 12, color: '#23374d'}}>
                            Yes
                            </Text>
                            <RadioButton.Android 
                            color="#1089ff" 
                            status={userHasSeenAFitnessProfessionalBefore === 'checked' ? 'checked' : 'unchecked'} 
                            onPress={() => {
                                setUserHasSeenAFitnessProfessionalBefore('checked')
                              handleUpdateUserFitnessBackground()
                            }}/>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{fontFamily: 'Avenir-Roman', fontSize: 12, color: '#23374d'}}>
                            No
                            </Text>
                            <RadioButton.Android 
                            color="#1089ff" 
                            status={userHasSeenAFitnessProfessionalBefore === 'checked' ? 'unchecked' : 'checked'} 
                            onPress={() => {
                                setUserHasSeenAFitnessProfessionalBefore('unchecked')
                               handleUpdateUserFitnessBackground()
                            }}/>
                    </View>

                </Surface>

                <Divider style={{height: 2}} />

                {
                    userHasSeenAFitnessProfessionalBefore === 'checked' ?
                    <>
                    <Surface style={styles.surface}>
                    <Text style={styles.surfaceTitle}>
                        Do you have any negative experiences working with a fitness professional?
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{fontFamily: 'Avenir-Roman', fontSize: 12, color: '#23374d'}}>
                            Yes
                            </Text>
                            <RadioButton.Android 
                            color="#1089ff" 
                            status={userHasNegativeExperienceWithProfessional == 'checked' ? 'checked' : 'unchecked'} 
                            onPress={() => {
                               setUserHasNegativeExperienceWithProfessional('checked')
                             handleUpdateUserFitnessBackground()
                            }}/>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{fontFamily: 'Avenir-Roman', fontSize: 12, color: '#23374d'}}>
                            No
                            </Text>
                            <RadioButton.Android 
                            color="#1089ff" 
                            status={userHasNegativeExperienceWithProfessional == 'checked' ? 'unchecked' : 'checked'} 
                            onPress={() => {
                               setUserHasNegativeExperienceWithProfessional('unchecked')
                              handleUpdateUserFitnessBackground()
                            }}/>
                    </View>
                </Surface>
                <Divider style={{height: 2}} />
                </>
                :
                null
                }                

                <Surface style={styles.surface}>
                    <Text style={styles.surfaceTitle}>
                       What are you short and long term exercise, health, and fitness goals?
                        </Text>
                        <TextInput 
                        value={shortAndLongTermGoalResponse}
                        onChangeText={text => setShortAndLongTermGoalResponse(text)}
                        onSubmitEditing={() => handleUpdateUserFitnessBackground()}
                        theme={{
                            colors: {
                                primary: '#23374d' 
                            }
                        }}
                        returnKeyLabel="done"
                        returnKeyType="done"
                        keyboardType="default"
                        style={{marginVertical: 10}} />
                </Surface>

                <Divider style={{height: 2}} />
                
                <Surface style={styles.surface}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={require('../../../images/official_icon.jpeg')} style={{width: 25, height: 25}} />
                    <Text style={{padding: 5, fontFamily: 'Avenir-Medium',  fontSize: 13, color: "#1089ff" }}>
                        Provided to trainers
                    </Text>
                </View> 
                    <Text style={styles.surfaceTitle}>
                      Have you ever had any fitness injuries?
                        </Text>
                        <TextInput 
                        value={fitnessInjuriesResponse}
                        onChangeText={text => setFitnessInjuriesResponse(text)}
                        onSubmitEditing={() => handleUpdateUserFitnessBackground()}
                        theme={{
                            colors: {
                                primary: '#23374d' 
                            }
                        }}
                        returnKeyLabel="done"
                        returnKeyType="done"
                        keyboardType="default"
                        style={{marginVertical: 10}} />
                </Surface>
                
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    surface: {
        width: '100%',
        padding: 10,
        elevation: 0
    },
    surfaceTitle: {
        fontSize: 13,
        fontFamily: 'Avenir-Heavy'
    },
})

export default UserBackgroundVerification;