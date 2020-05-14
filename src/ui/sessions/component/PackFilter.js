import React from 'react';

import {
    Text,
    View,
    StyleSheet,
    ScrollView
} from 'react-native';

import {
    Slider
} from 'react-native-elements';

import BottomSheet from 'reanimated-bottom-sheet';
import { Button, IconButton, Divider, RadioButton, Caption, Switch } from 'react-native-paper';

const days = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']

export default class PackFilter extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            freePack: false,
            subscriptionPack: false,
        }

    }

    render() {
        return (
            <View>
            <Text style={styles.title}>
                    Packs
                </Text>
                <View>
                    <Text style={styles.mainHeader}>
                        Pack Attributes
                    </Text>

                    <View style={styles.filter}>
                        <Text style={styles.filterHeader}>
                            Subscription
                        </Text>
                    </View>

                    <View style={[styles.alignRow, { justifyContent: "space-between" }]}>
                            <Text>
                                Free
                            </Text>
                            <Switch
                                value={this.state.freePack}
                                onValueChange={() => { this.setState({ freePack: !freePack }); }
                                }
                                color="#2196F3"
                            />
                        </View>
                        <View style={[styles.alignRow, { justifyContent: "space-between" }]}>
                            <Text>
                                Subscription Based
                            </Text>
                            <Switch
                                value={this.state.subscriptionPack}
                                onValueChange={() => { this.setState({ subscriptionPack: !subscriptionPack }); }
                                }
                                color="#2196F3"
                            />
                        </View>
                </View>
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
    title: {
        fontSize: 30,
        fontWeight: '700',
    },
    filterHeader: {
        fontSize: 15,
        fontWeight: "300",
        color: "#8E8E93"
    },
    filter: {
        padding: 5,
    }
})