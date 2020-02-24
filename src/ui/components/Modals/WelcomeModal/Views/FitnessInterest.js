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

const interestList = [
    'Strength',
    'Power',
    'Endurance',
    'Flexibility',
    'Speed',
    'Agility'
]

export default class FitnessInterest extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            interest: [],
        }
    }

    //throws error - this.staet.interest.includes is undefined??
    addInterest = (interest) => {
        if (this.state.interest && this.state.interest.includes(interest))
        {
            console.log('splice')
            this.setState({ interest: this.state.interest.splice(this.state.interest.indexOf(interest), 1)})
            this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('interest', interest);

            console.log(this.state.interest.length)
            return;
        }

        console.log('nah dice')
        this.setState({ interest: this.state.interest.push(interest)})
        this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('interest', interest);
        console.log(this.state.interest.length)
    }

    closeModalMethod = () => {
        this.props.closeModalMethod();
    }

    mapInterestList = () => {
        return interestList.map(interest => {
            if (this.state.interest.includes(interest))
            {
                return (
                    <Chip key={interest} style={{ backgroundColor: "#2196F3", alignItems: 'center', justifyContent: 'center', margin: 10, width: 100, height: 35, elevation: 5 }} mode="flat" onPress={() => this.addInterest(interest)}>
                    <Text>
                        {interest}
                    </Text>
                </Chip> 
                )
            }
            return (
                <Chip key={interest} style={{ alignItems: 'center', justifyContent: 'center', margin: 10, width: 100, height: 35, elevation: 5 }} mode="flat" onPress={() => this.addInterest(interest)}>
                <Text>
                    {interest}
                </Text>
            </Chip>
            )
        })
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', }}>
                        {
                            this.mapInterestList()
                        }
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
        fontSize: 25,
        fontWeight: "200"
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