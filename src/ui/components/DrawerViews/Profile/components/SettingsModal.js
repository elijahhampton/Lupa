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

import LogoutButton from '../../../DrawerViews/Profile/components/LogoutButton';

import SafeAreaView from 'react-native-safe-area-view';

import { ListItem } from 'react-native-elements';

import { withNavigation, NavigationActions, StackActions } from 'react-navigation';

import { logoutUser } from '../../../../../controller/lupa/auth';

import Color from '../../../../common/Color'
import GoalsModal from '../../../Modals/Goals/GoalsModal';
import ChangeAccountPropertyModal from '../../../Modals/User/Settings/ChangeAccountPropertyModal';
import { connect } from 'react-redux';
import LupaController from '../../../../../controller/lupa/LupaController';

import AddPaymentModal from '../components/AddPaymentModal';

import StripeCheckout from 'expo-stripe-checkout';

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
        key: 'Sessions',
        title: 'Sessions',
        description: 'You are set to receive notifications for sessions',
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

trainerList = [
    {
        key: 'Certification',
        title: 'Certification',
        description: 'National Association for Sports Medicine'
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
            sessionsSwitchIsEnabled: false,
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
                case 'Sessions':
                    return <Switch color="#2196F3" value={this.state.sessionsSwitchIsEnabled} onValueChange={() => this.handleNotificationSwitchesOnPress(key)}/>
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
            case 'Sessions':
                //set state
                this.setState({ sessionsSwitchIsEnabled: true });
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
          console.log(key);
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
                            <IconButton icon="arrow-back" onPress={() => this.props.navigation.goBack('Profile')}/>
                        </Left>
    
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

                        <List.Section>
                        <List.Subheader style={styles.listSubheader}>Payments</List.Subheader>
                        <List.Accordion theme={{
                            colors: {
                                primary: '#2196F3'
                            }
                        }} expanded={true} style={styles.listAccordion} title="Payment Preferences" right={props => <List.Icon {...props} icon="chevron-up" />}>
                        {
                            paymentList.map(item => {
                                return (
                                <List.Item style={styles.listItem} title={item.title} description={item.description} onPress={() => this.handleListItemOnPress(item.key)}/>
                                )
                            })
                        }
                        </List.Accordion>
                        </List.Section>

                        <List.Section>
                        <List.Subheader style={styles.listSubheader}>Privacy</List.Subheader>
                        {
                            privacyList.map(item => {
                                return (
                                <List.Item style={styles.listItem} title={item.title} description={item.description} />
                                )
                            })
                        }
                        </List.Section>

                        <List.Section>
                        <List.Subheader style={styles.listSubheader}>Fitness Profile</List.Subheader>
                        {
                           fitnessProfileList.map(item => {
                               return (
                                <List.Item style={styles.listItem} key={item.key} title={item.title} description={item.description} onPress={() => {this.handleListItemOnPress(item.key)}}/>
                                )
                            })
                        }
                        </List.Section>

                        <List.Section style={styles.listSection}>
                        <List.Subheader style={styles.listSubheader}>Lupa Trainer</List.Subheader>
                        {
                            trainerList.map(item => {
                                return (
                                     <List.Item style={styles.listItem} title={item.title} description={item.description}/>
                                )
                            })
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
                <GoalsModal  animated={true} animationType="fade" isOpen={this.state.goalsModalIsOpen} closeModalMethod={this._handleGoalsModalOnClose} />
                {/*<ChangeAccountPropertyModal property={this.state.property} closeModalMethod={this.handleCloseChangePropertyModal} isVisible={this.state.showChangeAccountPropertyModal} />*/}
                {/*<AddPaymentModal isOpen={this.state.paymentModalIsOpen} closeModalMethod={this.handleCloseAddPaymentModal}/>*/}
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