import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    ActionSheetIOS,
    Dimensions,
    ScrollView
} from 'react-native';

import { 
    DataTable, 
    Caption,
    IconButton,
    Surface
} from 'react-native-paper';
import SafeAreaView from 'react-native-safe-area-view';

import {
    BarChart
} from 'react-native-chart-kit';

const chartConfig = 
    {
        backgroundColor: "white",
        backgroundGradientFrom: "white",
        backgroundGradientTo: "white",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
          borderRadius: 16
        },
        propsForDots: {
          r: "2",
          strokeWidth: "1",
          stroke: "#ffa726"
        }
      }

      const data = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
          {
            data: [20, 45, 28, 80, 99, 43]
          }
        ]
      };

export default class ManageGoals extends React.Component {
    constructor(props) {
        super(props);

    }

    _showActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions(
        {
            options: ['Create New Goal', 'Edit Goal', 'View Goal Statistics', 'Cancel'],
            cancelButtonIndex: 2
        }, (buttonIndex) => {
            switch(buttonIndex) {
                case 0:
                    this.props.navigation.navigate('CreateNewGoal')
                    break;
                case 1:
                    alert('Edit Goal')
                    break;
                case 2:
                    alert('View Goal Statistics')
                    break;
                default:
            }
        });
    }


    render() {
        return (
            <View style={styles.root}>
                <SafeAreaView>
                <View style={{height: "8%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10}}>
                    <View style={{flexDirection: "row"}}>
                    <IconButton icon="menu" size={20} onPress={() => this.props.navigation.openDrawer()} />
                    <IconButton icon="more-vert" size={20} onPress={this._showActionSheet} />
                    </View>
                    <Text style={{fontSize: 25, fontWeight: "800"}}>
                        Goals
                    </Text>
                    </View>

                    <View style={{height: "42%"}}>
                        <View style={{height: "auto"}}>
                            <ScrollView horizontal={true} contentContainerStyle={{width: "100%",  flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}}>
                                <Surface style={{width: "auto", height: "auto", margin: 5, elevation: 2, padding: 5, borderRadius: 20, }}>
                                <Text style={styles.monthText}>
                                    Jan
                                </Text>
                                </Surface>
                                <Surface style={{width: "auto", height: "auto", margin: 5, elevation: 2, padding: 5, borderRadius: 20, }}>
                                <Text style={styles.monthText}>
                                    Jan
                                </Text>
                                </Surface>
                                <Surface style={{width: "auto", height: "auto", margin: 5, elevation: 2, padding: 5, borderRadius: 20, }}>
                                <Text style={styles.monthText}>
                                    Jan
                                </Text>
                                </Surface>
                                <Surface style={{width: "auto", height: "auto", margin: 5, elevation: 2, padding: 5, borderRadius: 20, }}>
                                <Text style={styles.monthText}>
                                    Jan
                                </Text>
                                </Surface>
                                <Surface style={{width: "auto", height: "auto", margin: 5, elevation: 2, padding: 5, borderRadius: 20, }}>
                                <Text style={styles.monthText}>
                                    Jan
                                </Text>
                                </Surface>
                                <Surface style={{width: "auto", height: "auto", margin: 5, elevation: 2, padding: 5, borderRadius: 20, }}>
                                <Text style={styles.monthText}>
                                    Jan
                                </Text>
                                </Surface>
                                <Surface style={{width: "auto", height: "auto", margin: 5, elevation: 2, padding: 5, borderRadius: 20, }}>
                                <Text style={styles.monthText}>
                                    Jan
                                </Text>
                                </Surface>

                            </ScrollView>
                        </View>

                        
                    </View>

            <View style={{height: "50%"}}>
                <View style={{height: "90%"}}>
                <DataTable>
                    <DataTable.Header style={{display: "flex"}}>
                        <DataTable.Title style={{flex: 3}}>
                            Goal
                        </DataTable.Title>
                        <DataTable.Title numeric style={{flex: 1}}>
                            Accountee
                        </DataTable.Title>
                        <DataTable.Title numeric style={{flex: 1}}>
                            Duration
                        </DataTable.Title>
                    </DataTable.Header>

                <DataTable.Row style={{display: "flex"}}>
                    <DataTable.Cell style={{flex: 3}}>
                    <Text style={styles.goalText}>
                            Complete three sessions with Jane
                        </Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric style={{flex: 1}}>
                        JM
                    </DataTable.Cell>
                    <DataTable.Cell numeric style={{flex: 1}}>
                        20
                    </DataTable.Cell>
                </DataTable.Row>

                </DataTable>
                </View>
                <View style={{height: "10%"}}>
                <DataTable.Pagination page={1} numberOfPages={3} label="Showing 13 of 30"/>
                </View>
                    </View>
                    
                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: "white",
    },
    chartStyle: {

    },
    statisticText: {
        fontSize: 15,
        fontWeight: "800",
        color: "rgba(189,189,189 ,1)"
    },
    numberText: {
        fontSize: 20,
        color: "rgba(189,189,189 ,1)",
    },
    goalText: {
        fontWeight: "800", fontSize: 15, color: "#212121", flexShrink: 1, flexWrap: 'wrap'
    },
    monthText: {
        fontSize: 20,
        fontWeight: "800",
        color: "#BDBDBD"
    }
});