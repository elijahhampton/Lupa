import React, { useState } from 'react';

import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Modal,
    ScrollView
} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';

import {
    Button,
    Appbar,
    IconButton,
} from 'react-native-paper';
import LupaController from '../../../../controller/lupa/LupaController';
import Feather1s from 'react-native-feather1s/src/Feather1s';

const months = ["January", "February", "March", "April",
    "May", "June", "July", "August", "September", "October",
    "November", "December"];

const numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

class BookNowModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            bookingDay: new Date(),
            bookingStartTime: new Date(5000),
            bookingEndTime: new Date(5000),
            selectedDate: new Date(),
            activeDate: new Date(),
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    }

    generateMatrix = () => {
        var matrix = [];

        matrix[0] = days;

        var year = this.state.activeDate.getFullYear();
        var month = this.state.activeDate.getMonth();

        var firstDay = new Date(year, month, 1).getDay();

        var maxDays = numDays[month];
        if (month == 1) { // February
            if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                maxDays += 1;
            }
        }

        var counter = 1;
        for (var row = 1; row < 7; row++) {
            matrix[row] = [];
            for (var col = 0; col < 7; col++) {
                matrix[row][col] = -1;
                if (row == 1 && col >= firstDay) {
                    // Fill in rows only after the first day of the month
                    matrix[row][col] = counter++;
                } else if (row > 1 && counter <= maxDays) {
                    // Fill in rows only if the counter's not greater than
                    // the number of days in the month
                    matrix[row][col] = counter++;
                }
            }
        }

        return matrix;
    }

    changeMonth = (n) => {
        this.setState(() => {
            this.state.activeDate.setMonth(
                this.state.activeDate.getMonth() + n
            )
            return this.state;
        });
    }

    _onPress = async (item) => {
        this.setState({ selectedDate: new Date(item) })
    };

    handleLeftChevronOnPress = () => {
        this.setState({ selectedDates: [] })
        this.changeMonth(-1)
    }

    handleRightChevronOnPress = () => {
        this.setState({ selectedDates: [] })
        this.changeMonth(+1)
    }

    render() {
        var matrix = this.generateMatrix();

        var rows = [];
        rows = matrix.map((row, rowIndex) => {
            var rowItems = row.map((item, colIndex) => {
                return (
                    <Text

                        style={{
                            flex: 1,
                            height: 18,
                            textAlign: 'center',
                            // Highlight header
                            backgroundColor: rowIndex == 0 ? 'transparent' : 'transparent',
                            // Highlight Sundays
                            color: colIndex == 0 ? '#1565C0' : '#000',
                            // Highlight current date
                            fontWeight: this.state.selectedDate == new Date(item)
                                ? 'bold' : ''
                        }}
                        onPress={() => this._onPress(item)}>
                        {item != -1 ? item : ''}
                    </Text>
                );
            });
        });

        return (
                <Modal visible={false} presentationStyle="fullScreen" animated={true} animationType="slide">
            
                        <Appbar.Header style={styles.appbar}>
                            <Appbar.Action icon={() => <Feather1s name="x" size={20} color="#212121" />} />
                            <Appbar.Content title="Booking Request" titleStyle={{ alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20 }} />
                        </Appbar.Header>
                        <ScrollView>
                        <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", height: "auto" }}>
          <IconButton icon="chevron-left" size={18} onPress={() => this.handleLeftChevronOnPress()}/>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 15,
            textAlign: 'center',
            color: "black",
          }}>
            {months[this.state.activeDate.getMonth()]} &nbsp;
            {this.state.activeDate.getFullYear()}
          </Text>
          <IconButton icon="chevron-right" size={18} onPress={() => this.handleRightChevronOnPress()}/>
        </View>
        {rows}
      </View>
                        </ScrollView>
               
                </Modal>
            )
        }
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#FFFFFF'
        },
        appbar: {
            width: Dimensions.get('window').width,
            backgroundColor: '#FFFFFF',
            elevation: 0,
            borderBottomWidth: 0.5,
            borderColor: 'rgb(174, 174, 178)',
        }
    })

    export default BookNowModal;