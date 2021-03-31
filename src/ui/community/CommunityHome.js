import React, { useEffect, useState  } from 'react';

import {
    View,
    Dimensions,
    Text,
    Modal,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import {
    Appbar,
    Button
} from 'react-native-paper';

import {
    Left,
    Right,
    Body,
    ScrollableTab,
    Tabs,
    Tab,
    Header
} from 'native-base';

import Feather1s from 'react-native-feather1s'

import FeatherIcon from 'react-native-vector-icons/Feather'
import Community from './Community';
import CommunityRoster from './CommunityRoster';
import CommunityEvents from './CommunityEvents';
import CommunityReviews from './CommunityReviews';
import LupaController from '../../controller/lupa/LupaController';
import { initializeNewCommunity } from '../../model/data_structures/community/community';
import LUPA_DB from '../../controller/firebase/firebase';
import { useSelector } from 'react-redux/lib/hooks/useSelector';
import GeneralPurposeSearchModal from '../search/GeneralPurposeSearchModal';

const COLOR = "#FFFFFF";
const TAB_PROPS = {
  tabStyle: {backgroundColor: COLOR},
  activeTabStyle: {backgroundColor: COLOR},
  textStyle: {color: "rgba(35, 55, 77, 0.75)", fontFamily: 'Avenir-Heavy', fontSize: 20},
  activeTextStyle: {color: "#1089ff", fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20}
};

function EditPhotosModal({ closeModal, isVisible, community }) {
    const [images, setImages] = useState(community.pictures);
    const [visible, setVisible] = useState(false);

    const [forceUpdate, setForceUpdate] = useState(false);
  
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
  
    const handleOnLeaveModal = () => {
      console.log(images)
      LUPA_CONTROLLER_INSTANCE.updateCommunityPictures(community.uid, images);
      closeModal();
    }
  
  
    const _chooseProfilePictureFromCameraRoll = async () => {
      let updatedImageList = []
  
      try {
  
       ImagePicker.showImagePicker({
           allowsEditing: true
       }, async (response) => {
           if (!response.didCancel)
           {      
            const uri = await response.uri;
            await LUPA_CONTROLLER_INSTANCE.saveCommunityImage(uri, {}, community.uid)
            .then(uploadedURI => {
  
              updatedImageList = images;
              updatedImageList.push(uploadedURI)
  
              setImages(updatedImageList)
              setForceUpdate(!forceUpdate)
            
            })
  
           }
           else if (response.error)
           {
         
           }
       });
  
       } catch(error)
       {
        
          // LOG_ERROR('BasicInformation.js', 'Unhandled exception in _chooseProfilePictureFromCameraRoll()', error);
       }
  
  
   }
  
    return (
      <Modal visible={isVisible} presentationStyle="fullScreen" animationType="slide">
         <Appbar.Header style={{backgroundColor: 'white', elevation: 0}}>
                  <Appbar.BackAction onPress={closeModal} />
                  <Appbar.Content title="Edit Photos" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', borderBottomColor: '#EEEEEE', borderBottomWidth: 1,  fontWeight: 'bold', fontSize: 25}} />
                  <Button onPress={handleOnLeaveModal} mode="text" color="#1089ff" uppercase={false}>
                    Save
                  </Button>
              </Appbar.Header>
        <View style={{flex: 1}}>
            <ScrollView>
              
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap'}}>
            <TouchableOpacity onPress={_chooseProfilePictureFromCameraRoll}>
               <View style={{margin: 10, width: 120, height: 120, borderRadius: 8, backgroundColor: '#EEEEEE', alignItems: 'center', justifyContent: 'center'}}>
                 <Feather1s name="plus-circle" size={25} style={{padding: 3}} />
               </View>
             </TouchableOpacity>
  
            {
            images.map(uri => {
              return <Image source={{uri: uri}} style={{width: Dimensions.get('window').width / 4, margin: 10, borderRadius: 8, height: 120}} />
            })
            }
          </View>
            </ScrollView>
          
        </View>
      </Modal>
    )
  }

const CommunityHome = ({ communityData }) => {

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const [programOffers, setProgramOffers] = useState([])
    const [trainerData, setTrainerData] = useState([])
    const [editPhotosModalVisible, setEditPhotosModalVisible] = useState(false);
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [invitedUsers, setInvitedUsers] = useState([])

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const [community, setCommunity] = useState(communityData)
  
    const handleSelectInviteUser = (user) => {
    setInvitedUsers([user, ...invitedUsers]);
  }

  renderSearchBarContent = () => {
    return (
      <View style={{width: Dimensions.get('window').width}}>
          <ScrollView horizontal>
            {
              invitedUsers.map(user => {
                return (
                <View style={{padding: 5,  borderWidth: 0.5, borderRadius: 12, borderColor: '#EEEEEE', width: 'auto', marginHorizontal: 10, flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar.Image size={30} source={{uri: user.photo_url }}  />
                    <Text style={{ fontFamily: 'Avenir-Medium', paddingHorizontal: 20}}>
                      {user.display_name}
                    </Text>
                </View>
                )
              })
            }
          </ScrollView>
      </View>
    )
  }


    const openActionSheet = () => 
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Edit Photos", "Invite Trainers", "Create Program", "Delete Community"],
        destructiveButtonIndex: 4,
        cancelButtonIndex: 0
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          //setResult(Math.floor(Math.random() * 100) + 1);
          setEditPhotosModalVisible(true);
        } else if (buttonIndex === 2) {
          setSearchModalVisible(true);
        } else if (buttonIndex === 3) {
          navigation.push('CreateProgram')
        } else if (buttonIndex === 4) {
          LUPA_CONTROLLER_INSTANCE.deleteCommunity(community.uid);
          navigation.pop();
        }
      }
    )

    return (
        <View style={{flex: 1}}>
        {/*  <Tabs 
          style={{backgroundColor: '#FFFFFF'}}
          tabBarUnderlineStyle={{backgroundColor: '#FFFFFF', height: 1}}
          tabContainerStyle={{borderBottomWidth: 0, height: 0}}
          renderTabBar={(props) =>
            <ScrollableTab {...props}  style={{borderBottomWidth: 0, borderColor: 'rgb(174, 174, 178)',  height: 40, shadowRadius: 1, justifyContent: 'flex-start', elevation: 0, backgroundColor: '#FFFFFF'}} tabsContainerStyle={{justifyContent: 'flex-start', backgroundColor: COLOR, elevation: 0}} underlineStyle={{backgroundColor: "#1089ff", height: 1, elevation: 0, borderRadius: 8}}/>}>
            
            <Tab heading='Community' {...TAB_PROPS} >
                <Community community={community} />
            </Tab>

            <Tab heading='Roster' {...TAB_PROPS} >
                <CommunityRoster trainers={trainerData} />
            </Tab>

            <Tab heading='Events' {...TAB_PROPS} >
                <CommunityEvents events={community.events} />
          </Tab>
          </Tabs>*/}

<Community community={community} />

          
         {/*   <EditPhotosModal 
          isVisible={editPhotosModalVisible} 
          closeModal={() => setEditPhotosModalVisible(false)} 
          community={community}
          />


          <GeneralPurposeSearchModal 
          isVisible={searchModalVisible} 
          closeModal={() => setSearchModalVisible(false)} 
          inputPlaceholder='Add trainers to your community'
          usersEnabled={false}
          trainersEnabled={true}
          communitiesEnabled={false}
          userHasButton={true}
          userButtonOnPress={user => handleSelectInviteUser(user)}
          userButtonTitle='Invite'
          searchResultsContainer={invitedUsers}
          showContentBelowSearchBar={true}
          contentBelowSearchBar={renderSearchBarContent()}
        //  showExitButton={}
        //  exitButtonPress={}
        //  exitButtonText={}
         />*/}
      </View>
    )
}

export default CommunityHome;