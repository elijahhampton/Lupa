import React, { useState, useEffect } from 'react';

import {
    Modal,
    Text,
    View,
    StyleSheet,
    Linking,
    RefreshControl,
    Image,
    ScrollView,
    SafeAreaView,
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
    Caption,
    Divider,
    List,
    Snackbar,
    Switch,
    Banner,
    Appbar,
    Avatar,
    Surface
} from 'react-native-paper';


import { ListItem, Input, CheckBox } from 'react-native-elements'



import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import axios from 'axios';

import LupaColor from '../../../common/LupaColor'
import { connect, useSelector } from 'react-redux';
import LupaController from '../../../../controller/lupa/LupaController';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { TouchableOpacity } from 'react-native-gesture-handler';
import UpdateCard from '../../settings/modal/UpdateCard';

import moment from 'moment'
import { getLupaUserStructurePlaceholder } from '../../../../controller/firebase/collection_structures';
import LOG, { LOG_ERROR } from '../../../../common/Logger';
import FullScreenLoadingIndicator from '../../../common/FullScreenLoadingIndicator';
import { createStripeCustomerAccount, STRIPE_VERIFICATION_STATUS } from '../../../../modules/payments/stripe';
import LUPA_DB from '../../../../controller/firebase/firebase';
import StripeVerificationStatusModal from '../../settings/modal/StripeVerificationStatusModal'
import HomeGymModal from '../../modal/HomeGymModal';
import { getLupaStoreState } from '../../../../controller/redux';

const SECTION_SEPARATOR = 15;
const SUB_SECTION_SEPARATOR = 25;
const FETCH_STRIPE_ACCOUNT_DATA_ENDPOINT = "https://us-central1-lupa-cd0e3.cloudfunctions.net/retrieveTrainerAccountInformation";

