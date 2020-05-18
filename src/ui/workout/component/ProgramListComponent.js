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
    
    getProgramImage = () => {
        try {
            return <Image style={{width: '100%', height: '100%', borderRadius:16 }} source={{uri: this.props.programData.program_image}} />
        } catch(err) {
            return <View style={{width: '100%', height: '100%', borderRadius: 16, backgroundColor: '#212121' }}>

            </View>
        }
    }
    render() {
        const programData = this.props.programData;
        return (
                <View>
                    <TouchableHighlight>
                    <Surface style={{elevation: 0, width: Dimensions.get('screen').width /1.3, height: 200, borderRadius: 16, margin: 15}}>
                    {
                        this.getProgramImage()
                    }
                </Surface>
                    </TouchableHighlight>

                <View style={{marginLeft: 15, width: Dimensions.get('screen').width /1.3}}>
                    <View style={{padding: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Text style={{fontFamily: 'ARSMaquettePro-Medium'}}>
                        {programData.program_name}
                    </Text>
                    <Caption>
                        {programData.program_slots} spots available
                    </Caption>
                    </View>
                    <Text style={{fontWeight: '300', fontSize: 12}}>
                   {programData.program_description}
                    </Text>

                    <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10, width: 120, alignSelf: 'flex-end'}}>
                        {
                            programData.length == undefined ?
                            null
                            :
                            programData.program_tags.map((tag, index, arr)=> {
                                return (
                                    <Caption key={index} >
                                        {tag}
                                    </Caption>
                                )
                            })
                        }
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