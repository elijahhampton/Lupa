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
    Switch,
    Appbar,
     Avatar,
     Surface
} from 'react-native-paper';


import { ListItem, Input, CheckBox} from 'react-native-elements'

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
import { getLupaStoreState } from '../../../../controller/redux';
import { TextInputMask } from 'react-native-masked-text'
import DateTimePicker from '@react-native-community/datetimepicker'
import RBSheet from 'react-native-raw-bottom-sheet';

import moment from 'moment'
import { getLupaUserStructurePlaceholder } from '../../../../controller/firebase/collection_structures';
import LOG, { LOG_ERROR } from '../../../../common/Logger';
import FullScreenLoadingIndicator from '../../../common/FullScreenLoadingIndicator';

const SECTION_SEPARATOR = 15;
const SUB_SECTION_SEPARATOR = 5;

const NEW_INDIVIDUAL_CUSTOMER_ACCOUNT_VERIFICATION_ENDPOINT = "https://us-central1-lupa-cd0e3.cloudfunctions.net/handleNewIndividualCustomAccountVerificationAttempt";
const FETCH_STRIPE_ACCOUNT_DATA_ENDPOINT = "https://us-central1-lupa-cd0e3.cloudfunctions.net/retrieveTrainerAccountInformation";
function StripeDashboardWebView({isVisible, closeModal}) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    const currUserData  = useSelector(state => {
        return state.Users.currUserData
    })

    const birthdayPickerRef = React.createRef();
    const birthdayInput = React.createRef();

    const [ready, setReady] = useState(false);

    const openBirthDayPicker = () => birthdayPickerRef.current.open();
    const closeBirthdayPicker = () => birthdayPickerRef.current.close();
    
    const [loading, setIsLoading] = useState(false);
    const [code, setCode] = useState("");
    const [source, setSource]  = useState("https://connect.stripe.com/express/oauth/authorize?redirect_uri=https://connect.stripe.com/connect/default/oauth&client_id=ca_IGlNQMXFjavl70PtKYuzUceI1Z99KXbx&state=FL")
    const [refresh, setRefreshing] = useState(false)
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

    const [stripeData, setStripeData] = useState({accountData: {}, balanceData: {}})
    const [componentDidErr, setComponentDidErr] = useState(false);
    const [verificationCurrentlyDue, setVerificationCurrentlyDue] = useState([])
    const [verificationErrors, setVerificationErrors] = useState([])
    const [verificationStatus, setVerificationStatus] = useState('')

    const [bankAccountHolderFirstName, setBankAccountHolderFirstName] = useState("")
    const [bankAccountHolderLastName, setBankAccountHolderLastName] = useState("")
    const [bankAccountRoutingNumber, setBankAccountRoutingNumber] = useState("")
    const [bankAccountNumber, setBankAccountNumber] = useState("");


    useEffect(() => {
        async function fetchPublicIpAddress() {
            IPService().then(ip => {
                console.log('Retrieved public ip address in stripe modal: ' + ip)
                setPublicIPAddress(ip);
            }).catch(error => {
                setIsLoading(false);
                setPublicIPAddress(0);
                setComponentDidErr(true)
                setVerificationStatus('')
                setStripeData(undefined)
                setReady(false);
                return;
            })
        }

        LOG('SettingsModal.js', 'Running use effect in SettingsModal.js.  Fetching public IP address and requesting stripe account data for the current user.');

        setIsLoading(true);
        fetchPublicIpAddress()
        axios({
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            url: FETCH_STRIPE_ACCOUNT_DATA_ENDPOINT,
            data: JSON.stringify({
                trainer_account_id: currUserData.stripe_metadata.account_id
            })
        }).then(response => {
          setStripeData(response.data.account_data)
          setVerificationCurrentlyDue(response.data.account_data.individual.requirements.currently_due)
          setVerificationErrors(response.data.account_data.individual.requirements.errors)
          setVerificationStatus(response.data.account_data.individual.verification.status)
          setReady(true);
           LOG('SettingsModal.js', 'Finished running axios request.');
        }).catch(err => {
          console.log('oh')
          console.log(err)
          setStripeData(undefined);
          setComponentDidErr(true)
          setVerificationStatus('')
          LOG_ERROR('SettingsModal.js', 'Error running axios request.', error);
          setIsLoading(false)
          setReady(false)
        })
        
    }, [])

    const verifyCustomAccount = async () => {
         let userData = getLupaUserStructurePlaceholder();
         await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(currUserData.user_uuid).then(data => {
            userData = data
         });

         if (userData.user_uuid === 0) {
             return;
         }

         try {
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
                user_uuid: currUserData.user_uuid,
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
            })
        }).then(response => {
          console.log('SUCCESSFULLY VERIFIED NEW ACCOUNT REQUEST')
        }).catch(err => {
          console.log('oh')
          console.log(err)
        })

    } catch(error) {
        console.log('error')
        console.log(error)
    }
    }

    const onRefresh = () => {
        setRefreshing(true)
        setIsLoading(true);
            IPService().then(ip => {
                console.log('Retrieved public ip address in stripe modal: ' + ip)
                setPublicIPAddress(ip);
            }).catch(error => {
                setIsLoading(false);
                setPublicIPAddress(0);
                setComponentDidErr(true)
                setVerificationStatus('')
                setStripeData(undefined)
                setReady(false);
                return;
            })

        LOG('SettingsModal.js', 'Running onRefresh in SettingsModal.js.  Fetching public IP address and requesting stripe account data for the current user.');

        axios({
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            url: FETCH_STRIPE_ACCOUNT_DATA_ENDPOINT,
            data: JSON.stringify({
                trainer_account_id: currUserData.stripe_metadata.account_id
            })
        }).then(response => {
          console.log('SUCCESS')
          console.log(response.data.account_data);
          setStripeData(response.data.account_data)
          setVerificationCurrentlyDue(response.data.account_data.individual.requirements.currently_due)
          setVerificationErrors(response.data.account_data.individual.requirements.errors)
          setVerificationStatus(response.data.account_data.individual.verification.status)
          setReady(true);
         // console.log(response.data.account_data.individual.requirements)
           LOG('SettingsModal.js', 'Finished running axios request.');
        }).catch(err => {
          console.log('oh')
          console.log(err)
          setStripeData(undefined);
          setComponentDidErr(true)
          setVerificationStatus('')
          LOG_ERROR('SettingsModal.js', 'Error running axios request.', error);
          setIsLoading(false)
          setReady(false)
        })

        setRefreshing(false);
    }

    const onChangeBirthdayDate = (event, date) => {
        const birthdayDate = new Date(date);
        const month = birthdayDate.getMonth();
        const day = birthdayDate.getDate();
        const year = birthdayDate.getFullYear();
        console.log(month)
        console.log(day)
        console.log(year)

        setDateOfBirth(date)
        setMonthOfBirth(month);
        setDayOfBirth(day);
        setYearOfBirth(year);
    }

    const checkInputs = () => {

    }

    const handleOpenBirthDayPicker = () => {
        if (birthdayInput.current) {
            if (!birthdayInput.current.isFocused()) {
                openBirthDayPicker()
            }
        }

        openBirthDayPicker()

    }

    const handleCloseBirthdayPicker = () => {
        if (birthdayInput.current) {
            if (birthdayInput.current.isFocused()) {
                birthdayInput.current.blur()
                closeBirthdayPicker()
                
            }
        }

      
        closeBirthdayPicker()
        birthdayInput.current.blur()
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
                <View style={{flex: 1}}>
                <DateTimePicker
            value={dateOfBirth}
            mode='date'
            is24Hour={false}
            display="default"
            onChange={onChangeBirthdayDate}
          />

                    <Button style={{marginVertical: 5}} onPress={handleCloseBirthdayPicker}>
                        Done
                    </Button>
                </View>
            </RBSheet>
        )
    }

    const renderComponentView = () => {
        if (!ready) {
            return (
            <View style={{flex: 1}}>
                  <View style={{backgroundColor: 'rgb(245, 249, 251)', paddingTop: Constants.statusBarHeight, padding: 10}}>
            <Text onPress={closeModal}>
                Cancel
            </Text>
        </View>
        <View style={{flex: 1}}>
            <FullScreenLoadingIndicator isVisible={true} />
        </View>
            </View>
            )
        }

        if (verificationStatus == 'verified') {
            return (
            <View style={{flex: 1}}>
                <View style={{backgroundColor: 'rgb(245, 249, 251)', paddingTop: Constants.statusBarHeight, padding: 10}}>
            <Text onPress={closeModal}>
                Cancel
            </Text>
        </View>
        <Text>
        Your account has been verified.
    </Text>
            </View>
            )
        } else if (verificationStatus == 'pending') {
            <View style={{flex: 1}}>
            <View style={{backgroundColor: 'rgb(245, 249, 251)', paddingTop: Constants.statusBarHeight, padding: 10}}>
        <Text onPress={closeModal}>
            Cancel
        </Text>
    </View>

    <Text>
        Your account is currently being verified by stripe. Check back later to see if it is finished.
    </Text>
        </View>
        } else if (verificationStatus == 'unverified') {
            <View style={{flex: 1}}>
            <View style={{backgroundColor: 'rgb(245, 249, 251)', paddingTop: Constants.statusBarHeight, padding: 10}}>
            <Text onPress={closeModal}>
                Cancel
            </Text>
        </View>
        <ScrollView>
        <View style={{padding: 10, backgroundColor: 'rgb(245, 249, 251)'}}>
            <View style={{paddingVertical: 10}}>
            <Text style={{fontSize: 25, fontFamily: 'Avenir-Heavy'}}>
                Payments Verification
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialIcon color="#23374d" name="lock" size={15} style={{paddingRight: 3}} />
            <Text style={{color: '#23374d', fontSize: 15, fontFamily: 'Avenir-Medium'}}>
                Payments powered by Stripe
            </Text>
            </View>
           
            </View>
            
            <View style={{paddingVertical: 10}}>
                <Text style={{fontSize: 15, fontFamily: 'Avenir-Heavy'}}>
                    Get paid by Lupa Health
                </Text>
                <Text style={{fontSize: 13, fontFamily: 'Avenir-Medium'}}>
                    Lupa Health partners with Stripe for fast, secure payments.  Fill out a few details so you can start getting paid.
                </Text>
            </View>

      
        </View>

        <Caption style={{padding: 10}}>
            We need to verify your information.  Please fill out the fields below.
        </Caption>

      
        <View style={styles.section}>
        <Text style={{fontFamily: 'Avenir-Medium', padding: 10}}>
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
            <Input ref={birthdayInput} value={moment(dateOfBirth).format('LL').toString()} onFocus={handleOpenBirthDayPicker} onBlur={handleCloseBirthdayPicker} label="Date of Birth" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
        </View>

        <View style={styles.section}>
            <View style={styles.subSection}>
            <Input  value={streetAddress} onChangeText={text => setStreetAddress(text)} label="Street Adress or P.O. Box" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
            </View>

            <View style={styles.subSection}>
            <Input  value={secondaryAddress} onChangeText={text => setSecondaryAddress(text)} label="Apt, Suit, Unit, Building (optional)" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
            </View>

            <View style={styles.subSection}>
            <Input  value={city} onChangeText={text => setCity(text)} label="City" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
            </View>

            <View style={styles.subSection}>
            <Input  value={state} onChangeText={text => setState(text)} label="State" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
            </View>

            <View style={styles.subSection}>
            <Input  value={zipCode} onChangeText={text => setZipCode(text)} label="ZIP Code" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
            </View>
           
        </View>


        <View style={styles.section}>
            <Input  value={phoneNumber} onChangeText={text => setPhoneNumber(text)} label="Phone Number" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
        </View>

        <View style={styles.section}>
            <Input  value={ssn} onChangeText={text => setSSN(text)} label="SSN (last 4)" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
        </View>

        <View style={styles.section}>
        <Text style={{fontFamily: 'Avenir-Medium', padding: 10}}>
            Banking Information
        </Text>
            <View style={styles.subSection}>
            <Input  value={bankAccountHolderFirstName} onChangeText={text => setBankAccountHolderFirstName(text)} label="Account Holder Name" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
            </View>

            <View style={styles.subSection}>
            <Input  value={bankAccountHolderLastName} onChangeText={text => setBankAccountHolderLastName(text)} label="Account Holder Name" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
            </View>

            <View style={styles.subSection}>
            <Input  value={bankAccountNumber} onChangeText={text => setBankAccountNumber(text)} label="Account Number" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
            </View>

            <View style={styles.subSection}>
            <Input  value={bankAccountRoutingNumber} onChangeText={text => setBankAccountRoutingNumber(text)} label="Account Routing Number" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
            </View>
           
        </View>

        <View style={{ margin: 10 }}>
          <CheckBox
            center
            title='Lupa partners with Stripe to ensure safe payments.  Please read the Stripe Service Agree.'
            titleStyle={{fontSize: 12}}
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

        <Text style={{color: '#1089ff', alignSelf: 'center'}}
  onPress={() => Linking.openURL('https://stripe.com/ssa')}>
Read the Stripe Service Agreement here.
</Text>

        <View style={{ marginVertical: 20, margin: 10 }}>
          <Button color="#23374d" mode="contained" style={{elevation: 0}} contentStyle={{height: 55}} onPress={verifyCustomAccount}>
              Verify Information
          </Button>
        </View>
        </ScrollView>
        {renderBirthdayDatePicker()}
        <SafeAreaView />
        </View>
        } else {
            <View style={{flex: 1}}>
            <View style={{backgroundColor: 'rgb(245, 249, 251)', paddingTop: Constants.statusBarHeight, padding: 10}}>
            <Text onPress={closeModal}>
                Cancel
            </Text>
        </View>
        <ScrollView>
        <View style={{padding: 10, backgroundColor: 'rgb(245, 249, 251)'}}>
            <View style={{paddingVertical: 10}}>
            <Text style={{fontSize: 25, fontFamily: 'Avenir-Heavy'}}>
                Payments Verification
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialIcon color="#23374d" name="lock" size={15} style={{paddingRight: 3}} />
            <Text style={{color: '#23374d', fontSize: 15, fontFamily: 'Avenir-Medium'}}>
                Payments powered by Stripe
            </Text>
            </View>
           
            </View>
            
            <View style={{paddingVertical: 10}}>
                <Text style={{fontSize: 15, fontFamily: 'Avenir-Heavy'}}>
                    Get paid by Lupa Health
                </Text>
                <Text style={{fontSize: 13, fontFamily: 'Avenir-Medium'}}>
                    Lupa Health partners with Stripe for fast, secure payments.  Fill out a few details so you can start getting paid.
                </Text>
            </View>

      
        </View>

        <Caption style={{padding: 10}}>
            We need to verify your information.  Please fill out the fields below.
        </Caption>

      
        <View style={styles.section}>
        <Text style={{fontFamily: 'Avenir-Medium', padding: 10}}>
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
            <Input ref={birthdayInput} value={moment(dateOfBirth).format('LL').toString()} onFocus={handleOpenBirthDayPicker} onBlur={handleCloseBirthdayPicker} label="Date of Birth" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
        </View>

        <View style={styles.section}>
            <View style={styles.subSection}>
            <Input  value={streetAddress} onChangeText={text => setStreetAddress(text)} label="Street Adress or P.O. Box" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
            </View>

            <View style={styles.subSection}>
            <Input  value={secondaryAddress} onChangeText={text => setSecondaryAddress(text)} label="Apt, Suit, Unit, Building (optional)" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
            </View>

            <View style={styles.subSection}>
            <Input  value={city} onChangeText={text => setCity(text)} label="City" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
            </View>

            <View style={styles.subSection}>
            <Input  value={state} onChangeText={text => setState(text)} label="State" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
            </View>

            <View style={styles.subSection}>
            <Input  value={zipCode} onChangeText={text => setZipCode(text)} label="ZIP Code" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
            </View>
           
        </View>


        <View style={styles.section}>
            <Input  value={phoneNumber} onChangeText={text => setPhoneNumber(text)} label="Phone Number" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
        </View>

        <View style={styles.section}>
            <Input  value={ssn} onChangeText={text => setSSN(text)} label="SSN (last 4)" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
        </View>

        <View style={styles.section}>
        <Text style={{fontFamily: 'Avenir-Medium', padding: 10}}>
            Banking Information
        </Text>
            <View style={styles.subSection}>
            <Input  value={bankAccountHolderFirstName} onChangeText={text => setBankAccountHolderFirstName(text)} label="Account Holder Name" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
            </View>

            <View style={styles.subSection}>
            <Input  value={bankAccountHolderLastName} onChangeText={text => setBankAccountHolderLastName(text)} label="Account Holder Name" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
            </View>

            <View style={styles.subSection}>
            <Input  value={bankAccountNumber} onChangeText={text => setBankAccountNumber(text)} label="Account Number" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
            </View>

            <View style={styles.subSection}>
            <Input  value={bankAccountRoutingNumber} onChangeText={text => setBankAccountRoutingNumber(text)} label="Account Routing Number" labelStyle={styles.labelStyle} inputStyle={styles.inputStyle} inputContainerStyle={styles.inputContainerStyle} />
            </View>
           
        </View>

        <View style={{ margin: 10 }}>
          <CheckBox
            center
            title='Lupa partners with Stripe to ensure safe payments.  Please read the Stripe Service Agree.'
            titleStyle={{fontSize: 12}}
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

        <Text style={{color: '#1089ff', alignSelf: 'center'}}
  onPress={() => Linking.openURL('https://stripe.com/ssa')}>
Read the Stripe Service Agreement here.
</Text>

        <View style={{ marginVertical: 20, margin: 10 }}>
          <Button color="#23374d" mode="contained" style={{elevation: 0}} contentStyle={{height: 55}} onPress={verifyCustomAccount}>
              Verify Information
          </Button>
        </View>
        </ScrollView>
        {renderBirthdayDatePicker()}
        <SafeAreaView />
        </View>
        }
    }
 
    return (
        <Modal presentationStyle="fullScreen" animationType="slide" visible={isVisible}>
            {renderComponentView()}
        </Modal>
    )
}


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
        <Input maxLength={180} value={bioText} onChangeText={text => setBioText(text)} multiline placeholder="Edit your biography" style={{width: Dimensions.get('window').width - 20, height: '30%', alignSelf: 'center'}} mode="outlined" theme={{
            colors: {
                primary: 'rgb(33,150,243)'
            }
        }}>

