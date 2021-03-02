import React, {createRef, useEffect, useState} from 'react';
import DrawerIcon from 'react-native-vector-icons/Feather'

import { 
  connect, 
  useDispatch, 
  useSelector 
} from 'react-redux';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView, 
    Dimensions,
    SafeAreaView,
    Linking,
} from 'react-native';
import {
  Avatar,
  Caption,
  Surface,
  Dialog,
  Paragraph,
  TouchableRipple,
  Button,
  Divider,
  Appbar,
  Chip,
} from 'react-native-paper';
import { GiftedChat } from 'react-native-gifted-chat'
import { Constants } from 'react-native-unimodules';
import TrainerInsights from '../../user/trainer/TrainerInsights';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Fire, LUPA_AUTH } from '../../../controller/firebase/firebase';
import { logoutUser } from '../../../controller/lupa/auth/auth';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { getLupaStoreState }from '../../../controller/redux/index';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather'
import LupaController from '../../../controller/lupa/LupaController';
import { DrawerActions } from '@react-navigation/native';
import { Input } from 'native-base';
import Swiper from 'react-native-swiper';
import CreatePackDialog from '../../packs/dialogs/CreatePackDialog';
import MatchMe from '../../packs/modal/MatchMe';

const ICON_SIZE = 20;
const ICON_COLOR = "rgb(203, 209, 214)"

