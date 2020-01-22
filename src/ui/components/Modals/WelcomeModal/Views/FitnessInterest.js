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

        if (input == '') { this.setState({ autoCompleteData: autoCompleteDataUnfiltered })}
        const result = autoCompleteDataFiltered.filter(element => element.startsWith(input));
        this.setState({ autoCompleteData: result})
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
                    inputStyle={{fontSize: 25, fontWeight: "600", color: "black"}} 
                    label="Interest" 
                    onChangeText={text => this._handleOnChangeText(text)} 
                    onSubmitEditing={this.addInterest}
                    returnKeyType="done"
                    keyboardType="default"
                    value={this.state.interestText} 
        />
        )
    }

    render() {
        return (
            <View style={styles.root}>
                <Button mode="text" color="#E0E0E0">
                    Take me into the app
                </Button>
                <View style={styles.instructionalTextContainer}>
                    <Text style={styles.instructionalText}>
                    What are your fitness interest? (i.e. Yoga, High Intensity Training, or Running?)
                    </Text>
                </View>

                <View style={styles.userInput}>

<Autocomplete
      data={this.state.autoCompleteData}
      onChangeText={text => this._handleOnChangeText(text)}
      renderItem={({ item, i }) => (
        <TouchableOpacity onPress={() => this.setState({ interest: this.state.interest.concat(item)})}>
          <Text style={{fontSize: 20, fontWeight: "300"}}>{item}</Text>
        </TouchableOpacity>
      )}
      containerStyle={{width: "100%", borderColor: "transparent"}}
      inputContainerStyle={{width: "100%", borderColor: "transparent"}}
      listContainerStyle={{width: "80%", borderColor: "transparent"}}
      listStyle={{width: "80%", borderColor: "transparent"}}
      renderTextInput={this._returnTextInput}
    />
                </View>

                <ScrollView contentContainerStyle={styles.interestChips}>
                    {
                        this.state.interest.map(interest => {
                            return (
                                <Chip style={styles.chipStyle} >
                                    {interest}
                                </Chip>
                            )
                        })
                    }
                </ScrollView>
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
        fontSize: 25,
        fontWeight: "600"
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