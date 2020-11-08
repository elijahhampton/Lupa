import RtcEngine from 'react-native-agora';

export const AGORA_APP_ID = "fd515bbb863a43fa8dd6e89f2b3bfaeb";


async function initRtcEngine() : Promise<RtcEngine> {
    // Pass in the App ID to initialize the RtcEngine object.
    const engine = await RtcEngine.create(AGORA_APP_ID)
    // Enable the video module.
    await engine.enableVideo()
    // Listen for the JoinChannelSuccess callback.
    // This callback occurs when the local user successfully joins the channel.
    engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => onJoinChannelSuccess(channel, uid, elapsed))
    // Listen for the UserJoined callback.
    // This callback occurs when the remote user successfully joins the channel.
    engine.addListener('UserJoined', (uid, elapsed) => onUserJoined(uid, elapsed))
    // Listen for the UserOffline callback.
    // This callback occurs when the remote user leaves the channel or drops offline.
    engine.addListener('UserOffline', (uid, reason) => onUserOffline(uid, reason))

    return engine;
}

function onJoinChannelSuccess(channel, uid, elapsed) {

}

function onUserJoined(uid, elapsed) {

}

function onUserOffline(uid, reason) {

}