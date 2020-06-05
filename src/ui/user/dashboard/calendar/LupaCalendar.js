import React from 'react';

import {
  View,
  StyleSheet,
  Text
} from 'react-native';

import {
  Surface,
  IconButton
} from 'react-native-paper';

const months = ["January", "February", "March", "April",
  "May", "June", "July", "August", "September", "October",
  "November", "December"];

const numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default class LupaCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeDate: new Date(),
    }
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
    await this.setState(() => {
      if (!item.match && item != -1) {
        this.state.activeDate.setDate(item);
        return this.state;
      }
    });

    if (this.props.onPress)
    {
      console.log(this.state.activeDate)
      this.props.onPress(this.state.activeDate);
    }
  };

  

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
              fontWeight: item == this.state.activeDate.getDate()
                ? 'bold' : ''
            }}
            onPress={() => this._onPress(item)}>
            {item != -1 ? item : ''}
          </Text>
        );
      });
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            padding: 15,
            justifyContent: 'space-around',
            alignItems: 'center',
            color: 'white'
          }}>
          {rowItems}
        </View>
      );
    });
    return (
      <View style={[styles.container, {elevation: this.props.elevation}]}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", height: "auto" }}>
          <IconButton icon="chevron-left" size={18} onPress={() => this.changeMonth(-1)}/>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 15,
            textAlign: 'center',
            color: "black",
          }}>
            {months[this.state.activeDate.getMonth()]} &nbsp;
            {this.state.activeDate.getFullYear()}
          </Text>
          <IconButton icon="chevron-right" size={18} onPress={() => this.changeMonth(+1)}/>
        </View>
        {rows}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 320,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    color: 'white',
    margin: 10,
    backgroundColor: 'transparent'
  }
})