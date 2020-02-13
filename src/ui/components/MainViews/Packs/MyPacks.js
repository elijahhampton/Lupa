import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    RefreshControl,
} from 'react-native';

import {
    Caption
} from 'react-native-paper';

import MyPacksCard from '../Packs/Components/PackCards';

import LupaController from '../../../../controller/lupa/LupaController';
import PackModal from '../../Modals/PackModal/PackModal';

import { connect } from 'react-redux';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

class MyPacks extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            currUserPacks: this.props.lupa_data.Packs.currUserPacksData
        }

        this.loadCurrUserPacks = this.loadCurrUserPacks.bind(this);
    }

    loadCurrUserPacks = () => {
      return this.state.currUserPacks.map(pack => {
          console.log(pack)
            return (
                <MyPacksCard title={pack.pack_title} packUUID={pack.id} numMembers={pack.pack_members.length} image={pack.pack_image} />
            )
        })
    }

    render() {
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

export default connect(mapStateToProps)(MyPacks);