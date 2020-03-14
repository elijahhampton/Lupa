import React, { useState } from 'react'

import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';

import {
    Caption,
    Headline,
    Button
} from 'react-native-paper';

import Swiper from 'react-native-swiper';

import { LinearGradient } from 'expo-linear-gradient';

import LupaController from '../../../controller/lupa/LupaController';

import {
    IconButton,
    Surface,
    Divider,
    Chip,
    Title
} from 'react-native-paper';

import {
    Header,
    Body,
    Container,
    Right,
    Left
} from 'native-base';

import {
    GOAL_UID,
    GOAL_PATHWAY_STRUCTURE_UID
} from '../../../model/data_structures/workout/common/types';

import SingleWorkoutComponent from '../component/SingleWorkoutComponent';

import { BlurView } from 'expo-blur';

import { connect } from 'react-redux';

const chipSelectedColor = "#3F51B5"

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

const mapDispatchToProps = action => {

}

const getGoalPathwayComponent = (goalUUID, goalPathwayUUID, workouts) => {
    if (goalUUID == GOAL_UID.IMPROVE_STRENGTH)
    {
        switch(goalPathwayUUID)
        {
            case GOAL_PATHWAY_STRUCTURE_UID.IMPROVE_STRENGTH_WEIGHTLIFTING: 
                return (
                <Swiper loop={false} horizontal={false} showsPagination={false}>
                    <ImproveStrengthWeightliftingGoalPathwayWelcome />
                    <ImproveStrengthWeightliftingGoalPathwayWarmUp />
                    <ImproveStrengthWeightliftingGoalPathwayPrimeWorkouts workoutData={workouts} />
                    <ImproveStrengthWeightliftingGoalPathwayPostWorkout />
                </Swiper>
                );
            case GOAL_PATHWAY_STRUCTURE_UID.IMPROVE_STRENGTH_CALISTHENICS:
            case GOAL_PATHWAY_STRUCTURE_UID.IMPROVE_STRENGTH_METABOLIC:
        }
    }

    if (goalUUID == GOAL_UID.IMPROVE_POWER)
    {

    }

    if (goalUUID == GOAL_UID.IMPROVE_STAMINA)
    {
        
    }

    if (goalUUID = GOAL_UID.IMPROVE_FLEXIBILITY)
    {

    }
}

