import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    Button as NativeButton,
    Image,
    Modal,
    SafeAreaView,
} from 'react-native';

import {
    Button,
    Menu,
    Divider,
    TextInput,
    Portal,
    Dialog,
    Provider,
    Appbar,
    Paragraph
} from 'react-native-paper';

import LupaController from '../../../../controller/lupa/LupaController';

const VerificationModal = (props) => {
    return (
        <Modal visible={props.isVisible} presentationStyle="fullScreen" animated={true} animationType="slide" style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', flex: 1, margin: 0}}>
            <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{width: '90%', fontWeight: '500', fontFamily: 'ARSMaquettePro-Medium', fontSize: 15}}>
                Thanks for submitting your information!  We will verify your credentials and update your account if everything checks out.  Please wait up to 24 hours for your account to be updated.
            </Text>

            <NativeButton title="Complete" onPress={() => props.closeModalMethod()}/>
            </SafeAreaView>
        </Modal>
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

    this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            menuVisible: false,
            buttonText: 'Select a certification',
            certification: '',
            NASM_CERTIFICATE_NUMBER: '',
            verificationSent: false,
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

    closeVerificationCompleteModal = () => {
        this.setState({
            verificationSent: false,
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

    sendCertificationNotice = async () => {
        let currUserUUID = await this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;
        await this.LUPA_CONTROLLER_INSTANCE.addLupaTrainerVerificationRequest(currUserUUID, this.state.certification, this.state.NASM_CERTIFICATE_NUMBER);
        await this.setState({ verificationSent: true  })

        if (this.props.navigation)
        {
            this.props.navigation.goBack();
        }
    }

    getHeader = () => {
        try {
            if ( this.props.navigation.state.params.navFrom)
            {
                if ( this.props.navigation.state.params.navFrom == 'Drawer')
                {
                    return (
                        <Appbar.Header style={{elevation: 0}} theme={{
                            colors: {
                                primary: '#FFFFFF'
                            }
                        }}>
                            <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
                            <Appbar.Content title="Trainer Registration" />
                        </Appbar.Header>
                    )
                }
            }
        }
        catch(err) {
           
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.root}>
                {
                    this.getHeader()
                }
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', }}>
                    <Text style={styles.instructionalText}>
                    Trainers registered on Lupa have access to exclusive tools such as building client list, creating workout programs, and engaging in research opportunies sponsored by Lupa.  
                    As a Lupa Trainer you will be able to make money and engage your clientele through our platform.  We currently only support the NASM certification, b
                    but plan on adding many more in the future.
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

                    <View style={{flex: 2.5, justifyContent: 'center'}}>
                        {
                            this.state.buttonText == 'Select a certification' ? 
                            null
                            :
                            this.getCertificationDetails()
                        }
                    </View>
                    <VerificationModal isVisible={this.state.verificationSent} closeModalMethod={this.closeVerificationCompleteModal} />
                </SafeAreaView>

        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 10
    },
    instructionalText: {
        height: 'auto',
        flexShrink: 1,
        alignSelf: 'center',
        fontSize: 15,
        marginHorizontal: 15,
        padding: 10,
        marginTop: 5,
        flex: 1,
        textAlign: 'center',
        width: '100%',
    },
    verificationModal: {
        width: '50%',
        height: '20%',
        position: 'absolute',
        alignSelf: 'center',
    },
})