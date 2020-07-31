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

const FollowerModal = ({ activeTab }) => {
    const navigation = useNavigation()

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    return (
        <Container style={styles.root}>
                    <Header hasTabs>
                        <Left>
                            <IconButton icon="arrow-back"  onPress={() => navigation.pop()}/>
                        </Left>
                        <Right>
                            <Text style={styles.userDisplayName}>
                                {currUserData.display_name}
                            </Text>
                        </Right>
                    </Header>

                    <Tabs page={activeTab}>
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