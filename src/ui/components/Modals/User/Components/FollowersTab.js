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
            userUUID: this.props.userUUID,
            followers: this.props.followers,
        }
    }

    componentDidMount() {
        
    }

    mapFollowers = async () => {
       if (this.state.followers.length == 0) { 
           console.log('LENGTH IS 0')
           return <Caption> You don't have any followers to display </Caption>
        }
       
      /* let displayName, username, photoUrl;
       let followers =  await this.state.map(follower => {
            this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(follower, 'display_name').then(result => {
                displayName = result;
            });

            this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(follower, 'username').then(result => {
                username = result;
            });

            this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(follower, 'photo_url').then(result => {
                photoUrl = result;
            })

            return <UserSearchResult photoUrl={photoUrl} username={username} displayName={displayName} />
        })

        return followers;*/
    }

    /**
     * Render
     * Renders component content.
     * 
     * TODO: At some point this code should be moved into a function.
     */
    render() {
        let displayName, username, photoUrl;
        return (
            <ScrollView shouldRasterizeIOS={true}>
                <SearchBar platform="ios" placeholder="Search" containerStyle={styles.searchContainer}/>
                {
               /* this.state.followers.length == 0 ? <Caption> You do not have any followers to display </Caption>
                :
                  this.state.followers.map(follower => {
                    this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(follower, 'display_name').then(result => {
                        displayName = result;
                    });
        
                    this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(follower, 'username').then(result => {
                        username = result;
                    });
        
                    this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(follower, 'photo_url').then(result => {
                        photoUrl = result;
                    })
        
                    return <UserSearchResult photoUrl={photoUrl} username={username} displayName={displayName} />
                })*/
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