import React, { useState, useEffect } from 'react';

import {
    Modal,
    Text,
    View,
    StyleSheet,
    ScrollView,
    Dimensions
} from 'react-native';

import {
    Header,
    Container,
    Left,
    Body,
    Right,
} from 'native-base';

import {
    Button,
    IconButton,
    Title,
    TextInput,
    Caption,
    Divider,
    List,
    Switch,
    Appbar,
} from 'react-native-paper';

import { ListItem } from 'react-native-elements'

import SafeAreaView from 'react-native-safe-area-view';

import { useDispatch } from 'react-redux';

import FeatherIcon from 'react-native-vector-icons/Feather'

import LupaColor from '../../../common/LupaColor'
import { connect, useSelector } from 'react-redux';
import LupaController from '../../../../controller/lupa/LupaController';
import { Constants } from 'react-native-unimodules';
import { getUpdateCurrentUserAttributeActionPayload } from '../../../../controller/redux/payload_utility';

function EditBioModal(props) {
    //lupa controller instance
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    //redux dispatch hook
    const dispatch = useDispatch();

    //user bio from useSelector redux hook
    const currUserBio = useSelector(state => {
        return state.Users.currUserData.bio
    })

    //bio and setbio function from useState
    let [bioText, setBioText] = useState('');

    //use effect hook
    useEffect(() => {
        setBioText(currUserBio)
    }, [])

    /**
     * 
     */
    handleCloseModal = async () => {
        LUPA_CONTROLLER_INSTANCE.updateCurrentUser('bio', bioText, "");

        const PAYLOAD = getUpdateCurrentUserAttributeActionPayload('bio', bioText)

        await dispatch({ type: 'UPDATE_CURRENT_USER_ATTRIBUTE', payload: PAYLOAD });

        props.closeModalMethod();
    }


    return (
    <Modal presentationStyle="fullScreen" visible={props.isVisible} style={{backgroundColor: 'white'}}>
       <SafeAreaView style={{flex: 1}}>
        <Appbar.Header style={{backgroundColor: '#FFFFFF', elevation: 0, alignItems: 'center'}}>
            <Appbar.BackAction onPress={() => props.closeModalMethod()}/>
            <Appbar.Content title="Edit Biography" titleStyle={{fontFamily: 'HelveticaNeue-Medium', fontSize: 15, fontWeight: '600'}} />
            <Button theme={{colors: {
                primary: 'rgb(33,150,243)'
            }}}
            onPress={() => handleCloseModal()}>
                <Text>
                    Save
                </Text>
            </Button>
        </Appbar.Header>
       <View style={{padding: 10}}>
       <Text style={{  fontSize: 17}}>
            Write a biography
        </Text>
        <Caption>
           Tell users something about yourself.  Why did you join Lupa?  What are you hoping to accomplish on your fitness journey?  What are your fitness interest? Goals?
        </Caption>
       </View>

       <Divider style={{marginVertical: 10}} />

        <View style={{flex: 1}}>
        <TextInput maxLength={180} value={bioText} onChangeText={text => setBioText(text)} multiline placeholder="Edit your biography" style={{width: Dimensions.get('window').width - 20, height: '30%', alignSelf: 'center'}} mode="outlined" theme={{
            colors: {
                primary: 'rgb(33,150,243)'
            }
        }}>

</TextInput>
        </View>
        </SafeAreaView>
    </Modal>
    )
}

accountList = [
    {
        key: 'Account',
        title: 'Account',
        description: '',
    },
    {
        key: 'Payments',
        title: 'Payments',
        description: '',
    },
    {
        key: 'LupaTrainer',
        title: 'Lupa Trainer',
        description: '',
    },
    {
        key: 'ChangePassword',
        title: 'Change Password',
        description: 'Change Password',
    },
    {
        key: 'RecoverPassword',
        title: 'Recover Password',
        description: 'Lupa will send you an email with a temporary password',
    },
]

notificationsList = [
    {
        key: 'Programs',
        title: 'Programs',
        description: 'You are set to receive notifications for programs',
    },
    {
        key: 'PackEvents',
        title: 'Pack Events',
        description: 'You are set to receive notifications for sessions'
    },
    {
        key: 'PackChat',
        title: 'Pack Chat',
        description: 'You are set to receive notifications for sessions'
    },
    {
        key: 'Messages',
        title: 'Messages',
        description: 'You are set to receive notifications for sessions'
    },
    {
        key: 'NewFollowers',
        title: 'New Followers',
        description: 'You are set to receive notifications for sessions'
    },
]

paymentList = [
    {
        key: 'AddPaymentMethod',
        title: 'Add a payment method',
    },
    {
        key: 'ModifyPaymentMethod',
        title: 'Modify an existing payment method',
    },
]

privacyList = [

]

fitnessProfileList = [
    {
        key: 'Goals',
        title: 'Goals',
        description: 'Add or change existing goal'
    },
]

lupaList = [
    {
        key: 'PrivacyPolicy',
        title: 'Privacy Policy',
        description: 'Read the Privacy Policy'
    },
    {
        key: 'TermsAndConditions',
        title: 'Terms and Conditions',
        description: 'Read the Lupa Terms and Conditions'
    }
]

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

class SettingsModal extends React.Component {

    constructor(props) {
        super(props);
        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()
        
        this.state = {
            userData: {},
            goalsModalIsOpen: false,
            property: '',
            reload: false,
            editBioVisible: false,
            isEditingDisplayName: false,
        }
    }

    componentDidMount = async () => {
        await this.setupSettings();
    }

    setupSettings = async () => {
        let userDataIn = {}
        

        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(this.props.lupa_data.Users.currUserData.user_uuid).then(result => {
            userDataIn = result;
        });

        await this.setState({ 
            userData: userDataIn
        })
    }

    handleOpenChangePropertyModal = async (key) => {
        await this.setState({ property: key})
        await this.setState({ showChangeAccountPropertyModal: true })
    }

    //need to fix this.. don't want to make two separate reads
    handleCloseChangePropertyModal = async () => {
        await this.setupSettings();
        this.setState({ showChangeAccountPropertyModal: false })
        await this.setupSettings();
    }

    handleCloseAddPaymentModal = async () => {
        this.setState({ paymentModalIsOpen: false })
    }

    renderNotificationSectionSwitches = (key) => {
        switch(key) {
                case 'Programs':
                    return <Switch color="#2196F3" value={this.state.programsSwitchIsEnabled} onValueChange={() => this.handleNotificationSwitchesOnPress(key)}/>
                case 'PackEvents':
                    return <Switch color="#2196F3" value={this.state.packEventsSwitchIsEnabled} onValueChange={() => alert('Switch value changed')}/>
                case 'PackChat':
                    return <Switch color="#2196F3" value={this.state.packChatSwitchIsEnabled} onValueChange={() => alert('Switch value changed')}/>
                case 'Messages':
                    return <Switch color="#2196F3" value={this.state.messagesSwitchIsEnabled} onValueChange={() => alert('Switch value changed')}/>
                case 'NewFollowers':
                    return <Switch color="#2196F3" value={this.state.newFollowersSwitchIsEnabled} onValueChange={() => alert('Switch value changed')}/>
        }
    }

    handleNotificationSwitchesOnPress = (key) => {
        switch(key) {
            case 'Programs':
                //set state
                this.setState({ programsSwitchIsEnabled: true });
                //change description
                //update value in controller

            case 'PackEvents':
            case 'PackChat':
            case 'Messages':
            case 'NewFollowers':
        }
    }


      handleListItemOnPress = (key) => {
        switch(key) {
            case 'ChangePaymentInformation':
               this._navigateToPaymentSettings();
            case 'Goals':
                this._handleGoalsModalOpen();
                break;

        }
    }

    _navigateToPaymentSettings = () => {
        this.props.navigation.navigate('PaymentSettingsView');
    }

    _handleGoalsModalOpen = () => {
        this.setState({ goalsModalIsOpen: true })
    }

    _handleGoalsModalOnClose = () => {
        this.setState({ goalsModalIsOpen: false })
    }

    getAccountListDescription = (description_property) => {
        switch(description_property)
        {
            case 'display_name':
                return this.state.userData.display_name;
            case 'username':
                return this.state.userData.username;
            case 'email':
                return this.state.userData.email;
        }
    }

    getIconName = (property) => {
        switch(property)
        {
            case 'change_password':
            case 'recover_password':
                return 'lock'
            default:
                return ''
        }
    }

    render() {
        return (
                <Container style={styles.root}>
                            <Appbar.Header statusBarHeight={false} style={{backgroundColor: '#FFFFFF', elevation: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Appbar.BackAction onPress={() => this.props.navigation.pop()} />
                                <Appbar.Content title="Settings" />
                </Appbar.Header>
                    <SafeAreaView style={{flex: 1}}>
                    <ScrollView>
                        {
                            accountList.map(item => {
                                return (
                                    <ListItem title={item.title} titleStyle={styles.titleStyle} description={this.getAccountListDescription(item.property)} bottomDivider rightIcon={() => <FeatherIcon name="arrow-right" size={20} />}/>
                                )
                            })
                        }

                        <View style={{padding: 10, marginVertical: 20}}>
   
                            <Text style={{paddingVertical: 15}}>
                                <Text style={{fontSize: 20,  fontFamily: 'Helvetica-Light'}}>
                                    Privacy Policy
                                </Text>
                                <FeatherIcon name="arrow-right" size={15} />
                                </Text>

                                <Text>
                                <Text style={{fontSize: 20,  fontFamily: 'Helvetica-Light'}}>
                                    Terms and Conditions
                                </Text>
                                <FeatherIcon name="arrow-right" size={15} />
                                </Text>
                        </View>
        <EditBioModal isVisible={this.state.editBioVisible} closeModalMethod={() => this.setState({ editBioVisible: false })} />
                </ScrollView>
                </SafeAreaView>
                </Container>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    },
    pageTitle: {
        color: '#2196F3'
    },
    listItem: {
        width: '90%'
        //backgroundColor: 'white'
    },
    listAccordion: {
        color: '#2196F3',
    },
    listSubheader: {
        color: '#2196F3',
    },
    listItemTitleStyle: {
        color: LupaColor.LUPA_BLUE
    },
    alignRowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleStyle: {
        fontSize: 13, 
        fontWeight: '400', 
        color: '#212121',
    },
    descriptionStyle: {
        color: '#212121'
    },
});

export default connect(mapStateToProps)(SettingsModal);