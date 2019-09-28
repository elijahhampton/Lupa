import React from 'react';

import {
    Text,
    View,
    StyleSheet
} from 'react-native';

class PackView extends React.Component {
    render() {
        return (
            <View style={styles.root}>
                <Text style={{fontWeight: "700", fontSize: 40}}>
                    Pack View
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    }
});

export default PackView;