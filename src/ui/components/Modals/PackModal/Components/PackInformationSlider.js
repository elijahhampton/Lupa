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
    SafeAreaView,
    Dimensions
} from 'react-native';

import BottomSheet from 'reanimated-bottom-sheet';
import { Divider } from 'react-native-paper';
export default class PackInformationSlider extends React.Component {
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
            <View style={styles.inner} >

            </View>
        )
    }

    _renderHeader = () => {
        return (
            <View style={styles.header} >
                                    <Text style={styles.headerTitle}>
                    Pack Information
                </Text>
                <Divider style={{height: 2}}/>
            </View>
        )
    }

    render() {
        return (
            <BottomSheet
                ref={this.bottomSheetRef}
                initialSnap={0}
                snapPoints={['1%', '65%', '1%']}
                renderHeader={this._renderHeader}
                renderContent={this._renderInner}
            />
        )
    }
}

const styles = StyleSheet.create({
    inner: {
        backgroundColor: "white",
        padding: 10,
        height: "100%",
    },
    header: {
        backgroundColor: "white",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        flex: 1,
        backgroundColor: "white",
        borderColor: 'black',
    },
    headerTitle: {
        fontSize : 25,
        fontWeight: "900",
        padding: 10,
        paddingLeft: 10,
    },

})