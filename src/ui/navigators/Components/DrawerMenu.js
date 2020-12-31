import React, {useEffect, useState} from 'react';
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
  TouchableRipple,
  Button,
  Divider,
  Appbar,
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
const ICON_SIZE = 20;
const ICON_COLOR = "rgb(203, 209, 214)"

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
  const [lupaStoreState, setLupaStoreState] = useState(getLupaStoreState())
  const navigation = useNavigation()
  const dispatch = useDispatch();
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

 
   return () => Fire.shared.off()
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
                          <Text style={{fontSize: 16, fontFamily: 'Avenir-Heavy'}}>
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
          <View style={{flex: 1}}>
         
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
</View>
   
      )
  } else {
      return (
          <ScrollView  shouldRasterizeIOS={true} showsHorizontalScrollIndicator={false}>
          {renderAvatarList()}
</ScrollView>
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

  const renderPacksDisplay = () => {
 

    const lupaStorePacks = getLupaStoreState().Packs.currUserPacksData;

    if (lupaStorePacks.length === 0) {
      return (
        <View style={{paddingLeft: 30, flexDirection: 'row', alignItems: 'center'}}>
  <Caption style={{paddingHorizontal: 20}}>
          Click the globe icon on the explore page to create a pack.
        </Caption>
        </View>
      
      )
    }

    return lupaStorePacks.map(pack => {
      return (
        <TouchableWithoutFeedback onPress={() => navigateToPackChat(pack.uid)}>
        <View style={{height: 'auto', marginLeft: 50, marginVertical: 5}}>
        <Text style={{fontSize: 13, fontFamily: 'Avenir', fontWeight: '500'}}> 
        {pack.name}
        </Text>
      </View>
      </TouchableWithoutFeedback>
      )
    })
  }

  return (
    <View style={styles.container}>
    <SafeAreaView
      style={styles.safeAreaView}
      forceInset={{top: 'always', horizontal: 'never'}}>
        <View style={{flex: 1, justifyContent: 'space-between'}}>
<View>
   
      <View style={styles.drawerHeader}>
        <View style={{flexDirection: 'row', alignItems: 'center',}}>
        <Appbar.BackAction />
        <Text style={styles.drawerHeaderText}>
                {currUserData.display_name}
              </Text>
        </View>
             

          <TouchableOpacity onPress={navigateToProfile}>
          <Avatar.Image source={{uri: currUserData.photo_url}} size={40} />
          </TouchableOpacity>

        </View>


      <Divider />

      {renderChatComponent()}

     


       {/* <TouchableOpacity onPress={togglePacksVisibility}>
        <View style={styles.navigationButtonContaner}>
          <DrawerIcon name="globe" color={ICON_COLOR} size={ICON_SIZE} style={styles.iconMargin}/>
          <Text style={styles.buttonText}>
           My Packs
          </Text>
        </View>
        </TouchableOpacity>
        {
          renderPacksDisplay()
        }*/}

        



        </View>

        </View>
    </SafeAreaView>
  </View>
  )
}

export default DrawerMenu;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF'
    },
    safeAreaView: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    drawerHeader: {
      margin: 15, 
      flexDirection: 'row', 
      paddingHorizontal: 10,
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
      fontFamily: 'Avenir-Black'
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
    }
  });

  /*
    Trainers should go through their own spaces first
    

  */