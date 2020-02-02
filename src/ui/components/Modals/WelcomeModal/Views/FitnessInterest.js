import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import {
    TextInput,
    Switch,
    Chip,
    Surface,
    Button
} from 'react-native-paper';

import {
    Input
} from 'react-native-elements';

import Autocomplete from 'react-native-autocomplete-input'

import {
    interestData
} from '../../../../../controller/lupa/lupa_pre';

import LupaController from '../../../../../controller/lupa/LupaController';

export default class FitnessInterest extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            firstName: '',
            lastName: '',
            interest: [],
            autoCompleteData: [],
            interestText: '',
        }
    }

    addInterest = () => {
        this.setState(prevState => ({
            interest: [...prevState.interest, this.state.interestText]
        }));

        this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('interest', this.state.interestText);
    }

    _randomizeAutoCompleteData = (list) => {
        const fullList = interestData;
        for (let i = 0; i < 5; ++i) {
            list.push(fullList[Math.floor((Math.random() * 8))]); //Random number between 1 and 8.. Need to increase as interest list increases.
        }

        this.setState({
            autoCompleteData: list
        })
    }

    _manipulateSuggestionList = (input) => {
        console.log('Input: ' + input)
        let autoCompleteDataUnfiltered = [];
        this._randomizeAutoCompleteData(autoCompleteDataUnfiltered);

        let autoCompleteDataFiltered = interestData;

        if (input == '') { this.setState({ autoCompleteData: autoCompleteDataUnfiltered }) }
        const result = autoCompleteDataFiltered.filter(element => element.startsWith(input));
        this.setState({ autoCompleteData: result })
    }

    _handleOnChangeText = (text) => {
        this._manipulateSuggestionList(text);
        this.setState({ interestText: text })
    }

    _handleFinishAddingInterest = interest => {
        //  this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('interest', interest);
    }

    _returnTextInput = () => {
        return (
            <Input placeholder="Try something like 'Yoga' "
                inputStyle={{ fontSize: 25, fontWeight: "600", color: "black" }}
                label="Interest"
                onChangeText={text => this._handleOnChangeText(text)}
                onSubmitEditing={this.addInterest}
                returnKeyType="done"
                keyboardType="default"
                value={this.state.interestText}
            />
        )
    }

    closeModalMethod = () => {
        this.props.closeModalMethod();
    }

    render() {
        return (
            <View style={styles.root}>
                <View style={{ flex: 1, justifyContent: 'space-around' }}>
                    <Button mode="text" color="#E0E0E0" onPress={() => this.closeModalMethod()}>
                        Take me into the app
                </Button>
                    <View style={styles.instructionalTextContainer}>
                        <Text style={styles.instructionalText}>
                            What are your fitness interest?
                    </Text>
                    </View>
                </View>

                <View style={{ flex: 2, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                        <Chip style={{ alignItems: 'center', justifyContent: 'center', margin: 10, width: 100, height: 35, elevation: 5 }} mode="flat">
                            <Text>
                                Strength
                            </Text>
                        </Chip>

                        <Chip style={{ alignItems: 'center', justifyContent: 'center', margin: 10, width: 100, height: 35, elevation: 5 }} mode="flat">
                            <Text>
                                Power
</Text>
                        </Chip>

                        <Chip style={{ alignItems: 'center', justifyContent: 'center', margin: 10, width: 100, height: 35, elevation: 5 }} mode="flat">
                            <Text>
                                Endurance
</Text>
                        </Chip>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                        <Chip style={{ alignItems: 'center', justifyContent: 'center', margin: 10, width: 100, height: 35, elevation: 5 }} mode="flat">
                            <Text>
                                Flexibility
</Text>
                        </Chip>
                        <Chip style={{ alignItems: 'center', justifyContent: 'center', margin: 10, width: 100, height: 35, elevation: 5 }} mode="flat">
                            <Text>
                                Speed
</Text>
                        </Chip>
                        <Chip style={{ alignItems: 'center', justifyContent: 'center', margin: 10, width: 100, height: 35, elevation: 5 }} mode="flat">
                            <Text>
                                Agility
</Text>
                        </Chip>
                    </View>
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
    },
    instructionalTextContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        height: "20%",
    },
    instructionalText: {
        flexShrink: 1,
        fontSize: 20,
        fontWeight: "500"
    },
    userInput: {
        width: "100%",
        alignItems: "center",
        height: "50%",
    },
    interestChips: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: 'wrap',
    },
})