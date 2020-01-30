import React from 'react';

import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import {
    Container,
    Left,
    Right,
    Body,
    Header,
} from 'native-base';

import {
    Modal,
    Provider,
    Portal,
    IconButton,
    Divider,
    Title,
    List,
    TextInput,
    Button,
    Headline
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';

import Color from '../../../../common/Color';

import LupaController from '../../../../../controller/lupa/LupaController';
this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

const ChangeUsernameModal = props => {
    return (
        <Provider>
            <Portal>
                <Modal contentContainerStyle={styles.changeUsernameModal} visible={props.isOpen} dismissable={true} onDismiss={props.closeModalMethod}>
                    <Headline>
                        Change Username
                    </Headline>

                    <TextInput mode="flat" placeholder="Ex. AwesomeJob123" theme={{colors: {
                        primary: Color.LUPA_BLUE
                    }}} />

                    <Button mode="contained">
                        Confirm 
                    </Button>
                </Modal>
            </Portal>
        </Provider>
    )
}

export default class  AccountSettingsView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showChangeUsernameModal: false,
        }
    }

    _handleCloseChangeUsernameModal = () => {
        this.setState({ showChangeUsernameModal: false })
    }

    render() {
        return (
            <Container style={styles.root}>
                <Header>
                    <Left>
                        <IconButton icon="arrow-back" onPress={() => this.props.navigation.goBack()}/>
                    </Left>

                    <Right>
                        <Title>
                        Account
                        </Title>
                    </Right>
                </Header>

                <SafeAreaView style={styles.contentContainer}>
                <List.Item title="Name" description="Elijah Hampton" onPress={() => this.setState({ showChangeUsernameModal: true })}/>
                <Divider />
                <List.Item title="Username" description="elijahhampton" onPress={() => this.setState({ showChangeUsernameModal: true })}/>
                <Divider />
                <List.Item title="Email" description="ejh0017@gmail.com" onPress={() => this.setState({ showChangeUsernameModal: true })}/>
                <Divider />
                <List.Item title="Mobile Number" description="You do not have a mobile number set" onPress={() => this.setState({ showChangeUsernameModal: true })}/>
                <Divider />
                <List.Item title="Change or recover password" description="Click here to change or recover your password" onPress={() => this.setState({ showChangeUsernameModal: true })}/>
                <Divider />
                <List.Item title="Forgot password" description="Click here to recover password" onPress={() => this.setState({ showChangeUsernameModal: true })}/>
                <Divider />
                </SafeAreaView>
                <ChangeUsernameModal isOpen={this.state.showChangeUsernameModal} closeModalMethod={this._handleCloseChangeUsernameModal} />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    contentContainer: {
        flex: 1,
    },
    changeUsernameModal: {
        width: "80%",
        height: "40%",
        backgroundColor: 'white',
        alignSelf: 'center',
         justifyContent: 'space-evenly',
         flexDirection: 'column',
    }
})