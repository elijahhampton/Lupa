import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Modal,
    ScrollView,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import {
    Paragraph,
    Title,
    Headline,
    IconButton,
    Surface,
    Checkbox,
    Caption
} from 'react-native-paper';

import {
    Header,
    Left,
    Right,
    Container
} from 'native-base';

import { Svg, Ellipse } from 'react-native-svg';

import { connect } from 'react-redux';

import { getAllGoalStructures } from '../../../../model/data_structures/workout/goal_structures';

import { Feather as FeatherIcon } from '@expo/vector-icons';

import LupaController from '../../../../controller/lupa/LupaController';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

class GoalsModal extends React.Component {
    constructor(props) {
        super(props);

        //Create an instance of the Lupa Controller
        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            goalClicked: false,
            goals: [],
            userGoalsDataUpdated:  [],
        }

        this.handleGoalOnPress = this.handleGoalOnPress.bind(this);
    }

    componentDidMount = async () => {
        await this.setupComponent();
    }

    setupComponent = async () => {
        let goalStructures = await getAllGoalStructures();

        let healthDataIn;
        await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserHealthData().then(result => {
            healthDataIn = result.goals;
        })

        await this.setState({ goals: goalStructures, userGoalsDataUpdated: healthDataIn })
    }

    /**
     * 
     */
    _getGoalCaptionColor = (uid) => {
       let goalsArray = this.state.userGoalsDataUpdated;

        for (let i = 0; i < goalsArray.length; i++)
        {
            if (goalsArray[i].goal_uuid == uid)
            {
                return "#2196F3"
            }
            else
            {

                return "grey"
            }
        }
    }

    mapGoalsWithSurface = () => {
        return this.state.goals.map((val, index, arr) => {
            return (
                <TouchableOpacity onPress={() => this.handleGoalOnPress(val.uid)} style={{width: '45%', height: 120, margin: 5}}>
                                    <Surface style={{flexDirection: 'column', width: '100%', height: '100%', borderRadius: 15, backgroundColor: 'white', elevation: 15,}}>
                    <Caption key={val.uid} style={{alignSelf: 'center', color: this._getGoalCaptionColor(val.uid), height: "auto"}} >
                        Activated
                    </Caption>

                <View style={{flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', padding: 10}}>
                    <Title>
                        {val.name}
                    </Title>
                    <Text numberOfLines={3} >
                       {val.description}
                    </Text>
                </View>
            </Surface>
                </TouchableOpacity>
            )
        })
    }

        /**
     * handleGoalOnPress
     * 
     * Defines what happens when the onPress method for a goal.
     * param[in] uuid UUID for the goal
     */
    async handleGoalOnPress(uuid) {
        if (this.state.userGoalsDataUpdated.includes(uuid))
        {
            let currArr = this.state.userGoalsDataUpdated;
            let updatedArr = currArr.splice(this.state.userGoalsDataUpdated.indexOf(uuid), 1);
            await this.setState({ userGoalsDataUpdated: updatedArr });
            await  this.LUPA_CONTROLLER_INSTANCE.removeGoalForCurrentUser(uuid);
        }
        else if (!this.state.userGoalsDataUpdated.includes(uuid))
        {
            let currArr = this.state.userGoalsDataUpdated;
            currArr.push(uuid);
            await this.setState({ userGoalsDataUpdated: currArr });
            await this.LUPA_CONTROLLER_INSTANCE.addGoalForCurrentUser(uuid);
        }
        
    }

    render() {
        return (
            <Modal visible={this.props.isOpen} presentationStyle="fullScreen" style={styles.modal}>
                <Container style={{flex: 1, backgroundColor: "white"}}>
                <Header style={{backgroundColor: '#FFFFFF'}} transparent >
                    <Right>
                        <Text style={{fontSize: 30, fontWeight: '600'}}>
                            Goals
                        </Text>
                    </Right>
                </Header>
                <Svg
    height="500"
    width="550"
    style={{position: 'absolute', left: 0, top: 0}}
>
    <Ellipse
        cx="30"
        cy="110"
        rx="250"
        ry="300"
        fill="#2196F3"
    />
</Svg>

<Svg
    height="600"
    width="550"
    style={{position: 'absolute', right: 0, bottom: 0}}
>
    <Ellipse
        cx="500"
        cy="560"
        rx="150"
        ry="110"
        fill="#2196F3"
    />
</Svg>
                

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'}}>
                        {
                            this.mapGoalsWithSurface()
                        }
                    </View>
                </View>
                    </View>
                    <TouchableOpacity onPress={() => this.props.closeModalMethod()}>
                <Surface style={{alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', elevation: 8, width: 60, height: 60, borderRadius: 60, position: 'absolute', bottom: 20}}>
                        <FeatherIcon name="x" size={20} />
                </Surface>
                </TouchableOpacity>
                </Container>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        display: 'flex',
        margin: 0,
        backgroundColor: 'white',
        flex: 1,
    }
});

export default connect(mapStateToProps)(GoalsModal);