import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Modal,
    ScrollView,
    Image,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';

import {
    Divider,
    Button,
    Menu,
    Paragraph,
    Caption,
    Surface,
    TextInput,
    Portal,
    Avatar,
    Appbar,
    Dialog,
} from 'react-native-paper';

import ShareProgramModal from '../program/modal/ShareProgramModal'

import { ListItem, Input } from 'react-native-elements'
import { Video } from 'expo-av'
import FeatherIcon from "react-native-vector-icons/Feather"
import { connect } from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';
import { Fire } from '../../../controller/firebase/firebase';
import LupaController from '../../../controller/lupa/LupaController';
import ThinFeatherIcon from "react-native-feather1s";
import { Constants } from 'react-native-unimodules';
import { getLupaProgramInformationStructure } from '../../../model/data_structures/programs/program_structures';
import RBSheet from "react-native-raw-bottom-sheet";
import { getLupaUserStructure } from '../../../controller/firebase/collection_structures';
import CircularUserCard from '../../user/component/CircularUserCard';
import LiveWorkoutFullScreenContentModal from './LiveWorkoutFullScreenContentModal';
import RestTimer from './RestTimer';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}


class LiveWorkout extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        this.interactionsRBSheet = React.createRef();
        this.interactionRBSheet = React.createRef();
        this.shareProgramRBSheet = React.createRef()
        this.interactionInput = React.createRef();

        this.state = {
            workoutStructure: ['Workout Name', 'Workout Name', 'Workout Name'],
            currentWorkout: {
                workout_name: "",
                workout_description: "",
                workout_media: {
                    uri: "",
                    media_type: ""
                },
                workout_steps: [],
                workout_tags: [],
                workout_uid: "",
                workout_cue: "",
                workout_sets: 0,
                workout_reps: 0,
                superset: []
            },
            currentWorkoutStructure: [],
            workoutDays: [],
            currentWorkoutDay: "",
            currentDayIndex: 0,
            currentWorkoutIndex: 0,
            playVideo: false,
            contentShowing: false,
            ready: false,
            programData: getLupaProgramInformationStructure(),
            programOwnerData: getLupaUserStructure(),
            dayMenuVisible: false,
            currentDisplayedMediaURI: "",
            contentTypeDisplayed: "",
            componentDidErr: false,
            liveWorkoutOptionsVisible: false,
            currUserFollowing: [],
            feedback: "",
            feedbackDialogIsVisible: false,
            mediaContainerHeight: 0,
            messages: [],
            interactionInputFocused: false,
            showFullScreenContent: false,
            showFinishedDayDialog: false,
            restTimerStarted: false,
            restTimerVisible: false,
            descriptionDialogVisible: false,
        }
    }

    async componentDidMount() {
        await this.setupLiveWorkout();
        await this.setupFire();
    }


    setupFire = async () => {
        let privateChatUUID;

        //check for shared chat uuid between users
        await this.LUPA_CONTROLLER_INSTANCE.getPrivateChatUUID(this.props.lupa_data.Users.currUserData.user_uuid, this.state.programOwnerData.user_uuid).then(result => {
            privateChatUUID = result;
        })

        //init Fire
        await Fire.shared.init(privateChatUUID);

        await Fire.shared.on(message =>
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, message),
            }))
        );
    }

    componentWillUnmount() {
        Fire.shared.off();
    }

    setupLiveWorkout = async () => {
        if (this.props.route.params.programData) {
            await this.setState({ programData: this.props.route.params.programData })
            console.log('di')
        } else if (this.props.route.params.uuid) {
            console.log('should have gone here')
            try {
                switch(this.props.route.params.workoutType) {
                    case 'PROGRAM':
                        console.log('PROGRAMsfalkdjflsd;kfjsdkl;fjasdl;')
                        await this.LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(this.props.route.params.uuid).then(data => {
                            this.setState({ programData: data })
                        })
                        break;
                    case 'WORKOUT':
                        await this.LUPA_CONTROLLER_INSTANCE.getWorkoutInformationFromUUID(this.props.route.params.uuid).then(data => {
                            console.log(data);
                            this.setState({ programData: data })
                        })
                        break;
                    default:
                        console.log('dsfsdjfklsfdksdlk')
                        this.setState({ ready: false, componentDidErr: true })
                }
    
                await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(this.state.programData.program_owner).then(data => {
                    this.setState({ programOwnerData: data })
                })
    
                await this.LUPA_CONTROLLER_INSTANCE.getUserInformationFromArray(this.props.lupa_data.Users.currUserData.following).then(data => {
                    this.setState({ currUserFollowing: data })
                })
    
    
                await this.loadWorkoutDays()
            } catch (err) {
                console.log(err)
                await this.setState({ ready: false, componentDidErr: true })
            }
        }



        await this.setState({ ready: true })

    }

    loadWorkoutDays = () => {
        this.setState({ workoutDays: this.state.programData.program_workout_days })
        this.loadCurrentDayWorkouts(this.state.programData.program_workout_days[0])
    }

    loadCurrentDayWorkouts = (day) => {
      /*  if (!this.state.ready) {
            return;
        }*/

        let workoutStructure;
        console.log('THE STRUCTURE: ')
        console.log(this.state.programData.program_workout_structure.Monday)
        switch (day) {
            case 'Monday':
                workoutStructure = this.generateWorkoutStructure(this.state.programData.program_workout_structure.Monday)
                this.setState({ currentWorkoutDay: day, currentWorkoutStructure: workoutStructure, currentWorkout: workoutStructure[0], currentWorkoutIndex: 0 })
                break;
            case 'Tuesday':
             
                console.log('UMMM: ' + this.state.programData.program_workout_structure.Tuesday)
                workoutStructure = this.generateWorkoutStructure(this.state.programData.program_workout_structure.Tuesday)
                
                this.setState({ currentWorkoutDay: day, currentWorkoutStructure: workoutStructure, currentWorkout: workoutStructure[0], currentWorkoutIndex: 0 })
                break;
            case 'Wednesday':
                workoutStructure = this.generateWorkoutStructure(this.state.programData.program_workout_structure.Wednesday)
                this.setState({ currentWorkoutDay: day, currentWorkoutStructure: workoutStructure, currentWorkout: workoutStructure[0], currentWorkoutIndex: 0 })
                break;
            case 'Thursday':
                workoutStructure = this.generateWorkoutStructure(this.state.programData.program_workout_structure.Thursday)
                this.setState({ currentWorkoutDay: day, currentWorkoutStructure: workoutStructure, currentWorkout: workoutStructure[0], currentWorkoutIndex: 0 })
                break;
            case 'Friday':
                workoutStructure = this.generateWorkoutStructure(this.state.programData.program_workout_structure.Friday)
                this.setState({ currentWorkoutDay: day, currentWorkoutStructure: workoutStructure, currentWorkout: workoutStructure[0], currentWorkoutIndex: 0 })
                break;
            case 'Saturday':
                workoutStructure = this.generateWorkoutStructure(this.state.programData.program_workout_structure.Saturday)
                this.setState({ currentWorkoutDay: day, currentWorkoutStructure: workoutStructure, currentWorkout: workoutStructure[0], currentWorkoutIndex: 0 })
                break;
            case 'Sunday':
                workoutStructure = this.generateWorkoutStructure(this.state.programData.program_workout_structure.Sunday)
                this.setState({ currentWorkoutDay: day, currentWorkoutStructure: workoutStructure, currentWorkout: workoutStructure[0], currentWorkoutIndex: 0 })
                break;
            default:
        }

        this.setState({ dayMenuVisible: false })
    }

    generateWorkoutStructure = (workoutData) => {
        let workoutStructure = []
        console.log('WORKOUTDATA: ' + workoutData)
        for (let i = 0; i < workoutData.length; i++) {
            workoutStructure.push(workoutData[i]); //Add the first workout
            for (let j = 0; j < workoutData[i].superset.length; j++) {
                workoutStructure.push(workoutData[i].superset[j]);
            }
        }

        return workoutStructure;
    }

    handleOnChangeWorkout = async (workout) => {
        await this.setState({ currentWorkout: workout, contentShowing: true, contentTypeDisplayed: workout.workout_media.media_type })
    }

    openDayMenu = () => this.setState({ dayMenuVisible: true })

    closeDayMenu = () => this.setState({ dayMenuVisible: false })

    showLiveWorkoutOptionsModal = () => {
        this.setState({ liveWorkoutOptionsVisible: true })
    }

    closeLiveWorkoutOptionsModal = () => {
        this.setState({ liveWorkoutOptionsVisible: false })
    }

    renderPreviewContent = (type, uri) => {
        switch (type) {
            case 'IMAGE':
                return this.getImageWorkoutPreviewCover(uri)
            case 'VIDEO':
                return this.getVideoWorkoutPreviewCover(uri)
            default:
                return (
                    //In this case render information about the workout
                    <View style={{ borderRadius: 10, borderWidth: 1, borderColor: '#FFFFFF', width: '100%', height: '100%', backgroundColor: 'black' }}>

                    </View>
                )
        }
    }

    getVideoWorkoutPreviewCover = (uri) => {
        try {
            return (
                <Video
                    source={{ uri: uri }}
                    rate={1.0}
                    volume={0}
                    isMuted={true}
                    resizeMode="cover"
                    shouldPlay={false}
                    isLooping={false}
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: '#FFFFFF',
                    }}
                />



            )
        } catch (err) {
            alert(err)
            return (

                <View style={{ flex: 1, borderRadius: 10, backgroundColor: '#212121', color: 'white', justifyContent: 'center', justifyContent: 'center' }}>
                    <Text>
                        Sorry it looks like something went wrong.  Try loading the workout again to get the video.
                   </Text>
                </View>
            )
        }
    }

    getImageWorkoutPreviewCover = (uri) => {
        return (
            <Image source={{ uri: uri }} resizeMethod='scale' resizeMode='cover' style={{ borderRadius: 10, borderWidth: 1, borderColor: '#FFFFFF', width: '100%', height: '100%' }} />
        )
    }

    renderContent = () => {
        if (!this.state.ready) {
            return (
                <View style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>

                </View>
            )
        }

        if (this.state.currentWorkout.workout_media.media_type == null || typeof (this.state.currentWorkout.workout_media.media_type) == 'undefined') {
            return (
                <View style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>

                </View>
            )
        }

        const workoutMediaType = this.state.currentWorkout.workout_media.media_type
        switch (workoutMediaType) {
            case 'IMAGE':
                return this.getWorkoutImageMedia(this.state.currentWorkout.workout_media.uri);
            case 'VIDEO':
                return this.getWorkoutVideoMedia(this.state.currentWorkout.workout_media.uri);
            default:
                return (
                    //In this case render information about the workout
                    <View style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>

                    </View>
                )
        }
    }

    getWorkoutImageMedia = (uri) => {
        try {
            return <Image source={{ uri: uri }} style={{ width: '100%', height: '100%' }} resizeMethod="scale" resizeMode="cover" />
        } catch (error) {
            alert(err)
            return (

                <View style={{ flex: 1, backgroundColor: '#212121', color: 'white', justifyContent: 'center', justifyContent: 'center' }}>
                    <Text>
                        Sorry it looks like something went wrong.  Try loading the workout again to get the video.
                   </Text>
                </View>
            )
        }
    }

    getWorkoutVideoMedia = (uri) => {
        try {
            return (
                <>
                    <Video
                        source={{ uri: uri }}
                        rate={1.0}
                        volume={0}
                        isMuted={true}
                        resizeMode="cover"
                        shouldPlay={this.state.playVideo}
                        isLooping={true}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        {renderVideoIcon()}
                    </Video>



                </>
            )
        } catch (err) {
            alert(err)
            return (

                <View style={{ flex: 1, backgroundColor: '#212121', color: 'white', justifyContent: 'center', justifyContent: 'center' }}>
                    <Text>
                        Sorry it looks like something went wrong.  Try loading the workout again to get the video.
                   </Text>
                </View>
            )
        }

    }

    renderVideoIcon = () => {
        return this.state.playVideo == true ?
            <ThinFeatherIcon
                thin={true}
                name="pause-circle"
                size={30}
                color="#FFFFFF"
                onPress={() => this.setState({ playVideo: false })}
                style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', padding: 10 }} />
            :
            <ThinFeatherIcon
                thin={true}
                name="play-circle"
                size={30}
                color="#FFFFFF"
                onPress={() => this.setState({ playVideo: true })}
                style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', padding: 10 }}
            />
    }

    handleShowInteractionRBSheet = async () => {
        this.setState({ liveWorkoutOptionsVisible: false })
        if (this.state.playVideo === true) {
            this.setState({ playVideo: false })
        }

        this.interactionRBSheet.current.open()
    }

    handleShareProgram = async () => {
        this.setState({ liveWorkoutOptionsVisible: false })
        if (this.state.playVideo === true) {
            this.setState({ playVideo: false })
        }

        this.props.navigation.push('ShareProgramModal', {
            programData: this.state.programData
        })
    }

    handleCloseLiveWorkout = () => {
        this.closeLiveWorkoutOptionsModal()
        this.props.navigation.pop()
    }

    advanceExercise = () => {
       this.setState({ restTimerVisible: true, restTimerStarted: true });
        if (this.state.currentWorkoutIndex === this.state.currentWorkoutStructure.length - 1) {
            this.setState({
                showFinishedDayDialog: true
            })
            return;
        }

        this.setState(prevState => {
            return {
                currentWorkout: this.state.currentWorkoutStructure[prevState.currentWorkoutIndex + 1],
                currentWorkoutIndex: prevState.currentWorkoutIndex + 1
            }
        })
    }

    renderWorkoutReps = () => {
        if (typeof(this.state.currentWorkout.workout_name) == 'undefined' || this.state.currentWorkout.workout_name == '') {
            return "-"
        }

        return this.state.currentWorkout.workout_reps;
    }

    renderWorkoutSets = () => {
        if (typeof(this.state.currentWorkout.workout_name) == 'undefined' || this.state.currentWorkout.workout_name == '') {
            return "-"
        }

        return this.state.currentWorkout.workout_sets;
    }

    renderWorkoutTempo = () => {
        return "0 - 0 - 0"
    }

   showDialog = () => this.setState({ showFinishedDayDialog: true }) 

   hideDialog = () => this.setState({ showFinishedDayDialog: false }) 

    renderComponentDisplay = () => {
        if (this.state.ready === true && this.state.componentDidErr === false && typeof (this.state.programData) != 'undefined') {
            return (
                <SafeAreaView style={{ flex: 1 }}>
                    <View onLayout={event => this.setState({ mediaContainerHeight: event.nativeEvent.layout.height })} style={{ flex: 2.5, alignItems: 'center', justifyContent: 'center' }}>

                        <Surface style={{ backgroundColor: 'black', height: '55%', borderRadius: 8, width: Dimensions.get('window').width - 20 }}>
                            <Video
                                source={require('../../videos/pushuppreview.mov')}
                                rate={1.0}
                                volume={0}
                                isMuted={true}
                                resizeMode="cover"
                                shouldPlay={true}
                                isLooping={true}
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                            {/*this.renderContent()*/}
                        </Surface>
                        <View style={{ paddingVertical: 10, width: Dimensions.get('window').width - 20, justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'Avenir-Heavy' }}>
                                {this.state.programData.program_name}
                        </Text>
                        <>
                            <Text style={{ fontFamily: 'Avenir-Light', paddingVertical: 3 }} numberOfLines={2}>
                               {this.state.programData.program_description}
                               
                    </Text>
                    <Text onPress={() => this.setState({ descriptionDialogVisible: true })} style={{color: '#1089ff', fontFamily: 'Avenir-Light'}}>
                                   Read full description
                               </Text>
                    </>
                        </View>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                        <View style={{ paddingHorizontal: 10, flex: 2, alignItems: 'flex-start', justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'Avenir-Heavy' }}>
                                {this.state.currentWorkout.workout_name}
                            </Text>
                            <Text style={{ fontFamily: 'Avenir-Light' }}>
                                {this.state.currentWorkout.workout_description == '' ? 'No description found for this workout.' : this.state.currentWorkout.workout_description}
                            </Text>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ alignSelf: 'flex-start', fontFamily: 'Avenir-Heavy' }}>
                                Participants
                        </Text>
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Profile', { userUUID: this.props.lupa_data.Users.currUserData.user_uuid })}>
                            <Surface style={{ marginVertical: 5, elevation: 8, width: 45, height: 45, borderRadius: 65 }}>
                                {this.props.lupa_data.Users.currUserData.photo_url == '' ? <Avatar.Text size={45} label="EH" labelStyle={{ color: 'white', fontSize: 15, fontFamily: 'Avenir' }} style={{ backgroundColor: '#1089ff' }} /> : <Avatar.Image style={{ flex: 1 }} size={45} source={{ uri: this.props.lupa_data.Users.currUserData.photo_url }} />}
                            </Surface>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                    <Divider style={{width: '100%'}} />
                    <View style={{ flex: 2, flexDirection: 'row' }}>
                       
                        <View style={{ width: '70%', justifyContent: 'space-evenly' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
                                <View style={{ alignItems: 'flex-start', marginRight: 10 }}>
                                    <Text style={{ paddingVertical: 3 }}>
                                        Sets
                        </Text>
                                    <View style={{ borderWidth: 1.2, borderRadius: 3, borderColor: 'rgb(218, 221, 234)', paddingHorizontal: 20, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontFamily: 'Avenir-Light' }}>
                                            {this.renderWorkoutSets()}
                            </Text>
                                    </View>
                                </View>

                                <View style={{ alignItems: 'flex-start', marginRight: 10 }}>
                                    <Text style={{ paddingVertical: 3 }}>
                                        Reps
                        </Text>
                                    <View style={{ borderWidth: 1.2, borderRadius: 3, borderColor: 'rgb(218, 221, 234)', paddingHorizontal: 20, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontFamily: 'Avenir-Light' }}>
                                            {this.renderWorkoutReps()}
                            </Text>
                                    </View>
                                </View>

                                <View style={{ alignItems: 'flex-start', paddingHorizontal: 20 }}>
                                    <Text style={{ paddingVertical: 3 }}>
                                        Tempo
                        </Text>
                                    <View style={{ borderWidth: 1.2, borderRadius: 3, borderColor: 'rgb(218, 221, 234)', paddingHorizontal: 50, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontFamily: 'Avenir-Light' }}>
                                           {this.renderWorkoutTempo()}
                            </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginLeft: 20, borderWidth: 1.2, borderRadius: 3, borderColor: 'rgb(218, 221, 234)', paddingHorizontal: 30, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'Avenir-Heavy' }}>
                                    Workout Day:
                    </Text>
                                <Menu visible={this.state.dayMenuVisible} anchor={
                                    <Button onPress={() => this.setState({ dayMenuVisible: true })} color="#1089ff" icon={() => <FeatherIcon name="chevron-down" size={20} />} uppercase={false} style={{ alignSelf: 'flex-start' }}>
                                        {this.state.programData.program_workout_days[0]}
                    </Button>
                                }>
                                    {

                                        this.state.programData.program_workout_days.map((day, index, arr) => {
                                            return <Menu.Item onPress={() => this.loadCurrentDayWorkouts(day)} title={day} titleStyle={{ fontFamily: 'Avenir' }} key={index} />
                                        })
                                    }

                                </Menu>

                            </View>
                        </View>

                        <View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }}>
                            {/* Nada */}
                        </View>

                    </View>

                    <TouchableOpacity style={{ position: 'absolute', bottom: 0, right: 0, }} onPress={() => this.advanceExercise()}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#1089ff', width: 80, height: 80, borderTopLeftRadius: 100 }}>
                            <ThinFeatherIcon name="arrow-right" size={30} color="white" />
                        </View>
                    </TouchableOpacity>

                </SafeAreaView>
            )
        } else if (this.state.componentDidErr) {
            return (
                <View style={{ flex: 1, paddingVertical: 100, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>

                    <Text style={{ fontSize: 15, fontFamily: 'HelveticaNeue' }}>
                        It looks like something wrong.  Try again later.
                        </Text>
                    <Button onPress={() => this.props.navigation.pop()} uppercase={false} mode="text" color="#1089ff" icon={() => <FeatherIcon name="arrow-left" color="#1089ff" />}>
                        Try again later
                        </Button>

                </View>
            )
        } else {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>
                        Loading your program...
                    </Text>
                </View>
            )
        }
    }

    renderInteractionBottomSheet = () => {
        return (
            <RBSheet
                ref={this.interactionRBSheet}
                height={Dimensions.get('window').height / 1.8}
                dragFromTopOnly={true}
                closeOnDragDown={true}
                customStyles={{
                    wrapper: {

                    },
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20
                    },
                    draggableIcon: {
                        backgroundColor: 'rgb(220, 220, 220)',
                    }
                }}
            >
                <Surface style={{ flex: 1, elevation: 0 }}>
                    <Text style={{ alignSelf: 'center', paddingVertical: 10, fontSize: 15, fontFamily: 'HelveticaNeue-Bold' }}>
                        Interactions
                    </Text>
                    
                    <View style={{ padding: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                       
                        <Avatar.Image style={{ marginHorizontal: 10 }} size={40} source={{ uri: this.state.programOwnerData.photo_url }} />

                      
                        <View>
                            <Text style={{ fontFamily: 'Avenir-Heavy', fontSize: 15 }}>
                                {this.state.programOwnerData.display_name}
                            </Text>
                            <Text style={{ color: '#23374d', fontFamily: 'Avenir-Roman' }}>
                                National Academy of Sports and Medicine
                            </Text>
                        </View>
                    </View>
                    <Divider />
                    <View style={{ flex: 1, backgroundColor: '#E5E5E5' }}>
                        <GiftedChat
                            messages={this.state.messages}
                            onSend={Fire.shared.send}
                            user={Fire.shared.getUser()}
                            showAvatarForEveryMessage={true}
                            placeholder="Begin typing here"
                            isTyping={true}
                            renderUsernameOnMessage={true}
                            showUserAvatar={true}
                            alwaysShowSend={true}
                            renderInputToolbar={() => this.state.interactionInputFocused === true ?
                                null
                                :
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, position: 'absolute', bottom: 10 }}>

                                    <Input
                                        leftIcon={() => <FeatherIcon color="#1089ff" name="message-circle" size={20} />}
                                        placeholder='How is your workout?'
                                        inputStyle={{ fontSize: 15, padding: 10 }}
                                        containerStyle={{ width: '80%', borderBottomWidth: 0 }}
                                        inputContainerStyle={{ borderBottomWidth: 0, backgroundColor: 'rgb(247, 247, 247)', borderRadius: 20 }}
                                        returnKeyType="done"
                                        returnKeyLabel="done"
                                    />
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '20%' }}>
                                        <FeatherIcon name="paperclip" size={20} />
                                        <FeatherIcon name="send" size={20} />
                                    </View>

                                </View>
                            }
                        />
                        {
                            this.state.interactionInputFocused === true ?
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width }}>

                                    <Input
                                        onFocus={() => this.setState({ interactionInputFocused: true })}
                                        onBlur={() => this.setState({ interactionInputFocused: false })}
                                        leftIcon={() => <FeatherIcon color="#1089ff" name="message-circle" size={20} />}
                                        placeholder='How is your workout?'
                                        inputStyle={{ fontSize: 15, padding: 10 }}
                                        containerStyle={{ width: '80%', borderBottomWidth: 0 }}
                                        inputContainerStyle={{ borderBottomWidth: 0, backgroundColor: 'rgb(247, 247, 247)', borderRadius: 20 }}
                                        returnKeyType="done"
                                        returnKeyLabel="done"
                                    />
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '20%' }}>
                                        <FeatherIcon name="paperclip" size={20} />
                                        <FeatherIcon name="send" size={20} />
                                    </View>

                                </View>
                                :
                                null
                        }
                    </View>


                </Surface>
            </RBSheet>
        )
    }

    renderFollowing = () => {
        const followingList = this.state.currUserFollowing.map(user => {
            if (typeof (user) == 'undefined' || user == null || user.user_uuid == null) {
                return null
            }

            return (
                <CircularUserCard user={user} />
            )
        })

        return followingList;
    }

    renderLiveWorkoutOptions = () => {
        return (
            <Modal visible={this.state.liveWorkoutOptionsVisible} presentationStyle="overFullScreen" transparent animated={true} animationType="slide">
                <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}>
                    <View style={{ paddingHorizontal: 20, height: 'auto', justifyContent: 'space-evenly', alignItems: 'flex-start' }}>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                            <Avatar.Image style={{ marginRight: 10 }} size={25} source={{ uri: this.state.programOwnerData.photo_url }} />
                            <View style={{alignItems: 'flex-start'}}>
                            <Text style={[styles.RBSheetText, { fontSize: 15,fontFamily: 'Avenir-Heavy' }]}>
                                    {this.state.programOwnerData.display_name}
                                </Text>
                                <Text style={{color: 'white'}}>
                                    National Association of Sports and Medicine
                                </Text>
                            </View>
                            </View>

                        <Text style={[styles.RBSheetText, { paddingVertical: 10 }]} numberOfLines={4} ellipsizeMode="tail">
                            {this.state.programData.program_description}
                        </Text>
                    </View>


                    <View>
                        <ListItem
                            title=''
                            titleStyle={styles.interactionsTitleText}
                            subtitle=''
                            subtitleStyle={styles.RBSheetText}
                            containerStyle={{ backgroundColor: 'transparent' }}
                            bottomDivider
                        />
                        <ListItem
                            title='Interactions'
                            titleStyle={[styles.RBSheetText, styles.interactionsTitleText]}
                            subtitle='Open interactions with your trainer.'
                            subtitleStyle={styles.interactionsSubtitleText}
                            rightIcon={() => <FeatherIcon name="message-circle" color="#FFFFFF" size={20} />}
                            containerStyle={{ backgroundColor: 'transparent' }}
                            bottomDivider
                            onPress={this.handleShowInteractionRBSheet}
                        />
                        <ListItem
                            title='Feedback'
                            titleStyle={[styles.RBSheetText, styles.interactionsTitleText]}
                            subtitle='Leave feedback and results about this program.'
                            subtitleStyle={styles.interactionsSubtitleText}
                            rightIcon={() => <FeatherIcon name="clipboard" color="#FFFFFF" size={20} />}
                            containerStyle={{ backgroundColor: 'transparent' }}
                            bottomDivider
                            onPress={this.showFeedbackDialog}
                        />
                        <ListItem
                            title='Share'
                            titleStyle={[styles.RBSheetText, styles.interactionsTitleText]}
                            subtitle='Share this program with a friend.'
                            subtitleStyle={styles.interactionsSubtitleText}
                            rightIcon={() => <FeatherIcon name="share" color="#FFFFFF" size={20} />}
                            containerStyle={{ backgroundColor: 'transparent' }}
                            bottomDivider
                            onPress={this.handleShareProgram}
                        />
                    </View>
                </SafeAreaView>

                <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(58, 58, 60, 0.5)', borderRadius: 80, width: 50, height: 50, borderWidth: 1, borderColor: '#FFFFFF', bottom: Constants.statusBarHeight, alignSelf: 'center', }}>
                    <FeatherIcon onPress={() => this.closeLiveWorkoutOptionsModal()} name="x" color="white" size={20} style={{ alignSelf: 'center' }} />
                </View>
            </Modal>
        )
    }

    showFeedbackDialog = () => {
        this.closeLiveWorkoutOptionsModal()
        this.setState({ feedbackDialogIsVisible: true })
    }

    closeFeedbackDialog = () => {
        this.setState({ feedbackDialogIsVisible: false })
    }

    handleSaveFeedback = () => {
        // this.LUPA_CONTROLLER_INSTANCE.saveFeedback(this.props.lupa_data.Users.currUserData.user_uuid, this.state.programData.program_owner, this.state.feedback)
        this.closeFeedbackDialog()
    }

    handleFeedbackTextInputOnChangeText = (text) => {
        this.setState({ feedback: text })
    }

    renderFinishedDialog = () => {
        return (
            <Portal>
        <Dialog visible={this.state.showFinishedDayDialog}>
          <Dialog.Title>Congratulations!</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
                It looks like you finished the entire workout for today.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button color="#1089ff" onPress={this.hideDialog}>Done</Button>
            <Button color="#1089ff" onPress={this.hideDialog}>Create Vlog</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
        )
    }

    renderDescriptionDialog = () => {
        return (
            <Portal>
        <Dialog visible={this.state.descriptionDialogVisible}>
          <Dialog.Content>
            <Paragraph>
                {this.state.programData.program_description}
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button color="#1089ff" onPress={() => this.setState({ descriptionDialogVisible: false })}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
        )
    }

    renderFeedbackDialog = () => {
        return (
            <Dialog visible={this.state.feedbackDialogIsVisible} style={{ position: 'absolute', top: Constants.statusBarHeight + 50, width: Dimensions.get('window').width - 20, alignSelf: 'center' }}>
                <Dialog.Title>
                    Feedback
                </Dialog.Title>
                <Dialog.Content>
                    <Caption>
                        Leave {this.state.programOwnerData.display_name} a note about their program and the results you've seen.
                    </Caption>
                    <View>
                        <TextInput
                            multiline={true}
                            returnKeyLabel="done"
                            returnKeyType="done"
                            value={this.state.feeedback}
                            onChangeText={text => this.handleFeedbackTextInputOnChangeText(text)}
                            mode="flat"
                            theme={{ colors: { primary: '#1089ff' } }} />
                    </View>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button style={{ marginHorizontal: 10 }} uppercase={false} color="#1089ff" onPress={this.closeFeedbackDialog}>
                        Cancel
                    </Button>
                    <Button style={{ marginHorizontal: 10 }} uppercase={false} color="#1089ff" mode="contained" onPress={this.handleSaveFeedback}>
                        Done
                    </Button>
                </Dialog.Actions>
            </Dialog>
        )
    }

    render() {
        return (
            <>
                <Appbar.Header style={{ backgroundColor: '#1089ff'}}>
                    <Appbar.Action icon={() => <ThinFeatherIcon name="arrow-left" size={20} onPress={() => this.props.navigation.pop()} />} />

                    <Appbar.Content title={this.state.programData.program_name} titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20}} />

                    <Appbar.Action disabled={this.state.ready === false} icon={() => <ThinFeatherIcon thin={false} name="maximize" size={20} onPress={() => this.setState({ showFullScreenContent: true })} />} />
                    {this.props.route.params.workoutType === 'PROGRAM' ? <Appbar.Action disabled={this.state.ready === false} icon={() => <ThinFeatherIcon thin={false} name="list" size={20} onPress={() => this.setState({ liveWorkoutOptionsVisible: true })} />} /> : null }
                </Appbar.Header>
                {this.renderComponentDisplay()}
                {this.renderLiveWorkoutOptions()}
                {this.renderInteractionBottomSheet()}
                {this.renderFeedbackDialog()}
                {this.renderFinishedDialog()}
                {this.renderDescriptionDialog()}
                <RestTimer isVisible={this.state.restTimerVisible}  timerHasStarted={this.state.restTimerStarted} closeModal={() => this.setState({ restTimerVisible: false })}/>
                <LiveWorkoutFullScreenContentModal isVisible={this.state.showFullScreenContent} closeModal={() => this.setState({ showFullScreenContent: false })} contentType={'VIDEO' /*this.state.contentTypeDisplayed*/} contentURI={this.state.currentDisplayedMediaURI} />
            </>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        backgroundColor: "#FAFAFA",
        flex: 1
    },
    container: {

    },
    interactionSurface: {
        flex: 1,
        borderRadius: 15, elevation: 0,
        alignItems: "center",
        justifyContent: "center"
    },
    interactionSurfaceText: {
        fontFamily: 'avenir-roman',
        fontSize: 20,

    },
    RBSheetText: {
        color: 'white'
    },
    interactionsTitleText: {
        fontSize: 15,
        color: 'white',
    },
    interactionsSubtitleText: {
        fontSize: 12,
        color: 'white',
    }
})

export default connect(mapStateToProps)(LiveWorkout);
