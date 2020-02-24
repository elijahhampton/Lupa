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
    TextInput,
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

certifications = [
    {
        key: 'NASM',
        title: 'National Academy of Sports Medicine',
    }
]

export default class TrainerInformation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            menuVisible: false,
            buttonText: 'Select a certification',
            certification: '',
            NASM_CERTIFICATE_NUMBER: '',
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

    handleOnPressCertification = (key) => {
        this.setState({ buttonText: key.title });
        this.setState({ certification: key.key });
        this.closeMenu();
    }

    getCertificationDetails = () => {
        switch (this.state.certification)
        {
            case 'NASM':
                return <View style={{flex: 1, justifyContent: 'space-around'}}>
                                    <TextInput theme={{
                                        colors: {
                                            primary: '#2196F3'
                                        }
                                    }} placeholder="Please enter your NASM certification number." value={this.state.NASM_CERTIFICATE_NUMBER} color="#2196F3" mode="outlined" onChangeText={text => this.setState({ NASM_CERTIFICATE_NUMBER: text })}/>
                <NativeButton title="Submit" onPress={() => this.sendCertificationNotice()} />
                </View>
            }
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
            onDismiss={() => this.setState({ menuVisible: false })}
            anchor={
              <NativeButton onPress={this.openMenu} title={this.state.buttonText} />
            }
          >
            {
                certifications.map(cert => {
                    return <Menu.Item key={cert.key} title={cert.title} onPress={() => this.handleOnPressCertification(cert)} onDismiss={() => this.setState({ menuVisible: false })}/>
                })
            }
            <Divider />
            <Menu.Item onPress={() => {}} title="Cancel" />
          </Menu>
          </Provider>

                    <View style={{flex: 3, justifyContent: 'center'}}>
                        {
                            this.state.buttonText == 'Select a certification' ? 
                            null
                            :
                            this.getCertificationDetails()
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