import React, { useState } from 'react'

import {
    Button as NativeButton, 
    View, 
    Text, 
    Modal, 
    Image, 
    StyleSheet,
    SafeAreaView,
} from 'react-native';

 

import { 
Divider
} from 'react-native-paper';
import EditBioModal from '../profile/settings/modal/EditBioModal';
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize'

function InviteFriendsModal(props) {
    const [editBioModalIsVisible, setEditBioModalVisible] = useState(false)

    return (
        <Modal visible={props.isVisible} animated={true} presentationStyle="fullScreen" style={{flex: 1, backgroundColor: '#FFFFFF'}}>
            <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
               <View style={{padding: 20, alignItems: 'center', justifyContent: 'space-evenly'}}>
               <Text style={{  fontSize: RFValue(15), paddingVertical: 10, fontWeight: '300'}}>
                    Getting started
                </Text>

                <Text style={{color: 'rgb(28, 28, 30)' , fontSize: RFValue(12)}}>
                    Gathering partners to start your fitness journey or managing your client list?  Let us help you get started.
                </Text>
               </View>

               <View style={{flex: 1, marginHorizontal: 10}}>
                    {
                        props.showGettingStarted == true ?
                        <Divider style={{marginVertical: 10}}/>
                        :
                        null
                    }
                   
                    {
                        props.showGettingStarted == true ?
                         <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-start'}}>
  
                              <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center'}}>
                              <Image source={require('../../images/checkmark-icon.png')} style={{margin: 5, width: 30, height: 30}} />
                              <Text style={{fontSize: RFValue(13), width: '80%', fontWeight: '400'}}>
                                      <Text>
                                      Whether you are looking for a personal trainer or looking to start training.
                                      </Text>
                                      <Text>
                                          {" "}
                                      </Text>
                                      <Text style={{color: 'rgba(30,136,229 ,1)'}} onPress={() => setEditBioModalVisible(true)}>
                                      Setup your bio.
                                      </Text>
                                       
                                  </Text>
                              </View>
                         </View>
                     :
                     null
                    } 
               </View>

                   <NativeButton title="Complete" onPress={() => props.closeModalMethod()} />
              
   
              {/* Edit Bio Modal */}
             <EditBioModal isVisible={editBioModalIsVisible} closeModalMethod={() => setEditBioModalVisible(false)} />
            </SafeAreaView>
        </Modal>
    )
}

export default InviteFriendsModal