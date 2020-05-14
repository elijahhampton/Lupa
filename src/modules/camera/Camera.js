import React from 'react';
import { StyleSheet, CameraRoll, TouchableHighlight } from 'react-native';

import { RNCamera } from 'react-native-camera';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

export default class LupaDefaultCameraConfiguration extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            videoUri: '',
            isRecordingInterrupted: false,
            showDialog: false,

        }

        this.lupaCamera = React.createRef();
    }
    
      _recordVideo() {
        this.lupaCamera.current.recordAsync().then(recObject => {
            this.setState({
                videoUri: recObject.uri,
                isRecordingInterrupted: recObject.isRecordingInterrupted
            })
        })
      }
    
      _stopRecording() {
          //stop recording
          this.lupaCamera.current.stopRecording();

           //show video dialog
           this.setState({

           })
      }

      handleSaveVideo = () => {
          const uri = this.state.videoUri;
          //Save to lupa bucket
      }

      render() {
        return (
            <RNCamera
            ref={this.lupaCamera}
            style={styles.cameraStyle}
            type={RNCamera.Constants.Type.front}
            flashMode={RNCamera.Constants.FlashMode.on}
            videoStabilizationMode={RNCamera.Constants.VideoStabilization.cinematic}>
      <MaterialIcon
          name="video-cam"
          size={40}
      />
            </RNCamera>
        )
      }
}


const styles = StyleSheet.create({
    cameraStyle: {
        flex: 1,
    }
});