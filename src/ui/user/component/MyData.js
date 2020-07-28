import React from 'react'
import { Appbar, Surface} from 'react-native-paper'
import { SafeAreaView, Dimensions, StyleSheet, Text, ScrollView} from 'react-native'
import {LineChart} from 'react-native-chart-kit'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'

function MyData(props) {
    const navigation = useNavigation()

    return (
        <SafeAreaView style={styles.container}>
                    <Appbar.Header style={styles.appbar}>
                    <Appbar.BackAction color="#212121" size={20} onPress={() => navigation.pop()} icon={() => <FeatherIcon name="arrow-left" color="#212121" />} />
        <Appbar.Content title="My Data" />
</Appbar.Header>
            <ScrollView>
            <Surface style={{marginVertical: 10, elevation: 3, borderRadius: 15, backgroundColor: '#1089ff', width: Dimensions.get('window').width - 20, alignSelf: 'center'}}>
<Text style={{fontSize: 20, color: '#E5E5E5', padding: 5}}> Sessions </Text>
<LineChart
data={{
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100
      ]
    }
  ]
}}
width={Dimensions.get("window").width - 20} // from react-native
height={120}
yAxisLabel="$"
yAxisSuffix="k"
yAxisInterval={1} // optional, defaults to 1
chartConfig={{
  backgroundColor: "#1089ff",
  backgroundGradientFrom: "#1089ff",
  backgroundGradientTo: "#1089ff",
  decimalPlaces: 2, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 15,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726"
  }
}}
bezier
style={{
  borderRadius: 15,
}}
/>
</Surface>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: '#FFFFFF',
        elevation: 0,
    },
    container: {
        backgroundColor: '#FFFFFF',
        flex: 1,
    }
})

export default MyData;