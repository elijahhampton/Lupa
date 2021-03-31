import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import LupaController from '../../../../controller/lupa/LupaController';
import { getUpdateCurrentUserAttributeActionPayload } from '../../../../controller/redux/payload_utility';
import { connect } from 'react-redux';
import { Caption } from 'react-native-paper';

const GymWelcome = ({ updateCurrentUserAttribute, setNextDisabled }) => {
    const [photoSource, setPhotoSource] = useState("");
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    useEffect(() => {
        setNextDisabled(true);

        if (photoSource) {
            setNextDisabled(false);
        }

    }, [photoSource])

    const _handleUserPhotoUrlUpdate = async (photoURI) => {
        try {
            let firebasePhotoURL;

            await LUPA_CONTROLLER_INSTANCE.saveUserProfileImage(photoURI).then(result => {
                firebasePhotoURL = result;
            });
            
            const reduxPayload = await getUpdateCurrentUserAttributeActionPayload('photo_url', firebasePhotoURL);
            await updateCurrentUserAttribute(reduxPayload);
    
            LUPA_CONTROLLER_INSTANCE.updateCurrentUser('photo_url', firebasePhotoURL);
        } catch(err) {
               LOG_ERROR('BasicInformation.js', 'Unhandled exception in _handleUserPhotoUrlUpdate', error);
        }
    }

    const _chooseProfilePictureFromCameraRoll = async () => {
         ImagePicker.showImagePicker({
             allowsEditing: true
         }, async (response) => {
             if (!response.didCancel)
             {
                 await setPhotoSource(response.uri);
 
                //Update field photo_url field
                _handleUserPhotoUrlUpdate(response.uri);
             }
             else if (response.error)
             {
                await setPhotoSource("");
                _handleUserPhotoUrlUpdate("");
             }
         });

     }

    return (
        <View style={{flex: 1, justifyContent: 'space-evenly', backgroundColor: 'white', alignItems: 'center'}}>
            <Text style={{fontFamily: 'Avenir-Heavy', color: '#23374d', fontSize: 22, alignSelf: 'center', padding: 20}}>
                Thank you for bringing your gym to Lupa.  Let's get you started.
            </Text>
            
            <View style={{alignItems: 'center'}}>
            <Avatar onPress={_chooseProfilePictureFromCameraRoll} showEditButton={photoSource ? false : true} size={100} rounded source={{ uri: photoSource }} containerStyle={{marginVertical: 15}} />
            <Caption>
                Choose a photo that best represents your space.
            </Caption>
            </View>
        </View>
    )
}

const mapStateToProps = state => ({
      lupa_data: state
})
  
const mapDispatchToProps = dispatch => ({
      updateCurrentUserAttribute: (payload) => dispatch({type: "UPDATE_CURRENT_USER_ATTRIBUTE", payload})
})

export default connect(mapStateToProps, mapDispatchToProps)(GymWelcome);