/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 * 
 *  SearchViewBottomSheet
 */

import React from 'react';

import {
    Text,
    View,
    StyleSheet,
} from 'react-native';

import {
    Slider
} from 'react-native-elements';

import BottomSheet from 'reanimated-bottom-sheet';
import { Button, IconButton, Divider, RadioButton, Caption, Switch } from 'react-native-paper';

export default class SearchFilter extends React.Component {
    constructor(props) {
        super(props);

        this.bottomSheetRef = React.createRef();
    }
    

    _renderInner = () => {
        return (
            <View style={styles.inner}>
                <View>
                    <Text style={styles.mainHeader}>
                        Personal
                    </Text>
                    <View style={styles.filter}>
                        <Text style={styles.filterHeader}>
                            Age
                        </Text>
                        <Slider
    value={0}
    onValueChange={() => console.log('Changing')}
    minimumValue={0}
    maximumValue={50}
    orientation="horizontal"
    thumbTintColor="#2196F3"
  />

  <Caption>
      The age range is currently set at 0 to 0.
  </Caption>
                    </View>

                    <View style={styles.filter}>
                    <Text style={styles.filterHeader}>
                            Gender
                        </Text>
                        <Button mode="contained" color="#2196F3" style={{borderRadius: 20}}>
                            Specify Gender
                        </Button>
                    </View>
                </View>

                <Divider style={styles.divider} />

                <View>
                    <Text style={styles.mainHeader}>
                        Fitness Profile
                    </Text>

                    <View style={styles.filter}>
                    <Text style={styles.filterHeader}>
                            Average Days in Gym
                        </Text>

                        <Slider
    value={0}
    onValueChange={() => console.log('Changing')}
    minimumValue={0}
    maximumValue={50}
    orientation="horizontal"
    thumbTintColor="#2196F3"
  />

  <Caption>
      Average days in gym range is currently set at 0 to 0.
  </Caption>
                    </View>

                    <View style={styles.filter}>
                        <View style={styles.alignRow, {alignItems: "center", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                        <Text style={styles.filterHeader}>
                            Trainer
                        </Text>

                        <Switch color="#2196F3" value={true} />
                        
                        </View>

                        <Caption>
                            You have chosen to search for trainers only.
                        </Caption>
                    </View>
                </View>

                <Divider style={styles.divider} />

                <View>
                    <Text style={styles.mainHeader}>
                        Availability
                    </Text>

                    <View style={styles.filter}>
                        <Text style={styles.filterHeader}>
                            Days Available
                        </Text>

                        <Text>
                            Figure out component for days here
                        </Text>

                        <Caption>
                            You have not chosen any days.
                        </Caption>
                    </View>

                    <View style={styles.filter}>
                        <Text style={styles.filterHeader}>
                            Times Available
                        </Text>

                        <Text>
                            Figure out component for times here.
                        </Text>

                        <Caption>
                            You have not chosen any times.
                        </Caption>
                    </View>
                </View>
            </View>
        )
    }

    _renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                <View style={[styles.alignRow, { width: "100%", justifyContent: "space-between" }]}>
                <View style={styles.alignRow}>
                <IconButton icon="clear" size={20}/>
                <Text style={styles.mainHeader}>
                    Filter
                </Text>
                </View>

                <Button mode="text" compact onPress={() => alert('Clear all filters')} color="#2196F3">
                    CLEAR ALL
                </Button>
                </View>
            </View>

            <Divider style={styles.divider}/>
            </View>
        )
    }

      render() {
          return (
                <BottomSheet
        ref={this.bottomSheetRef}
        initialSnap={0}
        snapPoints={['10%', '90%', '10%']}
        renderHeader={this._renderHeader}
        renderContent={this._renderInner}
      />
          )
      }
}

const styles = StyleSheet.create({
    divider: {
        margin: 15,
    },
    inner: {
        backgroundColor: "white",
        padding: 10,
        height: "100%",
    },
    headerContainer: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 5,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    alignRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    mainHeader: {
        fontSize: 20,
        fontWeight: '700',
    },
    filterHeader: {
        fontSize: 15,
        fontWeight: "300",
        color: "#8E8E93"
    },
    filter: {
        padding: 5,
    }
})