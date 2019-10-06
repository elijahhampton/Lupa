/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 * 
 *  SearchViewBottomSheet
 */

import React from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import { 
    BottomSheet
} from 'reanimated-bottom-sheet';

export default class SearchFilter extends React.Component {

      render() {
          return (
            <View style={styles.container}>
                <BottomSheet snapPoints = {[450, 300, 0]} />
            </View>
          )
      }
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
    }
})