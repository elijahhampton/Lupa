import React from 'react';

import {
    View,
    StyleSheet,
    ImageBackground,
    Modal,
    Text,
    TouchableWithoutFeedback
} from 'react-native';

import {
    TextInput, 
    Title,
    Headline,
    Button,
    ProgressBar
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';

import Swiper from 'react-native-swiper';

import LupaController from '../../../../controller/lupa/LupaController';

import ChooseUsername from './Views/ChooseUsername';
import BasicInformation from './Views/BasicInformation';
import FitnessInterest from './Views/FitnessInterest';
import WorkoutTimes from './Views/WorkoutTimes';
import TrainerInformation from './Views/TrainerInformation';

import _requestPermissionsAsync from '../../../../controller/lupa/permissions/permissions';

import Color from '../../../common/Color';

let progress = 0;

export default class WelcomeModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currIndex: 0,
            pageChangedForward: false,
            progress: 0
        }

        _requestPermissionsAsync();
        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    }

    _handleNextViewClick = () => {
        if (this.state.currIndex == 4)
        {
            this.props.closeModalMethod();
            return;
        }
 
        this.setState({ 
            pageChangedForward: true,
            currIndex: this.state.currIndex + 1,
            progress: this.state.progress + .20
        });
    }

    _handleBackViewClick = () => {
        this.setState({ 
        pageChangedForward: false,
        currIndex: this.state.currIndex - 1,
        progress: this.state.progress - .20
    });
    }
    

    presentScreen = (index) => {
            switch(index) {
                case 0:
                    progress += 20;
                    return <ChooseUsername />
                case 1:
                    progress += 20;
                    return <TrainerInformation />
                case 2:
                    progress += 20;
                    return <BasicInformation isForwardPageChange={this.state.isForwardPageChange} />
                case 3:
                    progress += 20;
                    return <FitnessInterest />
                case 4:
                    progress += 20;
                    return <WorkoutTimes />
                default:
            }   
    }

    render() {
        return (
            <Modal presentationStyle="fullScreen" animated={true} animationType="slide" visible={this.props.isVisible} style={styles.modalContainer}>
                <SafeAreaView style={{flex: 1}}>
                    <ProgressBar style={{padding: 10}} animating={true} color="#2196F3" progress={this.state.progress}/>
                        <View style={{flex: 4, flexGrow: 5, flexShrink: 2}}>
                        {
                            this.presentScreen(this.state.currIndex)
                        }
                        </View>
                        <View style={styles.buttons}>
                            {
                               this.state.currIndex == 0 ?
                               <Text>

                               </Text>
                               :                              
                               <Button mode="text" color="#2196F3" onPress={() => this._handleBackViewClick()}>
                                                            Back
                                                        </Button>
                                        
                            }
                            
                            {
                                this.state.currIndex == 4 ?
                                <Button mode="contained" color="#2196F3" onPress={() => this._handleNextViewClick()}>
                                Done
                            </Button>
                            :
                            <Button mode="text" color="#2196F3" onPress={() => this._handleNextViewClick()}>
                            Next
                        </Button>
                            }
                            
                        </View>
                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        display: "flex",
        backgroundColor: "#FAFAFA",
        margin: 0,
    },
    wrapper: {
        height: "95%",
    },
    buttons: {
        flex: 1,
        flexGrow: 1,
        padding: 10,
        flexShrink: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    }
});