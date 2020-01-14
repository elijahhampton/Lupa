import React from 'react';

import { Provider as PaperProvider } from 'react-native-paper';

import { Provider as StoreProvider } from 'react-redux';
import { createStore } from 'redux';
import lupaRootReducer, { searchReducer } from './src/controller/redux/reducers';

import LoginView from './src/ui/components/MainViews/login/LoginView';
import AuthenticationNavigator from './src/ui/components/Navigators/AuthenticationNavigator';
//import LupaApp from './src/ui/components/Lupa';
import LupaApp from './src/ui/components/Lupa';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import LupaController from './src/controller/lupa/LupaController';

const Navigator = createAppContainer(
  createSwitchNavigator(
    {
      Auth: {
        screen: AuthenticationNavigator,
        navigationOptions: ({ navigation }) => ({
          title: "Auth",
          header: null,
          gesturesEnabled: false,
        })
      },
      App: {
        screen: LupaApp,
        navigationOptions: ({ navigation }) => ({
          title: "App",
          header: null,
          gesturesEnabled: false,
        })
      },
    },
  )
);


const LupaStore = createStore(lupaRootReducer);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    this.state = {

    }
  }

  componentDidMount = () => {
  //  this.LUPA_CONTROLLER_INSTANCE.runAppSetup();
  }

  render() {
    return (
      
      <StoreProvider store={LupaStore}>
        <PaperProvider>
          <Navigator />
        </PaperProvider>
      </StoreProvider>
    );
  }
}

export default App;
