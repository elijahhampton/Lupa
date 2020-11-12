import React, { useEffect, useState } from 'react';

import {
    View,
    StyleSheet,
    Text,
    SectionList,
    Dimensions,
    Image,
    Modal,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
 
import {
    Icon 
} from 'react-native-elements';

import { connect, useDispatch } from 'react-redux';
import LupaController from '../../../../controller/lupa/LupaController';

import ProgramInformation from './component/ProgramInformation'
import { getLupaProgramInformationStructure } from '../../../../model/data_structures/programs/program_structures';
import FeatherIcon from 'react-native-vector-icons/Feather'
import LUPA_DB from '../../../../controller/firebase/firebase';
import { useNavigation } from '@react-navigation/native';

import { Button, Caption, Appbar } from 'react-native-paper'
import { Constants } from 'react-native-unimodules';
import BuildWorkoutController from './buildworkout/BuildWorkoutController';
import LOG, { LOG_ERROR } from '../../../../common/Logger';
import moment from 'moment'
const CreatingProgramModal = ({ uuid, closeModal, isVisible }) => {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    const [programData, setProgramData] = useState(getLupaProgramInformationStructure())
    const [changedUUID, setChangedUUID] = useState(0);
    const [componentReady, setComponentReady] = useState(true)
    const [isPublished, setIsPublished] = useState(false);
    
    const [isSaved, setSaved] = useState(false);

    const navigation = useNavigation();
    const dispatch = useDispatch()

    useEffect(() => {
        if (uuid == null || typeof(uuid) == 'undefined') {
            setComponentReady(false);
        }

        LOG('CreateProgram.js', 'Running useEffect.');
        setComponentReady(true);
    }, [uuid])

    const saveProgram = async () => {
        setComponentReady(false);
         //update current user
         await LUPA_CONTROLLER_INSTANCE.updateCurrentUser('programs', uuid, 'add');
         await LUPA_CONTROLLER_INSTANCE.markProgramCompleted(uuid);
         await LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(uuid).then(data => {
             dispatch({ type: 'ADD_CURRENT_USER_PROGRAM', payload: data})
             setProgramData(data);
         })
         setSaved(true);
         setComponentReady(true);
    }

    const handlePublishProgram =  async() => {
        setComponentReady(false);

        if (!isSaved) {
            //save program
            saveProgram()
        }

        //publish program
        await LUPA_CONTROLLER_INSTANCE.publishProgram(uuid)

        setComponentReady(true);
        setIsPublished(true);
    }


    const handleShareProgramOnPress = () => {
        closeModal()
        saveProgram();
        navigation.navigate('Train')
        navigation.navigate('ShareProgramModal', {
            programData: programData
        })
    }

    const handleOnComplete = () => {
        closeModal()
        navigation.navigate('Train')
    }

    const getComponentDisplay = () => {
        if ((componentReady && isPublished === false) || (componentReady && isSaved === false)) {
            return (
                <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)'  }}>
                        
                       <View style={{flexDirection: 'row', alignItems: 'center'}}>
                       <View style={{ paddingHorizontal: 10, paddingVertical: 20, alignItems: 'flex-start',}}>
                       <View style={{flexDirection: 'row', alignItems :'center', justifyContent: 'space-evenly'}}>
                       <View style={{marginRight: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', borderColor: '#1089ff', borderWidth: 1.5, width: 25, height: 25, borderRadius: 40}}>
                        <FeatherIcon name="check" size={15} color="#1089ff" />
                        </View>
                       <Text style={{fontFamily: 'Avenir-Light', paddingVertical: 5,  fontSize: 20, color: 'white',}}>
                            Your program is ready to publish
                        </Text>
                       </View>
                        <Text style={{color: 'white', fontFamily: 'Avenir', fontWeight: 'bold'}}>
                            After your program is published it will go live and instantly be available for purchase.
                        </Text>
                       </View>
                       
                       </View>

  

                        <View style={{marginVertical: 10, width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button disabled={isPublished} uppercase={false} color={isPublished  === true ? '#E5E5E5' : '#1089ff'} mode="contained" theme={{roundness: 8}} style={{elevation: 8, width: Dimensions.get('window').width - 100, alignItems: 'center', justifyContent: 'center', height: 45, borderColor: 'white'}} onPress={handlePublishProgram}>
                           {isPublished === true ? 'Published' : 'Save and Publish' }
                        </Button>
                        </View>

                        <View style={{marginVertical: 10, width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button disabled={isSaved} uppercase={false} color={isSaved  === true ? '#E5E5E5' : '#1089ff'} mode="contained" theme={{roundness: 8}} style={{elevation: 8, width: Dimensions.get('window').width - 100, alignItems: 'center', justifyContent: 'center', height: 45, borderColor: 'white'}} onPress={saveProgram}>
                           {isSaved === true ? 'Saved' : 'Save'}
                        </Button>
                        </View>

                        <View style={{marginVertical: 10, width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button uppercase={false} color="#1089ff" mode="contained" theme={{roundness: 8}} style={{elevation: 8, width: Dimensions.get('window').width - 100, alignItems: 'center', justifyContent: 'center', height: 45, borderColor: 'white'}} onPress={handleShareProgramOnPress}>
                            Share with friends
                        </Button>
                        </View>

                        <View style={{marginVertical: 10, width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button onPress={closeModal} uppercase={false} color="#1089ff" mode="contained" theme={{roundness: 8}} style={{elevation: 8, width: Dimensions.get('window').width - 100, alignItems: 'center', justifyContent: 'center', height: 45, borderColor: 'white'}}>
                            Exit
                        </Button>
                        </View>
    
                </SafeAreaView>
            )
        } else if (componentReady === true && isPublished === true) {
            return (
                <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)'  }}>
                        
                       <View style={{flexDirection: 'row', alignItems: 'center'}}>
                       <View style={{ paddingHorizontal: 10, paddingVertical: 20, alignItems: 'flex-start',}}>
                       <View style={{flexDirection: 'row', alignItems :'center', justifyContent: 'space-evenly'}}>
                       <View style={{marginRight: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', borderColor: '#1089ff', borderWidth: 1.5, width: 25, height: 25, borderRadius: 40}}>
                        <FeatherIcon name="check" size={15} color="#1089ff" />
                        </View>
                       <Text style={{fontFamily: 'Avenir-Light', paddingVertical: 5,  fontSize: 20, color: 'white',}}>
                            Your program has been published.
                        </Text>
                       </View>
                       </View>
                       
                       </View>

  

                        <View style={{marginVertical: 10, width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button disabled={isPublished} uppercase={false} color={isPublished  === true ? '#E5E5E5' : '#1089ff'} mode="contained" theme={{roundness: 8}} style={{elevation: 8, width: Dimensions.get('window').width - 100, alignItems: 'center', justifyContent: 'center', height: 45, borderColor: 'white'}} onPress={handlePublishProgram}>
                        {isPublished === true ? 'Published ' : 'Save and Publish' }
                        </Button>
                        </View>

                        <View style={{marginVertical: 10, width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button disabled={isSaved} uppercase={false} color={isSaved  === true ? '#E5E5E5' : '#1089ff'} mode="contained" theme={{roundness: 8}} style={{elevation: 8, width: Dimensions.get('window').width - 100, alignItems: 'center', justifyContent: 'center', height: 45, borderColor: 'white'}} onPress={saveProgram}>
                        {isSaved === true ? 'Saved' : 'Save'}
                        </Button>
                        </View>

                        <View style={{marginVertical: 10, width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button uppercase={false} color="#1089ff" mode="contained" theme={{roundness: 8}} style={{elevation: 8, width: Dimensions.get('window').width - 100, alignItems: 'center', justifyContent: 'center', height: 45, borderColor: 'white'}} onPress={handleShareProgramOnPress}>
                            Share with friends
                        </Button>
                        </View>

                        <View style={{marginVertical: 10, width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button onPress={closeModal} uppercase={false} color="#1089ff" mode="contained" theme={{roundness: 8}} style={{elevation: 8, width: Dimensions.get('window').width - 100, alignItems: 'center', justifyContent: 'center', height: 45, borderColor: 'white'}}>
                            Exit
                        </Button>
                        </View>
    
                </SafeAreaView>
            )
        }else {
            return (
                <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)'  }}>
                    <ActivityIndicator animating={true} color="white" />
                </SafeAreaView>
            )
        }
    }
    return (
        <Modal 
        animationType="fade"
        transparent={true}
        visible={isVisible}
        >
                {getComponentDisplay()}
        </Modal>
           
    )
}

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addProgram: (programPayload) => {
            dispatch({
                type: "ADD_CURRENT_USER_PROGRAM",
                payload: programPayload,
            })
        },
        deleteProgram: (programUUID) => {
            dispatch({
                type: "DELETE_CURRENT_USER_PROGRAM",
                payload: programUUID
            })
        },
    }
}

class CreateProgram extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            currIndex: 0,
            currProgramUUID: "",
            programData: getLupaProgramInformationStructure(),
            programImage: "",
            programComplete: false,
            creatingProgram: false,
        }

        this.nextIndex = this.nextIndex.bind(this);
    }

    async componentDidMount() {
        const UUID = Math.random().toString()
        await this.setState({ currProgramUUID: UUID }) 
        await this.setState({ programData: getLupaProgramInformationStructure(UUID, "", "" ,0, new Date(), new Date(), "", 0, 0, 0, {}, false, "", [], this.props.lupa_data.Users.currUserData.user_uuid, [this.props.lupa_data.Users.currUserData.user_uuid], "", false) })
        this.LUPA_CONTROLLER_INSTANCE.createNewProgram(UUID);
    }

    async componentWillUnmount() {
        if (this.state.programComplete == false) {
            //delete from database
            this.LUPA_CONTROLLER_INSTANCE.deleteProgram(this.props.lupa_data.Users.currUserData.user_uuid, this.state.currProgramUUID)
            if (typeof (this.state.currProgramUUID) != 'undefined' || this.state.currProgramUUID != '' || this.state.currProgramUUID == null) {
                //delete from redux
                this.props.deleteProgram(this.state.currProgramUUID)
            }
        }
    }

    captureProgramImage = (img) => {
        this.setState({
            programImage: img
        })
    }

    saveProgramInformation = async (programName, programDescription, numProgramSpots, programStartDate,
        programEndDate, programDuration, programTime, programPrice, programLocationData, programType,
        allowWaitlist, programImage, programTags, programAutomatedMessage, programDays) => {
        let updatedProgramData = {}

        updatedProgramData.program_structure_uuid = this.state.currProgramUUID;
        updatedProgramData.program_name = programName;
        updatedProgramData.program_description = programDescription;
        updatedProgramData.program_slots = numProgramSpots;
        updatedProgramData.program_start_date = moment().format();
        updatedProgramData.program_end_date = moment().add(programDuration, 'weeks').format()
        updatedProgramData.program_workout_days = programDays;
        updatedProgramData.program_duration = programDuration;
        updatedProgramData.program_time = programTime;
        updatedProgramData.program_price = programPrice;
        updatedProgramData.program_location = programLocationData;
        updatedProgramData.program_type = programType;
        updatedProgramData.program_allow_waitlist = allowWaitlist;
        updatedProgramData.program_image = this.state.programImage
        updatedProgramData.program_tags = programTags;
        updatedProgramData.program_participants = [this.props.lupa_data.Users.currUserData.user_uuid]
        updatedProgramData.program_owner = this.props.lupa_data.Users.currUserData.user_uuid;
        updatedProgramData.program_automated_message = programAutomatedMessage
        updatedProgramData.completedProgram = false;
        updatedProgramData.type = 'PROGRAM'
        updatedProgramData.program_purchase_metadata = {
            num_purchases: 0,
            purchase_list: [],
            date_purchased: new Date(), //remove
            gross_pay: 0,
            net_pay: 0,
        };
        updatedProgramData.program_metadata = {
            num_interactions: 0,
            views: 0,
            shares: 0,
        };

        let newState = {}
        this.setState({ programData: updatedProgramData })

        await this.LUPA_CONTROLLER_INSTANCE.updateProgramData(this.state.currProgramUUID, updatedProgramData);
        this.goToIndex(1)
    }

    saveProgramWorkoutData = async (workoutData) => {
        await this.LUPA_CONTROLLER_INSTANCE.updateProgramWorkoutData(this.state.currProgramUUID, workoutData)
        this.setState({ programComplete: true, creatingProgram: true });
    }

    handleSuccessfulReset = () => {
        this.setState({ 
            creatingProgram: false,
        })
    }

    saveProgram = async () => {
        await this.setState({
            programComplete: true
        })

        try {
            const programPayload = await this.LUPA_CONTROLLER_INSTANCE.saveProgram(this.props.lupa_data.Users.currUserData.user_uuid, this.state.programData);
            this.props.addProgram(programPayload);
        } catch (err) {
            await this.setState({
                programComplete: false
            })
        }
    }

    prevIndex = () => {
        this.setState({
            currIndex: this.state.currIndex - 1
        })
    }

    nextIndex = () => {
        this.setState({
            currIndex: this.state.currIndex + 1
        })
    }

    goToIndex = (index) => {
        this.setState({
            currIndex: index
        })
    }

    exit = () => {
        if (this.state.programComplete == false) {
            //delete from database
            this.LUPA_CONTROLLER_INSTANCE.deleteProgram(this.props.lupa_data.Users.currUserData.user_uuid, this.state.currProgramUUID)

            if (typeof (this.state.currProgramUUID) != 'undefined' || this.state.currProgramUUID != '' || this.state.currProgramUUID == null) {
                //delete from redux
                this.props.deleteProgram(this.state.currProgramUUID)
            }
        }

        this.props.navigation.goBack();
    }

    getViewDisplay = () => {
        switch (this.state.currIndex) {
            case 0:
                return (
                    <ProgramInformation captureImage={img => this.captureProgramImage(img)} handleCancelOnPress={this.exit} goToIndex={this.nextIndex} saveProgramInformation={(
                        programName,
                        programDescription,
                        numProgramSpots,
                        programStartDate,
                        programEndDate,
                        programDuration,
                        programTime,
                        programPrice,
                        programLocationData,
                        programType,
                        allowWaitlist,
                        programImage,
                        programTags,
                        programAutomatedMessage,
                        programWorkoutDays) => this.saveProgramInformation(programName,
                            programDescription,
                            numProgramSpots,
                            programStartDate,
                            programEndDate,
                            programDuration,
                            programTime,
                            programPrice,
                            programLocationData,
                            programType,
                            allowWaitlist,
                            programImage,
                            programTags,
                            programAutomatedMessage,
                            programWorkoutDays
                        )} />
                )
            case 1:
                return <BuildWorkoutController navigation={this.props.navigation} programUUID={this.state.currProgramUUID} programData={this.state.programData} goToIndex={this.goToIndex} saveProgramWorkoutData={workoutData => this.saveProgramWorkoutData(workoutData)} /> 
            default:
        }
    }


    render() {
        return (
            <View style={styles.root}>
                {
                    this.getViewDisplay()
                }
                <CreatingProgramModal uuid={this.state.currProgramUUID} isVisible={this.state.creatingProgram} closeModal={this.handleSuccessfulReset} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateProgram);