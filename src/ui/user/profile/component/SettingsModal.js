import React from 'react';

import {
    Modal,
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    ScrollView
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
    Divider,
    List,
    Title,
    Switch,
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';


import { withNavigation, NavigationActions, StackActions } from 'react-navigation';

import { logoutUser } from '../../../../controller/lupa/auth/auth';

import Color from '../../../common/Color'
import { connect } from 'react-redux';
import LupaController from '../../../../controller/lupa/LupaController';

accountList = [
    {
        key: 'Name',
        title: 'Name',
        description: '',
        property: 'display_name'
    },
    {
        key: 'Username',
        title: 'Username',
        description: '',
        property: 'username',
    },
    {
        key: 'Email',
        title: 'Email',
        description: '',
        property: 'email',
    },
    {
        key: 'ChangePassword',
        title: 'Change Password',
        description: 'Change Password',
        property: 'change_password',
    },
    {
        key: 'RecoverPassword',
        title: 'Recover Password',
        description: 'Lupa will send you an email with a temporary password',
        property: 'recover_password'
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
            programsSwitchIsEnabled: false,
            packEventsSwitchIsEnabled: false,
            packChatSwitchIsEnabled: false,
            messagesSwitchIsEnabled: false,
            newFollowersSwitchIsEnabled: false,
            goalsModalIsOpen: false,
            showChangeAccountPropertyModal: false,
            property: '',
            reload: false,
            paymentModalIsOpen: true
        }
    }

    componentDidMount = async () => {
        await this.setupSettings();
    }

    setupSettings = async () => {
        let userDataIn;

        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid).then(result => {
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
    
    _handleUserLogout = async () => {
        await logoutUser();
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Auth' })],
        });

        this.props.navigation.dispatch(resetAction); 
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
            case 'mobile_number':
                return this.state.userData.mobile_number;
        }
    }

    render() {
        return (
                <Container style={styles.root}>
                    <Header>
                        <Left>
                            <IconButton icon="arrow-back" onPress={() => this.props.navigation.goBack(null)}/>
                        </Left>

                        <Body />

                        <Right>
                            <Title style={styles.pageTitle}>
                                Settings
                            </Title>
                        </Right>
                    </Header>
                    <SafeAreaView style={{flex: 1}}>
                    <ScrollView>
                        <List.Section>
                        <List.Subheader style={styles.listSubheader}>Account</List.Subheader>
                        {
                            accountList.map(item => {
                                return (
                                    <List.Item onPress={() => this.handleOpenChangePropertyModal(item.property)} style={styles.listItem} title={item.title} description={this.getAccountListDescription(item.property)} descriptionEllipsizeMode="tail"/>
                                )
                            })
                        }
                        </List.Section>

                        <List.Section>
                        <List.Subheader style={styles.listSubheader}>Notifications</List.Subheader>
                        {
                            notificationsList.map((item, index) => {
                               return (
                                <List.Item style={styles.listItem} key={item.key} title={item.title} right={() => this.renderNotificationSectionSwitches(item.key)}/>
                               )
                            })
                        }
                        </List.Section>

                        <List.Section style={styles.listSection}>
                        <List.Subheader style={styles.listSubheader}>Lupa Trainer</List.Subheader>
                        {
                                     <List.Item style={styles.listItem} title={"Certification"} description={this.state.userData.certification}/>
                        }
                        </List.Section>

                        <List.Section>
                        <List.Subheader style={styles.listSubheader}>Lupa</List.Subheader>
                        {
                            lupaList.map(item => {
                                return (
                                    <List.Item style={styles.listItem} title={item.title} description={item.description} />
                                )
                            })
                        }
                        </List.Section>
        <Button mode="text" compact color="#2196F3" onPress={() => {this._handleUserLogout()}}>
        Log out
        </Button>
                </ScrollView>
                </SafeAreaView>
                </Container>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#FAFAFA"
    },
    pageTitle: {
        color: '#2196F3'
    },
    listItem: {
        //backgroundColor: 'white'
    },
    listAccordion: {
        color: '#2196F3',
    },
    listSubheader: {
        color: '#2196F3',
    },
    listItemTitleStyle: {
        color: Color.LUPA_BLUE
    },
    alignRowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

export default connect(mapStateToProps)((SettingsModal));