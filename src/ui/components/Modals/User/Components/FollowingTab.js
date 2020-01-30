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
            followingUUIDS: [],
            followingUserObjects: [],
            searchResultData: []
        }
    }

    componentDidMount = async () => {
        this.setupFollowingTabInformation();
    }

    setupFollowingTabInformation = async () => {
        let following;
        let results = [];

        const currUserUUID = await this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;

        await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(currUserUUID, 'following').then(result => {
            following = result;
        })

        await this.setState({ followingUUIDS: following })

        await this.state.followingUUIDS.forEach(async userUUID => {
            console.log('the uuid is: ' + userUUID)
            await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(userUUID).then(userObject => {
                results.push(userObject);
            });
        });

        await this.setState({ followingUserObjects: results });
    }

    mapFollowing = () => {
        console.log('the length is: ' + this.state.followingUserObjects.length)
        return this.state.followingUserObjects.map(user => {
            return (
                <Text>
                    Hi
                </Text>
            );
        })
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
                {
                    this.mapFollowing()
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    searchContainer: {
        backgroundColor: "transparent"
    }
})