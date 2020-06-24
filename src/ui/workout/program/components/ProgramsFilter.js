import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    ImageBackground,
    Animated,
    Image,
    Button as NativeButton,
    ScrollView,
} from 'react-native';

import {
    Appbar,
    Title,
    Button,
    Surface,
    Chip,
    FAB,
    Caption,
    Searchbar,
} from 'react-native-paper';

import {
    Header,
    Tab,
    Tabs,
} from 'native-base';

import { withNavigation } from 'react-navigation';

import { connect } from 'react-redux'

import FeatherIcon from 'react-native-vector-icons/Feather'

import Carousel from 'react-native-snap-carousel';
import { SearchBar, Rating, Slider, CheckBox, ListItem, Divider, Avatar} from 'react-native-elements';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { BlurView, VibrancyView } from "@react-native-community/blur";
import { Constants } from 'react-native-unimodules';

const list = [
    {
      name: 'Based on Interest',
      subtitle: '0 Selected',
      icon: <MaterialIcon name="label" size={20} color="#FFFFFF"/>
    },
    {
      name: 'Based on Workout Type',
      subtitle: '0 Selected',
      icon: <MaterialIcon name="fitness-center" size={20} color="#FFFFFF" />
    },
  ]

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

class ProgramsFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        console.log('disable swipe');
    }

    componentWillUnmount() {
        console.log('enable swipe');
    }

    render() {
        return (
            <Surface style={{position: 'absolute', backgroundColor: 'transparent', top: 0, width: Dimensions.get('window').width, height: this.props.filterHeight}}>
            <BlurView
style={[StyleSheet.absoluteFillObject, {padding: 10 }]}
blurType='light'
blurAmount={20}
reducedTransparencyFallbackColor="black"
>
                        <SafeAreaView style={{flex: 1, justifyContent: 'space-evenly'}}>
                            <View style={{alignItems: 'center'}}>
                            <SearchBar  
    platform="ios" 
    containerStyle={{backgroundColor: 'transparent', borderColor: '#212121'}} 
    style={{borderColor: '#212121'}} 
    inputContainerStyle={{borderColor: '#212121'}} 
    inputStyle={{borderColor: '#212121'}} 
    placeholder="Enter keywords (san francisco, strength)"
    />
    <Caption style={{color: 'white'}}>
        Enter keywords separated by commas
    </Caption>
                            </View>

                            <View>
                            {
list.map((l, i) => (
<TouchableOpacity>
      <ListItem
key={i}
leftIcon={l.icon}
title={l.name}
subtitle={l.subtitle}
bottomDivider
containerStyle={{
backgroundColor: 'transparent'
}}
titleStyle={styles.filterText}
subtitleStyle={{color: 'white'}}
/>
</TouchableOpacity>
))
}
                            </View>

<View>
<>
<Text style={styles.filterText}>
Adjust programs based on location radius
</Text>
<Slider
                value={0}
                onValueChange={() => console.log('Changing')}
                minimumValue={0}
                maximumValue={500}
                orientation="horizontal"
                thumbTintColor="#2196F3"
            />
            </>
            <>
<Text style={styles.filterText}>
Adjust programs based on participants
</Text>
<Slider
                value={0}
                onValueChange={() => console.log('Changing')}
                minimumValue={0}
                maximumValue={4}
                orientation="horizontal"
                thumbTintColor="#2196F3"
            />
            </>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
<Text style={styles.filterText}>
    Specific to my location (Auburn, United States)
</Text>
<CheckBox
checkedIcon='dot-circle-o'
uncheckedIcon='circle-o'
checked={this.state.checked}
onPress={() => this.setState({ checked: !this.state.checked})}
key="specific-area-checkbox"
/>
</View>
</View>

<View>
<Title style={{color: 'white'}}>
        Programs based on trainer attributes
    </Title>
<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
    <Text style={styles.filterText}>
        Male
    </Text>
    <CheckBox
checkedIcon='dot-circle-o'
uncheckedIcon='circle-o'
checked={this.state.checked}
onPress={() => this.setState({ checked: !this.state.checked})}
key="male"
/>
</View>

<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
    <Text style={styles.filterText}>
        Female
    </Text>
    <CheckBox
checkedIcon='dot-circle-o'
uncheckedIcon='circle-o'
checked={this.state.checked}
onPress={() => this.setState({ checked: !this.state.checked})}
key="female"
/>
</View>
</View>




<View style={{position: 'absolute', bottom: Constants.statusBarHeight, flexDirection: 'row', width: Dimensions.get('window').width, alignItems: 'center', justifyContent: 'space-evenly'}}>
<NativeButton title="Cancel" onPress={this.props.handleCancelButtonOnPress} />
<Button mode="contained" onPress={this.props.handleApplyFilterOnPress} color="#212121">
    Apply
</Button>
</View>


</SafeAreaView>
</BlurView>


</Surface>
        )
    }
}

const styles = StyleSheet.create({
    headerText: {
        fontFamily: 'ARSMaquettePro-Black', 
        margin: 5, 
        padding: 5, 
        alignSelf: 'flex-start', 
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: 25
    },
    filterText: {
        color: '#212121',
        fontFamily: 'ARSMaquettePro-Regular',
        fontSize: 15
    }
})

export default connect(mapStateToProps)(ProgramsFilter)