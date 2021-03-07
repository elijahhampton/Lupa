import React, { useState, useEffect, createRef } from 'react';
import { useSelector } from 'react-redux'

import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';

import {
  Caption,
  Button,
  Snackbar,
  Modal as PaperModal,
  Appbar,
  Chip,
  Divider,
} from 'react-native-paper';

import ImagePicker from 'react-native-image-picker';

import { Avatar } from 'react-native-elements';
import FeatherIcon from 'react-native-vector-icons/Feather'
import LupaController from '../../../../../controller/lupa/LupaController';
import RBSheet from 'react-native-raw-bottom-sheet';
import LOG, { LOG_ERROR } from '../../../../../common/Logger';
import { KeyboardAvoidingView } from 'react-native';

const PRE_FILLED_TAGS = [
  'Interval Training',
  'Advanced',
  'HIIT',
  'Body Weight',
  'Strength',
  'Agility',
  'Cardiovascular',
  'Speed',
  'Balance',
  'Beginner',
  'Intermmediate',
  'Speed',
  'Endurance',
  'Olympic Weightlifting',
  'Mobility',
  'Power',
  'Circuit',
  'Coordination',
  'Reaction Time',
  'Powerlifting',
  'Plyometric',
  'Stability',
  'Weight Loss',
  'Sport Specific',
  'Flexibility',
  'Bodybuilding',
  'Injury Prevention',
  'Very Advanced'
]

function AddTagsModal({ captureTags, isVisible, closeModal, openModal }) {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [externalTags, setExternalTags] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [extraTagsModalVisible, setExtraTagsModalVisible] = useState(false);

  const handleCaptureExternalTags = (inputTags) => {
    let updatedTags = tags;
    updatedTags = updatedTags.concat(inputTags);

    let updatedExternalTags = externalTags;
    updatedExternalTags = updatedExternalTags.concat(inputTags);
    
    setExternalTags(updatedExternalTags)
    setTags(updatedTags);
  }

  const handleAddTags = (tagString) => {
    if (tags.includes(tagString)) {
      let updatedTagList = tags;
      updatedTagList.splice(updatedTagList.indexOf(tagString), 1)
      setTags(updatedTagList)
    } else {
      setTags((prevState) => prevState.concat(tagString))
    }

    setForceUpdate(!forceUpdate)
  }

  const handleFinish = () => {
    captureTags(tags);
    closeModal()
  }

  const renderPreFilledTags = (tagString) => {
    if (tags.includes(tagString)) {
      return (
        <Chip
          onPress={() => handleAddTags(tagString)}
          mode="flat"
          style={[styles.tagsChipStyle, { backgroundColor: '#23374d' }]}
          textStyle={[styles.tagsChipTextStyle, { color: 'white' }]}
          theme={{
            roundness: 0,
          }}>
          {tagString}
        </Chip>
      )
    } else {
      return (
        <Chip
          onPress={() => handleAddTags(tagString)}
          mode="outlined"
          style={styles.tagsChipStyle}
          textStyle={styles.tagsChipTextStyle}
          theme={{
            roundness: 0,
          }}>
          {tagString}
        </Chip>
      )
    }
  }

  return (

    <Modal presentationStyle="fullScreen" visible={isVisible}>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ padding: 10, marginVertical: 20 }}>
          <Text style={{ fontFamily: 'Avenir-Black', fontSize: 30 }}>
            Make your program discoverable
          </Text>
          <Caption>
            Choose tags that best fit the purpose of your program
          </Caption>
        </View>

        <ScrollView contentContainerStyle={{  flexWrap: 'wrap', flexDirection: 'row' }}>
          <Chip onPress={() => setExtraTagsModalVisible(true)} style={styles.tagsChipStyle} textStyle={styles.tagsChipTextStyle}>
              Add your own
          </Chip>
          {
            PRE_FILLED_TAGS.map(tag => {
              return (
                renderPreFilledTags(tag)
              )
            })
          }
          {
            externalTags.map(tag => {
              return (
                renderPreFilledTags(tag)
              )
            })
            }
        </ScrollView>
        <Button
          mode="contained"
          color="#23374d"
          theme={{ roundness: 8 }}
          contentStyle={{ width: Dimensions.get('window').width - 20, height: 45 }}
          contentStyle={{ width: Dimensions.get('window').width - 20, height: 45 }}
          onPress={handleFinish}
          uppercase={false}>
          <Text style={{ fontWeight: '800', fontFamily: 'Avenir-Medium' }}>
            Done
            </Text>
        </Button>



      </View>
      <ExtraTagSubmission isVisible={extraTagsModalVisible} closeModal={() => setExtraTagsModalVisible(false)} captureExternalTags={tags => handleCaptureExternalTags(tags)} />
    </Modal>

  )
}

