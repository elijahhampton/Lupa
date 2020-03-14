import React from 'react';

import { Provider as PaperProvider } from 'react-native-paper';
import  {createStore} from 'redux';
import { Provider as StoreProvider} from 'react-redux';
import AuthenticationNavigator from './src/ui/navigators/AuthenticationNavigator';
import Lupa from './src/Lupa';
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
        screen: Lupa,
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
LupaStore.subscribe(() => console.log('Redux state change'))


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
