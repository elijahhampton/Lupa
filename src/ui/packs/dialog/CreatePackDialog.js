import React, { useState } from 'react';

import {
    Text,
    View,
    StyleSheet,
    Dimensions
} from 'react-native';

import {
    Dialog,
    Divider,
    TextInput,
    Button,
    Modal,
    ActivityIndicator,
    Snackbar,
    HelperText,
} from 'react-native-paper';

import { Dropdown } from 'react-native-material-dropdown';
import { useSelector, useDispatch } from 'react-redux';
import LupaController from '../../../controller/lupa/LupaController';

const MINIMUM_TITLE_CHARACTERS = 5;

const MAXIMUM_TITLE_CHARACTERS = 15;

function CreatingPackActivityIndicator(props) {
    return (
            <Modal visible={props.isVisible} presentationStyle="overFullScreen" transparent={true} style={{backgroundColor: "rgba(133, 133, 133, 0.6)"}} >
                <View style={{flex: 1, backgroundColor: "rgba(133, 133, 133, 0.5)", alignItems: "center", justifyContent: 'center'}}>
                <ActivityIndicator animating={true} color="#2196F3" size="large" />
                </View>
            </Modal>

    )
}

function CreatePackDialog(props) {
    const [packName, setPackName] = useState("")
    const [packDescription, setPackDescription] = useState("")
    const [packVisibility, setPackVisibility] = useState("")
    const [showSnack, setShowSnack] = useState(false)
    const [rejectedReason, setRejectedReason] = useState(false)
    const [activityIndicatorVisible, setActivityIndicatorVisible] = useState(false)

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()
    
    const dispatch = useDispatch()

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const onDismissSnackBar = () => {
        setShowSnack(false)
        setRejectedReason("")
    }

    const getHelperText = (packVisibility) => {
        switch(packVisibility)
        {
            case "Public":
                return (
                    <HelperText visible={true}>
            Your pack will only be visible on any search and explore pages.
      </HelperText>
                )
            case "Hidden":
                return (
                    <HelperText visible={true}>
            Your pack will only be visible to you and those you invite.
      </HelperText>
                )
            default:
                return(
                    <HelperText visible={true}>
                    Pick a pack visibility settings for your pack.
              </HelperText>
                )
        }
    }

    const createPack = async () => {
        if (packName < MINIMUM_TITLE_CHARACTERS || packName > MAXIMUM_TITLE_CHARACTERS)
        {
            setRejectedReason("The pack name must be between " + MINIMUM_TITLE_CHARACTERS + " and " + MAXIMUM_TITLE_CHARACTERS)
            setShowSnack(true)
            return;
        }

        await setActivityIndicatorVisible(true)

        let packData;

        await LUPA_CONTROLLER_INSTANCE.createNewPack(currUserData.user_uuid, packName, packDescription, 
            currUserData.location, "", [currUserData.user_uuid], [], 0, 0, new Date(), false, false, "", packVisibility).then(result => {
                packData = result;
            })

        await dispatch({type: "ADD_CURRENT_USER_PACK", payload: packData})
        await LUPA_CONTROLLER_INSTANCE.updateCurrentUser('packs', [packData.pack_uuid], 'add');
 
        await setActivityIndicatorVisible(false)
        props.closeDialogMethod()
    }

    return (
        <Dialog visible={props.isVisible} style={styles.dialog}>
            <Dialog.Title>
                Create a pack
            </Dialog.Title>
            <Divider />
            <View style={{flex: 1, justifyContent: 'space-evenly'}}>
            <TextInput value={packName}  onChangeText={text => setPackName(text)} label="Pack name" mode='outlined' placeholder="Ex. Chicago Runners" style={{width: '95%', alignSelf: 'center'}} theme={{
                colors: {
                    primary: '#23374d'
                }
            }} />
            <TextInput value={packDescription} onChangeText={text => setPackDescription(text)} multiline label="Description" mode='outlined' placeholder="Ex. The purpose of this pack is to..." style={{width: '95%', alignSelf: 'center'}} theme={{
                colors: {
                    primary: '#23374d'
                }
            }}/>
            <View>
            <Dropdown
            onChangeText={text => setPackVisibility(text)}
        value={packVisibility}
        label='Visibility'
        data={[
             {
      value: 'Public',
    }, {
      value: 'Hidden',
    }]}
        containerStyle={{width: '95%', alignSelf: 'center'}}
      />

      {getHelperText(packVisibility)}
            </View>
            </View>
            <Divider />
            <View style={{padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                <Button color="rgba(13,71,161 ,1)" onPress={props.closeDialogMethod}>
                    Cancel
                </Button>
                <Button mode="contained" color="rgba(13,71,161 ,1)" onPress={createPack}>
                    Create
                </Button>
            </View>

            <Snackbar
          style={{backgroundColor: '#212121'}}
          theme={{ colors: { accent: '#2196F3' }}}
          visible={showSnack}
          onDismiss={onDismissSnackBar}
          action={{
            label: 'Okay',
            onPress: () => setShowSnack(false),
          }}
        >
          {rejectedReason}
        </Snackbar>
        <CreatingPackActivityIndicator isVisible={activityIndicatorVisible} />
        </Dialog>
    )
}

const styles = StyleSheet.create({
    dialog: {
        width: Dimensions.get('window').width - 20,
        height: Dimensions.get('window').height / 2,
        backgroundColor: '#FFFFFF',
        alignSelf: 'center',
    }
})

export default CreatePackDialog;
