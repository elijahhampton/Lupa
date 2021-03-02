import React, {Component} from 'react'
import {
    Platform, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    Image,
    SafeAreaView,
    Dimensions, 
    ActivityIndicator
} from 'react-native'
import { Constants } from 'react-native-unimodules'
import RtcEngine, {RtcLocalView, RtcRemoteView, VideoRenderMode} from 'react-native-agora'
import { connect } from 'react-redux'
import axios from 'axios';
import LupaController from '../../../controller/lupa/LupaController';
import { getLupaUserStructurePlaceholder } from '../../../controller/firebase/collection_structures';
import { LupaUserStructure } from '../../../controller/lupa/common/types';
import FeatherIcon from 'react-native-vector-icons/Feather'
import { Surface, Button, Caption, FAB } from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import LUPA_DB from '../../../controller/firebase/firebase'
import VirtualLiveWorkout from '../../workout/modal/VirtualLiveWorkout'
interface Props {
    booking: Object
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
    uid: number,
    tokenLoaded: boolean,
    trainerData: LupaUserStructure,
    requesterData: LupaUserStructure,
    componentDidError: boolean,
    isFirstSession: boolean,
    firstSessionTimer: 100,
}

//VIRTUAL TO DO - set countdown timer and exit out of session

const mapStateToProps = (state, props) => {
    return {
        lupa_data: state
    }
}

class VirtualSession extends Component<Props, State> {
    _engine?: RtcEngine
    LUPA_CONTROLLER_INSTANCE?: LupaController

