import React, {Component} from 'react'
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions} from 'react-native'
import RtcEngine, {RtcLocalView, RtcRemoteView, VideoRenderMode} from 'react-native-agora'
import { connect } from 'react-redux'

interface Props {
}

/**
 * @property peerIds Array for storing connected peers
 * @property appId
 * @property channelName Channel Name for the current session
 * @property joinSucceed State variable for storing success
 */
interface State {
    appId: string,
    token: string,
    channelName: string,
    joinSucceed: boolean,
    peerIds: number[],
}

const mapStateToProps = (state, props) => {
    return {
        lupa_data: state
    }
}

class VirtualSession extends Component<Props, State> {
    _engine?: RtcEngine

    constructor(props) {
        super(props)
        this.state = {
            appId: 'fd515bbb863a43fa8dd6e89f2b3bfaeb',
            token: '006fd515bbb863a43fa8dd6e89f2b3bfaebIABv4jfbqzMtKzN2xSyTvvjrulZPDYIOaYiPOMNUKMZ5X7iT6u4AAAAAEABqf2Zw+8SoXwEAAQD6xKhf',
            channelName: '', //Randomly generate number
            joinSucceed: false,
            peerIds: [],
        }
    }

    componentDidMount() {
        this.generateChannelName();
        this.init();
    }

    /**
     * @name init
     * @description Function to initialize the Rtc Engine, attach event listeners and actions
     */
    init = async () => {
        const {appId} = this.state
        this._engine = await RtcEngine.create(appId)
        await this._engine.enableVideo()

        this._engine.addListener('Warning', (warn) => {
            console.log('Warning', warn)
        })

        this._engine.addListener('Error', (err) => {
            console.log('Error', err)
        })

        this._engine.addListener('UserJoined', (uid, elapsed) => {
            console.log('UserJoined', uid, elapsed)
            // Get current peer IDs
            const {peerIds} = this.state
            // If new user
            if (peerIds.indexOf(uid) === -1) {
                this.setState({
                    // Add peer ID to state array
                    peerIds: [...peerIds, uid]
                })
            }
        })

        this._engine.addListener('UserOffline', (uid, reason) => {
            console.log('UserOffline', uid, reason)
            const {peerIds} = this.state
            this.setState({
                // Remove peer ID from state array
                peerIds: peerIds.filter(id => id !== uid)
            })
        })

        // If Local user joins RTC channel
        this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
            console.log('JoinChannelSuccess', channel, uid, elapsed)
            // Set state variable to true
            this.setState({
                joinSucceed: true
            })
        })
    }

    generateChannelName = () => {
        this.setState({
            channelName: Math.random().toString()
        })
    }

    /**
     * @name startCall
     * @description Function to start the call
     */
    startCall = async () => {
        // Join Channel using null token and channel name
        await this._engine?.joinChannel(this.state.token, this.state.channelName, null, 0)
    }

    /**
     * @name endCall
     * @description Function to end the call
     */
    endCall = async () => {
        await this._engine?.leaveChannel()
        this.setState({peerIds: [], joinSucceed: false})
    }

    render() {
        return (
            <View style={styles.max}>
                <View style={styles.max}>
                    <View style={styles.buttonHolder}>
                        <TouchableOpacity
                            onPress={this.startCall}
                            style={styles.button}>
                            <Text style={styles.buttonText}> Start Call </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.endCall}
                            style={styles.button}>
                            <Text style={styles.buttonText}> End Call </Text>
                        </TouchableOpacity>
                    </View>
                    {this._renderVideos()}
                </View>
            </View>
        )
    }

    _renderVideos = () => {
        const {joinSucceed} = this.state
        return joinSucceed ? (
            <View style={styles.fullView}>
                <RtcLocalView.SurfaceView
                    style={styles.max}
                    channelId={this.state.channelName}
                    renderMode={VideoRenderMode.Hidden}/>
                {this._renderRemoteVideos()}
            </View>
        ) : null
    }

    generateRandomUID = () => {
        return Math.floor(Math.random() * 10); 
    }

    _renderRemoteVideos = () => {
        const {peerIds} = this.state
        return (
            <ScrollView
                style={styles.remoteContainer}
                contentContainerStyle={{paddingHorizontal: 2.5}}
                horizontal={true}>
                {peerIds.map((value, index, array) => {
                    return (
                        <RtcRemoteView.SurfaceView
                            style={styles.remote}
                            uid={this.generateRandomUID()}
                            channelId={this.state.channelName}
                            renderMode={VideoRenderMode.Hidden}
                            zOrderMediaOverlay={true}/>
                    )
                })}
            </ScrollView>
        )
    }
}

export default connect(mapStateToProps)(VirtualSession);

const styles = StyleSheet.create({
    max: {
        flex: 1,
    },
    buttonHolder: {
        height: 100,
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#0093E9',
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
    },
    fullView: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 100,
    },
    remoteContainer: {
        width: '100%',
        height: 150,
        position: 'absolute',
        top: 5
    },
    remote: {
        width: 150,
        height: 150,
        marginHorizontal: 2.5
    },
    noUserText: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: '#0093E9',
    },
})