function ExtraTagSubmission({ captureExternalTags, isVisible, closeModal }) {
  const [tags, setTags] = useState([])
  const [inputText, setInputText] = useState("");
  const [aggregatedText, setAggregatedText] = useState("");
  const [forceUpdate, setForceUpdate] = useState(false);

  const handleOnSubmitEditing = () => {
    let updatedTags = []
    updatedTags = tags;
    updatedTags.push(inputText);
   
    setTags(updatedTags);
    console.log(tags)
    //setInputText("")
  }

  const handleOnChangeText = (text) => {
    if (text.includes(',')) {
      let updatedTags = tags;
      updatedTags.push(inputText);

      setTags(updatedTags);
      setInputText("");
      return;
    }

    setInputText(text);
  }

  const handleOnDone = () => {
    captureExternalTags(tags);
    setInputText("")
    closeModal();
  }

  const deleteTag = tag => {
    let updatedTags = tags;
    updatedTags.splice(updatedTags.indexOf(tag), 1);
    setTags(updatedTags);
    setForceUpdate(!forceUpdate);
  }

  const renderTags = () => {
    return tags.map(tag => {
      return (
        <Chip style={{marginHorizontal: 5}} onPress={() => deleteTag(tag)} icon={() => <FeatherIcon name="x"/>}>
            {tag}
        </Chip>
      )
    })
  }

  return (
    <PaperModal visible={isVisible} contentContainerStyle={{backgroundColor: 'white', alignSelf: 'center', width: Dimensions.get('window').width - 20, height: 'auto', padding: 20}}>
      <KeyboardAvoidingView style={{width: '100%', height: 'auto',}} behavior="height">
        <TextInput 
          returnKeyType="done"
          returnKeyLabel="done"
          style={{marginVertical: 10, borderBottomColor: 'black', borderBottomWidth: 2}}
          placeholder="Add a tag" 
          value={inputText} 
          onChangeText={text => handleOnChangeText(text)}
          />
        <View>
          {
          tags.length != 0 ? 
          <ScrollView horizontal> 
            {renderTags()} 
          </ScrollView> 
          : 
          <Caption style={{alignSelf: 'center'}}> 
            Press , after typing a tag to add it to the list.
          </Caption>
          }
        </View>
        <Button
          mode="contained"
          color="#23374d"
          theme={{ roundness: 8 }}
          style={{marginVertical: 20, width: '100%', alignItems: 'center', justifyContent: 'center'}}
          contentStyle={{  height: 45 }}
          onPress={handleOnDone}
          uppercase={false}>
          <Text style={{ fontWeight: '800', fontFamily: 'Avenir-Medium' }}>
            Done
            </Text>
        </Button>
        </KeyboardAvoidingView>
    </PaperModal>
  )
}

