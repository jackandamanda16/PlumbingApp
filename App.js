import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './screens/DashboardScreen';
import FixtureIdentificationScreen from './screens/FixtureIdentificationScreen';
import TroubleshootingScreen from './screens/TroubleshootingScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="FixtureIdentification" component={FixtureIdentificationScreen} />
        <Stack.Screen name="Troubleshooting" component={TroubleshootingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}