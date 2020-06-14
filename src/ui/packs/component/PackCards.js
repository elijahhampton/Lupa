import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import {
    Surface,
    Caption,
    Dialog,
    Chip,
} from 'react-native-paper';

import { withNavigation, NavigationActions } from 'react-navigation';
import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

import LupaController from '../../../controller/lupa/LupaController';
import { getCurrentStoreState } from '../../../controller/redux';

class MyPacksCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            packUUID: this.props.packUUID,
            showPack: false,
            packProfileImage: '',
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    }

    handleShowPack = (uuid) => {
            this.props.navigation.navigate('PackModal', {
                navigation: this.props.navigation,
                packUUID: uuid,
                refreshPackViewMethod: this.refreshPackView.bind(this)
            })
    }

    refreshPackView = async () => {
        await this.props.refreshPackViewMethod();
    }

    componentDidMount = async () => {
        await this.setupComponent();
    }

    setupComponent = async () => {
        await this.LUPA_CONTROLLER_INSTANCE.getPackImageFromUUID(this.state.packUUID).then(result => {
            packProfileImageIn = result;
        })

        await this.setState({
            packProfileImage: packProfileImageIn
        })
    }

    render() {
        return (
            <TouchableOpacity onPress={() => this.handleShowPack(this.state.packUUID)} style={{marginVertical: 15}}>
                            <View style={{margin: 5, height: 120, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center'}}>
                <Surface style={{margin: 5, marginRight: 20, width: 100, height: 100, backgroundColor: '#FFFFFF', elevation: 2, borderRadius: 5}}>
                <Image style={styles.image} 
                                    resizeMode={ImageResizeMode.cover} 
                                    source={{uri: this.state.packProfileImage}} />
                </Surface>

                <View style={{flex: 1, height: 120, justifyContent: 'space-evenly', width: '100%'}}>
                    <Text style={{color: 'rgba(28, 28, 30, 0.8)', fontSize: 15, fontFamily: 'HelveticaNeueMedium'}}>
                        {this.props.title} (Community)
                    </Text>
                    <View>
                    <Text style={{color: 'rgba(28, 28, 30, 0.4)', fontSize: 15, fontFamily: 'HelveticaNeueMedium'}}>
                       {this.props.pack.pack_location.city}, {this.props.pack.pack_location.state} 
                    </Text>

                        <Text numberOfLines={2} style={{color: 'rgba(25,118,210 ,1)', fontSize: 12, fontFamily: 'HelveticaNeueLight'}}>
                            {this.props.pack.pack_description}
                        </Text>
                    </View>
                </View>
            </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    cardContainer: {
        margin: 10,
    },
    bottomSurface: {
        margin: 10, 
        width: Dimensions.get('screen').width / 1.5, 
        height: 100, 
        elevation: 10, 
        borderColor: '#212121',
        borderRadius: 20, 
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        padding: 5,
    },
    imageSurface: {
        position: 'absolute', 
        top: 12, 
        right: 12, 
        alignSelf: "center",
        width: 30, 
        height: 30, 
        alignItems: "center", 
        justifyContent: "center", 
        elevation: 15, 
        borderRadius: 20
    },
    image: {
        width: '100%',
        height: '100%'
    },
    cardContentContainer: {
        flex: 1, flexDirection: "column", padding: 15, justifyContent: 'space-evenly'
    },
    rating: {
        margin: 2
    }
});

export default withNavigation(MyPacksCard);