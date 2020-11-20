import React, { useState, useEffect, useRef, useCallback, createRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
  Slider,
  TouchableHighlight,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';

import {
  Surface,
  Modal as PaperModal,
  Caption,
  Button,
  Appbar,
  IconButton,
  Chip,
  Snackbar,
  ProgressBar,
  Divider,
  Title,
} from 'react-native-paper';

import ImagePicker from 'react-native-image-picker';

import { Constants } from 'react-native-unimodules';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Icon from "react-native-feather1s";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import SelectProgramImage from './SelectProgramImage'
import { Input} from 'react-native-elements';
import LupaMapView from '../../../../user/modal/LupaMapView'
import { copyFileAssets } from 'react-native-fs';
import { getLupaProgramInformationStructure } from '../../../../../model/data_structures/programs/program_structures';
import NumberFormat from 'react-number-format';
import LupaController from '../../../../../controller/lupa/LupaController';
import { LUPA_AUTH } from '../../../../../controller/firebase/firebase';
import RBSheet from 'react-native-raw-bottom-sheet';

function AddTagsModal({ captureTags, isVisible, closeModal }) {
  let [tags, setTags] = useState([]);
  let [inputValue, setInputValue] = useState('');

  const handleAddTags = () => {
    if (tags.length == 10) {
      return;
    }

    setTags((prevState) => [...prevState].concat(inputValue))
    setInputValue('')
  }

  const handleFinish = () => {
    captureTags(tags);
    closeModal()
  }

  const handleCancel = () => {
    closeModal()
  }

  return (

    <PaperModal contentContainerStyle={{ borderRadius: 10, alignSelf: 'center', top: 120, position: 'absolute', backgroundColor: 'white', width: Dimensions.get('window').width - 30, height: 400 }} visible={isVisible}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ padding: 10, fontSize: 20, fontWeight: 'bold' }}>
              Make your program discoverable
          </Text>
          </View>

          <View style={{ flex: 3, flexWrap: 'wrap', flexDirection: 'row', margin: 10 }}>
            {
              tags.map(tag => {
                return (
                  <Chip style={{ margin: 5, borderRadius: 5, width: 'auto' }} textStyle={{ fontSize: 15 }} theme={{
                    roundness: 0,
                  }}>
                    {tag}
                  </Chip>
                )
              })
            }
          </View>

          <View style={{ justifyContent: 'center', borderRadius: 10, flex: 1.5, backgroundColor: '#E3F2FD' }}>
            <Input
              placeholder='Try "cardio"'
              value={inputValue}
              inputStyle={{ fontSize: 12, padding: 10, }}
              inputContainerStyle={{ backgroundColor: 'white', borderWidth: 1, borderBottomWidth: 1, borderColor: '#BBDEFB' }}
             // onSubmitEditing={() => handleAddTags()}
              onBlur={handleAddTags}
              onChangeText={text => setInputValue(text)}
              keyboardAppearance="light"
              keyboardType="default"
              returnKeyLabel="submit"
              returnKeyType="done"
            />

            <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row' }}>
              <Button mode="text" color="#e53935" onPress={handleCancel}>
                <Text>
                  Cancel
            </Text>
              </Button>
              <Button mode="text" color="#1E88E5" onPress={handleFinish}>
                <Text>
                  Done
            </Text>
              </Button>
            </View>

          </View>
        </View>
      </KeyboardAvoidingView>
    </PaperModal>

  )
}

