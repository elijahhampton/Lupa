/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 * 
 *  SearchViewBottomSheet
 * 
 * BottomSheet snapPoints /* 0 - starting position to snap to , 1 - height to snap to upong pulling up, 2 - point to snap to upon pushing down
 */

import React from 'react';

import {
    Text,
    View,
    StyleSheet,
    Button
} from 'react-native';

import {
    Searchbar, Chip
} from 'react-native-paper';

import BottomSheet from 'reanimated-bottom-sheet';

export default class PacksSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openSearch: false,
        }

        this.bottomSheetRef = React.createRef();
    }

    _showSearch = () => {
            console.log('Calling search')
            this.bottomSheetRef.current.snapTo(1);
            console.log('Didnt snap')
    }
    

    _renderInner = () => {
        return (
            <View style={styles.inner}>
                <Searchbar value={this.state.searchValue} icon="search" iconColor="black" placeholder="Search all Lupa Packs" style={{width: "100%"}}/>
            </View>
        )
    }

    _renderHeader = () => {
        return (
            <View style={styles.header}>
                <View style={{alignSelf: "flex-end"}}>
                <Button 
                title="Add tags" 
                color="#007AFF" 
                onPress={() => alert('add tags modal')}
                />
                </View>
            
                <View style={styles.tagsDisplayContainer}>

                </View>
            </View>
        )
    }

      render() {
          return (
                <BottomSheet
        ref={this.bottomSheetRef}
        initialSnap={0}
        snapPoints={["0%", '85%', '0%']}
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
    tagsDisplayContainer: {
        display: "flex",
        padding: 10,
    },
    button: {
        fontSize: 10,
        fontWeight: "100"
    },
    inner: {
        backgroundColor: "white",
        width: "100%",
        height: "100%",
        padding: 15,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,.1)",
        backgroundColor: "white",
        display: "flex",
        padding: 10,
    },
})