import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import {
    Portal,
    Modal,
    Provider,
    Surface,
    IconButton
} from 'react-native-paper';

import LupaController from '../../../../controller/lupa/LupaController';

export default class PackInformationModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            packUUID: this.props.packUUID,
            packInformation: {},
        }
    }

    componentDidMount = async () => {
        let packInformationIn;
        await this.LUPA_CONTROLLER_INSTANCE.getPackInformationByUUID(this.state.packUUID).then(result => {
            packInformationIn = result;
        });

        await this.setState({ packInformation: packInformationIn });

    }

    render() {
        return (
            <Portal>
                <Modal contentContainerStyle={styles.modal} dismissable={true} onDismiss={this.props.closeModalMethod} visible={this.props.isOpen}>
                    <View style={{width: "100%", height: "auto", flexDirection: 'row', alignItems: "center", justifyContent: "space-between"}}>
                        <IconButton icon="clear" onPress={this.props.closeModalMethod} />
                        <Text>
                            Pack Information
                        </Text>
                    </View>
                    <Surface style={styles.surface}>
                        <Text style={styles.text}>
                            {this.state.packInformation.pack_title}
                        </Text>
                    </Surface>

                    <Surface style={styles.surface}>
                        <Text style={styles.text}>
                            {this.state.packInformation.pack_description}
                        </Text>
                    </Surface>

                    <Surface style={styles.surface}>
                        <Text style={styles.text}>
                            This pack has 30 members.
                    </Text>
                    </Surface>

                    <Surface style={styles.surface}>
                        <Text style={styles.text}>
                            This pack is based out of: Chicago, Illinois
                    </Text>
                    </Surface>
                </Modal>
            </Portal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        alignSelf: "center",
        width: "80%",
        height: "60%",
        backgroundColor: "white",
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
    },
    surface: {
        width: '100%',
        height: 70,
        elevation: 6,
        margin: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontSize: 20,
        fontWeight: '600',
        color: "black",
    }
})