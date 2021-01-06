import React from 'react';

import {
    View,
    Text,
} from 'react-native';
import { Divider } from 'react-native-paper';

const CommunityEvents = ({ events }) => {

    const renderCommunityEvents = () => {
        for (dateString in events) {
            let currDailyEvents = events[dateString.toString()].daily_events;
            return (
                <>
                    <View style={{padding: 10}}>
                        <Text style={{fontFamily: 'Avenir-Heavy'}}>
                            {dateString}
                        </Text>
                        <View>
                            {
                                currDailyEvents.map(dEvent => {
                                    return (
                                        <View style={{borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 5, padding: 10, margin: 10}}>
                                        <Text>
                                            {dEvent.name}
                                        </Text>
                                        <Text>
                                            {dEvent.details}
                                        </Text>
                                        <Text>
                                            {dEvent.startTime - dEvent.endTime}
                                        </Text>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                    <Divider style={{marginVertical: 5, height: 5, backgroundColor: '#EEEEEE' }} />
                </>
            )
        }
    }

    return (
        <View style={{flex: 1}}>
                {renderCommunityEvents()}
      </View>
    )
}

export default CommunityEvents;