import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    Button as NativeButton,
    Image,
    Modal,
    SafeAreaView,
    KeyboardAvoidingView
} from 'react-native';

import {
    Button,
    Menu,
    Divider,
    Caption,
    TextInput,
    Portal,
    Dialog,
    Provider,
    Appbar,
    Paragraph
} from 'react-native-paper';

import LupaController from '../../../../controller/lupa/LupaController';
import { connect } from 'react-redux'

const VerificationModal = (props) => {
    return (
        <Modal visible={props.isVisible} presentationStyle="fullScreen" animated={true} animationType="slide" style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', flex: 1, margin: 0}}>
            <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{width: '90%', fontWeight: '500',   fontSize: 15}}>
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

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

class TrainerInformation extends React.Component {
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
                return <View style={{justifyContent: 'center'}}>
                                    <TextInput 
                                    
                                    theme={{
                                        roundness: 3,
                                        colors: {
                                            primary: '#1089ff'
                                        }
                                    }} 
                                    placeholder="Please enter your NASM certification number." 
                                    value={this.state.NASM_CERTIFICATE_NUMBER} 
                                    mode="outlined" 
                                    onChangeText={text => this.setState({ NASM_CERTIFICATE_NUMBER: text })}
                                    style={{marginHorizontal: 10}}
                                    />
                </View>
            }
    }

    sendCertificationNotice = async () => {
        let currUserUUID = this.props.lupa_data.Users.currUserData.user_uuid
        await this.LUPA_CONTROLLER_INSTANCE.addLupaTrainerVerificationRequest(currUserUUID, this.state.certification, this.state.NASM_CERTIFICATE_NUMBER);
        await this.setState({ verificationSent: true  })

        if (this.props.navigation)
        {
            this.props.navigation.goBack();
        }
    }

    getHeader = () => {
        try {
            if ( this.props.route.params.navFrom)
            {
                if ( this.props.route.params.navFrom == 'Drawer')
                {
                    return (
                        <Appbar.Header style={{elevation: 0}} theme={{
                            colors: {
                                primary: 'transparent'
                            }
                        }}>
                            <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
                            <Appbar.Content title="Trainer Registration" titleStyle={{fontSize: 20, fontWeight: 'bold', fontFamily: 'Avenir-Heavy'}} />
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
            <View behavior="padding" style={styles.root}>
                {
                    this.getHeader()
                }
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', width: '100%', paddingHorizontal: 10 }}>
                    <Text style={styles.instructionalText}>
                    Trainers registered on Lupa have access to create full scale workout programs.  As a Lupa Trianer you will be able to make money and engage your clientele through our platform.
                </Text>
                <Caption>
                    Currently we only support NASM certifications.
                </Caption>
                </View>

     

                    <View style={{flex: 3, justifyContent: 'space-evenly'}}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
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
          {
                            this.state.buttonText == 'Select a certification' ? 
                            null
                            :
                            this.getCertificationDetails()
                        }
          </View>

          <View style={{flex: 1}}>
{this.state.buttonText == 'Select a certification' ?  null :  <NativeButton title="Submit" onPress={() => this.sendCertificationNotice()} />}
                       
          </View>
                    

                       
                    </View>
                    <VerificationModal isVisible={this.state.verificationSent} closeModalMethod={this.closeVerificationCompleteModal} />
                    <SafeAreaView />
                </View>

        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    instructionalText: {
        height: 'auto',
        flexShrink: 1,
        alignSelf: 'center',
        fontFamily: 'Avenir-Roman',
        fontSize: 15,
        textAlign: 'left',
        width: '100%',
        paddingVertical: 10
    },
    verificationModal: {
        width: '50%',
        height: '20%',
        position: 'absolute',
        alignSelf: 'center',
    },
})

export default connect(mapStateToProps)(TrainerInformation)