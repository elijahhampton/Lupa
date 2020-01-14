import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView
} from 'react-native';

import { MyPacksCard } from '../Packs/Components/PackCards';

import LupaController from '../../../../controller/lupa/LupaController';

export default class MyPacks extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            currUserPacks: [],
            indexToShow: 0,
            showPack: false,
        }

        this.loadCurrUserPacks = this.loadCurrUserPacks.bind(this);
        this.setupMyPacks = this.setupMyPacks.bind(this);
    }

    componentDidMount() {
        this.setupMyPacks();
    }

    setupMyPacks = async () => {
        let packsToShow;
       await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserPacks().then(result => {
            packsToShow = result;
        });

        await this.setState({
            currUserPacks: packsToShow,
        });
    }

    loadCurrUserPacks = () => {
      let packs = this.state.currUserPacks.map(pack => {
           return (
            <MyPacksCard  />
           );
       });

       return packs;
    }

    render() {
        let numPacks = this.state.currUserPacks.length;
        return (
            <>
                <ScrollView contentContainerStyle={{flexDirection: "row", flexWrap: 'wrap', justifyContent: "center",alignItems: "center" }}>
                    { 
                      this.loadCurrUserPacks()
                    }

                </ScrollView>
                                <Text style={{color: "#BDBDBD", alignSelf: "center", fontSize: 15, fontWeight: "600", position: "absolute", bottom: 2}}>
                                You are currently in { numPacks } pack.
                            </Text>
                            </>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FAFAFA",
        alignItems: "center",
        justifyContent: "center",
    },
    myPacksCardContainer: {
        width: Dimensions.get('screen').width - 50,
        height: Dimensions.get('screen').height - 250,
        elevation: 5,
        marginTop: 20
    },
})