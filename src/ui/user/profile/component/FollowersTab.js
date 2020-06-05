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

import LupaController from '../../../../controller/lupa/LupaController';

import { connect } from 'react-redux';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

class FollowersTab extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            followersUUIDS: this.props.lupa_data.Users.currUserData.followers,
            followersUserObjects: [],
        }
    }

    componentDidMount = async () => {
        await this.setupFollowersTabInformation();
    }

    setupFollowersTabInformation = async () => {
        let results = new Array();

        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationFromArray(this.state.followersUUIDS).then(objs => {
            results = objs;
        });

        await this.setState({ followersUserObjects: results });
    }

    mapFollowers = () => {
        return this.state.followersUserObjects.map(user => {
            return (
                <UserSearchResult avatarSrc={user.photo_url} displayName={user.display_name} username={user.username} isTrainer={user.isTrainer}/>
            );
        })
    }

    /**
     * Render
     * Renders component content.
     */
    render() {
        return (
            <ScrollView shouldRasterizeIOS={true}>
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

export default connect(mapStateToProps)(FollowersTab);