import React, { memo } from 'react';

import {
    Text,
    View,
    SafeAreaView,
    Modal,
    StyleSheet,
    ImageBackground,
    Dimensions,
    Button as NativeButton,
    ScrollView,
    Image,
} from 'react-native';

import {
    Surface, Paragraph, Caption, Button, IconButton, Avatar,
    Appbar,
    Searchbar,
    Divider
} from 'react-native-paper';

import {
    Header,
    Left,
    Right,
    Body,
} from 'native-base';

import { withNavigation } from 'react-navigation';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
 
import { connect} from 'react-redux';
import { LOG_ERROR } from '../../../common/Logger';

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
        console.log('disable swipe')
        await this.getWorkoutsPreview()
    }

    componentWillMount() {
        console.log('enable swipe')
    }

    getWorkoutsPreview = () => {
        let workouts = new Array(8);

        for (let i = 0; i < this.props.navigation.state.params.programData.program_workout_structure.warmup.length; i++)
        {
            workouts.push(this.props.navigation.state.params.programData.program_workout_structure.warmup[i])
        }

        if (workouts.length == 8)
        {
            this.setState({
                workoutPreviewArr: workouts
            })

            return;
        }

        for (let i = 0; i < this.props.navigation.state.params.programData.program_workout_structure.primary.length; i++)
        {
            workouts.push(this.props.navigation.state.params.programData.program_workout_structure.primary[i])
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
            if (typeof(workout == undefined)) {
                return (
                <View style={{flex: 1, backgroundColor: '#212121', borderRadius: 20}}>

            </View>
                )
            }

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
        } catch(error) {
            LOG_ERROR('LiveWorkoutPreview.js', 'Unhandled exception in getWorkoutMedia()', error)
            return (
            <View style={{flex: 1, backgroundColor: '#212121', borderRadius: 20}}>

            </View>
            )
        }
        
    }

    getUserAvatar = () => {
        try {
            return  <Avatar.Image style={{margin: 10, alignSelf: 'flex-end'}} source={{uri: this.props.navigation.state.params.programData.program_owner.photo_url}} size={30} />
        }  catch(error) {
            LOG_ERROR('LiveWorkoutPreview.js', 'Unhandled exception in getUserAvatar', error)
            return  <Avatar.Icon icon="search" size={40} color="#212121" style={{margin: 10, alignSelf: 'flex-end'}} />
        }
    }

    getDisplayName = () => {
        try {
            return this.props.navigation.state.params.programData.program_owner.displayName
        } catch(err) {
            LOG_ERROR('LiveWorkoutPreview.js', 'Unhandled exception in getDisplayName()', error)
            return '';
        }
    }

    getCertification = () => {
        try {
            return this.props.navigation.state.params.programData.program_owner.certification
        }
        catch(error) {
            LOG_ERROR('LiveWorkoutPreview.js', 'Unhandled exception in getCertification()', error)
            return 'NASM'
        }
        
    }

    getProgramName = () => {
        try {
            return this.props.navigation.state.params.programData.program_name
        }
        catch(error) {
            LOG_ERROR('LiveWorkoutPreview.js', 'Unhandled exception in getProgramName()', error)
            return 'Unknown Program Title'
        }
        
    }

    render() {
        const programData = this.props.navigation.state.params.programData;
        return (
            <View style={{flex: 1}}>
                <Header style={{backgroundColor: 'transparent'}} span={false} transparent>
                    <Left>
                        <Appbar.BackAction onPress={() => this.props.navigation.pop()} />
                    </Left>
                    <Body>
                        <Text style={{fontFamily: 'HelveticaNeueMedium', fontSize: RFPercentage(2)}}>
                            {this.getProgramName()}
                        </Text>
                    </Body>

                    <Right />
                </Header>
                <View style={{flex: 2.5}}>
                    <ImageBackground source={{uri: programData.program_image}} style={{flex: 1}} imageStyle={{width: '100%', height: '100%'}}>
                    <View style={styles.viewOverlay} />
                   {this.getUserAvatar()}
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Text style={{color: '#FFFFFF', fontFamily: 'ARSMaquettePro-Medium', fontSize: 20, paddingLeft: 12 }}>
                            Look ahead
                        </Text>
                        <View >
                        <ScrollView horizontal shouldRasterizeIOS={true} showsHorizontalScrollIndicator={false} centerContent contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}>
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
                    </View>

                        <View style={{padding: 10, position: 'absolute', bottom: 0, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                           <View style={styles.textContainer}>
                               <Text style={styles.titleText}>
                                   TRAINER
                               </Text>
                               <Text style={styles.contentText}>
                                {this.getDisplayName()}
                            </Text>
                           </View>


                           <View style={styles.textContainer}>
                           <Text style={styles.titleText}>
                                  CERTIFICATION
                               </Text>
                               <Text style={styles.contentText}>
                               {this.getCertification()}
                            </Text>
                           </View>
                        </View>
                    </ImageBackground>
         
                </View>

                <View style={{flex: 1, justifyContent: 'space-between',  backgroundColor: '#F2F2F2'}}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Paragraph  style={{fontSize: RFPercentage(1.5) ,padding: 10, fontFamily: 'HelveticaNeueLight', textAlign: 'left', textAlignVertical: 'center', lineHeight: 15}}>
                    {this.props.navigation.state.params.programData.program_description}
                    </Paragraph>
                    </View>

                    <NativeButton title="Start Workout" onPress={() => this.props.navigation.push('LiveWorkout', {
                        programData: programData,
                    })}/>
                </View>
  {/*
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
                                      <Appbar.Header style={{backgroundColor: 'transparent', elevation: 0}}>
                                      <Appbar.BackAction onPress={() => this.props.navigation.pop()} />
                <Appbar.Content title="Live Workout" />
            
</Appbar.Header>
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
                                            {
                                                this.getUserAvatar()
                                            }
                                            <Text style={{padding: 3, color: '#FFFFFF', fontSize: 15, fontWeight: '500', fontFamily: 'ARSMaquettePro-Regular'}}>
                                                {
                                                    this.getDisplayName()
                                                }
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
                                           {this.getCertification()}
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
                            <View style={{padding: 10, alignItems: 'center',  justifyContent: 'center', width: '100%'}}>
                        
                            <Text style={{color: 'white'}}>
                                Slide Down to Begin
                            </Text>
                            <MaterialIcon name="expand-more" size={20} color="#FFFFFF" />
                            </View>
                        </View>
                            */}
                <SafeAreaView style={{ backgroundColor: '#F2F2F2' }} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    viewOverlay: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.8)',
        width: '100%',
        height: '100%',
    },
    titleText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontFamily: 'HelveticaNeueBold'
    },
    contentText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'HelveticaNeueMedium'
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default connect(mapStateToProps)(withNavigation(LiveWorkoutPreview));