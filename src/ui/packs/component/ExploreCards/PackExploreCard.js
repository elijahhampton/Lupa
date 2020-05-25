import React from 'react';
import { withNavigation } from 'react-navigation';

import {
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import {
    Surface,
    Headline,
} from 'react-native-paper';


function DefaultPack(props) {
    const pack = props.pack;

    const _showPack = () => {
        props.navigation.navigate('PackModal', {
            navigation: this.props.navigation,
            packUUID: this.props.packUUID,
        })
    }


    return (
<TouchableOpacity onPress={_showPack}>
                        <Surface style={styles.defaultPackSurface}>
                        <ImageBackground style={styles.defaultPackImageBackground} imageStyle={styles.defaultPackImageStyle} source={{uri: pack.pack_image}}>
                    <Headline style={styles.defaultPackHeadline}>
                        {pack.pack_title}
                    </Headline>
                </ImageBackground>
            </Surface>
            </TouchableOpacity>
    )
}

export default withNavigation(DefaultPack);

const styles = StyleSheet.create({
    defaultPackSurface: {
        margin: 35, 
        alignSelf: 'center', 
        width: Dimensions.get('screen').width - 60, 
        marginHorizontal: 20,  
        height: 400, 
        elevation: 15, 
        borderRadius: 15
    },
    defaultPackImageBackground: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: 15,
    },
    defaultPackImageStyle: {
        borderRadius: 15
    },
    defaultPackHeadline: {
        color: 'white', 
        fontWeight: 'bold'
    },
})