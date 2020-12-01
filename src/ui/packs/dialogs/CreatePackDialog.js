import React, { useState, useEffect, createRef} from 'react';

import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    ScrollView,
    SafeAreaView,
TextInput,
    TouchableWithoutFeedback
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather'
import { useSelector } from 'react-redux';

import RBSheet from 'react-native-raw-bottom-sheet';
import {Avatar, SearchBar, Input} from 'react-native-elements';
import { Dialog, Divider, Button, Caption } from 'react-native-paper';
import LupaController from '../../../controller/lupa/LupaController';
import LOG from '../../../common/Logger';
import { getLupaProgramInformationStructure } from '../../../model/data_structures/programs/program_structures';

const CreatePackDialog = React.forwardRef(({}, ref) => {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const currUserData = useSelector(state => {
        return state.Users.currUserData
    });

  const [forceUpdate, setForceUpdate] = useState(false);
const [searchValue, setSearchValue] = useState("")
    const [usersToShare, setUsersToShare] = useState([]);
    const [usersUUIDToShare, setUsersUUIDToShare] = useState([]);
    const [currUserFollowers, setCurrUserFollowers] = useState([]);
    const [programIsAttached, setProgramIsAttached] = useState(false);
    const [programAttached, setProgramAttached] = useState(getLupaProgramInformationStructure());
    const [sheetIsOpen, setSheetIsOpen] = useState(false);
    const [shouldShowMoreOptions, setShowMoreOptions] = useState(false);
    const [rbSheetHeight, setRBSheetHeight] = useState(350)
    const [packName, setPackName] = useState("");
    const packNameTextInput = createRef();

    const onOpen = () => {
        setSheetIsOpen(true)
    }

    const onClose = () => {
        setSheetIsOpen(false)
    }

    const getRBSheetHeight = () => {
        if (shouldShowMoreOptions == false) {
            return 500
        } else {
            return 850
        }
    }

    const handleMoreOptions = () => {
        if (shouldShowMoreOptions == false) {
            setShowMoreOptions(true);
            setRBSheetHeight(420)
            ref.current.open()
        } else {
            setShowMoreOptions(false)
            setRBSheetHeight(350)
            ref.current.open();
        }
    }

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

    const renderUserAvatars = () => {
        return currUserFollowers.map((user, index, arr) => {
          if (usersUUIDToShare.includes(user.user_uuid)) {
            return (
              <TouchableWithoutFeedback key={user.user_uuid} onPress={() => handleAvatarOnPress(user)}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Avatar source={{uri: user.photo_url}} rounded size={50} containerStyle={{borderWidth: 2, padding: 3, borderColor: '#1089ff'}} icon={() => <FeatherIcon name="user" />} />
              <Text style={{padding: 10, fontSize: 12, fontFamily: 'Avenir-Roman'}}>
                {user.display_name}
              </Text>
              </View>
              </TouchableWithoutFeedback>
            )
          } else {
            return (
              <TouchableWithoutFeedback onPress={() => handleAvatarOnPress(user)}>
                 <View style={{alignItems: 'center', justifyContent: 'center'}}>
                 <Avatar source={{uri: user.photo_url}} rounded size={50} icon={() => <FeatherIcon name="user" />} />
                 <Text style={{padding: 10, fontSize: 12, fontFamily: 'Avenir-Roman'}}>
                   {user.display_name}
                 </Text>
                 </View>
                 </TouchableWithoutFeedback>
            )
          }
        })
      }

      useEffect(() => {
        async function fetchFollowers () {
          if (typeof(currUserData.followers) === 'undefined') {
            setCurrUserFollowers([])
            return;
          }
    
          await LUPA_CONTROLLER_INSTANCE.getUserInformationFromArray(currUserData.followers)
          .then(result => {
            setCurrUserFollowers(result);
          }).catch(error => {
            setCurrUserFollowers([])
          })
        }
        
        LOG('CreatePackDialog.js', 'Running useEffect.')
        if (packNameTextInput.current) {
          packNameTextInput.current.focus()
        }
        fetchFollowers()
      }, []);

    return (
        <RBSheet 
        ref={ref}
        height={rbSheetHeight}
        customStyles={{
            container: {
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20
            }
        }}
        onOpen={onOpen}
        onClose={onClose}
        >
            <View style={styles.content}>
              <View style={{width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10}}>
                  <Text style={{fontSize: 15, fontFamily: 'Avenir-Heavy'}}>
                      New Pack
                  </Text>

                       
                <Button icon={() => <FeatherIcon name={shouldShowMoreOptions == false ? 'chevron-down' : 'chevron-up'}/>} color="#1089ff" onPress={handleMoreOptions} uppercase={false} mode="text">
                        More Options
                    </Button>
              </View>
                <Divider />
                <View style={{marginVertical: 10}}>
        <Input ref={packNameTextInput} value={packName} onChangeText={text => setPackName(text)} inputStyle={styles.inputStyle} rightIcon={() => <FeatherIcon name="check" color="green" />} placeholder="Name your pack" placeholderTextColor="#212121" inputContainerStyle={{borderBottomWidth: 0}} style={{paddingVertical: 10, width: Dimensions.get('window').width - 20, alignSelf: 'center'}} />
        </View>

        <Divider style={{height: 12, backgroundColor: 'rgb(245, 246, 249)'}} />

                <View>
                <SearchBar
                placeholder="Invite Friends"
                placeholderTextColor="#212121"
                value={searchValue}
                inputStyle={styles.inputStyle}
                platform="ios"
                containerStyle={{ backgroundColor: 'white', borderColor: 'white' }}
                inputContainerStyle={{ borderColor: 'white', backgroundColor: 'rgb(245, 246, 249)' }}
                searchIcon={() => <FeatherIcon name="search" color="black" size={15} />}/>

            <ScrollView horizontal contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}>
              {renderUserAvatars()}
            </ScrollView>
          </View>

          <Button uppercase={false} mode="contained" color="#1089ff" theme={{roundness: 12}} style={{ elevation: 0, marginHorizontal: 20, marginVertical: 10, alignSelf: 'center'}} contentStyle={{width: Dimensions.get('window').width - 20, height: 45}}>
              Create Pack
          </Button>

          <Divider />
          <View style={{}}>
              <View style={{alignItems: 'flex-start'}}>
              <Button style={{marginVertical: 3}} contentStyle={{height: 40}} icon={() => <FeatherIcon name="airplay" color="#1089ff"/>} uppercase={false} color="#1089ff">
                  Attach a program
              </Button>
              <Caption style={{paddingLeft: 12}}>
                  Add a program for you and your friends to progress
              </Caption>
              </View>

          </View>


            </View>
            <SafeAreaView />
        </RBSheet>
    )
});

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    inputStyle: {
        fontSize: 15, fontFamily: 'Avenir-Light'
    
      },
})

export default CreatePackDialog;