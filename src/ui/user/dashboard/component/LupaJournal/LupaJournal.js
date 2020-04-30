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
            journalOpen: false,
            journalSurfaceHeight: new Animated.Value(380),
            showAnalyticalView: false,
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
        switch (this.state.journalDropdownValue)
        {
            case 'Lupa Assessments':
                return <AssessmentView />
        }
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
            toValue: 380,
            duration: 600,
        }).start();
    }

    render() {
        return (
            <Surface style={{alignSelf: 'center', margin: 15, padding: 15, backgroundColor: "#F2F2F2", width: Dimensions.get('window').width - 20, height: this.state.journalSurfaceHeight, borderRadius: 25, elevation: 10}}>
                    {
                        this.state.showAnalyticalView == true ?
                        <Dropdown value={this.state.journalDropdownValue} data={this.state.journalDropdownData} label="Lupa Assessments" containerStyle={{width: '100%'}} />
                        :
                        null
                    }
                
                    {
                        this.state.showAnalyticalView  == true ?
                        this.getAnalyticalView()
                        :
                        <LupaCalendar elevation={0} />
                    }

                    {
                        this.state.showAnalyticalView == true ?
                        <FAB 
                        icon="event"
                        small
                        style={{backgroundColor: "#212121", position: 'absolute', bottom: 0, right: 0, marginRight: 15, marginBottom: 15}}
                        onPress={this.handleShowCalendarView}
                        color="#FFFFFF"
                        />
                        :
                        <FAB 
                        icon="import-contacts"
                        small
                        style={{backgroundColor: "#212121", position: 'absolute', bottom: 0, right: 0, marginRight: 15, marginBottom: 15}}
                        onPress={this.showAnalyticalView}
                        color="#FFFFFF"
                        />

                    }
                
                    </Surface>
        )
    }
}

export default connect(mapStateToProps)(LupaJournal);

const styles = StyleSheet.create({
    root: {

    }
})