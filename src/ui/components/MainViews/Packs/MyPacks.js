import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    RefreshControl
} from 'react-native';

import { MyPacksCard } from '../Packs/Components/PackCards';

import LupaController from '../../../../controller/lupa/LupaController';
import PackModal from '../../Modals/PackModal/PackModal';

export default class MyPacks extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            currUserPacks: [],
            indexToShow: 0,
            packsModalOpen: false,
            refreshing: false,
            dummyToggle: false
        }

        this.loadCurrUserPacks = this.loadCurrUserPacks.bind(this);
    }

    componentDidMount  = async () => {
        let packsToShow;
       await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserPacks().then(result => {
            packsToShow = result;
        });

        await this.setState({
            currUserPacks: packsToShow,
        });
    }

    componentWillUpdate = async () => {
        let packsToShow;
        await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserPacks().then(result => {
             packsToShow = result;
         });
 
         await this.setState({
             currUserPacks: packsToShow,
         });
    }

    loadCurrUserPacks = () => {
      return this.state.currUserPacks.map(pack => {
           return (
            <MyPacksCard packUUID={pack.id} title={pack.pack_title} numMembers={pack.pack_members.length} image={pack.pack_image} />
           );
       });
    }

    render() {
        let numPacks = this.state.currUserPacks.length;
        return (
            <View style={{flex: 1, backgroundColor: '#FAFAFA'}}>
                <ScrollView  showsVerticalScrollIndicator={false} contentContainerStyle={{ backgroundColor: "#FAFAFA", flexDirection: "row", flexWrap: 'wrap', alignItems: "center" }} refreshControl={<RefreshControl onRefresh={() => alert('Refreshing')} refreshing={this.state.refreshing}/>}>
                    {this.loadCurrUserPacks()}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
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