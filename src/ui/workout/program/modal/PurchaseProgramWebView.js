import React, { createRef } from 'react';

import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Modal,
    Linking
} from 'react-native';

import {
    Button
} from 'react-native-paper';

import { WebView } from 'react-native-webview';

class PurchaseProgramWebView extends React.Component {
    constructor(props) {
        super(props);
        this.webViewRef = null;
    }

    sendProgramDataToWebView = () => {
        this.webViewRef = React.createRef();

        const message = {
            programName: this.props.programProps.program_name,
            programImage: this.props.programProps.program_image,
            ownerName: this.props.programProps.program_owner_display_name,
            programPrice: this.props.programProps.program_price,
        }

        try {
            if (this.webViewRef) {
                console.log('works')
                this.webViewRef.current.injectedJavaScript(message);
            } else {
                console.log('Web page is nullbb')
            }
        } catch(error) {
            console.log(error)
            console.log('Error posting message to web page.')
            console.log('error')
        }
    }

    render() {
        return (
 <Modal presentationStyle="formSheet" visible={this.props.isVisible}>
              <WebView 
                ref={this.webViewRef}
                style={{flex: 1, width: Dimensions.get('window').width}} 
                source={{uri: 'https://lupa-cd0e3.web.app' }}
                injectedJavaScript={this.sendProgramDataToWebView()} 
                />
            </Modal>
        )
    }
}

export default PurchaseProgramWebView;