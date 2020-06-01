
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
} from 'react-native';

import {
    Surface,
    Modal,
    Provider,
    Portal,
} from 'react-native-paper';

import { Button } from 'react-native-elements';

// eslint-disable-next-line import/no-unresolved
import { RNCamera } from 'react-native-camera';

import { Video } from 'expo-av'

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import FeatherIcon from 'react-native-vector-icons/Feather'

import LupaController from '../../../../../controller/lupa/LupaController';
import { Constants } from 'react-native-unimodules';

function VideoPreview(props) {
  const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

  const saveVideo = async () => {
    const newURI = await LUPA_CONTROLLER_INSTANCE.saveProgramWorkoutGraphic(props.currWorkoutPressed, props.currProgramUUID, 'VIDEO', props.videoSrcProps)
    await props.captureURI(newURI, "VIDEO")
    await  props.closeVideoPreview()
   await  props.closeMainModal()
  }

    return (
        <NativeModal visible={props.isVisible} 
        presentationStyle="fullScreen" 
        style={{flex: 1}}
        animated={true}
        animationType="slide">
                          <View style={{flex: 1, backgroundColor: 'transparent'}}>
                          <Video
                        source={{ uri: props.videoSrcProps }}
                        rate={1.0}
                        volume={10}
                        isMuted={false}
                        resizeMode="cover"
                        shouldPlay={true}
                        isLooping={true}
                        style={{flex: 1}}
                        
                    />

<View style={{padding: 15, flexDirection: 'row', alignItems: 'center', backgroundColor: 'black', width: Dimensions.get('window').width, height: 'auto', justifyContent: 'space-evenly'}}>

<TouchableWithoutFeedback onPress={props.closeVideoPreview} style={{margin: 15}}>
<Surface style={{elevation: 3, backgroundColor: '#2196F3', width: 55, height: 55, borderRadius: 55, alignItems: 'center', justifyContent: 'center'}}>
    <MaterialIcon name="cached" color="#FFFFFF" />
</Surface>
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={saveVideo} style={{margin: 15}}>
<Surface style={{elevation: 3, backgroundColor: '#2196F3', width: 55, height: 55, borderRadius: 55, alignItems: 'center', justifyContent: 'center'}}>
    <MaterialIcon name="done" color="#FFFFFF" />
</Surface>
</TouchableWithoutFeedback>

</View>
                          </View>
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

export default class CameraScreen extends React.Component {
  state = {
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

  takePicture = async function() {
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
        console.error(e);
      }
    }
  };

  toggle = value => () => this.setState(prevState => ({ [value]: !prevState[value] }));

  facesDetected = ({ faces }) => this.setState({ faces });

  renderFace = ({ bounds, faceID, rollAngle, yawAngle }) => (
    <View
      key={faceID}
      transform={[
        { perspective: 600 },
        { rotateZ: `${rollAngle.toFixed(0)}deg` },
        { rotateY: `${yawAngle.toFixed(0)}deg` },
      ]}
      style={[
        styles.face,
        {
          ...bounds.size,
          left: bounds.origin.x,
          top: bounds.origin.y,
        },
      ]}
    >
      <Text style={styles.faceText}>ID: {faceID}</Text>
      <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
      <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
    </View>
  );

  renderLandmarksOfFace(face) {
    const renderLandmark = position =>
      position && (
        <View
          style={[
            styles.landmark,
            {
              left: position.x - landmarkSize / 2,
              top: position.y - landmarkSize / 2,
            },
          ]}
        />
      );
    return (
      <View key={`landmarks-${face.faceID}`}>
        {renderLandmark(face.leftEyePosition)}
        {renderLandmark(face.rightEyePosition)}
        {renderLandmark(face.leftEarPosition)}
        {renderLandmark(face.rightEarPosition)}
        {renderLandmark(face.leftCheekPosition)}
        {renderLandmark(face.rightCheekPosition)}
        {renderLandmark(face.leftMouthPosition)}
        {renderLandmark(face.mouthPosition)}
        {renderLandmark(face.rightMouthPosition)}
        {renderLandmark(face.noseBasePosition)}
        {renderLandmark(face.bottomMouthPosition)}
      </View>
    );
  }

  renderFaces = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.faces.map(this.renderFace)}
    </View>
  );

  renderLandmarks = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.faces.map(this.renderLandmarksOfFace)}
    </View>
  );

  renderTextBlocks = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.textBlocks.map(this.renderTextBlock)}
    </View>
  );

  renderTextBlock = ({ bounds, value }) => (
    <React.Fragment key={value + bounds.origin.x}>
      <Text style={[styles.textBlock, { left: bounds.origin.x, top: bounds.origin.y }]}>
        {value}
      </Text>
      <View
        style={[
          styles.text,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]}
      />
    </React.Fragment>
  );

  textRecognized = object => {
    const { textBlocks } = object;
    this.setState({ textBlocks });
  };

  barcodeRecognized = ({ barcodes }) => this.setState({ barcodes });

  renderBarcodes = () => (
    <View style={styles.facesContainer} pointerEvents="none">
      {this.state.barcodes.map(this.renderBarcode)}
    </View>
  );

  renderBarcode = ({ bounds, data, type }) => (
    <React.Fragment key={data + bounds.origin.x}>
      <View
        style={[
          styles.text,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]}
      >
        <Text style={[styles.textBlock]}>{`${data} ${type}`}</Text>
      </View>
    </React.Fragment>
  );

  renderRecording = () => {
    const { isRecording } = this.state;
    const backgroundColor = isRecording ? 'darkred' : 'transparent';
    const action = isRecording ? this.stopVideo : this.takeVideo;
    return (
      <TouchableWithoutFeedback onPress={action} style={{borderRadius: 60}}>
        <View style={{alignSelf: 'center', width: 60, height: 60, borderRadius: 60, borderWidth: 3, borderColor: '#FFFFFF', padding: 20, backgroundColor: backgroundColor}} />
      </TouchableWithoutFeedback>
    
    );
  };

  stopVideo = async () => {
    await this.camera.stopRecording();

    await this.setState({ isRecording: false });
    this.setState({ showVideoPrev: true })
  };

  renderCamera() {
    const { canDetectFaces, canDetectText, canDetectBarcode } = this.state;

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
        faceDetectionLandmarks={
          RNCamera.Constants.FaceDetection.Landmarks
            ? RNCamera.Constants.FaceDetection.Landmarks.all
            : undefined
        }
        onFacesDetected={canDetectFaces ? this.facesDetected : null}
        onTextRecognized={canDetectText ? this.textRecognized : null}
        onGoogleVisionBarcodesDetected={canDetectBarcode ? this.barcodeRecognized : null}
      >

        <View style={StyleSheet.absoluteFill}>
          <View style={[styles.autoFocusBox, drawFocusRingPosition]} />
          <TouchableWithoutFeedback onPress={this.touchToFocus.bind(this)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
        </View>

        {/*
          this.state.isRecording == true ?
          null
          :
          <View
          style={{
            width: Dimensions.get('window').width,
            height: 72,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: Constants.statusBarHeight,
          }}
        >
          <View
            style={{
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: Dimensions.get('window').width,
            height: 'auto',
            }}
          >
            <TouchableOpacity style={[styles.flipButton, {width: 110}]} onPress={this.toggleFacing.bind(this)}>
              <Text style={styles.flipText}> FLIP </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.flipButton, {width: 110}]} onPress={this.toggleFlash.bind(this)}>
              <Text style={styles.flipText}> FLASH: {this.state.flash} </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.flipButton, {width: 110}]} onPress={this.toggleWB.bind(this)}>
              <Text style={styles.flipText}> WB: {this.state.whiteBalance} </Text>
            </TouchableOpacity>
          </View>
        </View>
        */
        }

{/*
        <View style={{ bottom: 0 }}>
          <View
            style={{
              height: 'auto',
              backgroundColor: 'transparent',
              alignSelf: 'flex-end',
            }}
          >
                      {this.state.zoom !== 0 && (
            <Text style={[styles.flipText, {alignSelf: 'center' }]}>Zoom: {this.state.zoom}</Text>
          )}
            <Slider
              style={{ width: 150, marginTop: 15, alignSelf: 'flex-end' }}
              onValueChange={this.setFocusDepth.bind(this)}
              step={0.1}
              disabled={this.state.autoFocus === 'on'}
            />
          </View>
        </View>
                      */}
       {/* 
        
        {!!canDetectFaces && this.renderFaces()}
        {!!canDetectFaces && this.renderLandmarks()}
        {!!canDetectText && this.renderTextBlocks()}
        {!!canDetectBarcode && this.renderBarcodes()} 
        */}

        <View style={{width: Dimensions.get('window').width,
         //   height: 200,
            backgroundColor: 'transparent',   
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 10,}}>
          <FeatherIcon name="x" size={25} color="#FFFFFF" onPress={this.props.closeModalMethod.bind(this)} />

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
<View style={{flex: 0.15, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
  <Text style={{color: 'white', fontSize: 16, fontFamily: 'ARSMaquettePro-Medium'}}>
      Perform your best two reps.  For the best capture include your entire body.
  </Text>
  </View>
{/*
<View style={{flex: 1}}>
  <View style={{flex: 1}}>

<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
<TouchableOpacity
              style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
              onPress={this.zoomIn.bind(this)}
            >
              <Text style={styles.flipText}> + </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.flipButton, { flex: 0.1, alignSelf: 'flex-end' }]}
              onPress={this.zoomOut.bind(this)}
            >
              <Text style={styles.flipText}> - </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.flipButton, { flex: 0.25, alignSelf: 'flex-end' }]}
              onPress={this.toggleFocus.bind(this)}
            >
              <Text style={styles.flipText}> AF : {this.state.autoFocus} </Text>
            </TouchableOpacity>
</View>

  </View>
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}
          >
            {this.renderRecording()}
            <TouchableOpacity
              style={[styles.flipButton, styles.picButton]}
              onPress={this.takePicture.bind(this)}
            >
              <Text style={styles.flipText}> SNAP </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.flipButton, styles.picButton]}
              onPress={this.props.closeModalMethod.bind(this)}
            >
                      <Text style={styles.flipText}> Close </Text>
            </TouchableOpacity>     
          </View>
<SafeAreaView />
</View>
          */}
      </SafeAreaView>
    );
  }

  render() {
    return  (
      <Modal visible={this.props.isVisible} contentContainerStyle={{width: '100%', height: '100%'}}>
        <View style={styles.container}>{this.renderCamera()}</View>
        <VideoPreview 
        isVisible={this.state.showVideoPrev} 
        videoSrcProps={this.state.currVideo} 
        closeVideoPreview={() => this.setState({ showVideoPrev: false})} 
        currWorkoutPressed={this.props.currWorkoutPressed}
        currProgramUUID={this.props.currProgramUUID}
        closeMainModal={this.props.closeModalMethod}
        captureURI={(uri, type) => this.props.handleCaptureNewMediaURI(uri, type)}
       />
        </Modal>
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
    marginTop: 10,
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