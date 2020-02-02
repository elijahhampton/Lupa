/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  16, 2019
 * 
 * Workout View
 */

import React from 'react';

import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    ImageBackground,
    RefreshControl,
} from "react-native";

import {
    Headline,
    Surface,
    Button,
    Divider,
} from 'react-native-paper';

import BackgroundImageTwo from '../../../images/background-two.jpg';
import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

import WorkoutComponent from './components/WorkoutComponent';
import { WORKOUT_MODALITY } from '../../../../controller/lupa/common/types'

import { connect } from 'react-redux';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

class WorkoutView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isRefreshing: false
        }
    }

    _handleOnRefresh = () => {
        this.setState({ isRefreshing: true })
        alert('Refreshing Workouts');
        this.setState({ isRefreshing: false })
    }

    render() {
        return (
            <View style={styles.root}>
                <View style={styles.imageView}>
                    <ImageBackground source={BackgroundImageTwo} style={styles.image} resizeMode={ImageResizeMode.contain} resizeMethod="resize">
                        <View style={styles.overlay}>
                            <View style={{ display: "flex" }}>
                                <Text style={{ color: "white", fontSize: 50, fontWeight: "200" }}>
                                    Welcome,
                                </Text>
                                <Text style={{ color: "white", fontSize: 50, fontWeight: "700" }}>
                                    {
                                        this.props.lupa_data.Users.currUserData.display_name
                                    }
                                </Text>
                            </View>

                            <View style={{ display: "flex" }}>
                                <Text style={{ color: "white", fontSize: 20, fontWeight: "200" }}>
                                    Enjoy our catalog of workouts curated by Lupa and Lupa trainers
                                </Text>
                            </View>


                            <View style={styles.buttonScroll}>
                                <ScrollView horizontal={true} shouldRasterizeIOS={true} showsHorizontalScrollIndicator={false}>
                                    <Button onPress={this.props.logoutMethod} mode="text" color="white" compact>
                                        All Workouts
                                    </Button>
                                    <Button mode="text" color="white" compact>
                                        Routines
                                    </Button>
                                    <Button mode="text" color="white" compact>
                                        Body Part
                                    </Button>
                                    <Button mode="text" color="white" compact>
                                        Trainer Recommendations
                                    </Button>
                                    <Button mode="text" color="white" compact>
                                        Goal Based
                                    </Button>
                                    <Button mode="text" color="white" compact>
                                        Suggestions
                                    </Button>
                                    <Button mode="text" color="white" compact>
                                        Curated by Lupa
                                    </Button>
                                </ScrollView>
                            </View>

                        </View>
                    </ImageBackground>
                </View>

                <Surface style={styles.workoutSurface}>
                    <View style={{width: '100%', height: '100%', flex: 1, borderTopLeftRadius: 25, borderTopRightRadius: 25, backgroundColor: "#FAFAFA"}}>
                    <ScrollView shouldRasterizeIOS={true} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this._handleOnRefresh}/>}>
                        <View style={{padding: 10, width: '100%', height: '100%', flex: 1, borderTopLeftRadius: 25, borderTopRightRadius: 25,}}>
                            <Headline style={{fontWeight: "500"}}>
                                All Workouts
                            </Headline>
                        </View>
                        <Divider />
                        <WorkoutComponent workoutModality={WORKOUT_MODALITY.CALISTHENICS} />
                        <Divider />
                        <WorkoutComponent workoutModality={WORKOUT_MODALITY.CALISTHENICS} />
                        <Divider />
                        <WorkoutComponent workoutModality={WORKOUT_MODALITY.METABOLIC} />
                        <Divider />
                        <WorkoutComponent workoutModality={WORKOUT_MODALITY.WEIGHTLIFTING} />
                        <Divider />
                        <WorkoutComponent workoutModality={WORKOUT_MODALITY.CALISTHENICS} />
                        <Divider />
                        <WorkoutComponent workoutModality={WORKOUT_MODALITY.METABOLIC} />
                        <Divider />
                        <WorkoutComponent workoutModality={WORKOUT_MODALITY.METABOLIC} />
                        <Divider />
                    </ScrollView>
                    </View>
                </Surface>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        display: "flex",
        backgroundColor: "rgba(0,111,230,0.2)",
    },
    buttonScroll: {
       
    },
    contentView: {
        display: "flex",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    workoutSurface: {
        position: "absolute",
        bottom: 0,
        height: "45%",
        width: "100%",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: "#FAFAFA",
        alignItems: "center",
        flexDirection: "column",
        elevation: 12,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
    },
    imageView: {
        width: "100%",
        height: "65%",
    },
    overlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: "rgba(0,111,230,0.2)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        padding: 10
    }
});

export default connect(mapStateToProps)(WorkoutView);