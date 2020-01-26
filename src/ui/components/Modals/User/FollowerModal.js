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
    IconButton
} from 'react-native-paper';

import FollowersTab from './Components/FollowersTab';
import FollowingTab from './Components/FollowingTab';

export default class FollowerModal extends React.Component {
    constructor(props) {
        super(props);

        this.state  = {
            userUUID: this.props.userUUID,
            activeTab: this.props.activeTab,
        }
    }
    render() {
        return (
                <Container style={styles.root}>
                    <Header hasTabs>
                        <Left>
                            <IconButton icon="arrow-back"  />
                        </Left>
                        <Body>
                            <Text>
                                Username here
                            </Text>
                        </Body>
                    </Header>

                    <Tabs page={this.state.activeTab}>
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
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#FAFAFA",
    }
})