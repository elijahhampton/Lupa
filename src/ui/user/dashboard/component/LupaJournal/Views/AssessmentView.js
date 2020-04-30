
import React, { useState, useEffect } from 'react';

import {
    Text,
    StyleSheet,
    View,
    Dimensions,
    TouchableOpacity,
    Animated,
} from 'react-native';
import AssessmentComponent from '../component/AssessmentComponent';

import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        lupa_data: state
    }
}

const mapDispatchToProps = dispatchEvent => {

}

class AssessmentView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            assessments: this.props.lupa_data.Assessments.generalAssessments
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {
                    this.state.assessments.map(assessment => {
                        return (
                            <AssessmentComponent 
                                assessmentObjectIn={assessment}
                                />
                        )
                    })
                }
            </View>
        )
    }
}

export default connect(mapStateToProps)(AssessmentView);