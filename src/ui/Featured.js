import React from 'react';

import {
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
} from 'react-native';

import {
    Caption,
    FAB,
} from 'react-native-paper';

import LupaController from '../controller/lupa/LupaController';
import { connect } from 'react-redux';
import LUPA_DB from '../controller/firebase/firebase';
import VlogFeedCard from './user/component/VlogFeedCard';
import { LOG_ERROR } from '../common/Logger';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

let vlogCollectionObserver;


/**
 * Lupa
 * @author Elijah Hampton
 * @date August 23, 2019
 *
 *  Featured
 */
class Featured extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            refreshing: false,
            lastRefresh: new Date().getTime(),
            feedVlogs: [],
        }
    }

    async componentDidMount() {
        const { currUserData } = this.props.lupa_data.Users;
        const query = LUPA_DB.collection('vlogs').where('vlog_state', '==', currUserData.location.state);
        vlogCollectionObserver = query.onSnapshot(querySnapshot => {
            let updatedState = [];

            querySnapshot.forEach(doc => {
                let data = doc.data();

                if (typeof (data) != 'undefined') {
                    updatedState.push(data);
                }
            });

            updatedState.concat(this.state.feedVlogs)

            if (updatedState.length === 0) {
                LUPA_DB.collection('vlogs').get().then(docs => {
                    docs.forEach(doc => {
                        const data = doc.data();
                        updatedState.push(data);
                    });
                })
            }

            this.setState({ feedVlogs: updatedState });

        }, error => {
            LOG_ERROR('Featured.js', 'componentDidMount::Caught error fetching vlogs.', error)
        });
    }

    async componentWillUnmount() {
        return () => vlogCollectionObserver();
    }

    handleOnRefresh = () => {
        this.setState({ refreshing: true })
        this.setState({ refreshing: false })
    }

    renderVlogs = () => {
        const { feedVlogs } = this.state;
        if (feedVlogs.length === 0) {
            return (
                <View style={{ width: '100%', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                    <Caption style={{ fontFamily: 'Avenir-Light', fontSize: 15, textAlign: 'center', backgroundColor: '#FFFFFF' }} >
                        There are no any vlogs in your area.  Check back later.
                    </Caption>
                </View>
            )
        }


        return feedVlogs.map((vlog, index, arr) => {
            if (index == 0) {
                return <VlogFeedCard key={index} vlogData={vlog} showTopDivider={false} />
            }

            return (
                <VlogFeedCard key={index} clickable={true} vlogData={vlog} showTopDivider={true} />
            )
        })
    }

    renderFAB = () => {
        const { isAuthenticated } = this.props.lupa_data.Auth;
        const { currUserData } = this.props.lupa_data.Users;
        const { navigation } = this.props;

        if (isAuthenticated == true) {
            if (currUserData.isTrainer == true) {
                return (
                    <FAB 
                    small={false} 
                    onPress={() => navigation.push('CreatePost')} 
                    icon="video" 
                    style={styles.fab} 
                    color="white" />
                )
            } else if (currUserData.isTrainer == false) {
                return (
                        <FAB 
                        small={false} 
                        onPress={() => navigation.push('CreatePost')} 
                        icon="video" 
                        style={styles.fab} 
                        color="white" />
                )
            }
        }
    }

    render() {
        return (
            <View style={styles.root}>
                <ScrollView 
                refreshControl={
                <RefreshControl 
                refreshing={this.state.refreshing} 
                onRefresh={this.handleOnRefresh} />
                } 
                contentContainerStyle={styles.scrollViewContainer}>
                    {this.renderVlogs()}
                </ScrollView>
                {this.renderFAB()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    scrollViewContainer: {
        backgroundColor: '#FFFFFF', 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    fab: {
        backgroundColor: '#1089ff', 
        position: 'absolute', 
        bottom: 0, 
        right: 0, 
        margin: 16, 
        color: 'white', 
        alignItems: 'center', 
        justifyContent: 'center',
    }
});

export default connect(mapStateToProps)(Featured);
