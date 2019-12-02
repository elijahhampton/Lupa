import React from 'react'

import {
    View,
    StyleSheet,
    Text,
    ScrollView
} from 'react-native';

import {
    List,
    Surface,
    IconButton
} from 'react-native-paper';

import { Feather as Icon } from '@expo/vector-icons';

import { 
    timesOfDay 
} from '../../../../../controller/lupa/lupa_pre';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default class TimeslotSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dayIndex: 0,
        }

    }

    _getNextDay = () => {
        let currIndex = this.state.dayIndex;
        if (currIndex == 6) { 
            this.setState({
                dayIndex: 0
            })
            return;
        }

        this.setState({ dayIndex: this.state.dayIndex + 1})
    }

    _getPrevDay = () => {
        let currIndex = this.state.dayIndex;

        if (currIndex == 0) { 
            this.setState({
                dayIndex: 6
            })
            return;
        }
        this.setState({ dayIndex: this.state.dayIndex - 1})
    }

    _getDay = index => {
        return days[index];
    }

    render() {
        return (
            <>
                <View style={{width: "100%", height: 20, margin: 15, alignItems: "center", flexDirection: "row", justifyContent: "space-between"}}>
                    
                    <IconButton icon="arrow-back" size={20} onPress={this._getPrevDay}/>
                        <Text style={styles.instructionalText}>
                            {
                                this._getDay(this.state.dayIndex)
                            }
                        </Text>
                        <IconButton icon="arrow-forward" size={20} onPress={this._getNextDay}/>
                </View>

                <Surface style={styles.menuSurface}>
                    <List.Section>
                        <List.Subheader>
                            Choose the times of day that you prefer working out.
                        </List.Subheader>
                    <ScrollView>
                        {
                            timesOfDay.map(obj => {
                                return (
                                    <List.Item style={{alignItems: "center"}} title={obj.title} description={obj.times} left={props => obj.icon} />
                                )
                            })
                        }
                    </ScrollView>
                    </List.Section>
                </Surface>
            </>
        );
    }
}

const styles = StyleSheet.create({
    menuSurface: {
        width: "100%",
        height: 350,
        elevation: 5,
        borderRadius: 15
    },
});