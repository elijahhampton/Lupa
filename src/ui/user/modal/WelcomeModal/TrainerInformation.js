import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    Button as NativeButton,
    Image,
    Modal,
} from 'react-native';

import {
    Button,
    Menu,
    Divider,
    TextInput,
    Portal,
    Dialog,
    Provider
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';

import LupaController from '../../../../controller/lupa/LupaController';

const VerificationModal = (props) => {
    return (
        <Modal visible={props.isVisible} presentationStyle="fullScreen" animated={true} animationType="slide" style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', flex: 1, margin: 0}}>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontWeight: '500'}}>
                Thanks for submitting your information!  We will verify your credentials and update your account if everything checks out.  Please wait up to 24 hours for your account to be updated.
            </Text>
            </View>

            <Image defaultSource={require('../../../images/verification_complete.png')} style={{width: '80%', height: '50%', alignSelf: 'center'}}  />

            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <NativeButton title="Complete" onPress={() => props.closeModalMethod()}/>
            </View>

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
        await this.setState({ verificationSent: true  })
        let currUserUUID = await this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;
        await this.LUPA_CONTROLLER_INSTANCE.addLupaTrainerVerificationRequest(currUserUUID, this.state.certification, this.state.NASM_CERTIFICATE_NUMBER);
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
                    <VerificationModal isVisible={this.state.verificationSent} closeModalMethod={this.closeVerificationCompleteModal} />
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
        height: '20%',
        position: 'absolute',
        alignSelf: 'center',
    },
})