    constructor(props) {
        super(props)
        this.state = {
            appId: 'fd515bbb863a43fa8dd6e89f2b3bfaeb',
            token: null,
            channelName: 'OOP', //Randomly generate number
            joinSucceed: false,
            peerIds: [],
            uid: 0,
            tokenLoaded: false,
            trainerData: getLupaUserStructurePlaceholder(),
            requesterData: getLupaUserStructurePlaceholder(),
            componentDidError: false,
            isFirstSession: this.props.isFirstSession,
            firstSessionTimer: 100,
            showVirtualLiveWorkout: false,
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    }

    async componentDidMount() {
        await this.generateUserData()
        await this.generateUID();
        await this.generateChannelName();
        await this.generateToken();
        await this.init();
    }

    generateUserData = async () => {
        const { booking } = this.props;
        console.log('@@@@@@@@@@')
        console.log(booking);
        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(booking.trainer_uuid).then(data => {
            this.setState({ trainerData: data })
        }).catch(error => {
            this.setState({ componentDidError: true });
        })

        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(booking.requester_uuid).then(data => {
            this.setState({ requesterData: data })
        }).catch(error => {
            this.setState({ componentDidError: true })
        })
    }

    generateUID = async () => {
        const uuid = await Math.floor(Math.random() * Math.floor(20));
        await this.setState({
            uid: uuid
        });
    }

    generateToken = async () => {
        await axios({
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            url: "https://us-central1-lupa-cd0e3.cloudfunctions.net/generateAgoraTokenFromUUID",
            data: JSON.stringify({
                uid: this.state.uid,
                channel_name: this.state.channelName,
            })
        }).then(response => {
            console.log(response)
            console.log(response.data);
            this.setState({ 
                token: response.data.token,
                tokenLoaded: true 
            })
            console.log(response);
        }).catch(err => {
            console.log('AAAAAAA')
            console.log(err)
        })
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

    generateChannelName = async () => {
        const trainerUUID = this.state.trainerData.user_uuid;
        const requesterUUID = this.state.requesterData.user_uuid;
        
        if (trainerUUID.toString().charAt(0) < requesterUUID.toString().charAt(0)) {
            await this.setState({
                channelName: trainerUUID.toString() + requesterUUID.toString()
            })
        } else {
            await this.setState({
                channelName: requesterUUID.toString() + trainerUUID.toString()
            })
        }
    }

    /**
     * @name startCall
     * @description Function to start the call
     */
    startCall = async () => {
        // Join Channel using null token and channel name
        await this._engine?.joinChannel(this.state.token, this.state.channelName, null, 0).then(() => {
           
        }).catch(error => {
            console.log(error)
        });
    }

    /**
     * @name endCall
     * @description Function to end the call
     */
    endCall = async () => {
        await this._engine?.leaveChannel()
        this.setState({peerIds: [], joinSucceed: false})
        this.props.closeSession();
        //this.props.navigation.pop();
    }

    getDisplayImageURI = () => {
        if (this.props.lupa_data.Users.currUserData.user_uuid == this.state.trainerData.user_uuid) {
            return this.state.requesterData.photo_url;
        } else {
            return this.state.trainerData.photo_url;
        }
    }

    renderVirtualHeaderContent = () => {
        if (this.state.joinSucceed == true) {
            return (
        <View style={{marginVertical: 10, alignItems: 'flex-end', padding: 20, width: Dimensions.get('window').width, backgroundColor: 'transparent', alignSelf: 'center', position: 'absolute', top: 0}}>
                  <TouchableOpacity  onPress={this.endCall}>
              <Caption style={{color: 'white'}}>
                  Leave Session
              </Caption>
              </TouchableOpacity>
          </View>
            )
        }
    }

    renderJoinSessionView = () => {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: 'rgb(255, 255, 255)', justifyContent: 'space-between'}}>
                <View style={{width: '100%', padding: 5, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                   <Text>
                       
                   </Text>
                    <Text style={{alignSelf: 'center', fontWeight: '600', color: 'rgb(188, 188, 188)', fontSize: 15}}>
                        Remote Session
                    </Text>

                    <Text>

                    </Text>
                </View>

                <View style={{alignItems: 'center', borderWidth: 70, borderRadius: 110, width: 100, height: 110, alignSelf: 'center', borderColor: 'rgb(215, 238, 252)', justifyContent: 'center'}}>
                    <Surface style={{elevation: 0, borderRadius: 110, width: 110, height: 110}}>
                            <Image style={{borderRadius: 110, width: '100%', height: '100%'}} source={{ uri: this.getDisplayImageURI() }} />
                    </Surface>
                </View>


                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                    <TouchableOpacity onPress={this.startCall}>
                    <View style={{alignItems: 'center'}}>
                    <Surface style={{elevation: 0, backgroundColor: 'rgb(32, 211, 104)', height: 70, width: 70, borderRadius: 70, alignItems: 'center', justifyContent: 'center'}}>
                            <MaterialIcon name="local-phone" size={24} color="white" />
                    </Surface>
                    <Caption>
                        Join Session
                    </Caption>
                    </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={this.endCall}>
                    <View style={{alignItems: 'center'}}>
                    <Surface style={{elevation: 0, backgroundColor: 'rgb(246, 61, 70)', height: 70, width: 70, borderRadius: 70, alignItems: 'center', justifyContent: 'center'}}>
                            <MaterialIcon name="close" size={24} color="white" />
                    </Surface>
                    <Caption>
                        Leave Session
                    </Caption>
                    </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    renderComponentView = () => {
        if (!this.state.joinSucceed) {
            return this.renderJoinSessionView();
        }

        if (this.state.joinSucceed) {
            return this._renderRemoteVideos()
        }
    }
      
      renderVirtualLiveWorkout = () => {
          if (this.state.joinSucceed == true) {
              if (this.props.isFirstSession == false) {
                return <VirtualLiveWorkout 
                isVisible={true} 
                uuid={this.props.programUID} 
                sessionID={this.props.sessionID}
                currentWeek={this.props.currentWeek}
                currentDay={this.props.currentDay}
                />
              }
          }
      }

    render() {
        return (
            <View style={styles.max}>
                <View style={styles.max}>
                    {
                        this.state.tokenLoaded === true ?
                        <View style={{flex: 1}}>
                       {this.renderComponentView()}
                    </View>
                    :
                    <View style={{flex: 1}}>
                        <ActivityIndicator animating={true} color="#23374d" />
                    </View>
                    }
                    
                </View>
    
            {this.renderVirtualLiveWorkout()}
            {this.renderVirtualHeaderContent()}
            </View>
        )
    }

    generateRandomUID = () => {
        return Math.floor(Math.random() * 10); 
    }

    _renderRemoteVideos = () => {
        const {peerIds} = this.state;
        return (
            <View style={styles.remoteContainer}>
                 <RtcLocalView.SurfaceView
                    style={styles.max}
                    channelId={this.state.channelName}
                    renderMode={VideoRenderMode.Hidden}/>
                {
                peerIds.map((value, index, array) => {
                    return (
                        <RtcRemoteView.SurfaceView
                            style={styles.remote}
                            uid={value}
                            channelId={this.state.channelName}
                            renderMode={VideoRenderMode.Hidden}
                            zOrderMediaOverlay={false}/>
                    )
                })
                }   
            </View>
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
        flex: 1,
    },
    remote: {
        flex: 1,
        backgroundColor: 'red',
    },
    noUserText: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: '#0093E9',
    },
})