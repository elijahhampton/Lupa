
import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Slider,
  Modal as NativeModal,
  TouchableWithoutFeedback,
  Dimensions,
  ImageBackground,
} from 'react-native';
 
import {
    Surface,
    Modal,
    Provider,
    Portal,
    Button,
} from 'react-native-paper';

// eslint-disable-next-line import/no-unresolved
import { RNCamera } from 'react-native-camera';

import { Video } from 'expo-av'

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import FeatherIcon from 'react-native-vector-icons/Feather'

import LupaController from '../../../../../controller/lupa/LupaController';
import { Constants } from 'react-native-unimodules';
import FullScreenLoadingIndicator from '../../../../common/FullScreenLoadingIndicator';

class VideoPreview extends React.Component {
  constructor(props) {
    super(props)

    this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    this.state = {
      showLoadingIndicator: false
    }
  }

  saveVideo = async () => {
    let newURI = "";
    try {
    this.setState({ showLoadingIndicator: true });
    
    switch (this.props.outlet) {
      case 'CreateProgram':
        newURI = await this.LUPA_CONTROLLER_INSTANCE.saveProgramWorkoutGraphic(this.props.currWorkoutPressed, 
        this.props.currProgramUUID, 'VIDEO', this.props.videoSrcProps);
        await this.props.captureURI(newURI, "VIDEO");

        break;
      case 'CreateNewPost':
        newURI = await this.LUPA_CONTROLLER_INSTANCE.saveVlogMedia(this.props.videoSrcProps);
        await this.props.captureURI(newURI, "VIDEO");
        break;
      default:
       // alert('ummm')
    }

    this.setState({ showLoadingIndicator: false });
    this.props.closeVideoPreview();
    this.props.closeMainModal()
    
    } catch(error) {
    
    }
  }

  saveImage = async () => {
    let newURI = "";
    try {
    this.setState({ showLoadingIndicator: true });
    
    switch (this.props.outlet) {
      case 'CreateProgram':
        newURI = await this.LUPA_CONTROLLER_INSTANCE.saveProgramWorkoutGraphic(this.props.currWorkoutPressed, 
        this.props.currProgramUUID, 'IMAGE', this.props.videoSrcProps);
        await this.props.captureURI(newURI, "IMAGE");
        break;
      case 'CreateNewPost':
        newURI = await this.LUPA_CONTROLLER_INSTANCE.saveVlogMedia(this.props.videoSrcProps);
        await this.props.captureURI(newURI, "IMAGE");
        break;
      default:
       // alert('ummm')
    }

    this.setState({ showLoadingIndicator: false });
    this.props.closeVideoPreview();
    this.props.closeMainModal()
    
    } catch(error) {
    
    }
  }

  render() {
    return (
      <NativeModal visible={this.props.isVisible} 
        presentationStyle="fullScreen" 
        style={{flex: 1, backgroundColor: 'red'}}
        animated={true}
        animationType="slide">
                          <View style={{flex: 1, backgroundColor: 'transparent'}}>
                            {
                              this.props.mediaCaptureType  == 'VIDEO' ?
                              <Video
                              source={{ uri: this.props.videoSrcProps }}
                              rate={1.0}
                              volume={10}
                              isMuted={false}
                              resizeMode="cover"
                              shouldPlay={true}
                              isLooping={true}
                              style={{flex: 1}}
                              
                          />
                          :
                          <ImageBackground style={{flex: 1, backgroundColor: 'blue'}} source={{uri: this.props.videoSrcProps }} />
                            }

<View style={{padding: 15, flexDirection: 'row', alignItems: 'center', backgroundColor: 'black', width: Dimensions.get('window').width, height: 'auto', justifyContent: 'space-evenly'}}>

<Button color="#FFFFFF" mode="text" onPress={() => this.props.closeVideoPreview()} style={{margin: 15}}>
      Retry
</Button>

{
  this.props.mediaCaptureType == 'VIDEO' ?
  <Button color="#FFFFFF" mode="text" onPress={() => this.saveVideo()} style={{margin: 15}}>
      Save V
</Button>
:
<Button color="#FFFFFF" mode="text" onPress={() => this.saveImage()} style={{margin: 15}}>
      Save
</Button>
}

</View>
                          </View>
                          <FullScreenLoadingIndicator isVisible={this.state.showLoadingIndicator} />
        </NativeModal>
    )
  }
}

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

