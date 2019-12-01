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

import BasicInformation from './Views/BasicInformation';
import FitnessInterest from './Views/FitnessInterest';
import WorkoutTimes from './Views/WorkoutTimes';

//import LupaController from '../../../api/controller/LupaController';

export default class WelcomeModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currIndex: 3,
        }
    }

    render() {
        return (
            <Modal presentationStyle="fullScreen" visible={this.props.isVisible} style={styles.modalContainer}>
                <SafeAreaView style={{flex: 1}}>
                    <Swiper style={styles.wrapper} 
                        loop={false}
                        showButtons={false}
                        showsPagination={false}
                        index={this.state.currIndex}
                        horizontal={true}
                        scrollEnabled={false} >
                        <BasicInformation />
                        <FitnessInterest />
                        <WorkoutTimes />
                    </Swiper>
                        <View style={styles.buttons}>
                        <Button mode="text" color="#2196F3" onPress={() => this.setState({currIndex: this.state.currIndex - 1})}>
                                Back
                            </Button>
                            <Button mode="text" color="#2196F3" onPress={() => this.setState({currIndex: this.state.currIndex + 1})}>
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