import React from 'react';

import {
    Modal,
    View,
    SafeAreaView,
    Button,
    TouchableOpacity,
    StyleSheet,
    Text,
    Dimensions,
    Slider,
} from 'react-native';

import {
    Divider,
    TextInput,
} from 'react-native-paper';

import Autocomplete from 'react-native-autocomplete-input';

const data = [

]

function WorkoutLogModal(props) {
    return (
        <Modal visible={props.isVisible} presentationStyle="fullScreen" animated={true} animationType="slide">
                            <SafeAreaView style={{flex: 1, height: '100%', padding: 10,}}>
                                <View>
                                <Text style={{padding: 10, fontSize: 22, fontFamily: 'HelveticaNeueMedium'}}>
                Log a workout
            </Text>
            <Text style={{padding: 10, fontSize: 15, fontFamily: 'HelveticaNeueLight'}}>
                Keep track of your workouts and help trainers learn more about your routine
            </Text>
                                </View>
            <Divider style={styles.divider} />
            <View style={{flex: 1, justifyContent: 'space-evenly'}}>
            <Autocomplete
  data={data}
  defaultValue={""}
  onChangeText={text => this.setState({ query: text })}
  renderItem={({ item, i }) => (
    <TouchableOpacity onPress={() => this.setState({ query: item })}>
      <Text>{item}</Text>
    </TouchableOpacity>
  )}
  containerStyle={{marginHorizontal: 20}}
  placeholder="Which workout are you logging?"
  keyboardAppearance="light"
  keyboardType="default"
  returnKeyLabel="done"
  returnKeyType="done"
/>

<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: Dimensions.get('window').width}}>
    <View style={{width: Dimensions.get('window').width / 3.5}}>
        <Text>
            Sets
        </Text>
        <TextInput mode="flat" keyboardType="numeric" keyboardAppearance="light" returnKeyType="done" />
    </View>

    <View style={{width: Dimensions.get('window').width / 3.5}}>
        <Text>
            Reps
        </Text>
        <TextInput mode="flat" keyboardType="numeric" keyboardAppearance="light" returnKeyType="done" />
    </View>
</View>

<View style={{marginHorizontal: 20}}>
    <Text>
        How difficult was this for you?
    </Text>
    <Slider />
</View>
<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
<Button title="Complete" onPress={props.closeModalMethod} />
<Button title="Log Another" onPress={props.closeModalMethod} />
</View>
            </View>
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    divider: {
        marginVertical: 10,
        width: Dimensions.get('window').width
    }
})

export default WorkoutLogModal;