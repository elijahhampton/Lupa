import React from 'react';

import { Provider as PaperProvider } from 'react-native-paper';
import  {createStore} from 'redux';
import { Provider as StoreProvider} from 'react-redux';
import AuthenticationNavigator from './src/ui/components/Navigators/AuthenticationNavigator';
import LupaApp from './src/ui/components/Lupa';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import LupaController from './src/controller/lupa/LupaController';
import LupaReducer from './src/controller/redux/reducers';

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

const LupaStore = createStore(LupaReducer);
LupaStore.subscribe(() => console.log(LupaStore.getState()))


class App extends React.Component {
  constructor(props) {
    super(props);

    this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
  }

  componentDidMount = () => {
    this.setupApp();
  }
  
  setupApp = async () => {
    await this.LUPA_CONTROLLER_INSTANCE.runAppSetup();
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
