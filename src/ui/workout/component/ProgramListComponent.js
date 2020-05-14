import React from 'react';

import {
    View,
    Image,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Animated,
    ScrollView,
    Dimensions,
} from 'react-native';

import {
    Surface,
    Caption, 
    Avatar, 
    Colors,
    Button, 
    Card, 
    Title, 
    Paragraph,
    ProgressBar,
    Divider
} from 'react-native-paper';

import { Rating, Button as ElementsButton } from 'react-native-elements';

import { LinearGradient } from 'expo-linear-gradient';

import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import { BlurView, VibrancyView } from "@react-native-community/blur";
import { TouchableHighlight } from 'react-native-gesture-handler';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

function ModalA(props) {
    const programObject = props.programObject;

    return (
        <Modal presentationStyle="fullScreen" visible={false} animationType="fade" animated={true}>
            <View style={{flex: 1, backgroundColor: '#212121'}}>
                <Image source={require('../../images/programs/sample_photo_one.jpg')} style={{width: '100%', height: '100%'}} />
            </View>
            <View style={{flex: 1}}>
        </View>

<Surface style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: 'transparent', elevation: 10, position: 'absolute', width: Dimensions.get('window').width, height: Dimensions.get('window').height / 2 + 120, bottom: 0}}>
            
                <BlurView
          style={{borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: 'transparent', flex: 1, position: 'absolute', bottom: 0, left: 0, right: 0, height: Dimensions.get('window').height / 2 + 120,}}
          blurType="xlight"
          blurAmount={1}
          reducedTransparencyFallbackColor="transparent"
        >
             <LinearGradient style={{borderTopLeftRadius: 50, borderTopRightRadius: 50,position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, height: Dimensions.get('window').height / 2 + 120 }} colors={['transparent', 'transparent', '#FFFFFF']}/>

        </BlurView>
                </Surface>


        </Modal>
    )
}

class ProgramListComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: new Animated.Value(200),
            height: new Animated.Value(360),
            showFullScreen: false,
        }

    }

    showFullScreenProgram = () => {
     this.setState({
            showFullScreen: true,
        });

        Animated.timing(this.state.width, {
            toValue: Dimensions.get('window').width,
            duation:0,
        }).start();

        Animated.timing(this.state.height, {
            toValue: Dimensions.get('window').height,
            duation:0,
        }).start();
    }
 
    render() {
        return (
                <View>
                    <TouchableHighlight>
                    <Surface style={{elevation: 0, width: Dimensions.get('screen').width /1.3, height: 200, borderRadius: 16, margin: 15}}>
                   <Image style={{width: '100%', height: '100%', borderRadius:16 }} source={{uri: 'https://picsum.photos/700'}} />
                </Surface>
                    </TouchableHighlight>

                <View style={{marginLeft: 15, width: Dimensions.get('screen').width /1.3}}>
                    <View style={{padding: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Text style={{fontFamily: 'ARSMaquettePro-Medium'}}>
                        Program Name
                    </Text>
                    <Caption>
                        0 spots available
                    </Caption>
                    </View>
                    <Text style={{fontWeight: '300', fontSize: 12}}>
                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its
                    </Text>

                    <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10, width: 120, justifyContent: 'space-evenly', alignSelf: 'flex-end'}}>
                    <Surface style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, elevation: 4, borderRadius: 5, backgroundColor: '#2196F3'}}>
                                        <MaterialIcon name="fitness-center" size={10} color="#FFFFFF" />
                                        </Surface>
                                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, elevation: 4, borderRadius: 5, backgroundColor: '#2196F3'}}>
                                        <MaterialIcon name="fitness-center" size={10} color="#FFFFFF" />
                                        </Surface>
                                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, elevation: 4, borderRadius: 5, backgroundColor: '#2196F3'}}>
                                        <MaterialIcon name="fitness-center" size={10} color="#FFFFFF" />
                                        </Surface>
                                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, elevation: 4, borderRadius: 5, backgroundColor: '#2196F3'}}>
                                        <MaterialIcon name="fitness-center" size={10} color="#FFFFFF" />
                                        </Surface>
                    </View>
                </View>
                </View>
        )
    }
}

const styles = StyleSheet.create({
    whiteText: {
        color: '#FFFFFF'
    },
    blackText: {
        color: '#212121'
    }
})
export default connect(mapStateToProps)(ProgramListComponent);