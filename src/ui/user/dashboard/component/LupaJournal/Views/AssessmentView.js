
import React, { useState, useEffect } from 'react';

import {
    ScrollView,
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
            <ScrollView style={{flex: 1}}>
                {
                    this.state.assessments.map(assessment => {
                        return (
                            <AssessmentComponent 
                                assessmentObjectIn={assessment}
                                />
                        )
                    })
                }
            </ScrollView>
        )
    }
}

export default connect(mapStateToProps)(AssessmentView);