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
    Caption
} from 'react-native-paper';

import { SearchBar } from 'react-native-elements';

import UserSearchResult from './UserSearchResult';

import LupaController from '../../../../../controller/lupa/LupaController';

export default class FollowersTab extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            /*userUUID: this.props.userUUID,
            followersUUDS: this.props.followers,
            followersUserObjects: [],
            serachResultData: [],*/
        }
    }

    componentDidMount() {
        //this.setupFollowersTabInformation();
    }

    setupFollowersTabInformation = async () => {
        let results = [];
        await this.followersUUIDS.forEach(async userUUID => {
            await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(userUUID).then(userObject => {
                results.push(userObject);
            });
        });

        await this.setState({ followersUserObjects: results });
    }

    mapFollowers = () => {
       /* return this.state.followersUserObjects(user => {
            return (
                <UserSearchResult />
            )
        })*/
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
                    this.mapFollowers()
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    searchContainer: {
        backgroundColor: "transparent",
    }
})