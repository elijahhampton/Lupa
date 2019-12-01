import React from 'react';

import {
    View,
    StyleSheet,
    Text
} from 'react-native';

import {
    TextInput,
    Switch,
    Chip,
    Surface
} from 'react-native-paper';

import {
    Input
} from 'react-native-elements';

export default class FitnessInterest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            interest: [],
            interestText: '',
        }
    }

    addInterest = () => {
        this.setState(prevState => ({
            interest: [...prevState.interest, this.state.interestText]
        }));
    }

    deleteInterest = (key) => {

    }

    modifyInterest = () => {

    }

    render() {
        return (
            <View style={styles.root}>
                <View style={styles.instructionalTextContainer}>
                    <Text style={styles.instructionalText}>
                    What are your fitness interest? (i.e. Yoga, High Intensity Training, or Running?)
                    </Text>
                </View>

                <View style={styles.userInput}>
                    <Input placeholder="Enter an interest" 
                    inputStyle={{fontSize: 30, fontWeight: "600", color: "black"}} 
                    label="Interest" 
                    onChangeText={text => this.setState({ interestText: text })} 
                    onSubmitEditing={this.addInterest}
                    returnKeyType="done"
                    keyboardType="default"
                    value={this.state.interestText} />
                </View>

                <View style={styles.interestChips}>
                    {
                        this.state.interest.map(interest => {
                            return (
                                <Chip style={styles.chipStyle} >
                                    {interest}
                                </Chip>
                            )
                        })
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 20
    },
    chipStyle: {
        elevation: 3,
        display: "flex",
        backgroundColor: "#637DFF",
        width: 90,
        height: 30,
        margin: 5,
        flexWrap: 'wrap',
        flexBasis: 90,
    },
    instructionalTextContainer: {
        height: "30%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    instructionalText: {
        flexShrink: 1,
        fontSize: 20,
        fontWeight: "600"
    },
    userInput: {
        height: "20%",
        width: "100%",
        alignItems: "center",
    },
    interestChips: {
        height: "50%",
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        display: "flex",
    },
})