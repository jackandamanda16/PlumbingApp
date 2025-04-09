import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './screens/DashboardScreen';
import FixtureIdentificationScreen from './screens/FixtureIdentificationScreen';
import TroubleshootingScreen from './screens/TroubleshootingScreen';
import GasAtmosphericWaterHeater from './screens/GasAtmosphericWaterHeater';
import GasPowerVentWaterHeater from './screens/GasPowerVentWaterHeater';
import GasDirectVentWaterHeater from './screens/GasDirectVentWaterHeater';
import ElectricWaterHeater from './screens/ElectricWaterHeater';
import HybridWaterHeater from './screens/HybridWaterHeater';
import GasTanklessWaterHeater from './screens/GasTanklessWaterHeater';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="FixtureIdentification" component={FixtureIdentificationScreen} />
        <Stack.Screen name="Troubleshooting" component={TroubleshootingScreen} />
        <Stack.Screen name="GasAtmosphericWaterHeater" component={GasAtmosphericWaterHeater} />
        <Stack.Screen name="GasPowerVentWaterHeater" component={GasPowerVentWaterHeater} />
        <Stack.Screen name="GasDirectVentWaterHeater" component={GasDirectVentWaterHeater} />
        <Stack.Screen name="ElectricWaterHeater" component={ElectricWaterHeater} />
        <Stack.Screen name="HybridWaterHeater" component={HybridWaterHeater} />
        <Stack.Screen name="GasTanklessWaterHeater" component={GasTanklessWaterHeater} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}