const ImproveStrengthWeightliftingGoalPathwayWelcome = props => {
    return (
        <View style={styles.container}>
            <BlurView tint="dark" intensity={100} style={styles.blurred}>
            <LinearGradient
                colors={['#ef5350', '#e53935', '#c62828', '#b71c1c']}
                style={{ padding: 15, flex: 1 }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <Headline>
                        Strength Improvement
                </Headline>
                <Title>
                    Weightlifting
                </Title>
                </View>

                <View style={{ flex: 2, alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'column' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                        Welcome to the strength improvement goal pathway.  We at Lupa have curated a group of workouts including list of warm up, prime,
                        and warm down workout for you to choose from to create your own workout routine.  Based on your fitness profile we have also adjusted
                        the volume for each workout that you should do, however if you have your own way feel free to do that as well.  This goal pathway was
                        specially crafted to focus on lorem ipsum lorem ipsum lorem ipsum lorem ipsum.  If you don't believe us check it out for yourself.  What
                        are you waiting for?
                </Text>

                    <View style={{ width: '100%', backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                        <IconButton icon="favorite" onPress={() => alert('Liked')} color="#f44336" />
                        <Button mode="text" color="white">
                            Exit
                        </Button>
                    </View>
                </View>

                <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                    <Caption style={{ color: 'white' }}>
                        60 Lupa Users have liked this pathway
                </Caption>
                </View>
            </LinearGradient>
            </BlurView>
        </View>
    );
}

const ImproveStrengthWeightliftingGoalPathwayWarmUp = props => {
    const [ chipSelected, setChipSelected ] = useState(false);

    handleChipSelected = () => {
        setChipSelected(true);
    }

    return (
        <View style={[styles.container, { backgroundColor: 'rgb(244, 247, 252)' }]}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                <Text style={{ padding: 10, fontSize: 20, fontWeight: '600' }}>
                    Warm Up Workouts
                    </Text>
                <Button mode="text" compact color="#1A237E">
                    Sort Workouts
                    </Button>
            </View>
            <View style={{ flex: 4, padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                <Surface style={{ backgroundColor: 'white', width: '90%', height: '100%', borderRadius: 10, elevation: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 'auto', padding: 10 }}>
                        <Text style={{ fontSize: 22, fontWeight: '800' }}>
                            Lorem Ipsum
                            </Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <SingleWorkoutComponent />
                        <Divider style={styles.divider} />
                        <SingleWorkoutComponent />
                        <Divider style={styles.divider} />
                        <SingleWorkoutComponent />
                        <Divider style={styles.divider} />
                        <SingleWorkoutComponent />
                        <Divider style={styles.divider} />
                        <SingleWorkoutComponent />
                        <Divider style={styles.divider} />
                        <SingleWorkoutComponent />
                        <Divider style={styles.divider} />
                        <SingleWorkoutComponent />
                        <Divider style={styles.divider} />
                        <SingleWorkoutComponent />
                        <Divider style={styles.divider} />
                        <SingleWorkoutComponent />
                        <Divider style={styles.divider} />
                        <SingleWorkoutComponent />
                        <Divider style={styles.divider} />
                        <SingleWorkoutComponent />
                        <Divider style={styles.divider} />
                        <SingleWorkoutComponent />
                        <Divider style={styles.divider} />
                        <SingleWorkoutComponent />
                        <Divider style={styles.divider} />
                        <SingleWorkoutComponent />
                        <Divider style={styles.divider} />
                        <SingleWorkoutComponent />
                        <Divider style={styles.divider} />
                        <SingleWorkoutComponent />
                        <Divider style={styles.divider} />
                        <SingleWorkoutComponent />
                        <Divider style={styles.divider} />
                    </ScrollView>
                </Surface>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{alignItems: 'center', justifyContent: 'center' }}>
                <Chip mode="flat" style={styles.chip} textStyle={styles.chipTextStyle}>
                    Chest
                </Chip>
                <Chip mode="flat" style={styles.chip} textStyle={styles.chipTextStyle}>
                    Back
                </Chip>
                <Chip mode="flat" style={styles.chip} textStyle={styles.chipTextStyle}>
                    Arms
                </Chip>
                <Chip mode="flat" style={styles.chip} textStyle={styles.chipTextStyle} selected={chipSelected} selectedColor={chipSelectedColor} onPress={() => this.handleChipSelected()}>
                    Shoulders
                </Chip>
                <Chip mode="flat" style={styles.chip} textStyle={styles.chipTextStyle}>
                    Torso
                </Chip>
                <Chip mode="flat" style={styles.chip} textStyle={styles.chipTextStyle}>
                    Legs
                </Chip>
                <Chip mode="flat" style={styles.chip} textStyle={styles.chipTextStyle}>
                    Calves
                </Chip>
                <Chip mode="flat" style={styles.chip} textStyle={styles.chipTextStyle}>
                    Hamstring
                </Chip>
            </ScrollView>
        </View>
    );
}

const ImproveStrengthWeightliftingGoalPathwayPrimeWorkouts = props => {
    const [workoutData, setWorkoutData] = useState(props.workoutData);
    return (
        <View style={[styles.container, { backgroundColor: 'rgb(244, 247, 252)' }]}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ padding: 10, alignSelf: 'flex-start', fontSize: 20, fontWeight: '600' }}>
                    Prime Workouts
                    </Text>
            </View>
            <View style={{ flex: 3, padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                <Surface style={{ backgroundColor: 'white', width: '90%', height: '100%', borderRadius: 10, elevation: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 'auto', padding: 10 }}>
                        <Text style={{ fontSize: 22, fontWeight: '800' }}>
                            Lorem Ipsum
                            </Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                    {
                        /*
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        */
                    }

                    {
                       /* workoutData.primeWorkouts.map(workout => {
                            return (
                            <SingleWorkoutComponent />
                            )
                        })*/
                    }
                    </ScrollView>
                </Surface>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>
                    Other stuff 3
                    </Text>
            </View>
        </View>
    );
}

const ImproveStrengthWeightliftingGoalPathwayPostWorkout = props => {
    return (
        <View style={[styles.container, { backgroundColor: 'rgb(244, 247, 252)' }]}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ padding: 10, alignSelf: 'flex-start', fontSize: 20, fontWeight: '600' }}>
                    Post Workouts
                    </Text>
            </View>
            <View style={{ flex: 3, padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                <Surface style={{ backgroundColor: 'white', width: '90%', height: '100%', borderRadius: 10, elevation: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 'auto', padding: 10 }}>
                        <Text style={{ fontSize: 22, fontWeight: '800' }}>
                            Lorem Ipsum
                            </Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                        <SingleWorkoutComponent />
                    </ScrollView>
                </Surface>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>
                    Other stuff 3
                    </Text>
            </View>
        </View>
    );
}


class WorkoutModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            userHealthData: "",
            goalUUID: this.props.navigation.state.params.goalUUID,
            goalPathwayUUID: this.props.navigation.state.params.goalPathwayUUID,
            chipSelected: false,
            modality: this.props.modality,
            workouts: [],
        }
    }

    componentDidMount = async () => {
        await this.setupComponent();
    }

    setupComponent = async () => {
        let healthDataIn, workoutsIn;

        //load users health data
        await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserHealthData().then(result => {
            healthDataIn = result;
        })

        //load workouts
        await this.LUPA_CONTROLLER_INSTANCE.getWorkoutsFromModalityByType('calisthenics').then(result => {
            workoutsIn = result;
        })



        await this.setState({
            healthData: healthDataIn,
            workouts: workoutsIn,
        });
    }



    render() {
        return (
            <Container style={styles.root} index={false}>
                {
                    getGoalPathwayComponent(this.state.goalUUID, this.state.goalPathwayUUID, this.state.workouts)
                }
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        margin: 0,
        flex: 1,
    },
    container: {
        flex: 1,
    },
    divider: {
        padding: 1,
        backgroundColor: '#EEEEEE'
    },
    chip: {
        backgroundColor: "#1A237E",
        margin: 10,
    },
    chipTextStyle: {
        color: 'white',
        fontWeight: '500',
        elevation: 3
    },
    blurred: {
        ...StyleSheet.absoluteFill
    }
});



export default connect(mapStateToProps)(WorkoutModal);