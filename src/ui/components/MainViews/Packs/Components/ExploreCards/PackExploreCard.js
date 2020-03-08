import React, { useState } from 'react';

import {
    Text,
    View,
    StyleSheet,
    Image,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import {
    Surface,
    Avatar,
    Divider,
    Card,
    FAB,
    Headline,
    Caption
} from 'react-native-paper';

import { Rating } from 'react-native-ratings';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

import { NavigationContext, withNavigation, NavigationActions } from 'react-navigation';

import LupaController from '../../../../../../controller/lupa/LupaController';


import PackInformationModal from '../../../../Modals/Packs/PackInformationModal';
import ProfilePreviewModal from '../../../../DrawerViews/Profile/ProfilePreviewModal';
import { useNavigation } from '@react-navigation/native';

let contextType = NavigationContext;

class DefaultPack extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            packUUID: this.props.packUUID,
            packProfileImage: '',
            ready: false,
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    }

    componentDidMount = async () => {
        await this.setupComponent();
    }

    setupComponent = async () => {
        let packProfileImageIn;

        console.log('her: ' + this.state.packUUID);

        await this.LUPA_CONTROLLER_INSTANCE.getPackImageFromUUID(this.state.packUUID).then(result => {
            packProfileImageIn = result;
        })

        console.log('uhh  ' + packProfileImageIn)


        await this.setState({
            packProfileImage: packProfileImageIn,
            ready: true,
        });
    }

    _setShowPack = () => {
        this.props.navigation.navigate('PackModal', {
            navigation: this.props.navigation,
            packUUID: this.props.packUUID,
        })
    }

    render() {
        return (
            <TouchableOpacity onPress={() => this._setShowPack()}>
                        <Surface style={{margin: 10, alignSelf: 'center', width: Dimensions.get('screen').width - 60, marginHorizontal: 20,  height: 400, elevation: 1, borderRadius: 15}}>
                        <ImageBackground style={{flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 15,}} imageStyle={{borderRadius: 15}} source={{uri: this.state.packProfileImage}}>
                    <Headline style={{color: 'white', fontWeight: 'bold'}}>
                        {this.props.pack_title}
                    </Headline>
                </ImageBackground>
            </Surface>
            </TouchableOpacity>
        )
    }
}

export default withNavigation(DefaultPack);


class SmPackCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            packUUID: this.props.packUUID,
            showPack: false,
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    }

    componentDidMount = async () => {
        await this.setupComponent();
    }

    setupComponent = () => {
        
    }

    _setShowPack = () => {
        this.setState({
            showPack: true,
        })
    }

    handleClosePack = () => {
        this.setState({
            showPack: false,
        })
    }

    render() {
        return (
            <>
            <Surface style={styles.packCards}>
                <View style={{flex: 1,  borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: 'black'}}>
                {/*<ImageBackground imageStyle={{flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20}} style={{flex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20}} resizeMode={ImageResizeMode.cover} defaultSource={require('../../../../../images/announcements.jpg')} />*/}

                </View>
    
                <Divider />
    
                <View style={{flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center'}}>
                    <Text numberOfLines={9}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </Text>
                </View>
    
                <Caption style={{alignSelf: 'center'}}>
                    Melbourne, FL
                </Caption>
            </Surface>
    
            <FAB onPress={() => this._setShowPack()} icon="menu" color="#FFFFFF" small style={{backgroundColor: "#2196F3",position: 'absolute', top: 10, right: 10, }} />
            <PackInformationModal isOpen={this.state.showPack} packUUID={this.state.packUUID} closeModalMethod={this.handleClosePack}/>
            </>
        );
    }
}

export const SubscriptionPackCard = (props) => {
    const [packUUID, setPackUUID] = useState(props.packUUID);
    const [showPack, setShowPack] = useState(false);

    _setShowPack = () => {
        setShowPack(true);
    }

    handleClosePack = () => {
        setShowPack(false)
    }
    
    return (
        <TouchableOpacity onPress={this._setShowPack}>
        <Surface style={styles.offerCards}>
        <Image style={{width: "100%", height: "100%", borderRadius: 15}} 
            resizeMode={ImageResizeMode.cover} 
            source={{uri: props.image}} />
        </Surface>


        <PackInformationModal isOpen={showPack} packUUID={props.packUUID} closeModalMethod={this.handleClosePack}/>
        </TouchableOpacity>
    );   
}

class TrainerFlatCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userUUID: this.props.userUUID,
            profileImage: '',
            currUserData: {},
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    }

    componentDidMount = async () => {
        await this.setupComponent();
    }

    setupComponent = async () => {
        let profileImageIn;
        console.log(this.state.userUUID)
        await this.LUPA_CONTROLLER_INSTANCE.getUserProfileImageFromUUID(this.state.userUUID).then(result => {
            profileImageIn = result;
        })

        await this.setState({
            profileImage: profileImageIn,
        })
    }

    handleNavigation = () => {
        this.props.navigation.dispatch(

            NavigationActions.navigate({
              routeName: 'Profile',
              params: {userUUID: this.state.userUUID, navFrom: 'SessionsView'},
              action: NavigationActions.navigate({ routeName: 'Profile', params: {userUUID: this.state.userUUID, navFrom: 'SessionsView'}})
            })
                        )
    }

    render() {
        return (
            <TouchableOpacity onPress={() =>        this.props.navigation.dispatch(

                NavigationActions.navigate({
                  routeName: 'Profile',
                  params: {userUUID: this.state.userUUID, navFrom: 'SessionsView'},
                  action: NavigationActions.navigate({ routeName: 'Profile', params: {userUUID: this.state.userUUID, navFrom: 'SessionsView'}})
                })
                            )}>
                            <Card style={styles.card}>
<Card.Cover style={{height: 180}} source={{ uri: this.state.profileImage }} />
<Card.Actions style={{height: "auto", flexDirection: "column", alignItems: "flex-start"}}>
<View style={{paddingTop: 3, paddingBottom: 3}}>
<Text style={styles.text}>
{this.props.displayName}
</Text>
<Text style={[styles.text, {fontWeight: "bold"}]}>
{this.props.location.city + ", " + this.props.location.state }
</Text>
</View>
{/*
<Caption>
Elijah Hampton has completed over {this.props.sessionsCompleted} sessions on Lupa.
</Caption>
*/}
</Card.Actions>
</Card>
</TouchableOpacity>
);
    }
}

export const UserFlatCard = (props) => {

    return (
            <Avatar.Image source={{uri: props.avatarSrc }} size={60} style={{margin: 5}} />
    );
}

const TrainerCard = withNavigation(TrainerFlatCard);
const SmallPackCard = withNavigation(SmPackCard);
export {
    SmallPackCard,
    TrainerCard,
}

const styles = StyleSheet.create({
    packCards: {
        elevation: 1,
        width: 165,
        height: 210,
        flexDirection: 'column',
        borderRadius: 20,
        margin: 5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    offerCards: {
        elevation: 1,
        width: 120,
        height: 150,
        borderRadius: 15,
        margin: 5,
    },
    card: {
        width: 160,
        height: "auto",
        margin: 10,
        borderRadius: 15,
    },
    text: {
        fontSize: 12,
    }
})