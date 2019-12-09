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
    Button
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';

import Swiper from 'react-native-swiper';

import LupaController from '../../../../controller/lupa/LupaController';

import ChooseUsername from './Views/ChooseUsername';
import BasicInformation from './Views/BasicInformation';
import FitnessInterest from './Views/FitnessInterest';
import WorkoutTimes from './Views/WorkoutTimes';

import _requestPermissionsAsync from '../../../../controller/lupa/permissions/permissions';
export default class WelcomeModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currIndex: 1,
            pageChangedForward: false,
        }

        _requestPermissionsAsync();
        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    }

    _handleNextViewClick = () => {
        this.setState({ 
            pageChangedForward: true,
            currIndex: this.state.currIndex + 1 
        });
    }

    _handleBackViewClick = () => {
        this.setState({ 
        pageChangedForward: false,
        currIndex: this.state.currIndex - 1 
    });
    }

    presentScreen = (index) => {
        let isTrainer = this.LUPA_CONTROLLER_INSTANCE.isTrainer(this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid)
        
        if (isTrainer) {
            switch(index) {
                case 0:
                    return <ChooseUsername />
                case 1:
                    return <TrainerInformation />
                case 2:
                    return <BasicInformation isForwardPageChange={this.state.isForwardPageChange} />
                case 3:
                    return <FitnessInterest />
                case 4:
                    return <WorkoutTimes />
                case 5:
            }   
        }
        else {
            switch(index) {
                case 0:
                    return <ChooseUsername />
                case 1:
                    return <BasicInformation isForwardPageChange={this.state.isForwardPageChange} />
                case 2:
                    return <FitnessInterest />
                case 3:
                    return <WorkoutTimes />
                case 4:
            }
        }

    }

    render() {
        return (
            <Modal presentationStyle="fullScreen" visible={this.props.isVisible} style={styles.modalContainer}>
                <SafeAreaView style={{flex: 1}}>
                        <View style={{height: "95%"}}>
                        {
                            this.presentScreen(this.state.currIndex)
                        }
                        </View>
                        <View style={styles.buttons}>
                        <Button mode="text" color="#2196F3" onPress={this._handleBackViewClick}>
                                Back
                            </Button>
                            <Button mode="text" color="#2196F3" onPress={this._handleNextViewClick}>
                                Next
                            </Button>
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: "5%",
    }
});