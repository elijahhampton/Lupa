import React from 'react';

import {
    Image,
    Text,
    View,
    Dimensions,
    Button as NativeButton,
} from 'react-native';

import {
    Surface
} from 'react-native-paper';

export default class UpcomingSessionCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sessionData: this.props.sessionDataObject,
            userData: this.props.userDataObject,
        }
    }
    
    getSessionStartTime = () => {
        let times = this.state.sessionData.time_periods.sort();
        return times[0];
    }

    render() {
        return (
            <Surface style={{flexDirection: "row", alignItems: "center", elevation: 8,  backgroundColor: "white", width: Dimensions.get('window').width - 20, height: 80, margin: 10, borderRadius: 20}}>
                <Surface style={{margin: 10, elevation: 10, width: 65, height: 65, borderRadius: 80}}>
                    <Image  style={{width: 65, height: 65, borderRadius: 80}} source={{uri: this.state.userData.photo_url}} />
                </Surface>
                <View>
                    <Text style={{fontFamily: "avenir-roman"}}>
                        {this.state.userData.display_name}
                    </Text>
                    <Text style={{fontFamily: "avenir-book"}}>
                        {this.state.sessionData.locationData.name}
                    </Text>
                    <Text style={{fontFamily: "avenir-book"}}>
                    {this.state.sessionData.locationData.address}
                    </Text>
                    <Text style={{fontFamily: "avenir-next-bold", fontWeight: "bold"}}>
                        {this.getSessionStartTime()}
                    </Text>
                </View>
            </Surface>
        )
    }
}