const SettingsModal = () => {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const currUserUUID = useSelector(state => {
        return state.Users.currUserData.user_uuid;
    });
    const navigation = useNavigation();

    const [homeGymModalIsVisible, setHomeGymModalIsVisible] = useState(false);

    const [updatedUserData, setUpdatedUserData] = useState(getLupaUserStructurePlaceholder());
    const [loading, setIsLoading] = useState(false);
    const [ready, setIsReady] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [registrationModalIsVisible, setRegistrationModalVisible] = useState(false);
    const [updateCardModalIsVisible, setUpdateCardModalIsVisible] = useState(false);
    const [publicIPAddress, setPublicIPAddress] = useState(0)

    const [stripeData, setStripeData] = useState({ accountData: {}, balanceData: {} })
    const [componentDidErr, setComponentDidErr] = useState(false);
    const [verificationCurrentlyDue, setVerificationCurrentlyDue] = useState([])
    const [verificationErrors, setVerificationErrors] = useState([])
    const [verificationStatus, setVerificationStatus] = useState('')
    const [verificationDeadline, setVerificationDeadline] = useState(new Date());

    useEffect(() => {
        LOG('SettingsModal.js', 'Running use effect in SettingsModal.js.  Fetching public IP address and requesting stripe account data for the current user.');
        let userDataObserver;
        try {
            userDataObserver = LUPA_DB.collection('users').doc(currUserUUID).onSnapshot(documentSnapshot => {
                const updatedData = documentSnapshot.data();
                setUpdatedUserData(updatedData);
            });
        } catch (error) {
            setComponentDidErr(true)
            updatedUserData.user_uuid = -1; //Need to change this to another method for detecting error 
            setIsLoading(false);
            setIsReady(true);
        }

        setIsLoading(true);
        fetchStripeData();
        setIsLoading(false);
        setIsReady(true);

        return () => userDataObserver();
    }, [publicIPAddress, updatedUserData.user_uuid]);

    const fetchStripeData = () => {
        const hasSubmittedForVerification = updatedUserData.stripe_metadata.has_submitted_for_verification;

        if (hasSubmittedForVerification) {
            fetchExistingStripeData()
        } else {
            fetchNonExistingStripeData()
        }
    }

    const fetchNonExistingStripeData = () => {
        LOG('SettingsModal.js', 'User account id is set to : ' + updatedUserData.stripe_metadata.account_id);
        LOG('SettingsModal.js', 'Fetching user stripe data.')

        const stripeAccountID = updatedUserData.stripe_metadata.account_id;
        if (typeof (stripeAccountID) == 'undefined' || stripeAccountID == "") {
            handleSetVerificationStatus('unregistered')
            return;
        }

        /* We need to check and see if the user has submitted for verification before.. if so then we just load the verification data.
        If not then we need to set that verification status as well */
        //check of the user has submitted for verification

            axios({
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                url: FETCH_STRIPE_ACCOUNT_DATA_ENDPOINT,
                data: JSON.stringify({
                    trainer_account_id: stripeAccountID
                })
            }).then(response => {
                LOG('SettingsModal.js', 'Finished running axios request.');
                setStripeData(response.data.account_data)
                setVerificationCurrentlyDue(response.data.account_data.requirements.currently_due)
                setVerificationErrors(response.data.account_data.requirements.errors)
                handleSetVerificationStatus('unregistered')
                setComponentDidErr(false);
                setIsLoading(false)
                setIsReady(true);
            }).catch(error => {
                LOG_ERROR('SettingsModal.js', 'Error running axios request.', error);
                console.log(error)
                setComponentDidErr(true)
                setStripeData(undefined);
                setIsLoading(false)
                setIsReady(true)
            })

    }

    const fetchExistingStripeData = () => {
        LOG('SettingsModal.js', 'User account id is set to : ' + updatedUserData.stripe_metadata.account_id);
        LOG('SettingsModal.js', 'Fetching user stripe data.')

        console.log('fetching existing')
        const stripeAccountID = updatedUserData.stripe_metadata.account_id;

        if (typeof (stripeAccountID) == 'undefined' || stripeAccountID == "") {
            return;
        }
        /* We need to check and see if the user has submitted for verification before.. if so then we just load the verification data.
        If not then we need to set that verification status as well */
        //check of the user has submitted for verification
        axios({
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            url: FETCH_STRIPE_ACCOUNT_DATA_ENDPOINT,
            data: JSON.stringify({
                trainer_account_id: stripeAccountID
            })
        }).then(response => {
            LOG('SettingsModal.js', 'Finished running axios request.');
            setStripeData(response.data.account_data)
            setVerificationCurrentlyDue(response.data.account_data.requirements.currently_due)
            setVerificationErrors(response.data.account_data.requirements.errors)
            setVerificationDeadline(response.data.account_data.requirements.current_deadline);
            handleSetVerificationStatus(response.data.account_data.individual.verification.status)
            setComponentDidErr(false);
            setIsLoading(false)
            setIsReady(true);
        }).catch(error => {
            LOG_ERROR('SettingsModal.js', 'Error running axios request.', error);
            setComponentDidErr(true)
            setStripeData(undefined);
            setIsLoading(false)
            setIsReady(true)
        });
    }

    const handleOnRefresh = () => {
        fetchStripeData();
    }

    const handleSetVerificationStatus = (status) => {
        const currentVerificationStatus = Number(updatedUserData.stripe_metadata.connected_account_verification_status);
        //check if account is disabled
        //TODO
        console.log('a')

        console.log(status)
        //handle status
        switch (status) {
            case 'verified':
                if (currentVerificationStatus != Number(STRIPE_VERIFICATION_STATUS.VERIFIED)) {
                    let newUserData = updatedUserData;
                    newUserData.stripe_metadata.connected_account_verification_status = 0;
                    LUPA_CONTROLLER_INSTANCE.updateCurrentUser('stripe_metadata', updatedUserData.stripe_metadata, "");
                }
                setVerificationStatus(0);
                break;
            case 'pending':
                if (currentVerificationStatus != Number(STRIPE_VERIFICATION_STATUS.PENDING)) {
                    let newUserData = updatedUserData;
                    newUserData.stripe_metadata.connected_account_verification_status = 1;
                    LUPA_CONTROLLER_INSTANCE.updateCurrentUser('stripe_metadata', updatedUserData.stripe_metadata, "");
                }
                setVerificationStatus(1);
                break;
            case 'unverified':
                if (currentVerificationStatus != Number(STRIPE_VERIFICATION_STATUS.UNVERIFIED)) {
                    let newUserData = updatedUserData;
                    newUserData.stripe_metadata.connected_account_verification_status = 2;
                    LUPA_CONTROLLER_INSTANCE.updateCurrentUser('stripe_metadata', updatedUserData.stripe_metadata, "");
                }
                setVerificationStatus(2);
                break;
            default:
                if (currentVerificationStatus != Number(STRIPE_VERIFICATION_STATUS.UNREGISTERED)) {
                    let newUserData = updatedUserData;
                    newUserData.stripe_metadata.connected_account_verification_status = 3;
                    LUPA_CONTROLLER_INSTANCE.updateCurrentUser('stripe_metadata', updatedUserData.stripe_metadata, "");
                }
                setVerificationStatus(3)
                break;
        }
    }

    const updateCardIsDisabled = () => {
        if (updatedUserData.stripe_metadata.stripe_id == null
            || updatedUserData.stripe_metadata.stripe_id == ""
            || typeof(updatedUserData.stripe_metadata.stripe_id) == 'undefined' ) {
                return true
            }  else {
                return false;
            }
    }

    const renderCardData = () => {
        let cardMessage = "";

        if (updatedUserData.stripe_metadata.stripe_id == null
            || updatedUserData.stripe_metadata.stripe_id == ""
            || typeof(updatedUserData.stripe_metadata.stripe_id) == 'undefined' ) {
                cardMessage = "Enable payments before updating your card information."
                return cardMessage;
            }  

        try {
            if (typeof (updatedUserData.stripe_metadata.card_last_four) == 'undefined' || updatedUserData.stripe_metadata.card_last_four == "") {
                cardMessage = "You have not saved a card.";
            } else {
                cardMessage = `**** **** **** ${updatedUserData.stripe_metadata.card_last_four}`
            }
        } catch (error) {
            return "An error occurred while trying to pull your card data."
        }
        return cardMessage;
    }

    const renderVerificationStatusData = () => {
        const status = Number(updatedUserData.stripe_metadata.connected_account_verification_status);

        if (componentDidErr) {
            return 'An error occurred while trying to fetch your verification status.  Refresh this page to try again.'
        }

        if (status == STRIPE_VERIFICATION_STATUS.VERIFIED) {
            return 'Your account has been verified.';
        } else if (status == STRIPE_VERIFICATION_STATUS.PENDING) {
            return 'Your account is pending verification';
        } else if (status == STRIPE_VERIFICATION_STATUS.UNVERIFIED) {
            return `Your account must be verified before you can begin to accept payments.  Click here to fill out your payouts verification information.  Your verification form must be filled out by ${moment(verificationDeadline).format('LL').toString()} to avoid your payouts account from becoming disabled`;
        } else if (status == STRIPE_VERIFICATION_STATUS.UNREGISTERED) {
            return 'Ready to start accepting payments?  Click here to create your stripe customer account.';
        } else {
            return 'An error occurred while trying to fetch your verification status.  Refresh this page to try again.';
        }
    }

    const getTrainerPayoutsSubtitleStyle = () => {
        const status = Number(updatedUserData.stripe_metadata.connected_account_verification_status);

        /* This is how we should actually show the status captions once we allow for all of the 
        stages */
        if (status == STRIPE_VERIFICATION_STATUS.VERIFIED) {
            return {
                color: '#4CAF50',
            }
        } else if (status == STRIPE_VERIFICATION_STATUS.PENDING) {
            return {
                color: '#1089ff',
            }
        } else if (status == STRIPE_VERIFICATION_STATUS.UNVERIFIED) {
            return {
                color: '#f44336',
            }
        } else if (status == STRIPE_VERIFICATION_STATUS.UNREGISTERED) {
            return {
                color: 'grey'
            }
        } else {
            return {
                color: 'grey'
            }
        }
    }

   const handleTrainerPayoutsOnPress = async () => {
        const status = Number(updatedUserData.stripe_metadata.connected_account_verification_status);

        if (componentDidErr) {
            return;
        }

        switch (status) {
            case STRIPE_VERIFICATION_STATUS.VERIFIED:
                setRegistrationModalVisible(true);
                break;
            case STRIPE_VERIFICATION_STATUS.PENDING:
                setRegistrationModalVisible(true);
                break;
            case STRIPE_VERIFICATION_STATUS.UNVERIFIED:
                setRegistrationModalVisible(true);
                break;
            case STRIPE_VERIFICATION_STATUS.UNREGISTERED:
                setIsLoading(true);
                const email = updatedUserData.email;
                const uuid = updatedUserData.user_uuid;

                await createStripeCustomerAccount(email, uuid, true).then(() => {
                    setIsLoading(false);
                }).catch(error => {
                    setComponentDidErr(true);
                    setIsLoading(false);
                })
                break;
            default:

        }
    }

    const handleUserPaymentsOnPress = async () => {
        if (componentDidErr) {
            return;
        }

        setIsLoading(true);

        const email = updatedUserData.email;
        const uuid = updatedUserData.user_uuid;
        await createStripeCustomerAccount(email, uuid, false).then(() => {
            setIsLoading(false);
        }).catch(error => {
            setComponentDidErr(true);
            setIsLoading(false);
        })
    }

    const handleChangeHomeGymOnPress = () => {
        setHomeGymModalIsVisible(true);
    }

    const renderPaymentsOptions = () => {

        let userSubtitleText = ""
        let styling = {}
        if (updatedUserData.stripe_metadata.stripe_id == ""
            || typeof (updatedUserData.stripe_metadata.stripe_id) == 'undefined'
            || updatedUserData.stripe_metadata.stripe_id == null) {
            userSubtitleText = "Lupa uses Stripe's infrastructure to provide a secure payment gateway.  Click here to register your account with stripe.";
            styling={
                color: 'grey'
            }
        } else {
            userSubtitleText = "Your account has been enabled to make payments."
            styling={
                color: 'green'
            }
        }

        return (
            <View>
                <Text style={styles.listItemTitleStyle}>
                    Payments
                </Text>

                {
                    updatedUserData.isTrainer == false ?
                        <ListItem onPress={handleUserPaymentsOnPress} title="Enable Payments" titleStyle={styles.titleStyle} subtitle={userSubtitleText} subtitleStyle={[{ fontSize: 12 }, styling]} bottomDivider />
                        :
                        <ListItem onPress={handleTrainerPayoutsOnPress} title="Trainer Payouts" titleStyle={styles.titleStyle} subtitle={renderVerificationStatusData()} subtitleStyle={[{ fontSize: 12 }, getTrainerPayoutsSubtitleStyle()]} bottomDivider />
                }

                <ListItem onPress={() => setUpdateCardModalIsVisible(true)} disabled={updateCardIsDisabled()} title="Update Card" subtitle={renderCardData()} titleStyle={[styles.titleStyle, {color: updateCardIsDisabled() == true ? 'grey' : 'black'}]} subtitleStyle={[updateCardIsDisabled() == true ? { color: 'grey' } :  { color: 'black' } , { fontSize: 12,  }]} bottomDivider rightIcon={() => <Feather1s name="arrow-right" size={20} />} />
            </View>
        )
    }

    const renderLupaTrainerOptions = () => {

        if (updatedUserData.isTrainer === true) {
            return (
                <View>
                    <Text style={styles.listItemTitleStyle}>
                        Lupa Trainer
                            </Text>

                    <ListItem onPress={handleChangeHomeGymOnPress} title="Change Home Gym" titleStyle={styles.titleStyle} subtitle='Change the location of your home gym.' subtitleStyle={[{ fontSize: 12 }, getTrainerPayoutsSubtitleStyle()]} bottomDivider />
                </View>
            )
        }
    }

    return (
        <View style={styles.root}>
            <Appbar.Header statusBarHeight={false} style={{ backgroundColor: '#FFFFFF', elevation: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Appbar.Action icon={() => <Feather1s name="arrow-left" size={20} />} onPress={() => navigation.pop()} />
                <Appbar.Content title="Settings" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 25}} />
            </Appbar.Header>
            <TouchableOpacity onPress={() => navigation.push('AccountSettings')}>
                <Appbar theme={{ colors: { primary: '#FFFFFF' } }} style={{ borderBottomWidth: 0.5, borderColor: 'rgb(174, 174, 178)', paddingHorizontal: 15, elevation: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Avatar.Image size={40} source={{ uri: updatedUserData.photo_url }} />
                        <View style={{ marginHorizontal: 10 }}>
                            <Text>
                                {updatedUserData.display_name}
                            </Text>
                            <Text>
                                {updatedUserData.email}
                            </Text>
                        </View>
                    </View>

                    <Feather1s name="arrow-right" size={20} />

                </Appbar>
            </TouchableOpacity>

            <SafeAreaView style={{ flex: 1 }}>

                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleOnRefresh} />}>
                    {renderLupaTrainerOptions()}
                    {renderPaymentsOptions()}

                    <View>
                        <Text style={styles.listItemTitleStyle}>
                            Lupa
                            </Text>

                        <ListItem onPress={() => Linking.openURL('https://5af514dc-3d51-449a-8940-8c4d36733565.filesusr.com/ugd/c97eb1_d6bd8c33999e4e5ba4191b65eaf89048.pdf')} title="Privacy Policy" titleStyle={styles.titleStyle} bottomDivider rightIcon={() => <Feather1s name="arrow-right" size={20} />} />
                        <ListItem onPress={() => Linking.openURL('https://5af514dc-3d51-449a-8940-8c4d36733565.filesusr.com/ugd/c97eb1_c21bb78f5f844ba19d9df294fe63b653.pdf')} title="Terms and Conditions" titleStyle={styles.titleStyle} bottomDivider rightIcon={() => <Feather1s name="arrow-right" size={20} />} />
                    </View>


                    <UpdateCard isVisible={updateCardModalIsVisible} closeModal={() => setUpdateCardModalIsVisible(false)} />
                    <StripeVerificationStatusModal 
                    isVisible={registrationModalIsVisible} 
                    closeModal={() => setRegistrationModalVisible(false)} 
                    userData={updatedUserData} 
                    verificationStatus={verificationStatus} 
                    verificationErrors={verificationErrors} />
                    <FullScreenLoadingIndicator isVisible={loading} />
                </ScrollView>
            </SafeAreaView>
        </View>
    )
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
    section: {
        marginVertical: SECTION_SEPARATOR
    },
    subSection: {
        marginVertical: SUB_SECTION_SEPARATOR
    },
    labelStyle: {
        fontFamily: 'Avenir-Light',
        fontSize: 12,
    },
    inputContainerStyle: {
        borderWidth: 1,
        borderRadius: 3,
        paddingLeft: 5
    },
    inputStyle: {
        fontSize: 15,
        fontWeight: '400'
    }
});

export default SettingsModal;