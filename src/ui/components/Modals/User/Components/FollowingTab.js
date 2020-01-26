import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Modal,
    ScrollView
} from 'react-native';

import {
    Left,
    Right,
    Body,
    Container,
    Header,
    Tab,
    Tabs,
} from 'native-base';

import {
    Button,
    IconButton,
    Avatar
} from 'react-native-paper';

import { SearchBar } from 'react-native-elements';

import UserSearchResult from './UserSearchResult';

import LupaController from '../../../../../controller/lupa/LupaController';

export default class FollowingTab extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        this.following = [];

        this.state = {
            userUUID: this.props.userUUID,
            followingUUIDS: this.props.following,
            searchResultData: []
        }
    }

    componentDidMount = async () => {
     /*   let searchResultDataArr = [];

          await this.state.followingUUIDS.forEach(followee => {
              console.log(followee);
            let userInfo = this.getUserInfo(followee);
            searchResultDataArr.push(userInfo);
        });

        await this.setState({ searchResultData: searchResultDataArr })

        console.log('aaa' + this.state.searchResultData)*/
    }

    getUserInfo = async (uuid) => {
        let displayNameIn = "", usernameIn = "", photoUrlIn = "";

        await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(uuid, 'display_name').then(result => {
            displayNameIn = result;
            console.log('uhh' + displayNameIn)
        });

         await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(uuid, 'username').then(result => {
            usernameIn = result;
            console.log(usernameIn)
        });

         await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(uuid, 'photo_url').then(result => {
            photoUrlIn = result;
            console.log(photoUrlIn)
        })

        return { displayName: displayNameIn, username: usernameIn, photoUrl: photoUrlIn }
    }

    /**
     * Render
     * Renders component content.
     * 
     * TODO: At some point this code should be moved into a function.
     */
    render() {
        return (
            <ScrollView shouldRasterizeIOS={true}>
                <SearchBar platform="ios" placeholder="Search" containerStyle={styles.searchContainer}/>
                {/*
                    console.log(this.state.searchResultData)
                */}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    searchContainer: {
        backgroundColor: "transparent"
    }
})