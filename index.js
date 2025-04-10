import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import lodash from 'lodash'; // Load full Lodash
global.lodash = lodash; // Make it globally available
import { registerRootComponent } from 'expo';

import App from './App';

console.log('URL polyfill loaded:', typeof URL !== 'undefined');
console.log('Lodash loaded:', typeof lodash.extend !== 'undefined');

registerRootComponent(App);