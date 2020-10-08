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
     Avatar
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
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { TouchableOpacity } from 'react-native-gesture-handler';
import UpdateCard from '../../settings/modal/UpdateCard';

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
            <Appbar.Content title="Edit Biography" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20}} />
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
        key: 'LupaTrainer',
        title: 'Lupa Trainer',
        description: '',
    },
    {
        key: 'Payments',
        title: 'Payments',
        description: '',
    }
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
            updateCardModalVisible: false,
        }
    }

    render() {
        const currUserData = this.props.lupa_data.Users.currUserData;
        return (
                <Container style={styles.root}>
                            <Appbar.Header statusBarHeight={false} style={{backgroundColor: '#FFFFFF', elevation: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Appbar.Action icon={() => <Feather1s name="arrow-left" size={20} />} onPress={() => this.props.navigation.pop()} />
                                <Appbar.Content title="Settings" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20}} />
                </Appbar.Header>
                <TouchableOpacity onPress={() => this.props.navigation.push('AccountSettings')}>
                <Appbar theme={{colors: { primary: '#FFFFFF'}}} style={{borderBottomWidth: 0.5, borderColor: 'rgb(174, 174, 178)', paddingHorizontal: 15, elevation: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Avatar.Image size={40} source={{uri: currUserData.photo_url }} />
                    <View style={{marginHorizontal: 10}}>
                        <Text>
                            {currUserData.display_name}
                        </Text>
                        <Text>
                            {currUserData.email}
                        </Text>
                    </View>
                    </View>

                    <Feather1s name="arrow-right" size={20} />
                   
                </Appbar>
                </TouchableOpacity>

                    <SafeAreaView style={{flex: 1}}>
                        
                    <ScrollView>
                        {
                            currUserData.isTrainer ?
                            <View>
                            <Text style={styles.listItemTitleStyle}>
                                Lupa Trainer
                            </Text>
                            <ListItem onPress={() => {}} title="Update Certification" titleStyle={styles.titleStyle} bottomDivider rightIcon={() => <Feather1s name="arrow-right" size={20} />}/>
                        </View>
                            :
                            null
                        }

                        <View>
                            <Text style={styles.listItemTitleStyle}>
                                Payments
                            </Text>
                            <ListItem onPress={() => this.setState({ updateCardModalVisible: true })} title="Update Card" subtitle={currUserData.stripe_metadata.card_last_four == "" ? "You have not saved a card." : `**** **** **** ${currUserData.stripe_metadata.card_last_four}`} titleStyle={styles.titleStyle} bottomDivider rightIcon={() => <Feather1s name="arrow-right" size={20} />}/>
                            <ListItem onPress={() => this.setState({ updateCardModalVisible: true })} leftIcon={() => <Feather1s name="info" size={18} />} title="Learn More" subtitle={() => <Caption> Learn more about payments with Lupa.</Caption>} titleStyle={styles.titleStyle} bottomDivider rightIcon={() => <Feather1s name="arrow-right" size={20} />}/>
                        </View>

                        <View>
                            <Text style={styles.listItemTitleStyle}>
                                Lupa
                            </Text>
                            <ListItem onPress={() => {}} title="Privacy Policy" titleStyle={styles.titleStyle} bottomDivider rightIcon={() => <Feather1s name="arrow-right" size={20} />}/>
                            <ListItem onPress={() => {}} title="Terms and Conditions" titleStyle={styles.titleStyle} bottomDivider rightIcon={() => <Feather1s name="arrow-right" size={20} />}/>
                        </View>


                <EditBioModal isVisible={this.state.editBioVisible} closeModalMethod={() => this.setState({ editBioVisible: false })} />
                <UpdateCard isVisible={this.state.updateCardModalVisible} closeModal={() => this.setState({ updateCardModalVisible: false })} />
                 
                </ScrollView>

                </SafeAreaView>
                </Container>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#EEEEEE"
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
        fontWeight: '600', 
        color: '#212121',
    },
    listItemTitleStyle: {
        color: 'rgb(99, 99, 102)',
        padding: 10
    },
    descriptionStyle: {
        color: '#212121'
    },
});

export default connect(mapStateToProps)(SettingsModal);