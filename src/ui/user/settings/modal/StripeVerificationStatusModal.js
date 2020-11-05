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

import SafeAreaView from 'react-native-safe-area-view';

import { useDispatch } from 'react-redux';

import axios from 'axios';

import FeatherIcon from 'react-native-vector-icons/Feather'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import IPService from 'react-native-public-ip';

import LupaColor from '../../../common/LupaColor'
import { connect, useSelector } from 'react-redux';
import LupaController from '../../../../controller/lupa/LupaController';
import { Constants } from 'react-native-unimodules';
import { getUpdateCurrentUserAttributeActionPayload } from '../../../../controller/redux/payload_utility';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { TouchableOpacity } from 'react-native-gesture-handler';
import UpdateCard from '../../settings/modal/UpdateCard';
import { getLupaStoreState } from '../../../../controller/redux/index';
import { TextInputMask } from 'react-native-masked-text'
import DateTimePicker from '@react-native-community/datetimepicker'
import RBSheet from 'react-native-raw-bottom-sheet';

import moment from 'moment'
import { getLupaUserStructurePlaceholder } from '../../../../controller/firebase/collection_structures';
import LOG, { LOG_ERROR } from '../../../../common/Logger';
import FullScreenLoadingIndicator from '../../../common/FullScreenLoadingIndicator';
import { createStripeCustomerAccount, STRIPE_VERIFICATION_STATUS } from '../../../../modules/payments/stripe';

const SECTION_SEPARATOR = 15;
const SUB_SECTION_SEPARATOR = 5;

