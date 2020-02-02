import React from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Modal
} from 'react-native';

import {
    Caption,
    Chip,
    Divider,
    Title,
    Headline,
    Provider,
    Portal,
    IconButton,
} from 'react-native-paper';

import { connect } from 'react-redux';

import { WORKOUT_MODALITY } from '../../../../controller/lupa/common/types';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}


class WorkoutModal extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            
        }
    }


    render() {
        return (
              <Modal animationType="fade" visible={this.props.isOpen} presentationStyle="fullScreen" style={styles.modal}>
                  <IconButton onPress={() => this.props.closeModalMethod()} icon="clear"/>
                    <Text>
                        Hello World
                    </Text>
                </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        padding: 8,
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'center',
    }
})

export default connect(mapStateToProps)(WorkoutModal);