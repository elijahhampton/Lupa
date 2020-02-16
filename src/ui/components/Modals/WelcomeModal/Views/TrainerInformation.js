import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    Button as NativeButton,
} from 'react-native';

import {
    Button,
    Menu,
    Divider,
    Provider
} from 'react-native-paper';

const verificationModal = (props) => {
    return (
        <Portal>
            <Modal style={styles.verificationModal}>

            </Modal>
        </Portal>
    )
}

export default class TrainerInformation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            menuVisible: false,
        }
    }

    closeMenu = () => {
        this.setState({ 
            menuVisible: false,
        })
    }

    openMenu = () => {
        this.setState({
            menuVisible: true,
        })
    }

    render() {
        return (
            <View style={styles.root}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.instructionalText}>
                    As a Lupa Trainer you will be able to make money based on your tier.  Read more about our tiering system here.
                </Text>
                </View>

                    <Provider>
                    <Menu
            visible={this.state.menuVisible}
            onDismiss={this.closeMenu}
            anchor={
              <NativeButton onPress={this.openMenu} title="Select a certification" />
            }
          >
            <Menu.Item onPress={() => {}} title="National Academy of Sports Medicine (NASM)" />
            <Menu.Item onPress={() => {}} title="National Academy of Sports Medicine (NASM)" />
            <Menu.Item onPress={() => {}} title="National Academy of Sports Medicine (NASM)" />
            <Divider />
            <Menu.Item onPress={() => {}} title="Cancel" />
          </Menu>
          </Provider>

                    <View style={{flex: 3}}>
                        {
                            //based on certification
                        }
                    </View>
                </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 10
    },
    instructionalText: {
        flexShrink: 1,
        fontSize: 20,
        fontWeight: "200"
    },
    verificationModal: {
        width: '50%',
        height: '50%',
    },
})