const NEW_INDIVIDUAL_CUSTOMER_ACCOUNT_VERIFICATION_ENDPOINT = "https://us-central1-lupa-cd0e3.cloudfunctions.net/handleNewIndividualCustomAccountVerificationAttempt";
function StripeVerificationStatusModal({ isVisible, closeModal, userData, verificationStatus, verificationErrors }) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    const birthdayPickerRef = React.createRef();

    const openBirthDayPicker = () => birthdayPickerRef.current.open();
    const closeBirthdayPicker = () => birthdayPickerRef.current.close();

    const onToggleSnackBar = () => setSnackBarVisible(!snackBarIsVisible);
    const onDismissSnackBar = () => setSnackBarVisible(false);

    const [snackBarIsVisible, setSnackBarVisible] = useState(false);
    const [snackBarReason, setSnackBarReason] = useState("")

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState(new Date())
    const [dayOfBirth, setDayOfBirth] = useState(25)
    const [monthOfBirth, setMonthOfBirth] = useState(8);
    const [yearOfBirth, setYearOfBirth] = useState(1993);
    const [streetAddress, setStreetAddress] = useState("");
    const [secondaryAddress, setSecondaryAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("")
    const [country, setCountry] = useState("")
    const [zipCode, setZipCode] = useState("")
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('+1')
    const [ssn, setSSN] = useState('')
    const [TOSIsAccepted, setTOSIsAccepted] = useState(false)
    const [publicIPAddress, setPublicIPAddress] = useState(0);

    const [bankAccountHolderFirstName, setBankAccountHolderFirstName] = useState("")
    const [bankAccountHolderLastName, setBankAccountHolderLastName] = useState("")
    const [bankAccountRoutingNumber, setBankAccountRoutingNumber] = useState("")
    const [bankAccountNumber, setBankAccountNumber] = useState("");

    const [componentDidErr, setComponentDidErr] = useState(false);

    useEffect(() => {
        async function fetchPublicIpAddress() {
            IPService().then(ip => {
                LOG('SettingsModal.js', 'Retrieved public ip address in StripeVerificationModal: ' + ip);
                setPublicIPAddress(ip);
                setComponentDidErr(false);
            }).catch(error => {
                setComponentDidErr(true)
                setPublicIPAddress(-1);
                return;
            });
        }

        LOG('StripeVerificationStatusModal.js', 'Fetching public ip address.')
        fetchPublicIpAddress();
    }, [publicIPAddress])
 

    const inputsAreValid = () => {
        if (firstName == "") {
            return false;
        } else if (lastName == "") {
            return false;
        } else if (streetAddress == "") {
            return false;
        } else if (zipCode == "") {
            return false;
        } else if (phoneNumber == "" || phoneNumber.length < 12) {
            return false;
        } else if (ssn.length < 4 || ssn == "") {
            return false;
        } else if (TOSIsAccepted == false) {
            return false;
        } else if (publicIPAddress == 0 || typeof (publicIPAddress) == 'undefined') {
            return false;
        } else if (bankAccountNumber == "") {
            return false;
        } else if (bankAccountHolderFirstName == "") {
            return false;
        } else if (bankAccountHolderLastName == "") {
            return false;
        } else if (bankAccountRoutingNumber == "") {
            return false;
        } else {
            return true;
        }
    }

    const clearInputs = () => {
        setFirstName("")
        setLastName("")
        setStreetAddress("")
        setSecondaryAddress("")
        setZipCode("")
        setPhoneNumber("+1")
        setSSN("")
        setTOSIsAccepted(false)
        setBankAccountNumber("")
        setBankAccountRoutingNumber("")
        setBankAccountHolderFirstName("")
        setBankAccountHolderLastName("")
    }

    const verifyCustomAccount = async () => {
        const retVal = inputsAreValid();

        if (retVal == false) {
            setSnackBarVisible(true)
            setSnackBarReason('One or more of your inputs are invalid');
            return;
        }

        axios({
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            url: NEW_INDIVIDUAL_CUSTOMER_ACCOUNT_VERIFICATION_ENDPOINT,
            data: JSON.stringify({
                bank_account_holder_first_name: bankAccountHolderFirstName,
                bank_account_holder_last_name: bankAccountHolderLastName,
                bank_account_number: bankAccountNumber,
                bank_account_routing_number: bankAccountRoutingNumber,
                account_id: userData.stripe_metadata.account_id,
                email: userData.email,
                public_ip_address: publicIPAddress,
                user_uuid: userData.user_uuid,
                user_display_name: userData.display_name,
                city: userData.location.city,
                state: userData.location.state,
                street_address: streetAddress,
                secondary_address: secondaryAddress,
                zipcode: zipCode,
                birthday_day: dayOfBirth,
                birthday_month: monthOfBirth,
                birthday_year: yearOfBirth,
                user_first_name: firstName,
                user_last_name: lastName,
                user_phone_number: phoneNumber,
                last_four_ssn: ssn,
                current_stripe_verification_status: userData.stripe_metadata.stripe_verification_status
            })
        }).then(response => {
            LOG('SettingsModal.js', 'Finished sending new user stripe verification request.');
            closeModal()
        }).catch(err => {
            LOG('SettingsModal.js', 'Error while trying to submit new user stripe verification request');
            //show error dialog

            //close modal
            closeModal()
        })

        closeModal()
    }

    const onChangeBirthdayDate = (event, date) => {
        const birthdayDate = new Date(date);
        const month = birthdayDate.getMonth();
        const day = birthdayDate.getDate();
        const year = birthdayDate.getFullYear();

        setDateOfBirth(date)
        setMonthOfBirth(month);
        setDayOfBirth(day);
        setYearOfBirth(year);
    }

    const handleOpenBirthDayPicker = () => {
        openBirthDayPicker()
    }

    const handleCloseBirthdayPicker = () => {
        closeBirthdayPicker()
    }

    const renderBirthdayDatePicker = () => {
        return (
            <RBSheet
                ref={birthdayPickerRef}
                height={300}
                customStyles={{

                }}
            >
                <View style={{ flex: 1 }}>
                    <DateTimePicker
                        value={dateOfBirth}
                        mode='date'
                        is24Hour={false}
                        display="default"
                        onChange={onChangeBirthdayDate}
                    />

                    <Button style={{ marginVertical: 5 }} onPress={handleCloseBirthdayPicker}>
                        Done
                    </Button>
                </View>
            </RBSheet>
        )
    }

    const renderVerificationForm = () => {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: 'rgb(245, 249, 251)', paddingTop: Constants.statusBarHeight, padding: 10 }}>
                    <Text onPress={closeModal}>
                        Cancel
            </Text>
                </View>
                <ScrollView>
                    <View style={{ padding: 10, backgroundColor: 'rgb(245, 249, 251)' }}>
                        <View style={{ paddingVertical: 10 }}>
                            <Text style={{ fontSize: 25, fontFamily: 'Avenir-Heavy' }}>
                                Payments Verification
            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcon color="#23374d" name="lock" size={15} style={{ paddingRight: 3 }} />
                                <Text style={{ color: '#23374d', fontSize: 15, fontFamily: 'Avenir-Medium' }}>
                                    Payments powered by Stripe
            </Text>
                            </View>

                        </View>

                        <View style={{ paddingVertical: 10 }}>
                            <Text style={{ fontSize: 15, fontFamily: 'Avenir-Heavy' }}>
                                Get paid by Lupa Health
                </Text>
                            <Text style={{ fontSize: 13, fontFamily: 'Avenir-Medium' }}>
                                Lupa Health partners with Stripe for fast, secure payments.  Fill out a few details so you can start getting paid.
                </Text>
                        </View>


                    </View>

                    <Caption style={{ padding: 10 }}>
                        We need to verify your information.  Please fill out the fields below.
        </Caption>


                    <View style={styles.section}>
                        <Text style={{ fontFamily: 'Avenir-Medium', padding: 10 }}>
                            Personal Information
        </Text>
                        <View style={styles.subSection}>
                            <Input value={firstName} onChangeText={text => setFirstName(text)} label="First Name" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
                        </View>

                        <View style={styles.subSection}>
                            <Input value={lastName} onChangeText={text => setLastName(text)} label="Last Name" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View>
                            <Text style={{ color: 'rgb(119, 131, 143)', paddingLeft: 15, fontSize: 12, fontWeight: '500' }}>
                                Date of Birth
            </Text>
                            <Caption style={{ paddingLeft: 15 }}>
                                Click to choose your date of birth
            </Caption>
                        </View>
                        <Button color="#23374d" mode="text" uppercase={true} onPress={handleOpenBirthDayPicker}>
                            {moment(dateOfBirth).format('LL').toString()}
                        </Button>

                    </View>

                    <View style={styles.section}>
                        <View style={styles.subSection}>
                            <Input value={streetAddress} onChangeText={text => setStreetAddress(text)} label="Street Adress or P.O. Box" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
                        </View>

                        <View style={styles.subSection}>
                            <Input value={secondaryAddress} onChangeText={text => setSecondaryAddress(text)} label="Apt, Suit, Unit, Building (optional)" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
                        </View>

                        <View style={styles.subSection}>
                            <Input value={city} onChangeText={text => setCity(text)} label="City" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
                        </View>

                        <View style={styles.subSection}>
                            <Input value={state} onChangeText={text => setState(text)} label="State" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
                        </View>

                        <View style={styles.subSection}>
                            <Input value={zipCode} onChangeText={text => setZipCode(text)} label="ZIP Code" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
                        </View>

                    </View>


                    <View style={styles.section}>
                        <Input value={phoneNumber} onChangeText={text => setPhoneNumber(text)} label="Phone Number" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
                    </View>

                    <View style={styles.section}>
                        <Input value={ssn} onChangeText={text => setSSN(text)} label="SSN (last 4)" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
                    </View>

                    <View style={styles.section}>
                        <Text style={{ fontFamily: 'Avenir-Medium', padding: 10 }}>
                            Banking Information
        </Text>
                        <View style={styles.subSection}>
                            <Input value={bankAccountHolderFirstName} onChangeText={text => setBankAccountHolderFirstName(text)} label="Account Holder Name" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
                        </View>

                        <View style={styles.subSection}>
                            <Input value={bankAccountHolderLastName} onChangeText={text => setBankAccountHolderLastName(text)} label="Account Holder Name" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
                        </View>

                        <View style={styles.subSection}>
                            <Input value={bankAccountNumber} onChangeText={text => setBankAccountNumber(text)} label="Account Number" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
                        </View>

                        <View style={styles.subSection}>
                            <Input value={bankAccountRoutingNumber} onChangeText={text => setBankAccountRoutingNumber(text)} label="Account Routing Number" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
                        </View>

                    </View>

                    <View style={{ margin: 10 }}>
                        <CheckBox
                            center
                            title='Lupa partners with Stripe to ensure safe payments.  Please read the Stripe Service Agree.'
                            titleStyle={{ fontSize: 12 }}
                            iconRight
                            iconType='material'
                            checkedIcon='done'
                            uncheckedIcon='check-box-outline-blank'
                            checkedColor='check-box'
                            containerStyle={{ backgroundColor: 'transparent', padding: 15, borderColor: 'transparent' }}
                            checked={TOSIsAccepted}
                            onPress={() => setTOSIsAccepted(!TOSIsAccepted)}
                        />
                    </View>

                    <Text style={{ color: '#1089ff', alignSelf: 'center' }}
                        onPress={() => Linking.openURL('https://stripe.com/ssa')}>
                        Read the Stripe Service Agreement here.
