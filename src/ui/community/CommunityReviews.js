import React from 'react';

import {
    View,
    Text,
    ScrollView,
    Dimensions,
} from 'react-native';

import {
    Appbar,
    Paragraph,
    Divider,
} from 'react-native-paper';

import moment from 'moment';



const CommunityReviews = ({ reviews }) => {
    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView style={{flex: 1}}>
          {reviews.map(review => {
            return (
              <>
              <View style={{alignItems: 'flex-start', width: Dimensions.get('window').width, padding: 20}}>
                  <Text style={{fontFamily: 'Avenir-Medium'}}>
                    {moment(review.date_created).format('LL').toString()}
                  </Text>
                  <Paragraph style={{fontFamily: 'Avenir-Light'}}>
                    {review.text}
                  </Paragraph>
                
                </View>
                <Divider />
                </>
            )
          })}
          </ScrollView>
      </View>
    )
  }

  export default CommunityReviews;