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

let LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

export default class MyPacks extends React.Component {
    constructor(props) {
        super(props);

        this.currUserPacks = LUPA_CONTROLLER_INSTANCE.getCurrUser().packInformation.packs;

        this.state = {
            currUserPacks: this.currUserPacks,
            indexToShow: 0,
            showPack: false,
        }

        this.loadCurrUserPacks = this.loadCurrUserPacks.bind(this);
    }

    loadCurrUserPacks = () => {
       let packs = this.state.currUserPacks.map(pack => {
           return (
            <MyPacksCard title={pack} />
           );
       })

       return packs;
    }

    render() {
        let numPacks = this.state.currUserPacks.length;
        return (
                <>
                <View style={{margin: 10}}>
                <Text style={{color: "#BDBDBD", alignSelf: "center", fontSize: 15, fontWeight: "600"}}>
                    You are currently in { numPacks } pack.
                </Text>
                </View>

                <View horizontal={true} contentContainerStyle={{flexDirection: "row", justifyContent: "space-evenly", alignItems: "flex-start"}}>
                    { 
                       this.loadCurrUserPacks()
                    }
                </View>
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