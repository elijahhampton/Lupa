/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 *
 *  Featured
 */

import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions,
    RefreshControl,
} from 'react-native';

import {
    Divider,
    Caption,
    FAB,
} from 'react-native-paper';

import LupaController from '../../controller/lupa/LupaController';
import { connect } from 'react-redux';
import { RFValue } from 'react-native-responsive-fontsize';
import LUPA_DB from '../../controller/firebase/firebase';
import VlogFeedCard from '../user/component/VlogFeedCard';
import { LOG_ERROR } from '../../common/Logger';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Feather1s from 'react-native-feather1s/src/Feather1s';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

let communityVlogObserver;

class CommunityFeed extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            refreshing: false,
            lastRefresh: new Date().getTime(),
            feedVlogs: [],
        }
    }

    componentDidMount() {
        this.fetchCommunityVlogs();
    }

    componentWillUnmount() {
        return () => communityVlogObserver();
    }

    fetchCommunityVlogs = () => {
        const VLOG_QUERY = LUPA_DB.collection('communities').doc(this.props.community.uid).collection('vlogs')
        communityVlogObserver = VLOG_QUERY.onSnapshot(querySnapshot => {
            const updatedState = [];

            querySnapshot.forEach(doc => {
                let data = doc.data();

                if (typeof (data) != 'undefined') {
                    updatedState.push(data);
                }
            });

            updatedState.concat(this.state.feedVlogs)
            this.setState({ feedVlogs: updatedState });

        }, error => {
            LOG_ERROR('CommunityFeed.js', 'Error fetching community vlog data.', error)
        });
    }

    handleOnRefresh = () => {
        this.setState({ refreshing: true })
        this.fetchCommunityVlogs();
        this.setState({ refreshing: false })
      }

    renderVlogs = () => {
        if (this.state.feedVlogs.length === 0) {
            return (
                <View style={{alignItems: 'center', marginVertical: 20, width: '100%', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                    <View style={{marginVertical: 10, alignItems: 'center'}}>
                    <Text style={{fontSize: 25, fontFamily: 'Avenir-Heavy'}}>
                        No Community Vlogs
                    </Text>
                    <Caption style={{fontFamily: 'Avenir', paddingHorizontal: 20}}>
                        This community has no vlogs.  Check back again later or {" "}
                        <Caption>
                    create the first one.
                    </Caption>
                    </Caption>

                    </View>
                   
                   <Image source={require('../images/vlogs/novlog.png')} style={{marginTop: 40, width: 220, height: 300}} />
                </View>
            )
        }


        return this.state.feedVlogs.map((vlog, index, arr) => {
            if (index == 0) {
                return <VlogFeedCard key={index} vlogData={vlog} showTopDivider={false} />
            }

            return (
                <VlogFeedCard key={index} clickable={true} vlogData={vlog} showTopDivider={true} />  
            )
        })
    }

    renderFAB = () => {
              return (
                <FAB 
                small={false} 
                onPress={() => this.props.navigation.push('CreatePost', {
                    communityUID: this.props.community.uid,
                    vlogType: 'Community'
                })} 
                icon="video" 
                style={{backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16, color: 'white', alignItems: 'center', justifyContent: 'center',}} color="white" 
                />
              )
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
                    contentContainerStyle={{backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
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
    mainGraphicText: {

        color: '#FFFFFF',
        fontSize: 25,
        alignSelf: 'flex-start'
    },
    subGraphicText: {

        color: '#FFFFFF',
        alignSelf: 'flex-start',
        textAlign: 'left',
    },
    graphicButton: {
        alignSelf: 'flex-start',
    },
    viewOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 0,
    },
    chipText: {
        color: 'white',

    },
    chip: {
        position: 'absolute',
        top: 15,
        right: 10,
        backgroundColor: '#2196F3',
        elevation: 15
    },
    imageBackground: {
        flex: 1,
        width: Dimensions.get('window').width,
        borderRadius: 0,
        alignItems: 'flex-start',
        justifyContent: 'space-around',
    },
    sectionHeaderText: {
        fontSize: RFValue(15), fontFamily: 'Avenir-Heavy', fontSize: 15,
    },
    searchContainerStyle: {
        backgroundColor: "#FFFFFF", width: Dimensions.get('window').width, alignSelf: 'center'
    },
    inputContainerStyle: {
        backgroundColor: 'white',
    },
    inputStyle: {
        fontSize: 15, fontWeight: '600', fontFamily: 'Avenir-Roman'
    },
    iconContainer: {
        width: '10%', alignItems: 'center', justifyContent: 'center'
    },
    appbar: {
        width: Dimensions.get('window').width,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        elevation: 0,
        flexDirection: 'column',
        marginVertical: 20
    }
});

export default connect(mapStateToProps)(CommunityFeed);
