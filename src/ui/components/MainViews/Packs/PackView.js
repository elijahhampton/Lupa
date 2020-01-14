import React from 'react';

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
    Header,
    Container,
    Left,
    Right,
    Body,
} from 'native-base'; //for conversion into an actual header

import { 
    IconButton 
} from 'react-native-paper';

import { 
    Feather as Icon 
} from '@expo/vector-icons';



import Explore from './Explore';
import MyPacks from './MyPacks';
import Promotions from './Promotions';
import CreatePack from '../../Modals/CreatePack';
import LupaController from '../../../../controller/lupa/LupaController';

function getExploreTabColorStyle(currState) {
    if (currState == 0) {
        return { color: '#2196F3' };
    }
    return { color: 'rgba(0,0,0,.15)' };
}

function getMyPacksTabColorStyle(currState) {
    if (currState == 1) {
        return { color: '#2196F3' };
    }
    return { color: 'rgba(0,0,0,.15)' };
}

function getPromotionsTabColorStyle(currState) {
    if (currState == 2) {
        return { color: '#2196F3' };
    }
    return { color: 'rgba(0,0,0,.15)' };
}

const viewArray = [<Explore />, <MyPacks />, <Promotions />];

function getActiveTab(index) {
   switch(index) {
       case 0:
           return <Explore />
        case 1:
            return <MyPacks />
        case 2:
            return <Promotions />
        default:
   }
}

export default class PackView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeView: 0,
            acitivePacks: [],
            createPackModalIsOpen: false,
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    }
    
    _showActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions(
        {
            options: ['Create New Pack', 'Manage Packs', 'Cancel'],
            cancelButtonIndex: 2
        }, (buttonIndex) => {
            switch(buttonIndex) {
                case 0:
                    this.setState({ createPackModalIsOpen: true })
                case 1:
                    this.setState({ createPackModalIsOpen: true })
                case 2:
                default:
            }
        });
    }

    closePackModal = () => {
        this.setState({ createPackModalIsOpen: false });
    }

    render() {
        const DynamicView = this.state.activeView;
        return (
            <SafeAreaView style={styles.root}>
                
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, backgroundColor: "white"}}>
                    <IconButton icon="more-vert" size={20} onPress={this._showActionSheet} />
                    <Text style={{fontSize: 25, fontWeight: "800"}}>
                        My Packs
                    </Text>
                    </View>

                    <View style={styles.tabs}>
                    <TouchableOpacity onPress={() => {this.setState({activeView: 0})}}>
                    <Text style={[ styles.tabsText, getExploreTabColorStyle(this.state.activeView) ]}>
                        Explore
                    </Text>
                    </TouchableOpacity>

                    <Text style={styles.tabsText}>
                        .
                    </Text>

                    <TouchableOpacity onPress={() => {this.setState({activeView: 1})}}>
                    <Text style={[styles.tabsText, getMyPacksTabColorStyle(this.state.activeView) ]}>
                        My Packs
                    </Text>
                    </TouchableOpacity>

                    <Text style={styles.tabsText}>
                        .
                    </Text>

                    <TouchableOpacity onPress={() => {this.setState({activeView: 2})}}>
                    <Text style={[styles.tabsText, getPromotionsTabColorStyle(this.state.activeView) ]}>
                        Promotions
                    </Text>
                    </TouchableOpacity>
                </View>

                <View style={{flex: 1}} /*scrollEnabled={this.state.activeView == 'mypacks' ? true : false}*/>
                    {
                        getActiveTab(this.state.activeView)
                    }
                </View>

               {/*  <PacksSearch ref="packsSearchRef" /> */}
               <CreatePack isOpen={this.state.createPackModalIsOpen} closeModalMethod={this.closePackModal}/>
            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "white",
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
        backgroundColor: "white",
        margin: 5,
    }
});