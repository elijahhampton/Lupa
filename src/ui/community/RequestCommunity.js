import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    SafeAreaView,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';



import FeatherIcon from 'react-native-vector-icons/Feather'
import {
    Appbar, Button, Avatar, Divider, Caption, Snackbar
} from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import { Input, SearchBar } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LupaController from '../../controller/lupa/LupaController';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import LOG, { LOG_ERROR } from '../../common/Logger';
import { Body, Header, Left, Right } from 'native-base';
import UserSearchResult from '../user/profile/component/UserSearchResult';
import { getLupaUserStructurePlaceholder } from '../../controller/firebase/collection_structures';
import FullScreenLoadingIndicator from '../../ui/common/FullScreenLoadingIndicator'

function AssociateAccountModal({ isVisible, closeModal, setAssociatedAccount }) {
    const [searchValue, setSearchValue] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const handleOnPress = (result) => {
        setAssociatedAccount(result);
        closeModal();
    }


    const performSearch = async searchQuery => {
        //If no search query then set state and return
        if (searchQuery == "" || searchQuery == "") {
            setSearching(false);
            setSearchValue("");
            setSearchResults([])
            return;
        }

        setSearching(true);
        setSearchValue(searchQuery);
        setSearchResults([])


        await LUPA_CONTROLLER_INSTANCE.search(searchQuery)
            .then(searchData => {
                setSearchResults(searchData);
                setSearching(false);
            })
            .catch(error => {
                setSearching(false);
            })
    }

    const renderSearchResults = () => {
        return searchResults.map(result => {
            return (
                <UserSearchResult
                    hasButton={true}
                    buttonTitle="Associate"
                    buttonOnPress={() => handleOnPress(result)}
                    userData={result}
                />
            )
        })
    }

    const handleOnChangeText = (text) => {
        performSearch(text)
    }


    return (
        <Modal presentationStyle="fullScreen" visible={isVisible}>
            <Header>
                <Left>
                    <Appbar.BackAction onPress={closeModal} />
                </Left>

                <Body>
                    <Image source={require('../images/logo.jpg')} style={{ width: 50, height: 50, marginVertical: 10, alignSelf: 'center' }} />
                </Body>

                <Right />
            </Header>
            <View style={{ flex: 1 }}>
                <SearchBar
                    placeholder="Search for your Lupa Account"
                    placeholderTextColor="rgb(199, 201, 203)"
                    value={searchValue}
                    onChangeText={text => handleOnChangeText(text)}
                    inputStyle={styles.inputStyle}
                    platform="ios"
                    containerStyle={{ backgroundColor: 'white', borderColor: 'white' }}
                    inputContainerStyle={{ borderColor: 'white', backgroundColor: 'rgb(245, 246, 249)' }}
                    searchIcon={() => <FeatherIcon name="search" color="black" size={20} />}
                />
                <ScrollView>
                    {renderSearchResults()}
                </ScrollView>
            </View>
        </Modal>
    )
}

