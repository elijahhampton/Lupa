
import React, { useState, useRef, createRef, useEffect } from 'react';

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

const VideoPreview = ({ isVisible, closeModal, videoSrcProps, closeVideoPreview,
currWorkoutPressed, currProgramUUID, closeMainModal, captureURI, mediaCaptureType, outlet }) => {
 const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

 const [loadingIndicatorIsVisible, setLoadingIndicatorIsVisible] = useState(false);

 const saveVideo = async () => {
    let newURI = "";
    try {
        setLoadingIndicatorIsVisible(true)
    
    switch (outlet) {
      case 'CreateProgram':
        newURI = await LUPA_CONTROLLER_INSTANCE.saveProgramWorkoutGraphic(currWorkoutPressed, 
        currProgramUUID, 'VIDEO', videoSrcProps);

        currWorkoutPressed.workout_media.media_type = "VIDEO";
        currWorkoutPressed.workout_media.uri = newURI
        await captureURI(newURI, "VIDEO");
        break;
      default:
       // alert('ummm')
    }

    setLoadingIndicatorIsVisible(false);

    closeVideoPreview();
    closeMainModal()
    
    } catch(error) {
    
    }
  }

  return (
    <NativeModal visible={isVisible} 
      presentationStyle="fullScreen" 
      style={{flex: 1, backgroundColor: 'red'}}
      animated={true}
      animationType="slide">
                        <View style={{flex: 1, backgroundColor: 'transparent'}}>
                          {
                            mediaCaptureType  == 'VIDEO' ?
                            <Video
                            source={{ uri: videoSrcProps }}
                            rate={1.0}
                            volume={10}
                            isMuted={false}
                            resizeMode="cover"
                            shouldPlay={true}
                            isLooping={true}
                            style={{flex: 1}}
                            
                        />
                        :
                        <ImageBackground style={{flex: 1, backgroundColor: 'blue'}} source={{uri: videoSrcProps }} />
                          }

<View style={{padding: 15, flexDirection: 'row', alignItems: 'center', backgroundColor: 'black', width: Dimensions.get('window').width, height: 'auto', justifyContent: 'space-evenly'}}>

<Button color="#FFFFFF" mode="text" onPress={() => closeVideoPreview()} style={{margin: 15}}>
    Retry
</Button>


<Button color="#FFFFFF" mode="text" onPress={() => saveVideo()} style={{margin: 15}}>
    Save V
</Button>

</View>
                        </View>
                        <FullScreenLoadingIndicator isVisible={loadingIndicatorIsVisible} />
      </NativeModal>
  )

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

const CameraScreen = ({ isVisible, closeModal, currWorkoutPressed, currProgramUUID, mediaCaptureType, outlet, captureURIProp }) => {
    const [flash, setFlash] = useState('off')
    const [zoom, setZoom] = useState(0)
    const [autoFocus, setAutoFocus] = useState('on')
    const [autoFocusPoint, setAutoFocusPoint] = useState({
        normalized: { x: 0.5, y: 0.5 }, // normalized values required for autoFocusPointOfInterest
        drawRectPosition: {
          x: Dimensions.get('window').width * 0.5 - 32,
          y: Dimensions.get('window').height * 0.5 - 32,
        },
      })
    const [depth, setDepth] = useState(0)
    const [type, setType] = useState('back')
    const [whiteBalance, setWhiteBalance] = useState('auto')
    const [ratio, setRatio] = useState('16:9')
    const [recordOptions, setRecordOptions] = useState({
        mute: true,
       // maxDuration: 20,
        quality: RNCamera.Constants.VideoQuality['288p'],
        
      })
    const [isRecording, setRecording] = useState(false);
    const [canDetectFaces, setCanDetectFaces] = useState(false);
    const [canDetectText, setCanDetectText] = useState(false);
    const [canDetectBarcode, setCanDetectBarcode] = useState(false);
    const [faces, setFaces] = useState([])
    const [textBlocks, setTextBlocks] = useState([])
    const [barcodes, setBarcodes] = useState([])
    const [showVideoPrev, setShowVideoPrev] = useState(false)
    const [currVideo, setCurrVideo] = useState('')

    const camera = createRef()
    
    const toggleFacing = () => {
        const updatedType = type === 'back' ? 'front' : 'back';
        setType(updatedType);
    }
    
      const toggleFlash = () => {
        setFlash(flashModeOrder[flash])
      }
    
    const toggleWB = () => {
        setWhiteBalance(wbOrder[whiteBalance])
      }
    
    const toggleFocus = () => {
        setAutoFocus(autoFocus === 'on' ? 'off' : 'on')
      }

      const touchToFocus = (event) => {
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

        setAutoFocus({
            normalized: { x, y },
            drawRectPosition: { x: pageX, y: pageY },
          })
      }

      const zoomOut = () => {
        setZoom(zoom - 0.1 < 0 ? 0 : zoom - 0.1,)
      }
    
      const zoomIn = () => {
          setZoom(zoom + 0.1 > 1 ? 1 : zoom + 0.1,)
      }
    
      const setFocusDepth = (depth) => {
          setDepth(depth)
      }
    
      const takePicture = async () => {
        if (camera) {
          const data = await camera.takePictureAsync();
        }
      };

      const takeVideo = async () => {
        if (camera && !isRecording) {
          try {
            const promise = camera.current.recordAsync(recordOptions);
            setRecording(true);
    
            if (promise)
            {
              const data = await promise;
              setCurrVideo(data.uri)
            }
    
          } catch (e) {
       
          }
        }
      };

     // toggle = value => set => this.setState(prevState => ({ [value]: !prevState[value] }));

      const renderRecording = () => {
        const backgroundColor = isRecording ? 'darkred' : 'transparent';
        const videoAction = isRecording ? stopVideo : takeVideo
        const pictureAction = takePicture
    
          return (
            <TouchableWithoutFeedback onPress={videoAction} style={{borderRadius: 60}}>
              <View style={{alignSelf: 'center', width: 60, height: 60, borderRadius: 60, borderWidth: 3, borderColor: '#FFFFFF', padding: 20, backgroundColor: backgroundColor}} />
            </TouchableWithoutFeedback>
          );
      };

      const stopVideo = async () => {
        await camera.current.stopRecording();
        await setRecording(false)
        setShowVideoPrev(true)
      };

      const openVideoPrev = () => {
          setShowVideoPrev(true)
      }
    
      const closeVideoPrev = () => {
          setShowVideoPrev(false)
      }

      const renderCamera = () => {
        const drawFocusRingPosition = {
          top: autoFocusPoint.drawRectPosition.y - 32,
          left: autoFocusPoint.drawRectPosition.x - 32,
        };
    
        return (
          <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
                  <Surface style={{flex: 1, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, elevation: 10}}>
                  <RNCamera
            ref={camera}
            style={{
              flex: 1, 
              justifyContent: 'space-between',
              borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
            }}
            type={type}
            flashMode={flash}
            autoFocus={autoFocus}
            autoFocusPointOfInterest={autoFocusPoint.normalized}
            zoom={zoom}
            whiteBalance={whiteBalance}
            ratio={ratio}
            focusDepth={depth}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
          >
            <View style={StyleSheet.absoluteFill}>
              <View style={[styles.autoFocusBox, drawFocusRingPosition]} />
              <TouchableWithoutFeedback onPress={touchToFocus}>
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
              <FeatherIcon name="x" size={25} color="#FFFFFF" onPress={closeModal} />
    
              <FeatherIcon name="zap" size={25} color="#FFFFFF" onPress={toggleFlash} />
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
              <MaterialIcon name="restore" size={30} color="white" onPress={toggleFacing} />
              </View>
    
              <View style={{flex: 2}}>
              {renderRecording()}
              </View>
    
              <View style={{flexDirection: 'row',  alignItems: 'center', justifyContent: 'center', flex: 1}}>
              <TouchableOpacity
                  style={[styles.flipButton, { alignSelf: 'flex-end' }]}
                  onPress={zoomIn}
                >
                  <Text style={styles.flipText}> + </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.flipButton, { alignSelf: 'flex-end' }]}
                  onPress={zoomOut}
                >
                  <Text style={styles.flipText}> - </Text>
                </TouchableOpacity>
              </View>
              
            </View>
          </RNCamera>
    </Surface>
      <View style={{flex: 0.15, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{color: 'white', fontSize: 16,  }}>
          Perform your best two reps.  For the best capture include your entire body.
      </Text>
      </View>
          </SafeAreaView>
        );
      }

      const captureURI = (uri, type) => {
        captureURIProp(uri, type)
      }

      return  (
        <NativeModal 
        presentationStyle="fullScreen"
        visible={isVisible} 
        animationType="fade"
        closeModal={closeModal}>
          <View style={styles.container}>{renderCamera()}</View>
          <VideoPreview 
          isVisible={showVideoPrev} 
          videoSrcProps={currVideo} 
          closeVideoPreview={closeVideoPrev} 
          currWorkoutPressed={currWorkoutPressed}
          currProgramUUID={currProgramUUID}
          closeMainModal={closeModal}
          captureURI={(uri, type) => captureURI(uri,type)}
          mediaCaptureType={mediaCaptureType}
          outlet={outlet}
         />
         </NativeModal>
      )

}

export default CameraScreen;

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