import React from 'react';

import {
    Text,
    View,
    StyleSheet,
    ScrollView
} from 'react-native';

import {
    IconButton,
    Button,
    Divider
} from 'react-native-paper';

export default class SearchFilterHeader extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            
        }

    }

    render() {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <View style={[styles.alignRow, { width: "100%", justifyContent: "space-between" }]}>
                        <View style={styles.alignRow}>
                            <IconButton icon="clear" size={20} />
                            <Text style={styles.mainHeader}>
                                Filter
                </Text>
                        </View>

                        <Button mode="text" compact onPress={() => alert('Clear all filters')} color="#2196F3">
                            CLEAR ALL
                </Button>
                    </View>
                </View>

                <Divider style={styles.divider} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    alignRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    mainHeader: {
        fontSize: 20,
        fontWeight: '700',
    },
    divider: {
        margin: 8,
    },
    inner: {
        backgroundColor: "white",
        padding: 10,
        height: "100%",
    },
    headerContainer: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 5,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
})