function PackLeaderLimitDialog({ isVisible, closeDialog }) {
  return (
    <Dialog visible={isVisible} onDismiss={closeDialog} style={{borderRadius: 20}}>
      <Dialog.Title>
        Pack Leader Limit Reached
      </Dialog.Title>
      <Dialog.Content>
        <Paragraph>
          You've reached the limit of packs that you are allowed to join.  Delete a pack or try creating a pack at a later date.
        </Paragraph>
      </Dialog.Content>
      <Dialog.Actions>
        <Button
        style={{alignSelf: 'flex-end', elevation: 0}}
        contentStyle={{paddingHorizontal: 10}}
        color="#1089ff"
        theme={{roundness: 8}}
        uppercase={false}
        mode="contained"
        onPress={closeDialog}
        >
          <Text style={{fontFamily: 'Avenir', fontWeight: '700'}}>
            Okay
          </Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

/**
 * This component render a drawer menu. The drawer menu contains all of the content for the
 * drawer.
 * @param {Object} props Properties that this component receives.
 */
function DrawerMenu({ }) {

  const [messages, setMessages] = useState([])
  const [userMessageData, setUserMessageData]  = useState([])
  const [currMessagesIndex, setCurrMessagesIndex] = useState(0)
  const [inboxEmpty, setEmptyInbox] = useState(false);
  const [avatarIndex, setAvatarIndex] = useState(0)
  const [viewReady, setViewReady] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [matchMeIsVisible, setMatchMeIsVisible] = useState(false);
  const [lupaStoreState, setLupaStoreState] = useState(getLupaStoreState())
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const createPackSheetRef = createRef();
  

  const [createIsVisble, setCreateIsVisible] = useState(false);
  const [packLeaderLimitReachedDialogIsVisible, setPackLeaderLimitReachedDialogIsVisible] = useState(false);

  const currUserData = useSelector(state => {
    return state.Users.currUserData;
  })

  const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();


  const [packsAreVisible, setPacksVisible] = useState(false);

  useEffect(() => {
    async function initComponent() {
      await setupUserMessageData()
      await setupFire()
    }

   setLupaStoreState(getLupaStoreState())
   initComponent()

 
  // return () => Fire.shared.off()
  }, [])

  

  handleAvatarOnPress = async (avatarIndex) => {
    setCurrMessagesIndex(avatarIndex)
    setAvatarIndex(avatarIndex)
    setShowChat(true)
  }

  renderAvatarList = () => {
    if (userMessageData)
    {
        if (userMessageData.length == 0)
        {
          return;
        }
        else
        {
         return userMessageData.map((userData, index, arr) => {
              return (
                  <TouchableOpacity key={userData.user_uuid} style={{marginVertical: 10, alignItems: 'flex-start'}} onPress={() => handleAvatarOnPress(index)}>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Avatar.Image key={userData.photo_url} source={{uri: userData.photo_url}} key={index} size={50}  style={{ elevation: 10, marginHorizontal: 20 }}  />
                      <View>
                          <Text style={{fontSize: 16, fontFamily: 'Avenir-Heavy', color: 'white'}}>
                              {userData.display_name}
                          </Text>
                      </View>
                      </View>
                   
                  </TouchableOpacity>
              )
          })
        }
    }
  
}

renderChatComponent = () => {
  if (showChat === true) {
      return (
         
                 <GiftedChat 
messages={messages} 
onSend={Fire.shared.send} 
user={Fire.shared.getUser()} 
showAvatarForEveryMessage={true} 
placeholder="Begin typing here" 
isTyping={true} 
renderUsernameOnMessage={true}
showUserAvatar={true}
alwaysShowSend={true}
/>
      )
  } else {
      return (
<>
  <ScrollView shouldRasterizeIOS={true} showsHorizontalScrollIndicator={false}>
          {renderAvatarList()}
</ScrollView>
</>
   
        
      )
  }
}



  setupUserMessageData = async () => {
      let currUserChats, userMessageDataIn = [];
    await LUPA_CONTROLLER_INSTANCE.getAllCurrentUserChats().then(chats => {
        currUserChats = chats;
    });

    if (currUserChats.length >= 1)
    {
        for (let i = 0; i < currUserChats.length; ++i)
        {
            await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(currUserChats[i].user).then(userData => {
                userMessageDataIn.push(userData);
            });
        }
    }

    if (userMessageDataIn.length >= 1)
    {
      setUserMessageData(userMessageDataIn)
      setEmptyInbox(false)
    }
  }

  setupFire = async () => {
    //clear messages
    setMessages([])
    let privateChatUUID;

                //check for shared chat uuid between users
    await LUPA_CONTROLLER_INSTANCE.getPrivateChatUUID(currUserData.user_uuid, userMessageData[currMessagesIndex].user_uuid).then(result => {
        privateChatUUID = result;
    }).then(() => {
      setViewReady(true)
    })
    .catch(error => {
      setViewReady(false)
    })
  

    try {
                 //init Fire
    await Fire.shared.init(privateChatUUID);

    await Fire.shared.on(message => {
      setMessages(previousMessages => GiftedChat.append(previousMessages, message))
      setViewReady(true)
    /*  this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
       // viewReady: true,
      }))*/
    })

    } catch(error) {
      setViewReady(false);
    }
  }


  /**
   * Navigates to the ProfileView
   * @param userUUID String uuid of the user to show on the profile
   * @param navFrom String Location navigating from
   */
  const navigateToProfile = () => {
    navigation.push('Profile', {
      userUUID: currUserData.user_uuid,
      navFrom: 'Drawer'
    })
  }

  const navigateToTrainerInformation = () => {
    navigation.navigate('RegisterAsTrainer', {
      navFrom: 'Drawer'
    })
  }

  const navigateToPickInterest = () => {
    navigation.push('PickInterest', {
      navFrom: 'Drawer'
    });
  }

  /**
   * Logs the user out.
   */
  const _handleLogout = async () => {
    await dispatch(logoutUser());
    await navigation.navigate('GuestView');
  }

  const togglePacksVisibility = () => {
    setPacksVisible(!packsAreVisible)
  }

  const navigateToPackChat = (uid) => {
    navigation.navigate('PackChat', {
      uid: uid
    })
  }

  const renderContentSwiper = () => {
    return (
      <View style={{width: '100%', alignSelf: 'center', height: 190}}>
      <Swiper 
      paginationStyle={{marginTop: 20}}
        showsPagination={true} 
        autoplayTimeout={3}
        showsButtons={false} 
        dotColor="#E5E5E5" 
        autoplay={true}
        style={{alignItems: 'center', justifyContent: 'center'}}
         >
     <View style={styles.swiperEntryContentContainer}>
       <Text style={styles.swiperEntryContentText}>
            Whether working out or taking a break don't do it alone. Invite your friends to start a pack.
      </Text>
          <Button onPress={handleOpenCreatePack} theme={{roundness: 20}} style={{marginTop: 10}} uppercase={false} color="#FFFFFF" mode="contained">
          <Text style={{fontFamily: 'Avenir'}}>
            Start a pack
          </Text>
          </Button>
     </View>


     <View style={styles.swiperEntryContentContainer}>
       <Text style={styles.swiperEntryContentText}>
          Looking for workout partners?  Let us search through your community and find your perfect match.
      </Text>
          <Button onPress={() => setMatchMeIsVisible(true)} theme={{roundness: 20}} style={{marginTop: 10}} uppercase={false} color="#FFFFFF" mode="contained">
          <Text style={{fontFamily: 'Avenir'}}>
            Match me
          </Text>
          </Button>
     </View>



     <View style={styles.swiperEntryContentContainer}>
       <Text style={styles.swiperEntryContentText}>
           Find the perfect trainer for you and your friends today.
      </Text>
          <Button onPress={() => navigation.push('Search')} theme={{roundness: 20}} style={{marginTop: 10}} uppercase={false} color="#FFFFFF" mode="contained">
          <Text style={{fontFamily: 'Avenir'}}>
            Find a trainer
          </Text>
          </Button>
     </View>

    </Swiper>
    </View>
    )
  }

  const renderPacksDisplay = () => {
    const lupaStorePacks = getLupaStoreState().Packs.currUserPacksData;
    if (lupaStorePacks.length == 0) {
      return (
        renderContentSwiper()
      )
    }

    return (
      <View>
        {renderContentSwiper()}
        <View>
      <Text style={styles.sectionHeaderText}>
 Packs
</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} shouldRasterizeIOS={true}>
        {
             lupaStorePacks.map(pack => {
              return (
                <Chip 
                icon={() => pack.members >= 3 ? <FeatherIcon color="#1089ff" name="globe" /> :  <FeatherIcon color="#1089ff" name="lock" />}
                mode="outlined"
                textStyle={{color: '#1089ff', fontSize: 13, fontFamily: 'Avenir', fontWeight: '500'}}
                style={{ marginHorizontal: 10, borderRadius: 8, marginVertical: 5}} onPress={() => navigateToPackChat(pack.uid)}>
                  <Text> 
                {pack.name}
                </Text>
                </Chip>
              )
            })
        }
      </ScrollView>
      </View>
      </View>
    )
  }

  handleOnChooseCreatePack = () => {
    const userPacks = getLupaStoreState().Packs.currUserPacksData;
    const updatedUserState = getLupaStoreState().Users.currUserData;

    
    let count = 0;
    for (let i = 0; i < userPacks.length; i++) {
        if (userPacks[i].leader == updatedUserState.user_uuid) {
          count++;
        }
    }

    if (count >= 2) {
      setPackLeaderLimitReachedDialogIsVisible(true);
      return;
    }

    setCreateIsVisible(false);
    handleOpenCreatePack();
  }

  handleOpenCreatePack = () => {
    createPackSheetRef.current.open();
  }

  handleOnCloseCreatePack = () => {
    createPackSheetRef.current.close();
  }



  return (
    <View style={styles.container}>
    <SafeAreaView
      style={styles.safeAreaView}
      forceInset={{top: 'always', horizontal: 'never'}}>
        <View style={{flex: 1, justifyContent: 'space-between'}}>
<View style={{flex: 1}}>
   
      <View style={styles.drawerHeader}>
        <View style={{flexDirection: 'row', alignItems: 'center',}}>
        <Appbar.BackAction onPress={showChat === true ? () => setShowChat(false) : () => navigation.dispatch(DrawerActions.closeDrawer())} color="#FFFFFF" size={20} />
        <View style={{paddingHorizontal: 10}}>
          <Text style={styles.drawerHeaderText}>
                {currUserData.display_name}
              </Text>
            
          </View>
        </View>
             

          <TouchableOpacity onPress={navigateToProfile}>
          <Avatar.Image source={{uri: currUserData.photo_url}} size={40} style={{marginHorizontal: 10}} />
          </TouchableOpacity>

        </View>


      <Divider />

<View>
{renderPacksDisplay()}
</View>


<Text style={styles.sectionHeaderText}>
 Messages
</Text>
   

    {renderChatComponent()}
        </View>
        </View>
    </SafeAreaView>
    <MatchMe isVisible={matchMeIsVisible} closeModal={() => setMatchMeIsVisible(false)} />
    <CreatePackDialog ref={createPackSheetRef} />
    <PackLeaderLimitDialog 
          isVisible={packLeaderLimitReachedDialogIsVisible} 
          closeDialog={() => setPackLeaderLimitReachedDialogIsVisible(false)} 
          />
  </View>
  )
}

export default DrawerMenu;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#23374d'
    },
    safeAreaView: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    drawerHeader: {
      paddingVertical: 10,
      flexDirection: 'row', 

      alignItems: 'center', 
      justifyContent: 'space-between'
    },
    drawerFooter: {
      width: '100%',
      flexDirection: 'column', 
      position: 'absolute', 
      bottom: Constants.statusBarHeight
    },
    footerSection: {
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-evenly', 
    },
    navigationButtonContaner: {
      flexDirection: 'row', 
      alignItems: 'center', 
      margin: 15,
      width: '90%'
    },
    drawerHeaderText: { 
      paddingVertical: 5,
      fontSize: 18,
      fontFamily: 'Avenir-Black',
      color: 'white'
    },
    drawerHeaderSubText: {
      fontSize: 15,
      fontFamily: 'Avenir-Roman',
      color: '#1089ff',
    },
    iconMargin: {
      marginHorizontal: 8
    },
    healthCareCaption: {
      alignSelf: 'center', 
      padding: 5
    },
    buttonText: {
      color: '#000000',
        fontSize: 18, 
        fontWeight: '300',
    },
    swiperEntryContentContainer: {
      marginVertical: 10, flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center'
    },
    swiperEntryContentText: {
      fontFamily: 'Avenir', textAlign: 'center', color: 'white'
    },
    sectionHeaderText: {
      fontSize: 16,
      padding: 10,
      fontFamily: 'Avenir-Heavy',
      color: 'white'
    }
  });

  /*
    Trainers should go through their own spaces first
    

  */