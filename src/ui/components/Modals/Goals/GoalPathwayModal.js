import React from 'react'

import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import {
    Portal,
    Provider,
    Modal,
} from 'react-native-paper';

const mapStateToProps = (state, action) => {

}

const mapDispatchToProps = action => {

}

class GoalPathwayModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userHealthData: this.props.lupa_data.Users.currUserHealthData,
            goalPathwayUUID: this.props.goalPathwayUUID,
        }
    }

    return() {
        return (
            <Provider>
                <Portal>
                    <Modal contentContainerStyle={styles.modal}>
                        <Text>
                            Hello World
                        </Text>
                    </Modal>
                </Portal>
            </Provider>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        width: '80%',
        height: '85%',
    }
});



export default connect(mapStateToProps, mapDispatchToProps)(GoalPathwayModal);