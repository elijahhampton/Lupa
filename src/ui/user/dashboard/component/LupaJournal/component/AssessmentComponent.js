import React, { useState } from 'react';

import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';

import {
    Surface,
    Caption,
} from 'react-native-paper';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import AssessmentModal from '../../../modal/AssessmentReviewModal';
import AssessmentReviewModal from '../../../modal/AssessmentReviewModal'

function AssessmentComponent(props) {
    let [reviewModalVisible, showReviewModal] = useState(false);

    function showReviewModalWrapper() {
        showReviewModal(true)
    }

    function closeReviewModalWrapper() {
        showReviewModal(false)
    }

    const assessmentObject = props.assessmentObjectIn;
    
    return (
        <TouchableOpacity onPress={showReviewModalWrapper} disabled={assessmentObject.assessment_available} style={{margin: 3}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Surface style={{margin: 5, width: 10, height: 10, borderRadius: 10, backgroundColor: assessmentObject.assessment_colors[0]}} />
                <Text style={{fontSize: 13, fontWeight: '500'}}>
               {assessmentObject.assessment_acronym}
            </Text>
                </View>

            {
                assessmentObject.assessment_available ?
                <Caption>
                    Available
                </Caption>
                :
                <Caption>
                    Unavailable
                </Caption>
            }
            </View>
        </View>
        <View style={{paddingLeft: 20}}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize: 12, fontWeight: '500'}}>
         {assessmentObject.assessment_title}
        </Text>
        <Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize: 10}}>
           {assessmentObject.assessment_description}
        </Text>
        </View>
        <AssessmentReviewModal isVisible={reviewModalVisible} closeModalMethod={closeReviewModalWrapper} assessmentObjectIn={assessmentObject}/>
</TouchableOpacity>
    )
}

export default AssessmentComponent;