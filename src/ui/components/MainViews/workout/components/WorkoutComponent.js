import React from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import {
    Caption,
    Chip,
    Divider,
    Title,
    Headline,
    Modal,
    Provider,
} from 'react-native-paper';

import { connect } from 'react-redux';

import { WORKOUT_MODALITY } from '../../../../../controller/lupa/common/types.ts';
import WorkoutModal from '../../../Modals/Workout/WorkoutModal';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

/* MaterialUI #400s */
const getChipBackgroundColor = workoutType => {
    switch(workoutType)
    {
        case "calisthenics":
            return "#29B6F6"
        case "weightlifting":
            return "#ef5350"
        case "metabolic":
            return "#FFEE58"
    }
}

class WorkoutComponent extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            workoutModalIsOpen: true,
        }
    }

    _handleOpenWorkoutModal = () => {
        this.setState({ workoutModalIsOpen: true })
    }

    _handleCloseWorkoutModal = () => {
        this.setState({ workoutModalIsOpen: false })
    }


    render() {
        return (
            <TouchableOpacity onPress={() => this.props.navigateMethod()}>
                            <View style={{display: 'flex', flexDirection: 'column', width: '100%', height: 'auto', padding: 5}}>
            <View style={{justifyContent: 'flex-start'}}>
            <Title>
               {this.props.pathwayName}
            </Title>
            <Text numberOfLines={2} ellipsizeMode="tail">
                {this.props.pathwayDescription}
            </Text>
            </View>
            <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', padding: 5}}>
            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                {this.props.iterationsCompleted} Iterations Completed
            </Text>
            <Chip mode="flat" style={{width: "auto", height: 25, elevation: 3, backgroundColor: getChipBackgroundColor(this.props.workoutModality)}}>
            <Caption style={{alignSelf: 'flex-end'}}>
                    {this.props.workoutModality}
            </Caption>
            </Chip>
            </View>
        </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    root: {

    }
})

export default connect(mapStateToProps)(WorkoutComponent);