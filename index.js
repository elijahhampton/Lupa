import { AppRegistry, Platform } from 'react-native';
import App from './App';

try {
  AppRegistry.registerComponent('Lupa', () => App);

if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('main');
  AppRegistry.runApplication('Lupa', { rootTag });
}
} catch(err) {
  console.log('got emm aaaaaaaaaaaaaaaa')
}
