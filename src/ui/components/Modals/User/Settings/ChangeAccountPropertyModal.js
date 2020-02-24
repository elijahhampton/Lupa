import React from 'react';

import {
    Text,
    StyleSheet,
    View,
} from 'react-native';

import {
    Portal,
    Modal,
    Button,
    Provider,
    Title,
    TextInput
} from 'react-native-paper';

import { connect } from 'react-redux';

import LupaController from '../../../../../controller/lupa/LupaController';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

class ChangeAccountPropertyModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            userData: this.props.lupa_data.Users.currUserData,
            textInputValue: '',
            usernameTextFieldError: false
        }
    }

    handleOnChangeUsernameText = async (text) => {
        let isTaken;
        await this.setState({ textInputValue: text });

        await this.LUPA_CONTROLLER_INSTANCE.isUsernameTaken(text).then(result => {
            isTaken = result;
        });

        await this.setState({ usernameTextFieldError: isTaken })
    }

    renderModalContent = () => {
        const propertyToManage = this.props.property;

        switch(propertyToManage)
        {
            case 'display_name':
                return (
                    <View>
                        <View>
                        <Title>
                            Enter a new display name
                        </Title>
                        <Text>
                        </Text>
                        </View>

                        <TextInput placeholder="Enter a new display name" theme={{colors: {
                            primary: "#2196F3",
                        }}} mode="outlined" value={this.state.textInputValue} onChangeText={text => this.setState({ textInputValue: text })} style={{margin: 5, width: '100%'}} />

                        <View style={styles.buttonsContainer}>
                            <Button mode="text" color="#2196F3" onPress={() => this.handlePropertyUpdate(propertyToManage)}>
                                Accept
                            </Button>

                            <Button mode="text" color="#f44336" onPress={this.props.closeModalMethod}>
                                Cancel
                            </Button>
                        </View>
                    </View>
                )
            case 'username':
                return (
                    <View>
                        <View>
                        <Title>
                            Enter a new username
                        </Title>
                        <Text>
                        </Text>
                        </View>

                        <TextInput placeholder="Enter a new username" theme={{colors: {
                            primary: "#2196F3",
                        }}} mode="outlined" value={this.state.textInputValue} onChangeText={text => this.handleOnChangeUsernameText(text)} style={{margin: 5, width: '100%'}} error={this.state.usernameTextFieldError}/>

                        <View style={styles.buttonsContainer}>
                            <Button mode="text" color="#2196F3" onPress={() => this.handlePropertyUpdate(propertyToManage)} disabled={this.state.usernameTextFieldError}>
                                Accept
                            </Button>

                            <Button mode="text" color="#f44336" onPress={this.props.closeModalMethod}>
                                Cancel
                            </Button>
                        </View>
                    </View>
                )
            case 'email':
                return (
                    <View>
                        <View>
                        <Title>
                            Enter a new email
                        </Title>
                        <Text>
                        </Text>
                        </View>

                        <TextInput placeholder="Enter a new email" theme={{colors: {
                            primary: "#2196F3",
                        }}} mode="outlined" value={this.state.textInputValue} onChangeText={text => this.setState({ textInputValue: text })} style={{margin: 5, width: '100%'}} />

                        <View style={styles.buttonsContainer}>
                            <Button mode="text" color="#2196F3" onPress={() => this.handlePropertyUpdate(propertyToManage)}>
                                Accept
                            </Button>

                            <Button mode="text" color="#f44336" onPress={this.props.closeModalMethod}>
                                Cancel
                            </Button>
                        </View>
                    </View>
                )
        }
    }

    handlePropertyUpdate = (attribute) => {
        this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser(attribute, this.state.textInputValue);
        this.props.closeModalMethod();
    }

    render() {
        return (
            <Provider>
                            <Portal>
                <Modal contentContainerStyle={styles.modal} visible={this.props.isVisible} onDismiss={this.props.closeModalMethod}>
                   {
                       this.renderModalContent()
                   }
                </Modal>
            </Portal>
            </Provider>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        alignSelf: 'center',
        padding: 10,
        width: '90%',
        height: '30%',
        backgroundColor: 'white',
        borderRadius: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    }
})

export default connect(mapStateToProps)(ChangeAccountPropertyModal);