const landmarkSize = 2;

export default class CameraScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      flash: 'off',
      zoom: 0,
      autoFocus: 'on',
      autoFocusPoint: {
        normalized: { x: 0.5, y: 0.5 }, // normalized values required for autoFocusPointOfInterest
        drawRectPosition: {
          x: Dimensions.get('window').width * 0.5 - 32,
          y: Dimensions.get('window').height * 0.5 - 32,
        },
      },
      depth: 0,
      type: 'back',
      whiteBalance: 'auto',
      ratio: '16:9',
      recordOptions: {
        mute: true,
       // maxDuration: 20,
        quality: RNCamera.Constants.VideoQuality['288p'],
        
      },
      isRecording: false,
      canDetectFaces: false,
      canDetectText: false,
      canDetectBarcode: false,
      faces: [],
      textBlocks: [],
      barcodes: [],
      showVideoPrev: false,
      currVideo: "",
    };
  }

  toggleFacing() {
    this.setState({
      type: this.state.type === 'back' ? 'front' : 'back',
    });
  }

  toggleFlash() {
    this.setState({
      flash: flashModeOrder[this.state.flash],
    });
  }

  toggleWB() {
    this.setState({
      whiteBalance: wbOrder[this.state.whiteBalance],
    });
  }

  toggleFocus() {
    this.setState({
      autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
    });
  }

  touchToFocus(event) {
    const { pageX, pageY } = event.nativeEvent;
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const isPortrait = screenHeight > screenWidth;

    let x = pageX / screenWidth;
    let y = pageY / screenHeight;
    // Coordinate transform for portrait. See autoFocusPointOfInterest in docs for more info
    if (isPortrait) {
      x = pageY / screenHeight;
      y = -(pageX / screenWidth) + 1;
    }

    this.setState({
      autoFocusPoint: {
        normalized: { x, y },
        drawRectPosition: { x: pageX, y: pageY },
      },
    });
  }

  zoomOut() {
    this.setState({
      zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
    });
  }

  zoomIn() {
    this.setState({
      zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
    });
  }

  setFocusDepth(depth) {
    this.setState({
      depth,
    });
  }

  takePicture = async () => {
    if (this.camera) {
      const data = await this.camera.takePictureAsync();
      console.warn('takePicture ', data);
    }
  };

  takeVideo = async () => {
    const { isRecording } = this.state;
    if (this.camera && !isRecording) {
      try {
        const promise = this.camera.recordAsync(this.state.recordOptions);

        this.setState({ isRecording: true });

        if (promise)
        {
          const data = await promise;
          await this.setState({
            currVideo: data.uri
        })
        }

      } catch (e) {
   
      }
    }
  };

  toggle = value => () => this.setState(prevState => ({ [value]: !prevState[value] }));

  renderRecording = () => {
    const backgroundColor = this.state.isRecording ? 'darkred' : 'transparent';
    const videoAction = this.state.isRecording ? this.stopVideo : this.takeVideo
    const pictureAction = this.takePicture

    if (this.props.mediaCaptureType == 'VIDEO')
    {
      return (
        <TouchableWithoutFeedback onPress={videoAction} style={{borderRadius: 60}}>
          <View style={{alignSelf: 'center', width: 60, height: 60, borderRadius: 60, borderWidth: 3, borderColor: '#FFFFFF', padding: 20, backgroundColor: backgroundColor}} />
        </TouchableWithoutFeedback>
      );
    }
    else if ( this.props.mediaCaptureType == 'IMAGE')
    {
      return (
      <TouchableWithoutFeedback onPress={pictureAction} style={{borderRadius: 60}}>
          <View style={{alignSelf: 'center', width: 60, height: 60, borderRadius: 60, borderWidth: 3, borderColor: '#FFFFFF', padding: 20, backgroundColor: backgroundColor}} />
        </TouchableWithoutFeedback>    
      )
    }
    else {
      return (
        <TouchableWithoutFeedback onPress={videoAction} style={{borderRadius: 60}}>
        <View style={{alignSelf: 'center', width: 60, height: 60, borderRadius: 60, borderWidth: 3, borderColor: '#FFFFFF', padding: 20, backgroundColor: backgroundColor}} />
      </TouchableWithoutFeedback>
      )
    }

  };

  stopVideo = async () => {
    await this.camera.stopRecording();

    await this.setState({ isRecording: false });
    this.setState({ showVideoPrev: true })
  };

  showVideoPrev = () => {
    this.setState({ showVideoPrev: true})
  }

  closeVideoPrev = () => {
    this.setState({ showVideoPrev: false })
  }

  renderCamera() {
    const drawFocusRingPosition = {
      top: this.state.autoFocusPoint.drawRectPosition.y - 32,
      left: this.state.autoFocusPoint.drawRectPosition.x - 32,
    };

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
              <Surface style={{flex: 1, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, elevation: 10}}>
              <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 1, 
          justifyContent: 'space-between',
          borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        }}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        autoFocusPointOfInterest={this.state.autoFocusPoint.normalized}
        zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        focusDepth={this.state.depth}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      >

        <View style={StyleSheet.absoluteFill}>
          <View style={[styles.autoFocusBox, drawFocusRingPosition]} />
          <TouchableWithoutFeedback onPress={this.touchToFocus.bind(this)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
        </View>

        <View style={{width: Dimensions.get('window').width,
         //   height: 200,
            backgroundColor: 'transparent',   
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 10,}}>
          <FeatherIcon name="x" size={25} color="#FFFFFF" onPress={() => this.props.navigation.pop()} />

          <FeatherIcon name="zap" size={25} color="#FFFFFF" onPress={this.toggleFlash.bind(this)} />
        </View>


       <View
          style={{
            width: Dimensions.get('window').width,
         //   height: 200,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            bottom: 0,
            marginBottom: 5,
          }}
        >

          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <MaterialIcon name="restore" size={30} color="white" onPress={this.toggleFacing.bind(this)} />
          </View>

          <View style={{flex: 2}}>
          {this.renderRecording()}
          </View>

          <View style={{flexDirection: 'row',  alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <TouchableOpacity
              style={[styles.flipButton, { alignSelf: 'flex-end' }]}
              onPress={this.zoomIn.bind(this)}
            >
              <Text style={styles.flipText}> + </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.flipButton, { alignSelf: 'flex-end' }]}
              onPress={this.zoomOut.bind(this)}
            >
              <Text style={styles.flipText}> - </Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </RNCamera>
</Surface>
{
  this.props.route.params.outlet === 'CreateProgram' ?
  <View style={{flex: 0.15, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
  <Text style={{color: 'white', fontSize: 16,  }}>
      Perform your best two reps.  For the best capture include your entire body.
  </Text>
  </View>
  :
  null
}
      </SafeAreaView>
    );
  }

  captureURI = (uri, type) => {
    this.props.route.params.captureURI(uri, type)
  }

  render() {
    return  (
      <>
        <View style={styles.container}>{this.renderCamera()}</View>
        <VideoPreview 
        isVisible={this.state.showVideoPrev} 
        videoSrcProps={this.state.currVideo} 
        closeVideoPreview={() => this.setState({ showVideoPrev: false })} 
        currWorkoutPressed={typeof(this.props.route.params.currWorkoutPressed) == 'undefined' ? '' : this.props.route.params.currWorkoutPressed}
        currProgramUUID={typeof(this.props.route.params.currProgramUUID) == 'undefined' ? '' : this.props.route.params.currProgramUUID}
        closeMainModal={(path) => this.props.navigation.pop()}
        captureURI={(uri, type) => this.captureURI(uri,type)}
        mediaCaptureType={this.props.route.params.mediaCaptureType}
        outlet={this.props.route.params.outlet}
       />
       </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#000',
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    margin: 10,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoFocusBox: {
    position: 'absolute',
    height: 64,
    width: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    opacity: 0.4,
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  },
  picButton: {
    backgroundColor: 'darkseagreen',
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#FFD700',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: 'absolute',
    backgroundColor: 'red',
  },
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  text: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#F00',
    justifyContent: 'center',
  },
  textBlock: {
    color: '#F00',
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },

});