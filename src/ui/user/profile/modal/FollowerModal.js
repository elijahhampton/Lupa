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

import FollowersTab from '../component/FollowersTab';
import FollowingTab from '../component/FollowingTab';

import { connect } from 'react-redux';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

class FollowerModal extends React.Component {
    constructor(props) {
        super(props);

        this.state  = {
            userUUID: this.props.userUUID,
            activeTab: this.props.activeTab,
        }
    }

    _navigateBack = () => {
        this.props.navigation.goBack();
    }

    render() {
        return (
                <Container style={styles.root}>
                    <Header hasTabs>
                        <Left>
                            <IconButton icon="arrow-back"  onPress={() => this.props.navigation.navigate('Profile', { go_back_key: this.props.navigation.state.key })}/>
                        </Left>
                        <Right>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                                {this.props.lupa_data.Users.currUserData.display_name}
                            </Text>
                        </Right>
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
});

export default connect(mapStateToProps)(FollowerModal);