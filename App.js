import React from 'react';

import { Provider as PaperProvider } from 'react-native-paper';

import LoginView from './src/ui/components/MainViews/login/LoginView';
//import LupaApp from './src/ui/components/Lupa';
import LupaApp from './src/ui/components/Navigators/LupaDrawerNavigator';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const Navigator = createAppContainer(
  createStackNavigator(
  {
    Auth: {
      screen: LoginView,
      navigationOptions: ({navigation}) => ({
        title: "Auth",
        header: null,
        gesturesEnabled: false,
      })
    },
    App: {
      screen: LupaApp,
      navigationOptions: ({navigation}) => ({
        title: "Auth",
        header: null,
        gesturesEnabled: false,
      })
    },
  },
)
);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
    }
  }

  render() {
    return (
      <PaperProvider>
        <Navigator />
      </PaperProvider>
    );
  }
}

export default App;
