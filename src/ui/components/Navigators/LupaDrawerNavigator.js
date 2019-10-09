import Lupa from '../Lupa';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';

const DrawerNavigatorExample = createDrawerNavigator({
    //Drawer Optons and indexing
    Screen1: {
      //Title
      screen: Lupa,
      navigationOptions: {
        drawerLabel: 'Demo Screen 1',
      },
    },
  });


const options = {
    drawerTpe: 'front',
}
  export default createAppContainer(DrawerNavigatorExample, options);