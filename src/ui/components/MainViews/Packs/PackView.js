import React from 'react';

import {
    Text,
    View,
    StyleSheet,
    Button,
    TouchableOpacity,
    ActionSheetIOS
} from 'react-native';

import { Feather as Icon } from '@expo/vector-icons';


import Explore from './Explore';
import MyPacks from './MyPacks';
import { IconButton } from 'react-native-paper';

function getExploreTabColorStyle(currState) {
    if (currState == 'explore') {
        return { color: '#2196F3' };
    }
    return { color: 'rgba(0,0,0,.15)' };
}

function getMyPacksTabColorStyle(currState) {
    if (currState == 'mypacks') {
        return { color: '#2196F3' };
    }
    return { color: 'rgba(0,0,0,.15)' };
}

export default class PackView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeView: 'explore',
        }
    }

    _showActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions(
        {
            options: ['Create New Pack', 'Cancel'],
            cancelButtonIndex: 1
        }, (buttonIndex) => {
            if (buttonIndex == 0) {
                //Launch Modal to create new pack
                alert('Create New Pack')
            }
        });
    }

    render() {
        const DynamicView = this.state.activeView;
        return (
            <View style={styles.root}>
                <View style={styles.header}>
                    <IconButton icon="search" size={20} onPress={() => alert('Search packs')} />
                    <IconButton icon="more-vert" size={20} onPress={this._showActionSheet} />
                </View>

                <Text style={{marginLeft: 10, fontSize: 30, fontWeight: "700"}}>
                    Packs
                </Text>

                <View style={styles.tabs}>
                    <TouchableOpacity onPress={() => {this.setState({activeView: 'explore'})}}>
                    <Text style={[ styles.tabsText, getExploreTabColorStyle(this.state.activeView) ]}>
                        Explore
                    </Text>
                    </TouchableOpacity>

                    <Text style={styles.tabsText}>
                        .
                    </Text>

                    <TouchableOpacity onPress={() => {this.setState({activeView: 'mypacks'})}}>
                    <Text style={[styles.tabsText, getMyPacksTabColorStyle(this.state.activeView) ]}>
                        My Packs
                    </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {
                        DynamicView  == 'explore' ? ( <Explore /> ) : ( <MyPacks /> )
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
        
    },
    tabs: {
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-evenly",
        margin: 15,
    },
    tabsText: {
        fontSize: 20,
        fontWeight: "600",
        color: "rgba(0,0,0,.15)",
    },
    header: {
        paddingTop: 20,
        alignItems: "flex-end",
        flexDirection: "row",
        justifyContent: "flex-end"
    }
});