</Text>

                    <View style={{ marginVertical: 20, margin: 10 }}>
                        <Button color="#23374d" mode="contained" style={{ elevation: 0 }} contentStyle={{ height: 55 }} onPress={verifyCustomAccount}>
                            Verify Information
          </Button>
                    </View>
                </ScrollView>
                {renderBirthdayDatePicker()}
                <SafeAreaView />
            </View>
        )
    }

    const renderComponentView = () => {
        if (componentDidErr) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={{ backgroundColor: 'rgb(245, 249, 251)', paddingTop: Constants.statusBarHeight, padding: 10 }}>
                        <Text onPress={closeModal}>
                            Cancel
          </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text>
                            Error loading your verification information.  Return to the previous page and try again.
          </Text>
                    </View>
                </View>
            )
        }

        try {
        if (Number(verificationStatus) == STRIPE_VERIFICATION_STATUS.VERIFIED) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={{ backgroundColor: 'rgb(245, 249, 251)', paddingTop: Constants.statusBarHeight, padding: 10 }}>
                        <Text onPress={() => closeModal()}>
                            Cancel
            </Text>
                    </View>
                    <Text style={{ padding: 10, fontFamily: 'Avenir-Medium' }}>
                        Your account has been verified.
    </Text>
                </View>
            )
        } else if (Number(verificationStatus) == STRIPE_VERIFICATION_STATUS.PENDING) {
            return (
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: 'rgb(245, 249, 251)', paddingTop: Constants.statusBarHeight, padding: 10 }}>
                    <Text onPress={closeModal}>
                        Cancel
        </Text>
                </View>

                <Text style={{ padding: 10, fontFamily: 'Avenir-Medium' }}>
                    Your account is currently being verified by stripe. Check back later to see if it is finished.
    </Text>
            </View>
            )
        } else if (Number(verificationStatus) == STRIPE_VERIFICATION_STATUS.UNVERIFIED && verificationErrors.length == 0) {
            return renderVerificationForm() 
        } else {

            return (

                <View style={{ flex: 1 }}>
                    <View style={{ backgroundColor: 'rgb(245, 249, 251)', paddingTop: Constants.statusBarHeight, padding: 10 }}>
                        <Text onPress={closeModal}>
                            Cancel
        </Text>
                    </View>

                    <Text>
                        It looks like there was an error verifying your information.  Please contact us at rheasilvia.lupahealth@gmail.com for further help.
    </Text>
                </View>
            )
        }
    } catch(error) {
        setComponentDidErr(true);
    }
    }

    return (
        <Modal presentationStyle="fullScreen" animationType="slide" visible={isVisible}>
            {renderComponentView()}
            <Snackbar
                visible={snackBarIsVisible}
                onDismiss={onDismissSnackBar}
                style={{ color: '#1089ff' }}
                action={{
                    label: 'Okay',
                    onPress: () => {
                        setSnackBarVisible(false)
                    },
                }}>
                {snackBarReason}
            </Snackbar>
        </Modal>
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

export default StripeVerificationStatusModal;