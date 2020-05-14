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
    ScrollView,
    SafeAreaView
} from 'react-native';

import SearchFilterHeader from './SearchFilterHeader';
import UserFilter from './UserFilter';
import PackFilter from './PackFilter';


import BottomSheet from 'reanimated-bottom-sheet';
import { Divider } from 'react-native-paper';
export default class SearchFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isGenderMaleSwitchOn: false,
            isGenderFemaleSwitchOn: false,
        }

        this.bottomSheetRef = React.createRef();
    }


    _renderInner = () => {
        return (
            <SafeAreaView>
                            <ScrollView style={styles.inner} showsVerticalScrollIndicator={false}>
                <UserFilter />
                <Divider style={styles.divider} />
                <PackFilter />
            </ScrollView>
            </SafeAreaView>
        )
    }

    _renderHeader = () => {
        return (
            <SearchFilterHeader />
        )
    }

    render() {
        return (
            <BottomSheet
                ref={this.bottomSheetRef}
                initialSnap={0}
                snapPoints={['0%', '90%', '10%']}
                renderHeader={this._renderHeader}
                renderContent={this._renderInner}
            />
        )
    }
}

const styles = StyleSheet.create({
    divider: {
        margin: 8,
    },
    inner: {
        backgroundColor: "white",
        padding: 10,
        height: "100%",
    },

})