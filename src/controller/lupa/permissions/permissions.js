import {
    Permissions,
    Platform
} from 'react-native';

export default _getPermissionsAsync = async () => {
    if (Platform.OS == 'ios') {
        const { photoPermissionsStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (photoPermissionsStatus != 'granted') {
            alert('Sorry, we need camera roll permissions to make this work.');
        }
    }
}