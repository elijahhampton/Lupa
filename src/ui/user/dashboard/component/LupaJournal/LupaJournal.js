import React, { useState, useEffect } from 'react';

import {
    Text,
    StyleSheet,
    View,
    Dimensions,
    TouchableOpacity,
    Animated,
} from 'react-native';

import {
    Surface, FAB
} from 'react-native-paper';

import { Dropdown } from 'react-native-material-dropdown';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LupaCalendar from '../../calendar/LupaCalendar';

import { connect } from 'react-redux';
import AssessmentModal from '../../modal/AssessmentModal';
import AssessmentReviewModal from '../../modal/AssessmentReviewModal';
import { LinearGradient } from 'expo-linear-gradient';

import LupaController from '../../../../../controller/lupa/LupaController';
import AssessmentView from './Views/AssessmentView';
import { Constants } from 'react-native-unimodules';

const mapStateToProps = state => {
    return {
        lupa_data: state
    }
}

const mapDispatchToProps = dispatchEvent => {

}

class LupaJournal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            journalOpen: this.props.showJournal,
            journalSurfaceHeight: new Animated.Value(450),
            showAnalyticalView: this.props.showJournal,
            journalDropdownData: [
                {
                    value: 'Lupa Assessments'
                },
            ],
            journalDropdownValue: 'Lupa Assessments'
        }
    }

    componentDidMount() {

    }

    generateUserAssessmentData() {

    }

    getAnalyticalView = () => {
        return <AssessmentView />
    }

    showAnalyticalView = () => {
        this.setState({ showAnalyticalView: true })
        Animated.timing(this.state.journalSurfaceHeight, {
            toValue: Dimensions.get('window').height  - 150,
            duration: 600,
        }).start();
    }

    handleShowCalendarView = () => {
        this.setState({ showAnalyticalView: false })
        Animated.timing(this.state.journalSurfaceHeight, {
            toValue: 400,
            duration: 600,
        }).start();
    }

    render() {
        return (
            <Surface style={{alignSelf: 'center', margin: 15, padding: 15, backgroundColor: "#FFFFFF", width: '95%', height: this.state.journalSurfaceHeight, borderRadius: 25, elevation: 2}}>
                        <AssessmentView />
                    </Surface>
        )
    }
}

export default connect(mapStateToProps)(LupaJournal);

const styles = StyleSheet.create({
    root: {

    }
})