import React from 'react';

import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    Dimensions,
    SafeAreaView,
} from 'react-native';

import { 
    Appbar, Avatar, Divider
} from 'react-native-paper';

import { connect } from 'react-redux';
import ReceivedProgramNotification from './component/ReceivedProgramNotification';
import LupaController from '../../../controller/lupa/LupaController';
import LiveWorkout from '../../workout/modal/LiveWorkout';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

class NotificationsView extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            userNotifications: [],
        }
    }

    componentDidMount = async () =>  {
        let notificationsIn = [];

        try {
            await this.LUPA_CONTROLLER_INSTANCE.getUserNotifications().then(notifications => {
                notificationsIn = notifications;
            })

        } catch (err) {
           notificationsIn = []
        }

        await this.setState({
            userNotifications: notificationsIn
        })
    }

    mapNotifications = () => {
        return this.state.userNotifications.map(notification => {
            switch(notification.type)
            {
                case 'RECEIVED_PROGRAMS':
                    return (
                        <ReceivedProgramNotification notification={notification} avatarSrc={notification.fromData.photo_url} fromData={notification.fromData} />
                    )
            }
        })
    }

    handleOnRefresh = () => {

    }

    refreshNotifications = () => {

    }

    render() {
        return (
            <View style={styles.root}>
                <Appbar.Header style={{elevation: 0}} theme={{
                    colors: {
                        primary: '#F2F2F2'
                    }
                }}>
                    <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
                    <Appbar.Content title="Notifications" />
                </Appbar.Header>
                <ScrollView contentContainerStyle={{}}>
                <Avatar.Image style={{alignSelf: 'center', margin: 20}} size={60} source={{uri: this.props.lupa_data.Users.currUserData.photo_url}} />
                
                <View style={{margin: 5, flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width}}>
                    <Divider style={{width: '100%'}} />
                </View>

                    {
                        this.mapNotifications()
                    }
                
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F2F2F2'
    }
})

export default connect(mapStateToProps)(NotificationsView)