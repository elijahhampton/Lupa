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
        case WORKOUT_MODALITY.CALISTHENICS:
            return "#29B6F6"
        case WORKOUT_MODALITY.WEIGHTLIFTING:
            return "#ef5350"
        case WORKOUT_MODALITY.METABOLIC:
            return "#FFEE58"
    }
}

class WorkoutComponent extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            workoutModalIsOpen: false,
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
            <>
            <TouchableOpacity onPress={() => this._handleOpenWorkoutModal()}>
                            <View style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 'auto', padding: 5}}>
            <View style={{justifyContent: 'flex-start'}}>
            <Title>
                Goal Pathway Name
            </Title>
            <Text numberOfLines={2} ellipsizeMode="tail">
                This is a long paragraph about the goal pathway here and what you have to do to accomplish it
            </Text>
            </View>
            <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', padding: 5}}>
            <Caption>
                5 Iterations
            </Caption>
            <Chip mode="flat" style={{width: "auto", height: 25, elevation: 3, backgroundColor: getChipBackgroundColor(this.props.workoutModality)}}>
            <Caption style={{alignSelf: 'flex-end'}}>
                    {this.props.workoutModality}
            </Caption>
            </Chip>
            </View>
        </View>
            </TouchableOpacity>
            <WorkoutModal isOpen={this.state.workoutModalIsOpen} closeModalMethod={this._handleCloseWorkoutModal} />
            </>
        )
    }
}

const styles = StyleSheet.create({
    root: {

    }
})

export default connect(mapStateToProps)(WorkoutComponent);