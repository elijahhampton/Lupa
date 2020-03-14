
import { createAppContainer } from 'react-navigation';

import { createStackNavigator } from 'react-navigation-stack';
import WorkoutView from '../workout/WorkoutView'
import WorkoutModal from '../workout/modal/WorkoutModal';

const WorkoutViewNavigator = createStackNavigator(
    {
    WorkoutView: {
        screen: WorkoutView,
        navigationOptions: ({ navigation }) => ({
            title: 'WorkoutView',
            header: null,
            gesturesEnabled: false,
        })
    },
    WorkoutModal: {
        screen: WorkoutModal,
        navigationOptions: ({ navigation }) => ({
            title: 'WorkoutModal',
            header: null,
            gesturesEnabled: false,
        })
    },
    },
    {
    initialRouteName: 'WorkoutView',
    }
);

export default createAppContainer(WorkoutViewNavigator);