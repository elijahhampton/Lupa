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
            <Modal presentationStyle="fullScreen" visible={this.props.isOpen}>
                <Container>
                    <Header hasTabs>
                        <Left>
                            <IconButton icon="arrow-back" onPress={this.props.closeModalMethod} />
                        </Left>
                        <Body>
                            <Text>
                                {this.props.username}
                            </Text>
                        </Body>
                    </Header>

                    <Tabs page={this.state.activeTab}>
                            <Tab heading="Followers">
                                <FollowersTab userUUID={this.state.userUUID} followers={this.props.followers} />
                            </Tab>
                            <Tab heading="Following">
                               <FollowingTab userUUID={this.state.userUUID} following={this.props.following} />
                            </Tab>
                        </Tabs>
                </Container>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        backgroundColor: "#FAFAFA",

    }
})