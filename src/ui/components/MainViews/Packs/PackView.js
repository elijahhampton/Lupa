import React from 'react';
import ReactDOM from 'react-dom';

import {
    Text,
    View,
    StyleSheet,
    Button,
    TouchableOpacity,
    ActionSheetIOS,
    SafeAreaView,
    ScrollView
} from 'react-native';

import { 
    IconButton 
} from 'react-native-paper';

import { 
    Feather as Icon 
} from '@expo/vector-icons';


import Explore from './Explore';
import MyPacks from './MyPacks';
import CreatePack from '../../Modals/CreatePack';
import LupaController from '../../../../controller/lupa/LupaController';

const LUPA_CONTROLLER_ISNTANCE = LupaController.getInstance();

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
            acitivePacks: [],
        }
    }
    
    _showActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions(
        {
            options: ['Create New Pack', 'Manage Packs', 'Cancel'],
            cancelButtonIndex: 2
        }, (buttonIndex) => {
            switch(buttonIndex) {
                case 0:
                    alert('Create New Pack')
                case 1:
                    alert('Manage Packs')
                case 2:
                default:
            }
        });
    }

    render() {
        const DynamicView = this.state.activeView;
        return (
            <SafeAreaView style={styles.root}>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10}}>
                    <IconButton icon="more-vert" size={20} onPress={this._showActionSheet} />
                    <Text style={{fontSize: 25, fontWeight: "800"}}>
                        My Packs
                    </Text>
                    </View>

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

                    <Text style={styles.tabsText}>
                        .
                    </Text>

                    <TouchableOpacity onPress={() => {this.setState({activeView: 'mypacks'})}}>
                    <Text style={[styles.tabsText, getMyPacksTabColorStyle(this.state.activeView) ]}>
                        Promotions
                    </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView scrollEnabled={this.state.activeView == 'mypacks' ? true : false}>
                    {
                        DynamicView  == 'explore' ? ( <Explore /> ) : ( <MyPacks /> )
                    }
                </ScrollView>

               {/*  <PacksSearch ref="packsSearchRef" /> */}
               <CreatePack />
            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#FAFAFA",
    },
    tabs: {
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        alignSelf: "center",
        justifyContent: "space-evenly",
        backgroundColor: "transparent",
    },
    tabsText: {
        fontSize: 20,
        fontWeight: "600",
        color: "rgba(0,0,0,.15)",
    },
    header: {
        alignItems: "flex-end",
        flexDirection: "column",
        justifyContent: "flex-end",
        backgroundColor: "#FAFAFA",
        margin: 5,
    }
});