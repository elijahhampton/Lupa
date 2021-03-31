import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView  } from 'react-native';
import { Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LupaController from '../../../../controller/lupa/LupaController';
import FullScreenLoadingIndicator from '../../../common/FullScreenLoadingIndicator';
import { connect } from 'react-redux';
import { getUpdateCurrentUserAttributeActionPayload } from '../../../../controller/redux/payload_utility';

const GymInformation = ({ setNextDisabled, updateCurrentUserAttribute }) => {
    const [images, setImages] = useState([]);
    const [communityName, setCommunityName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [communityPhoneNumber, setCommunityPhoneNumber] = useState('');

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    useEffect(() => {
        setNextDisabled(true);

        if (communityName && communityPhoneNumber) {
            setNextDisabled(false);
        }
    }, [communityPhoneNumber, communityName])

    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
             <Text style={{fontFamily: 'Avenir-Heavy', color: '#23374d', fontSize: 22, alignSelf: 'center', padding: 20}}>
                Tell us a little about your gym.
            </Text>

                 <Input
                    label="Gym, Studio, or Apartment Name"
                    placeholder="Gym name"
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
                    blurOnSubmit
                    onBlur={() => {
                        updateCurrentUserAttribute(getUpdateCurrentUserAttributeActionPayload('display_name', communityName, []))
                        LUPA_CONTROLLER_INSTANCE.updateCurrentUser('display_name', communityName, "");
                    }}
                />

                <Input
                    label="Contact Information"
                    placeholder="XXX-XXX-XXXX"
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
                    textContentType="telephoneNumber" 
                    blurOnSubmit
                    onBlur={() => {
                        updateCurrentUserAttribute(getUpdateCurrentUserAttributeActionPayload('phone_number', communityPhoneNumber, []))
                        LUPA_CONTROLLER_INSTANCE.updateCurrentUser('phone_number', communityPhoneNumber, "");
                    }}
                    />

                <SafeAreaView />
 
            <FullScreenLoadingIndicator isVisible={isLoading} />
        </View>
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
        color: 'black',
        fontFamily: 'Avenir-Heavy',
    }
})

const mapDispatchToProps = dispatch => ({
    updateCurrentUserAttribute: payload => dispatch({ type: 'UPDATE_CURRENT_USER_ATTRIBUTE', payload })
})

export default connect(null, mapDispatchToProps)(GymInformation);