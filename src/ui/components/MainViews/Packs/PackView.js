import React from 'react';

import {
    Text,
    View,
    StyleSheet,
    Button,
    TouchableOpacity,
    ActionSheetIOS,
    SafeAreaView,
    ScrollView,
    RefreshControl
} from 'react-native';

import {
    Header,
    Container,
    Left,
    Right,
    Body,
    Tabs,
    Tab
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
            options: ['Create New Pack', 'Cancel'],
            cancelButtonIndex: 1
        }, (buttonIndex) => {
            switch(buttonIndex) {
                case 0:
                    this.setState({ createPackModalIsOpen: true })
                default:
            }
        });
    }

    closePackModal = () => {
        this.setState({ createPackModalIsOpen: false });
    }

    render() {
        return (
            <Container style={{backgroundColor: "#FAFAFA"}}>
                <Header hasTabs style={{backgroundColor: "white"}}>
                    <Left>
                    <IconButton icon="more-vert" size={20} onPress={this._showActionSheet} />
                    </Left>
                    <Right>
                    <Text style={{fontSize: 25, fontWeight: "800"}}>
                        My Packs
                    </Text>
                    </Right>
                </Header>
                <Tabs style={{backgroundColor: "#FAFAFA"}} locked>
                    <Tab heading="Explore" tabStyle={{backgroundColor: "white"}} activeTabStyle={{backgroundColor: "white"}} >
                        <Explore />
                    </Tab>
                    <Tab heading="My Packs" tabStyle={{backgroundColor: "white"}} activeTabStyle={{backgroundColor: "white"}}>
                        <MyPacks />
                    </Tab>
                </Tabs>

                               {/*  <PacksSearch ref="packsSearchRef" /> */}
               <CreatePack isOpen={this.state.createPackModalIsOpen} closeModalMethod={this.closePackModal}/>
            </Container>
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
        backgroundColor: "white",
        margin: 5,
    }
});