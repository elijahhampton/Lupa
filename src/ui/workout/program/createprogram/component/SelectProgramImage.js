import React, { useState } from 'react'

import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native'

import {
    Surface
} from 'react-native-paper'

import FeatherIcon from 'react-native-vector-icons/Feather'

import ImagePicker from 'react-native-image-picker'

function SelectProgramImage({ captureImage }) {
    const [programImage, setProgramImage] = useState("")
    const [isProgramImageSet, setIsPromiseImageSet] = useState(false)

    const _chooseImageFromCameraRoll = async () => {
      try {
        ImagePicker.showImagePicker({}, async (response) => {
            if (!response.didCancel)
            {
              await captureImage(response.uri)
              await setProgramImage(response.uri)
              await setIsPromiseImageSet(true)
            }
        });
      } catch(err) {
          alert(err)
      }
  
    }

    return (
        <View style={styles.container}>
                            <Surface style={styles.surface}>
                    {
                      isProgramImageSet == true ?
                      <Image source={{uri: programImage }} style={styles.image} />
                      :
                      <FeatherIcon name="plus-circle" size={60} color="rgb(174,174,178)" onPress={_chooseImageFromCameraRoll} />
                    }
                </Surface>

                <Text style={styles.text}>
                    Choose a cover image
                </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        margin: 50,
        fontSize: 20,
        color: '#23374d',
        fontWeight: 'bold'
    },
    image: {
        width: '100%', 
        height: '100%', 
        borderRadius: 10
    },
    surface: {
        margin: 10, 
        elevation: 10, 
        borderRadius: 10, 
        alignSelf: 'center', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: Dimensions.get('window').width - 50, 
        height: '50%',
    }
})

export default SelectProgramImage;