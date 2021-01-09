import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Modal,
} from 'react-native';

import {
    ActivityIndicator
} from 'react-native-paper';

function FullScreenLoadingIndicator({ isVisible }) {
    return (
        <Modal 
        animationType="fade"
        transparent={true}
        visible={isVisible}
        presentationStyle="overFullScreen"
        >
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)'}}>
          <ActivityIndicator animating={true} size="large" color="#FFFFFF" />
      </View>
        </Modal>
    )
}

export default FullScreenLoadingIndicator;