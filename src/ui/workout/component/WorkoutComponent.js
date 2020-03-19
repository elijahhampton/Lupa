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
} from 'react-native-paper';

import { connect } from 'react-redux';

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
                            <View style={{alignSelf: 'center', borderRadius: 10, backgroundColor: 'white', margin: 5, justifyContent: 'space-around', display: 'flex', flexDirection: 'column', width: '95%', height: 'auto', padding: 15}}>
            <View style={{justifyContent: 'space-between', flexDirection: 'row', padding: 5, alignItems: 'center'}}>
            <Text style={{fontSize: 16, fontWeight: "600", padding: 3, color: "#212121"}}>
               {this.props.pathwayName}
            </Text>
            <Chip mode="flat" style={{width: "auto", height: 25, elevation: 3, backgroundColor: getChipBackgroundColor(this.props.workoutModality)}}>
            <Caption style={{alignSelf: 'flex-end'}}>
                    {this.props.workoutModality}
            </Caption>
            </Chip>

            </View>
            
            <Caption numberOfLines={3} ellipsizeMode="tail">
                {this.props.pathwayDescription}
            </Caption>
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