</Input>
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
            registrationModalVisible: false,
        }
    }

    renderCardData = () => {
        const currUserData = getLupaStoreState().Users.currUserData;
        return currUserData.stripe_metadata.card_last_four == "" ? "You have not saved a card." : `**** **** **** ${currUserData.stripe_metadata.card_last_four}`
    }

    renderVerificationStatusData = () => {
        const updatedUserData = getLupaStoreState().Users.currUserData;
        if (updatedUserData.stripe_metadata.connected_account_verification_status == 'verified') {
            return (
                'Your account has been verified.'
            )
        } else if (updatedUserData.stripe_metadata.connected_account_verification_status == 'pending') {
            return 'Your account is pending verification'
        } else if (updatedUserData.stripe_metadata.connected_account_verification_status == 'unverified') {
            return 'Your account must be verified before you can begin to accept payments.'
        }
    }

    getTrainerPayoutsSubtitleStyle = () => {
        const updatedUserData = getLupaStoreState().Users.currUserData;
        const status = updatedUserData.stripe_metadata.connected_account_verification_status;

        if (status == 'verified') {
            return {
                color: '#4CAF50',
            }
        } else if (status == 'pending') {
            return {
                color: '#1089ff',
            }
        } else if (status == 'unverified') {
            return {
                color: '#f44336',
            }
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
                            <ListItem onPress={() => this.setState({ registrationModalVisible: true })} title="Trainer Payouts" titleStyle={styles.titleStyle} subtitle={this.renderVerificationStatusData()} subtitleStyle={[{fontSize: 12}, this.getTrainerPayoutsSubtitleStyle()]} bottomDivider />
                        </View>
                            :
                            null
                        }

                        <View>
                            <Text style={styles.listItemTitleStyle}>
                                Payments
                            </Text>
                            <ListItem onPress={() => this.setState({ updateCardModalVisible: true })} title="Update Card" subtitle={this.renderCardData()} titleStyle={styles.titleStyle} subtitleStyle={{fontSize: 12}} bottomDivider rightIcon={() => <Feather1s name="arrow-right" size={20} />}/>
                           {/* <ListItem onPress={() => this.setState({ updateCardModalVisible: true })} leftIcon={() => <Feather1s name="info" size={18} />} title="Learn More" subtitle={() => <Caption> Learn more about payments with Lupa.</Caption>} titleStyle={styles.titleStyle} bottomDivider rightIcon={() => <Feather1s name="arrow-right" size={20} />}/> */}
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
                 <StripeDashboardWebView isVisible={this.state.registrationModalVisible} closeModal={() => this.setState({ registrationModalVisible: false })} />
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

export default connect(mapStateToProps)(SettingsModal);