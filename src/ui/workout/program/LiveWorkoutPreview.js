import React from 'react';

import {
    Text,
    View,
    SafeAreaView,
    Modal,
    StyleSheet,
    ImageBackground,
    Dimensions,
    ScrollView,
} from 'react-native';

import {
    Surface, Paragraph, Caption, Button, IconButton, Avatar
} from 'react-native-paper';

import { LinearGradient } from 'expo-linear-gradient';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import ThinFeatherIcon from "react-native-feather1s";

import { connect} from 'react-redux';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

class LiveWorkoutPreview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            workoutPreviewArr: [],
        }
    }

    componentDidMount = async () => {
        await this.getWorkoutsPreview()
    }

    getWorkoutsPreview = () => {
        let workouts = new Array(8);

        for (let i = 0; i < this.props.programData.program_workout_structure.warmup.length; i++)
        {
            workouts.push(this.props.programData.program_workout_structure.warmup[i])
        }

        if (workouts.length == 8)
        {
            this.setState({
                workoutPreviewArr: workouts
            })

            return;
        }

        for (let i = 0; i < this.props.programData.program_workout_structure.primary.length; i++)
        {
            workouts.push(this.props.programData.program_workout_structure.primary[i])
        }

        if (workouts.length == 8)
        {
            this.setState({
                workoutPreviewArr: workouts
            })

            return;
        }

        this.setState({
            workoutPreviewArr: workouts
        })

    }

    getWorkoutMedia = (workout) => {
        try {
            if ( workout.workout_media.media_type == "VIDEO")
            {
                return (
                    <Video 
                    source={{ uri: workout.workout_media.uri }}
                    rate={1.0}
                    volume={0}
                    isMuted={true}
                    resizeMode="cover"
                    shouldPlay={false}
                    isLooping={false}
                    style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 20,
                    }} />
                )
            }
        } catch(err) {
            return (
            <View style={{flex: 1, backgroundColor: '#212121', borderRadius: 20}}>

            </View>
            )
        }
        
    }

    userHasProgramSaved = () => {
        let retVal =  false;

        for (let i = 0; i < this.props.lupa_data.Programs.currUserProgramsData.length; i++)
        {
            if (this.props.programData)
            {
                if (this.props.lupa_data.Programs.currUserProgramsData[i].program_uuid = this.props.programData.program_structure_uuid)
                {
                    retVal = true;
                    break;
                }
            }
            else
            {
                retVal = false;
            }
        }

        return retVal;
    }

    getBookmarkIcon = () => {
        return this.userHasProgramSaved() ?
                                            <IconButton icon="bookmark"  />
                                            :
                                            <IconButton icon="bookmark-border"  />
    }

    render() {
        const programOwnerData = this.props.programOwnerData;
        const programData = this.props.programData;
        return (
            <SafeAreaView  style={{flex: 1}}>
                 <LinearGradient
          colors={['#2196F3',  '#212121', '#000000' ]}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: Dimensions.get('window').height
          }}
        />
                    <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                            <Surface style={{ borderRadius: 5, width: Dimensions.get('window').width - 50, height: '80%'}}>
                                <Surface style={{elevation: 15, position: 'absolute', bottom: 120, alignSelf: 'center', width: '90%', height: '80%'}}>
                                    <ImageBackground imageStyle={{width: '100%', height: '100%'}} source={{uri: this.props.programData.program_image }} resizeMode="cover" resizeMethod="resize" style={{flex: 1}}>
                                    <View style={{position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, right: 0,backgroundColor: 'rgba(0,0,0, 0.4)'}} />
                                        <Text style={{padding: 5, alignSelf: 'center', color: '#FFFFFF', fontSize: 20, letterSpacing: 3,fontWeight: '300'}}>
                                        {this.props.programData.program_name}
                                        </Text>
                                        <View style={{padding: 5, flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', bottom: 0, width: '100%'}}>
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Avatar.Image source={{uri: this.props.programOwnerData.photo_url }} size={30} />
                                            <Text style={{padding: 3, color: '#FFFFFF', fontSize: 15, fontWeight: '500', fontFamily: 'ARSMaquettePro-Regular'}}>
                                                {this.props.programOwnerData.display_name}
                                            </Text>
                                            </View>
                                            <ThinFeatherIcon
                                                name="info"
                                                size={18}
                                                color="#FFFFFF"
                                                thin={false}
                                                style={{padding: 5}}
                                                        /> 
                                            <Text style={{padding: 5, color: '#FFFFFF', fontSize: 15, fontWeight: '500', fontFamily: 'ARSMaquettePro-Regular'}}>
                                            {this.props.programOwnerData.certification == undefined ? <Text> NASM </Text>: this.props.programOwnerData.certification}
                                            </Text>
                                        </View>
                                    </ImageBackground>
                                </Surface>
                                <View style={{bottom: 0, position: 'absolute', width: '100%', height: 120, alignItems: 'center', justifyContent: 'flex-end', padding: 5}}>
                                <Text style={{alignSelf: 'center', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, padding: 15, color: 'rgb(142, 142, 147)'}} numberOfLines={4}>
                              {this.props.programData.program_description}
                                </Text>
                                <View style={{alignSelf: 'flex-end', width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                        {
                                            this.getBookmarkIcon()
                                        }
                                        <IconButton icon="share" />
                                        </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 3}}>
                    {
                        this.props.programData.program_tags.map((tag, index, arr) => {
                            if (index == 3) return;
                            return (
                                <Caption>
                                    {tag}
                                </Caption>
                            )
                        })
                    }
                    </View>
                                </View>
                                </View>
                            </Surface> 
                        </View>

                        <View style={{flex: 1,}}>
                            <Text style={{color: '#FFFFFF', padding: 5, fontFamily: 'ARSMaquettePro-Regular', fontSize: 20}}>
                                Workouts Preview
                            </Text>
                            <View style={{flex: 1}}>
                            <ScrollView horizontal centerContent contentContainerStyle={{}}>
                                {
                                    this.state.workoutPreviewArr.map(workout => {
                                        return (
                                            <View style={{alignItems: 'center'}}>
                                         <Surface style={{width: 140, height: 80, margin: 10, borderRadius: 20, elevation: 4}}>
                                                {
                                                    this.getWorkoutMedia()
                                                }
                                            </Surface>
                                            <Text>
                                                <Caption style={{color: 'white'}}>
                                                    {workout.workout_name}
                                                </Caption>
                                            </Text>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                            </View>
                            <View style={{flex: 1, padding: 10, alignItems: 'center',  justifyContent: 'center', width: '100%'}}>
                        
                            <Text style={{color: 'white'}}>
                                Slide Down to Begin
                            </Text>
                            <MaterialIcon name="expand-more" size={20} color="#FFFFFF" />
                            </View>
                        </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    }
})

export default connect(mapStateToProps)(LiveWorkoutPreview);