function PublishProgram({uuid, saveProgramMetadata, goBack}) {
  const [programTitle, setProgramTitle] = useState("");
  const [programDescription, setProgramDescription] = useState("");
  const [programTags, setProgramTags] = useState([]);
  const [programImage, setProgramImage] = useState("");
  const [programPrice, setProgramPrice] = useState(0);
  const [programImageIsSet, setProgramImageSet] = useState(false);
  const [programTagModalVisible, setProgramTagModalVisible] = useState(false);
  const [programIsPublic, setProgramPublic] = useState(false);

  const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

  const handlePublishToProfile = () => {
    if (programIsPublic === true) {
      return;
    }

    LUPA_CONTROLLER_INSTANCE.setProgramPublic(uuid, true);
    setProgramPublic(true);
  }

  const renderPublicToProfileText = () => {
    if (programIsPublic === true) {
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
        <Caption style={{padding: 20}}>
          Add at least one tag to make your program discoverable and reach a variety of clients!
        </Caption>
      )
    } else {
        return programTags.map((tag, index, arr) => {
            return (
                <Chip style={{marginHorizontal: 10, width: 120, alignItems: 'center', justifyContent: 'center'}} key={tag}>
                    <Text style={{fontFamily: 'Avenir-Light'}}>
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
        <View style={{backgroundColor: '#EEEEEE', margin: 10, borderRadius: 5, width: 120, height: 120, alignItems: 'center', justifyContent: 'center'}}>
                  <FeatherIcon name="plus-circle" size={25} onPress={handleChooseProgramImage} />
              </View>
      )
    } else {
      return (
      <View style={{backgroundColor: '#EEEEEE', margin: 10, borderRadius: 5, width: 120, height: 120, alignItems: 'center', justifyContent: 'center'}}>
                  <Image style={{width: '100%', height: '100%'}} source={{uri: programImage}} />
              </View>
      )
    }
  }

  const handleChooseProgramImage = async () => {
    ImagePicker.showImagePicker({
      allowsEditing: true
  }, async (response) => {
      if (!response.didCancel)
      {
        let updatedUri = "";
        await LUPA_CONTROLLER_INSTANCE.saveProgramImage(uuid, response.uri.trim()).then(uri => {
          updatedUri = uri;
        })

        setProgramImage(updatedUri);
        setProgramImageSet(true);
      }
      else if (response.error)
      {
        setProgramImage("");
        setProgramImageSet(false);
      }
  });
  }

  const handleCaptureTags = (tags) => {
    setProgramTags(tags)
  }

  const handleOnFinish = () => {
    saveProgramMetadata(programTitle, programDescription, programTags, programImage, programPrice);
  }

  const openShareWithFriendsModal = () => {

  }
  
  const closeShareWithFriendsModal = () => {

  }

  const renderShareWithFriendsModal = () => {

  }

  return (
    <View style={{flex: 1}}>
                  <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 0,  borderBottomColor: 'rgb(199, 199, 204)', borderBottomWidth: 0.8 }}>
                    <Appbar.Action onPress={goBack} icon={() =>  <FeatherIcon name="arrow-left" color="#000000" size={22} style={{margin: 18}} />} />
                    <Appbar.Content title="Publish Program" titleStyle={{fontFamily: 'HelveticaNeue-Medium', fontSize: 15, fontWeight: '600'}} />
                </Appbar.Header>
                <ScrollView>
                <View style={{marginVertical: 10}}>
             {renderProgramImage()}
          </View>

          <View style={{marginVertical: 10}}>
             <View style={{marginVertical: 10}}>
               <Text style={{paddingHorizontal: 10, fontFamily: 'Avenir-Heavy', fontSize: 16}}>
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

             <View style={{marginVertical: 10}}>
               <Text style={{paddingHorizontal: 10, fontFamily: 'Avenir-Heavy', fontSize: 16}}>
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
          <Text style={{padding: 10, fontFamily: 'Avenir-Heavy', fontSize: 16}}>
                 Program Price
               </Text>
               <View style={{flexDirection: 'row', aligItems: 'center', marginVertical: 10, height: 45, alignSelf: 'center', width: Dimensions.get('window').width - 20, borderWidth: 0.8, borderColor: '#E5E5E5'}}>
              <View style={{width: 50, backgroundColor: '#1089ff', alignItems: 'center', justifyContent: 'center'}}>
                <FeatherIcon name="dollar-sign" size={20} color="white" />
              </View>
              <TextInput
              value={programPrice}
              onChangeText={text => setProgramPrice(text)}
              placeholder="$59.99" 
              style={{paddingHorizontal: 10}}
              returnKeyType="done"
              returnKeyLabel="done"
              keyboardType="numeric"
              keyboardAppearance="light"
              />
          </View>
          </View>


          <Divider />

          <View style={{marginVertical: 10}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10}}>
            <Text style={{fontFamily: 'Avenir-Heavy', fontSize: 16}}>
              Tags
            </Text>
            <Text style={{color: '#1089ff'}} onPress={() => setProgramTagModalVisible(true)}>
              Edit
            </Text>
            </View>
            <View style={{padding: 10}}>
              {renderProgramTags()}
            </View>
          </View>

          <Divider />

          <View style={{marginVertical: 10}}>
            <Button 
            color="#1089ff"
            style={{alignSelf: 'flex-start'}}
            mode="text"
            uppercase={false} 
            icon={() => <FeatherIcon name="user-plus"  size={12} />}>
              Share with friends (0 selected)
            </Button>

          <View>
          <Button   
          onPress={handlePublishToProfile}
            color="#1089ff"
            style={{alignSelf: 'flex-start'}}
            mode="text"
            uppercase={false} 
            icon={() => <FeatherIcon name="globe" size={12} />}>
             {renderPublicToProfileText()}
            </Button>
            <Caption style={{paddingHorizontal: 10}}>
              Publishing a program to your profile will also allow your program to be shown on the home  and search pages.
            </Caption>
          </View>
            
          </View>

          <Divider />
      
            <Button 
            onPress={handleOnFinish}
            color="#23374d"
            mode="contained"
            theme={{roundness: 12}}
            contentStyle={{width: Dimensions.get('window').width - 50, height: 45}}
            style={{marginVertical: 20, alignSelf: 'center', elevation: 8}}>
              Finish
            </Button>
   
             </ScrollView>
          

    
                 <AddTagsModal isVisible={programTagModalVisible} closeModal={() => setProgramTagModalVisible(false)} captureTags={handleCaptureTags} />
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
  topView: {
    flex: 2,
    backgroundColor: '#FFFFFF',
    elevation: 15,
    justifyContent: 'space-between'
  },
  bottomView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  divider: {
    width: Dimensions.get('window').width - 150,
    alignSelf: 'center'
  },
  container: {
    width: "100%",
    height: 320,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    color: 'white',
    margin: 10,
    backgroundColor: 'transparent'
  },
  selectedType: {
    backgroundColor: '#d4e5ff',
    borderColor: '#BBDEFB',
    borderWidth: 0.5
  },
  unselectedType: {
    backgroundColor: '#FFFFFF',
    borderColor: 'transparent',
    borderWidth: 0
  },
  textInput: {
    margin: 3,
    width: '100%',
    alignSelf: 'flex-start',
    marginVertical: 10,
    paddingVertical: 15,
    fontSize: 13,
    fontFamily: 'Avenir-Light',
  },
  questionText: {
    fontFamily: "Avenir-Medium",
    fontSize: 18,
    fontWeight: '700',
    color: '#23374d'
  }
})

export default PublishProgram;