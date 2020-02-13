import React from 'react'

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import {
    Caption,
    Headline,
    Button
} from 'react-native-paper';

import Swiper from 'react-native-swiper';

import { LinearGradient } from 'expo-linear-gradient';

import {
    IconButton
} from 'react-native-paper';

import {
    Header,
    Body,
    Container,
    Right,
    Left
} from 'native-base';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

const mapDispatchToProps = action => {

}

const GoalPathwayWelcome = props => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#64B5F6', '#1E88E5', '#0D47A1']}
                style={{ padding: 15, flex: 1 }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <Headline>
                        Strength Improvement
                </Headline>
                </View>

                <View style={{ flex: 2, alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'column'}}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                        Welcome to the strength improvement goal pathway.  We at Lupa have curated a group of workouts including list of warm up, prime,
                        and warm down workout for you to choose from to create your own workout routine.  Based on your fitness profile we have also adjusted
                        the volume for each workout that you should do, however if you have your own way feel free to do that as well.  This goal pathway was
                        specially crafted to focus on lorem ipsum lorem ipsum lorem ipsum lorem ipsum.  If you don't believe us check it out for yourself.  What
                        are you waiting for?
                </Text>

                <View style={{width: '100%', backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                        <IconButton  icon="favorite" onPress={() => alert('Liked')} color="#f44336"/>
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
        </View>
    );
}

const GoalPathwayWarmUp = props => {
    return (
        <View style={styles.container}>
            <Text>
                GoalPathwayWarmUp
            </Text>
        </View>
    );
}

const GoalPathwayPrimeWorkouts = props => {
    return (
        <View style={styles.container}>
            <Text>
                GoalPathwayPrimeWorkouts
            </Text>
        </View>
    );
}

const GoalPathwayPostWorkout = props => {
    return (
        <View style={styles.container}>
            <Text>
                GoalPathwayPostWorkout
            </Text>
        </View>
    );
}


class WorkoutModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userHealthData: "",
            goalPathwayUUID: this.props.navigation.state.params.goalPathwayUUID,
        }
    }

    render() {
        return (
            <Container style={styles.root} index={false}>
                <Swiper loop={false}>
                    <GoalPathwayWelcome />
                    <GoalPathwayWarmUp />
                    <GoalPathwayPrimeWorkouts />
                    <GoalPathwayPostWorkout />
                </Swiper>
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
    }
});



export default WorkoutModal;