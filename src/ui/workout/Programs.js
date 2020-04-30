// cohort to invite
// brainstorm - one player mode and landing to help you learn more about yourself
// aha moment

import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    ImageBackground,
    Image,
} from 'react-native';

import {
    Appbar,
    Surface,
    Chip,
    FAB,
} from 'react-native-paper';

import { withNavigation } from 'react-navigation';

import { connect } from 'react-redux'

import FeatherIcon from 'react-native-vector-icons/Feather'

import LiveWorkout from '../workout/modal/LiveWorkout'
import { ScrollView } from 'react-native-gesture-handler';
import Carousel from 'react-native-snap-carousel';

const SamplePhotoOne = require('../images/programs/sample_photo_one.jpg')
const SamplePhotoTwo = require('../images/programs/sample_photo_two.jpg')
const SamplePhotoThree = require('../images/programs/sample_photo_three.jpg')

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

class Programs extends React.Component {
    constructor(props) {
        super(props);

        this.props.disableSwipe();

        this.state = {
            open: false, 
            showLiveWorkout: false,
            lupaProgramsHeight: 0,
            samplePhotoData: [
                SamplePhotoOne,
                SamplePhotoTwo,
                SamplePhotoThree
            ]
        }

    }

    async componentDidMount() {
        await this.props.disableSwipe();
    }

    componentWillUnmount() {
        this.props.enableSwipe();
    }

    //move inside of program component
    handleShowLiveWorkout = async (program) => {
        await this.setState({ showLiveWorkout: true })
    }

    //move inside of program component
    handleCloseLiveWorkout = () => {
         this.setState({ showLiveWorkout: false })
    }

    _onStateChange = ({ open }) => this.setState({ open: !this.state.open });

    _renderItem = ({item, index}) => {
        return (
            <>
                                <Surface style={{alignItems: 'center', justifyContent: 'center', borderRadius: 15, elevation: 15, margin: 5, height: this.state.lupaProgramsHeight / 1.5}}>
                                    <Image resizeMode="cover" source={item} style={{width: '100%', height: '100%', borderRadius: 15}} />
                                    <Text style={{fontFamily: 'ars-maquette-pro', position: 'absolute', alignSelf: 'center', fontWeight: 'bold', fontSize: 35, color: 'white'}}>
                                        Coming Soon
                                    </Text>
                                    <Chip style={{position: 'absolute', top: 0, right: 0, margin: 14, backgroundColor: '#2196F3'}}>
                                        Curated By Lupa
                                    </Chip>
                                </Surface>

                                <Text style={{alignSelf: 'center', fontFamily: 'ars-maquette-pro', color: 'white'}}>
                                    Aura Program
                                </Text>

                                <View style={{marginTop: 50, alignSelf: 'center', width: '80%', alignItems: 'center', justifyContent: 'center'}}>
                        <FAB
    style={{position: 'absolute', alignSelf: 'flex-end', backgroundColor: "#212121"}}
    small
    icon="edit"
    color="white"
    onPress={() => console.log('Pressed')}
  />

<FAB
    style={{position: 'absolute', alignSelf: 'center', backgroundColor: "#FFFFFF"}}
    icon={() => <FeatherIcon name="activity" size={25} />}
    onPress={() => console.log('Pressed')}
    color="#212121"
  />

<FAB
    style={{position: 'absolute', alignSelf: 'flex-start', backgroundColor: "#212121"}}
    small
    icon="share"
    onPress={() => console.log('Pressed')}
  />
                        </View>
                                </>
        );
    }
 

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#212121'}}>
                <Appbar.Header style={{backgroundColor: '#212121', elevation: 0}}>
                </Appbar.Header>

                <View style={{flex: 0.3}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}} horizontal={true} shouldRasterizeIOS={true}>
                        <View 
                        style={{
                            margin: 5, 
                            borderRadius: 10, 
                            borderWidth: 1, 
                            borderColor: 'white', 
                            backgroundColor: 'white', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            padding: 20, 
                            width: Dimensions.get('window').width / 2 - 35, 
                        }}
                        >
                            <Text style={{
                            height: 'auto',
                            fontWeight: 'bold', 
                            fontSize: 13, 
                            fontFamily: 'ARSMaquettePro-Regular',
                            color: '#212121',}}>
                            Lupa Programs
                            </Text>
                        </View>

                        <View 
                        style={{
                            margin: 5, 
                            borderRadius: 10, 
                            borderWidth: 1, 
                            borderColor: 'white', 
                            backgroundColor: 'white', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            padding: 20, 
                            width: Dimensions.get('window').width / 2 - 35, 
                            height: 'auto', 
                        }}
                        >
                            <Text style={{
                            color: '#212121', 
                            fontWeight: 'bold', 
                            fontSize: 13, 
                            fontFamily: 'ARSMaquettePro-Regular',}}>
                            My Programs
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{flex: 4}} onLayout={event => this.setState({ lupaProgramsHeight: event.nativeEvent.layout.height})}>
                    <ScrollView>
                    <Text style={{fontFamily: 'ARSMaquettePro-Black', margin: 5, padding: 5, alignSelf: 'flex-end', color: 'white', fontWeight: 'bold', fontSize: 30}}>
                        Curated By Lupa
                    </Text>

                    <View style={{width: Dimensions.get('window').width, height: this.state.lupaProgramsHeight}}>
                        <Carousel 
                        data={this.state.samplePhotoData}
                        itemWidth={Dimensions.get('window').width - 100}
                        sliderWidth={Dimensions.get('window').width}
                        scrollEnabled={false}
                        firstItem={1}
                        renderItem={this._renderItem}
                        />
                    </View>
                    </ScrollView>
                </View>

                <FAB.Group
             open={this.state.open}
             icon={this.state.open ? 'list' : 'menu'}
             actions={[
               { icon: 'group', label: 'Sessions', onPress: () => this.props.navigation.navigate('SearchView'), color: '#212121', style: {backgroundColor: '#FFFFFF', color: '#212121'}},
               { icon: 'fitness-center', label: 'Build a Workout', onPress: () => this.props.navigation.navigate('BuildAWorkout'), color: '#212121', style: {backgroundColor: '#FFFFFF', color: '#212121'}},
             ]}
             onPress={() => {
               this.setState({ open: !this.state.open})
             }}
             onStateChange={this._onStateChange}
             style={{position: 'absolute'}}
             fabStyle={{backgroundColor: "white"}}
           />
            </SafeAreaView>
        )
    }
}

export default connect(mapStateToProps)(withNavigation(Programs));