function PublishProgram({ uuid, saveProgramMetadata, goBack, exit }) {
  const [programTitle, setProgramTitle] = useState("");
  const [programDescription, setProgramDescription] = useState("");
  const [programTags, setProgramTags] = useState([]);
  const [programImage, setProgramImage] = useState("");
  const [programPrice, setProgramPrice] = useState(0);
  const [programImageIsSet, setProgramImageSet] = useState(false);
  const [programTagModalVisible, setProgramTagModalVisible] = useState(false);
  const [programIsPublic, setProgramPublic] = useState(false);

  const [usersToShare, setUsersToShare] = useState([]);
  const [usersUUIDToShare, setUsersUUIDToShare] = useState([]);
  const [currUserFollowers, setCurrUserFollowers] = useState([]);

  const [forceUpdate, setForceUpdate] = useState(false);

  const [extraTagsModalVisible, setExtraTagsModalVisible] = useState(false);

  const shareProgramRBSheetRef = createRef();

  const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarReason, setSnackBarReason] = useState("")

  const currUserData = useSelector(state => {
    return state.Users.currUserData;
  });

  useEffect(() => {
    async function fetchFollowers() {
      if (typeof (currUserData.followers) === 'undefined') {
        return;
      }

      await LUPA_CONTROLLER_INSTANCE.getUserInformationFromArray(currUserData.followers)
        .then(result => {
          setCurrUserFollowers(result);
        }).catch(error => {
          LOG_ERROR('PublishProgram.js', 'useEffect::Caught error fetching current users followers data.', error)
          setCurrUserFollowers([])
        })
    }

    LOG('PublishProgram.js', 'Running useEffect');
    fetchFollowers()
  }, []);

  const handleAvatarOnPress = (user) => {
    let updatedUserUUIDList = usersUUIDToShare;
    let updatedUserList = usersToShare;
    if (usersUUIDToShare.includes(user.user_uuid)) {
      updatedUserUUIDList.splice(updatedUserUUIDList.indexOf(user.user_uuid), 1)
      setUsersUUIDToShare(updatedUserUUIDList);
    } else {
      updatedUserUUIDList.push(user.user_uuid);
      setUsersUUIDToShare(updatedUserUUIDList)
    }

    setForceUpdate(!forceUpdate)
  }

  const handleOnPressSend = async () => {
    await LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(uuid).then(result => {
      LUPA_CONTROLLER_INSTANCE.handleSendUserProgram(currUserData, usersUUIDToShare, result);
    });
  }

  const validateCheckout = async () => {
    if (programImage == "") {
      
      setSnackBarReason('Please add a photo for this program.')
      setSnackBarVisible(true);
      return false;
    } else if (programTitle == "") {
      setSnackBarReason('Give your program a title.')
      setSnackBarVisible(true);
      return false;
    } else if (programDescription == "") {
      setSnackBarReason('Give your program a description.')
      setSnackBarVisible(true);
      return false;
    } else if (programTags.length == 0) {
      setSnackBarReason('Please add ateast one tag to your program.')
      setSnackBarVisible(true);
      return false;
    }

    return true;
  }

  const renderUserAvatars = () => {
    return currUserFollowers.map((user, index, arr) => {
      if (usersUUIDToShare.includes(user.user_uuid)) {
        return (
          <TouchableWithoutFeedback key={user.user_uuid} onPress={() => handleAvatarOnPress(user)}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Avatar source={{ uri: user.photo_url }} rounded size={60} containerStyle={{ borderWidth: 2, padding: 3, borderColor: '#1089ff' }} icon={() => <FeatherIcon name="user" />} />
              <Text style={{ padding: 10, fontSize: 12, fontFamily: 'Avenir-Roman' }}>
                {user.display_name}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )
      } else {
        return (
          <TouchableWithoutFeedback onPress={() => handleAvatarOnPress(user)}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Avatar source={{ uri: user.photo_url }} rounded size={60} icon={() => <FeatherIcon name="user" />} />
              <Text style={{ padding: 10, fontSize: 12, fontFamily: 'Avenir-Roman' }}>
                {user.display_name}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )
      }
    })
  }

  const handlePublishToProfile = () => {

    LUPA_CONTROLLER_INSTANCE.setProgramPublic(uuid, true);
    setProgramPublic(true);
  }

  const renderPublicToProfileText = () => {
    if (programIsPublic != true) {
      return (
        <Text>
          Publish to profile
        </Text>
      )
    } else {
      return (
        <Text>
          Program published!
        </Text>
      )
    }
  }

  const renderProgramTags = () => {
    if (programTags.length === 0) {
      return (
        <Caption style={{ padding: 20 }}>
          Add at least one tag to make your program discoverable and reach a variety of clients!
        </Caption>
      )
    } else {
      return programTags.map((tag, index, arr) => {
        return (
          <Chip style={{ margin: 10, alignItems: 'center', justifyContent: 'center' }} key={tag} textStyle={{ fontFamily: 'Avenir-Heavy' }}>
            <Text>
              {tag}
            </Text>
          </Chip>
        )
      })
    }
  }

  const renderProgramImage = () => {
    if (programImageIsSet === false) {
      return (
        <View style={{ backgroundColor: '#EEEEEE', margin: 10, borderRadius: 5, width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }}>
          <FeatherIcon name="plus-circle" size={25} onPress={handleChooseProgramImage} />
        </View>
      )
    } else {
      return (
        <View style={{ backgroundColor: '#EEEEEE', margin: 10, borderRadius: 5, width: 120, height: 120, alignItems: 'center', justifyContent: 'center' }}>
          <Image style={{ width: '100%', height: '100%' }} source={{ uri: programImage }} />
        </View>
      )
    }
  }

  const handleChooseProgramImage = async () => {
    ImagePicker.showImagePicker({
      allowsEditing: true
    }, async (response) => {
      if (!response.didCancel) {
        await LUPA_CONTROLLER_INSTANCE.saveProgramImage(uuid, response.uri.trim())
          .then(uri => {
            setProgramImage(uri)
            setProgramImageSet(true);
            LUPA_CONTROLLER_INSTANCE.updateProgramImage(uuid, uri);
            LOG('PublishProgram.js', 'handleChooseProgramImage::Successfully retrieved image uri and set state: ' + programImage)
          }).catch(error => {
            setProgramImage("")
            setProgramImageSet(false);
            LOG_ERROR('PublishProgram.js', 'handleChooseProgramImage::Caught exception trying to retrieve new image uri.', error)
          });

      }
      else if (response.error) {
        setProgramImage("");
        setProgramImageSet(false);
      }
    });
  }

  const handleCaptureTags = (tags) => {
    setProgramTags(tags)
  }

  const handleCaptureExternalTags = (tags) => {
    let updatedTags = programTags;
    updatedTags.concat(tags);

    setProgramTags(updatedTags);
  }

  const handleOnFinish = async () => {
    const retVal = await validateCheckout();

    if (retVal == true) {
      await saveProgramMetadata(programTitle, programDescription, programTags, programPrice).then(() => {
        handleOnPressSend()
      });
    }

    exit();
  }

  const openShareWithFriendsModal = () => shareProgramRBSheetRef.current.open();

  const closeShareWithFriendsModal = () => shareProgramRBSheetRef.current.close();

  const renderShareWithFriendsModal = () => {
    return (
      <RBSheet
        ref={shareProgramRBSheetRef}
        height={200}
        dragFromTopOnly={true}
        closeOnDragDown={true}
        customStyles={{
          wrapper: {

          },
          container: {

            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
          draggableIcon: {
            backgroundColor: 'grey',
          }
        }}
      >
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <View style={{ padding: 10, paddingBottom: 15 }}>
            <Text style={{ alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontSize: 16 }}>
              Share Program
            </Text>
          </View>
          <Divider style={{ width: Dimensions.get('window').width }} />
          <View style={{ marginVertical: 10 }}>
            <ScrollView horizontal centerContent contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
              {renderUserAvatars()}
            </ScrollView>
          </View>

        </View>
        <SafeAreaView />
      </RBSheet>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 0, borderBottomColor: 'rgb(199, 199, 204)', borderBottomWidth: 0.8 }}>
        <Appbar.BackAction onPress={goBack} />
        <Appbar.Content title="Publish Program" titleStyle={{ alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 25 }} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={{ backgroundColor: '#FFFFFF' }}>
        <View style={{ marginVertical: 10 }}>
          {renderProgramImage()}
        </View>

        <View style={{ marginVertical: 10 }}>
          <View style={{ marginVertical: 10 }}>
            <Text style={{ paddingHorizontal: 10, fontFamily: 'Avenir-Heavy', fontSize: 16 }}>
              Program Title
               </Text>
            <TextInput
              value={programTitle}
              onChangeText={title => setProgramTitle(title)}
              placeholder="Give your program a title"
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: 1.5,
                paddingVertical: 10,
                alignSelf: 'center',
                width: Dimensions.get('window').width - 20
              }}
              returnKeyLabel="done"
              returnKeyType="done"
              keyboardType="default"
              keyboardAppearance="light"
            />
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text style={{ paddingHorizontal: 10, fontFamily: 'Avenir-Heavy', fontSize: 16 }}>
              Program Description
               </Text>
            <TextInput
              value={programDescription}
              onChangeText={description => setProgramDescription(description)}
              placeholder="Write a quick description"
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: 1.5,
                paddingVertical: 10,
                alignSelf: 'center',
                width: Dimensions.get('window').width - 20
              }}
              returnKeyLabel="done"
              returnKeyType="done"
              keyboardType="default"
              keyboardAppearance="light"
            />
          </View>
        </View>

        <Divider />

        <View>
          <Text style={{ padding: 10, fontFamily: 'Avenir-Heavy', fontSize: 16 }}>
            Program Price
               </Text>
          <View style={{ flexDirection: 'row', aligItems: 'center', marginVertical: 10, height: 45, alignSelf: 'center', width: Dimensions.get('window').width - 20, borderWidth: 0.8, borderColor: '#E5E5E5' }}>
            <View style={{ width: 50, backgroundColor: '#1089ff', alignItems: 'center', justifyContent: 'center' }}>
              <FeatherIcon name="dollar-sign" size={20} color="white" />
            </View>
            <TextInput
              value={programPrice}
              onChangeText={text => setProgramPrice(text)}
              placeholder="$59.99"
              style={{ paddingHorizontal: 10 }}
              returnKeyType="done"
              returnKeyLabel="done"
              keyboardType="numeric"
              keyboardAppearance="light"
            />
          </View>
        </View>


        <Divider />

        <View style={{ marginVertical: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
            <Text style={{ fontFamily: 'Avenir-Heavy', fontSize: 16 }}>
              Tags
            </Text>
            <Text style={{ color: '#1089ff' }} onPress={() => setProgramTagModalVisible(true)}>
              Edit
            </Text>
          </View>
          <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
            {renderProgramTags()}
          </View>
        </View>

        <Divider />

        <View style={{ marginVertical: 10 }}>
          <Button
            color="#1089ff"
            style={{ alignSelf: 'flex-start' }}
            mode="text"
            uppercase={false}
            icon={() => <FeatherIcon name="user-plus" size={12} />}
            onPress={openShareWithFriendsModal}
          >
            Share with friends ({usersUUIDToShare.length} selected)
            </Button>

          <View>
            <Button
              onPress={programIsPublic != true ? handlePublishToProfile : null}
              color="#1089ff"
              style={{ alignSelf: 'flex-start' }}
              mode="text"
              uppercase={false}
              icon={() => <FeatherIcon name="globe" size={12} />}>
              {renderPublicToProfileText()}
            </Button>
            <Caption style={{ paddingHorizontal: 10 }}>
              Publishing a program to your profile will also allow your program to be shown on the home  and search pages.
            </Caption>
          </View>

        </View>

        <Divider />

        <Button
          onPress={handleOnFinish}
          color="#23374d"
          mode="contained"
          theme={{ roundness: 12 }}
          uppercase={false}
          contentStyle={{ width: Dimensions.get('window').width - 50, height: 45 }}
          style={{ marginVertical: 20, alignSelf: 'center', elevation: 0 }}>
          <Text style={{ fontFamily: 'Avenir' }}>
            Publish Program
              </Text>
        </Button>

      </ScrollView>

      <AddTagsModal isVisible={programTagModalVisible} openModal={() => setExtraTagsModalVisible(true)}  closeModal={() => setProgramTagModalVisible(false)} captureTags={handleCaptureTags} />
      <Snackbar
        visible={snackBarVisible}
        onDismiss={() => setSnackBarVisible(false)}
        action={{
          label: 'Okay',
          onPress: () => {
            // Do something
          },
        }}>
        {snackBarReason}
      </Snackbar>
      {renderShareWithFriendsModal()}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsChipStyle: {
    margin: 5,
    borderRadius: 20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
  },
  tagsChipTextStyle: {
    fontSize: 13,
    fontFamily: 'Avenir-Heavy',
    fontWeight: '800'
  },
})

export default PublishProgram;