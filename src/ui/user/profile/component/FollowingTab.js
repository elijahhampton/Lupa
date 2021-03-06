import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Modal,
    ScrollView
} from 'react-native';

import UserSearchResult from './UserSearchResult';

import LupaController from '../../../../controller/lupa/LupaController';

import { connect } from 'react-redux';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

class FollowingTab extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            followingUUIDS: this.props.lupa_data.Users.currUserData.following,
            followingUserObjects: [],
        }
    }

    componentDidMount = async () => {
        await this.setupFollowingTabInformation();
    }

    setupFollowingTabInformation = async () => {
        let results = new Array();
        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationFromArray(this.state.followingUUIDS).then(objs => {
            results = objs;
        });

        await this.setState({ followingUserObjects: results });
    }

    mapFollowing = () => {
        return this.state.followingUserObjects.map(user => {
            return (
                <UserSearchResult userData={user} />
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
               {/* <SearchBar platform="ios" placeholder="Search" containerStyle={styles.searchContainer}/> */}
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

export default connect(mapStateToProps)(FollowingTab);