const RequestCommunity = ({ isVisible, closeModal }) => {
    const [images, setImages] = useState([]);
    const [communityName, setCommunityName] = useState("");
    const [communityAddress, setCommunityAddress] = useState("");
    const [communityZipcode, setCommunityZipcode] = useState('');
    const [communityCity, setCommunityCity] = useState('');
    const [communityState, setCommunityState] = useState('');
    const [communityOwnerName, setCommunityOwerName] = useState('');
    const [associatedLupaAccount, setAssociatedLupaAccount] = useState(getLupaUserStructurePlaceholder());
    const [associateAccountModalVisislbe, setAssociateAccountModalVisible] = useState(false);
    const [searchBarFocused, setSearchBarFocused] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [requestSucceeded, setRequestSucceeded] = useState(-1);
    const [loading, setLoading] = useState(false);
    const [communityPhoneNumber, setCommunityPhoneNumber] = useState('');

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const searchBarRef = React.createRef();

    useEffect(() => {
        checkSearchBarState()
    }, [searchBarFocused])

    const checkSearchBarState = () => {
        if (searchBarFocused === true) {
            //do something
            setAssociateAccountModalVisible(true);

            //blur
            searchBarRef.current.blur();
        } else {
            // setAssociateAccountModalVisible(false);
        }
    }

    const handleOnSetAssociatedAccount = (result) => {
        setAssociatedLupaAccount(result);
    }

    const renderSendRequestButton = () => {
        if (requestSucceeded == -1) {
            //show button
            return (
                <Button
                    onPress={handleOnRequest}
                    mode="contained"
                    uppercase={false}
                    color="rgb(32, 82, 122)"
                    theme={{ roundness: 12 }}
                    contentStyle={{ width: Dimensions.get('window').width - 20, height: 55 }}
                    style={{ alignSelf: 'center', marginVertical: 10, width: Dimensions.get('window').width - 20 }}
                >
                    <Text style={{ fontFamily: 'Avenir' }}>
                        Send Request
                </Text>
                </Button>
            )
        } else if (requestSucceeded === false) {
            return (<Button
                disabled={true}
                mode="contained"
                uppercase={false}
                color="rgb(32, 82, 122)"
                theme={{ roundness: 12 }}
                contentStyle={{ width: Dimensions.get('window').width - 20, height: 55 }}
                style={{ alignSelf: 'center', marginVertical: 10, width: Dimensions.get('window').width - 20 }}
            >
                <Text style={{ fontFamily: 'Avenir' }}>
                    Request Failed.  Try again later.
                        </Text>
            </Button>
            )
        } else if (requestSucceeded === true) {
            return (<Button
                disabled={true}
                mode="contained"
                uppercase={false}
                color="rgb(32, 82, 122)"
                theme={{ roundness: 12 }}
                contentStyle={{ width: Dimensions.get('window').width - 20, height: 55 }}
                style={{ alignSelf: 'center', marginVertical: 10, width: Dimensions.get('window').width - 20 }}
            >
                <Text style={{ fontFamily: 'Avenir' }}>
                    Request succeeded.
                        </Text>
            </Button>
            )
        } else {
            //showButton
            return (<Button
                mode="contained"
                uppercase={false}
                color="rgb(32, 82, 122)"
                theme={{ roundness: 12 }}
                contentStyle={{ width: Dimensions.get('window').width - 20, height: 55 }}
                style={{ alignSelf: 'center', marginVertical: 10, width: Dimensions.get('window').width - 20 }}
            >
                <Text style={{ fontFamily: 'Avenir' }}>
                    Send Request
                    </Text>
            </Button>
            )
        }
    }

    const handleOnRequest = () => {
        setLoading(true);
        //save community and get uuid
        LUPA_CONTROLLER_INSTANCE.createCommunityRequest(communityName, communityAddress, communityZipcode,
            communityCity, communityState, communityOwnerName, communityPhoneNumber, images, associatedLupaAccount.user_uuid)
            .then(communityUID => {
                console.log("SUCCESSSS")
                console.log(communityUID)
                setRequestSucceeded(true);
                setLoading(false);
                // LOG('PublishProgram.js', 'handleChooseProgramImage::Successfully retrieved image uri and set state: ' + programImage)
            })
            .catch(error => {
                console.log(error)
                setRequestSucceeded(false);
                setLoading(false);
                //LOG_ERROR('PublishProgram.js', 'handleChooseProgramImage::Caught exception trying to retrieve new image uri.' ,error)
            })

        //navigate to home page
        closeModal()
    }

    const handleAddImage = async () => {
        ImagePicker.showImagePicker({
            allowsEditing: true
        }, async (response) => {
            if (!response.didCancel) {
                const uri = response.uri;
                setImages(imgArr => [uri, ...imgArr]);
            }
            else if (response.error) {

            }
        });
    }

    const renderImages = () => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <View style={{ marginHorizontal: 10, backgroundColor: '#EEEEEE', margin: 10, borderRadius: 12, width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }}>
                    <Feather1s name="plus-circle" size={25} style={{ padding: 3 }} onPress={handleAddImage} />
                </View>


                {
                    images.map((image, index, arr) => {
                        return (
                            <View style={{ marginHorizontal: 10, backgroundColor: '#EEEEEE', margin: 10, borderRadius: 12, width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ width: '100%', height: '100%', borderRadius: 12 }} source={{ uri: image }} />
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    const renderAssociatedLupaAccount = () => {
        if (typeof (associatedLupaAccount) == 'undefined' || associatedLupaAccount.user_uuid == '0' || associatedLupaAccount.photo_url == '') {
            return (
                <Caption style={{ padding: 20 }}>
                    This person will be able to edit the community page directly from their account.  After the community is approved an email
                    will be sent to the email address stored for this account with a login for the community page.
                </Caption>
            )
        }

        return (
            <View style={{ flexDirection: "row", alignItems: "center", width: Dimensions.get('window').width, padding: 5, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar.Image size={35} source={{ uri: associatedLupaAccount.photo_url }} style={{ margin: 5 }} />
                    <View style={{ flexDirection: "column", justifyContent: "flex-start", margin: 3 }}>
                        <Text style={{}}>
                            {associatedLupaAccount.display_name}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <Modal presentationStyle="fullScreen" animationType="slide" visible={isVisible} onDismiss={closeModal}>
            <Appbar.Header style={{ backgroundColor: '#FFFFFF' }}>
                <Left>
                    <Appbar.BackAction onPress={closeModal} />
                </Left>

                <Body>
                    <Image source={require('../images/logo.jpg')} style={{ width: 50, height: 50, marginVertical: 10, alignSelf: 'center' }} />
                </Body>

                <Right />
            </Appbar.Header>
            <KeyboardAwareScrollView style={styles.container}>
                <Text style={{ alignSelf: 'center', fontFamily: 'Avenir-Heavy', paddingVertical: 10, fontWeight: 'bold', fontSize: 25 }}>
                    Add your community
                </Text>
              {/*  <View>
                    <Text style={[styles.labelStyle, { padding: 10, color: 'rgb(115, 128, 140)' }]}>
                        Link Lupa Account
                    </Text>
                    <TouchableOpacity onPress={() => setAssociatedLupaAccount(true)}>
                        <SearchBar
                            onStartShouldSetResponder={event => false}
                            onStartShouldSetResponderCapture={event => false}
                            ref={searchBarRef}
                            placeholder="Associate an account with this business"
                            placeholderTextColor="rgb(199, 201, 203)"
                            inputStyle={styles.inputStyle}
                            platform="ios"
                            containerStyle={{ backgroundColor: 'white', borderColor: 'white' }}
                            inputContainerStyle={{ borderColor: 'white', backgroundColor: 'rgb(245, 246, 249)' }}
                            searchIcon={() => <FeatherIcon name="search" color="black" size={20} onPress={() => setSearchBarFocused(true)} />}
                            onFocus={() => setSearchBarFocused(true)}
                            onBlur={() => setSearchBarFocused(false)} />
                    </TouchableOpacity>
                    {renderAssociatedLupaAccount()}
                </View>
                <Divider style={{ height: 5, backgroundColor: '#EEEEEE' }} />
              */}
                <Input
                    label="Gym, Studio, or Apartment Name"
                    placeholder="Enter a name"
                    containerStyle={styles.containerStyle}
                    labelStyle={styles.labelStyle}
                    inputStyle={styles.inputStyle}
                    inputContainerStyle={styles.input}
                    returnKeyLabel="done"
                    returnKeyType="done"
                    keyboardType="default"
                    keyboardAppearance="light"
                    value={communityName}
                    onChangeText={text => setCommunityName(text)}
                    textContentType="organizationName"
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                    <Input
                        label="Address"
                        placeholder="Enter an address"
                        style={{ width: '50%' }}
                        containerStyle={[styles.containerStyle, { width: '60%' }]}
                        labelStyle={styles.labelStyle}
                        inputStyle={styles.inputStyle}
                        inputContainerStyle={styles.input}
                        returnKeyLabel="done"
                        returnKeyType="done"
                        keyboardType="default"
                        keyboardAppearance="light"
                        value={communityAddress}
                        onChangeText={text => setCommunityAddress(text)}
                        textContentType="fullStreetAddress"
                    />

                    <Input
                        label="Zipcode"
                        placeholder="000000"
                        containerStyle={[styles.containerStyle, { width: '35%' }]}
                        labelStyle={styles.labelStyle}
                        inputStyle={styles.inputStyle}
                        inputContainerStyle={styles.input}
                        returnKeyLabel="done"
                        returnKeyType="done"
                        keyboardType="default"
                        keyboardAppearance="light"
                        value={communityZipcode}
                        onChangeText={text => setCommunityZipcode(text)}
                        textContentType="postalCode"
                    />

                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                    <Input
                        label="City"
                        placeholder="Enter a city"
                        style={{ width: '50%' }}
                        containerStyle={[styles.containerStyle, { width: '60%' }]}
                        labelStyle={styles.labelStyle}
                        inputStyle={styles.inputStyle}
                        inputContainerStyle={styles.input}
                        returnKeyLabel="done"
                        returnKeyType="done"
                        keyboardType="default"
                        keyboardAppearance="light"
                        value={communityCity}
                        onChangeText={text => setCommunityCity(text)}
                        textContentType="addressCity" />

                    <Input
                        label="State"
                        placeholder="XX"
                        containerStyle={[styles.containerStyle, { width: '35%' }]}
                        labelStyle={styles.labelStyle}
                        inputStyle={styles.inputStyle}
                        inputContainerStyle={styles.input}
                        returnKeyLabel="done"
                        returnKeyType="done"
                        keyboardType="default"
                        keyboardAppearance="light"
                        value={communityState}
                        onChangeText={text => setCommunityState(text)}
                        textContentType="addressState" />

                </View>

                <Input
                    label="Owner Name"
                    placeholder="Enter the business owner's name"
                    containerStyle={styles.containerStyle}
                    labelStyle={styles.labelStyle}
                    inputStyle={styles.inputStyle}
                    inputContainerStyle={styles.input}
                    returnKeyLabel="done"
                    returnKeyType="done"
                    keyboardType="default"
                    keyboardAppearance="light"
                    value={communityOwnerName}
                    onChangeText={text => setCommunityOwerName(text)}
                    textContentType="name" />

                <Input
                    label="Contact Information"
                    placeholder="+1 XXX XXX XXXX"
                    containerStyle={styles.containerStyle}
                    labelStyle={styles.labelStyle}
                    inputStyle={styles.inputStyle}
                    inputContainerStyle={styles.input}
                    returnKeyLabel="done"
                    returnKeyType="done"
                    keyboardType="numeric"
                    keyboardAppearance="light"
                    value={communityPhoneNumber}
                    onChangeText={text => setCommunityPhoneNumber(text)}
                    textContentType="telephoneNumber" />

                {renderSendRequestButton()}

                <SafeAreaView />
            </KeyboardAwareScrollView >
            <AssociateAccountModal isVisible={associateAccountModalVisislbe} closeModal={() => setAssociateAccountModalVisible(false)} setAssociatedAccount={account => handleOnSetAssociatedAccount(account)} />
            <FullScreenLoadingIndicator isVisible={loading} />
        </Modal>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    containerStyle: {
        marginVertical: 15
    },
    input: {
        padding: 5,
    },
    inputStyle: {
        fontSize: 15,
    },
    labelStyle: {
        fontSize: 20,
        fontFamily: 'Avenir-Heavy',
    }
})

export default RequestCommunity;