import React, { useState } from 'react';

import {
    Modal,
    View,
    TextInput,
    Text,
    SafeAreaView,
} from 'react-native';
import { Divider, Appbar, FAB, Caption, Menu, Provider } from 'react-native-paper';
import ThinFeatherIcon from 'react-native-feather1s'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

function SchedulerModal({ closeModal, isVisible }) {
    const [addedTimes, setAddedTimes] = useState([]);

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [startTimePeriod, setStartTimePeriod] = useState("AM")
    const [endTimePeriod, setEndTimePeriod] = useState("PM")

    const [startTimeMenuVisible, setStartTimeMenuVisible] = useState(false);
    const [endTimeMenuVisible, setEndTimeMenuVisible] = useState(false);

    const openStartTimeMenu = () => setStartTimeMenuVisible(true);
  
    const closeStartTimeMenu = () => setStartTimeMenuVisible(false);

    const openEndTimeMenu = () => setEndTimeMenuVisible(true);
  
    const closeEndTimeMenu = () => setEndTimeMenuVisible(false);
  

    const renderTimeRow = () => {
        return null;
    }

    return (
        <Modal presentationStyle="fullScreen" visible={isVisible} animated={true} animationType="slide">
            <Appbar.Header style={{backgroundColor: '#FFFFFF'}}>
                <Appbar.Action icon={() => <ThinFeatherIcon name="arrow-left" size={20} />}  onPress={closeModal}/>
                <Appbar.Content title="Edit Hours" />
            </Appbar.Header>
            <ScrollView contentContainerStyle={{marginTop: 10}}>
                {addedTimes.length === 0 ? <Caption style={{marginVertical: 10, alignSelf: 'center'}}>You don't have any times added for the days.</Caption> : null}
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{}}>
            <Text style={{paddingVertical: 5}}>
              Start time
            </Text>
            <TextInput returnKeyLabel="done" returnKeyType="done" keyboardType="numeric" maxLength={4} value={startTime.length == 1 ? startTime + ":" : startTime} onChangeText={text => setStartTime(text)} placeholder="8:00" style={{borderWidth: 1, padding: 10, borderRadius: 3, borderColor: '#EEEEEE'}} />
            </View>

   
            <Menu
          visible={startTimeMenuVisible}
          onDismiss={closeStartTimeMenu}
          anchor={ 
          <TouchableOpacity onPress={openStartTimeMenu}>
              <Text  style={{margin: 10, fontSize: 15}}>
          AM
          <FeatherIcon name="chevron-down" size={12} />
        </Text>
        </TouchableOpacity>}>
          <Menu.Item onPress={() => setStartTimePeriod("AM")} title="AM" />
          <Menu.Item onPress={() => setStartTimePeriod("AM")} title="PM" />
        </Menu> 
   
           
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{}}>
            <Text style={{paddingVertical: 5}}>
              Start time
            </Text>
            <TextInput returnKeyLabel="done" returnKeyType="done" keyboardType="numeric" maxLength={4} value={endTime.lengtj === 1 ? endTime + ":" : endTime} onChangeText={text => setEndTime(text)} placeholder="8:00" style={{borderWidth: 1, padding: 10, borderRadius: 3, borderColor: '#EEEEEE'}} />
            </View>
    
            <Menu
          visible={endTimeMenuVisible}
          onDismiss={closeEndTimeMenu}
          anchor={ 
          <TouchableOpacity onPress={openEndTimeMenu}>
              <Text  style={{margin: 10, fontSize: 15}}>
          AM
          <FeatherIcon name="chevron-down" size={12} />
        </Text>
        </TouchableOpacity>}>
          <Menu.Item onPress={() => setEndTimePeriod("AM")} title="AM" />
          <Menu.Item onPress={() => setEndTimePeriod("PM")} title="PM" />
        </Menu>
          </View>


          <ThinFeatherIcon name="check"  size={20} />
         
</View>
</ScrollView>
<FAB onPress={closeModal} icon="check" style={{position: 'absolute', bottom: 0, right: 0, margin: 16, backgroundColor: '#1089ff'}} />
      
      </Modal>
    )
}

export default SchedulerModal;