import React from 'react';

import {
    Text,
    StyleSheet,
} from 'react-native';

import {
    Left,
    Right,
    Container,
    Header,
    Body,
    Tab,
    Tabs,
} from 'native-base';

import {
    IconButton
} from 'react-native-paper';

import FollowersTab from '../component/FollowersTab';
import FollowingTab from '../component/FollowingTab';

import { connect, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Feather1s from 'react-native-feather1s/src/Feather1s';

const FollowerModal = ({ activeTab }) => {
    const navigation = useNavigation()

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    return (
        <Container style={styles.root}>
                    <Header hasTabs>
                        <Left>
                            <IconButton icon={() => <Feather1s name="arrow-left" size={20} />}  onPress={() => navigation.pop()}/>
                        </Left>
                        <Body />
                        <Right />
                    </Header>

                    <Tabs page={activeTab} tabBarUnderlineStyle={{height: 2}}>
                            <Tab heading="Followers">
                                <FollowersTab  />
                            </Tab>
                            <Tab heading="Following">
                               <FollowingTab  />
                            </Tab>
                        </Tabs>
                </Container>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#FAFAFA",
    },
    userDisplayName: {
        fontSize: 18, 
        fontWeight: 'bold'
    }
});

export default FollowerModal;