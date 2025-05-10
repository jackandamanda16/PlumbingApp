import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';
import { theme } from './styles/theme';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import MyAccountScreen from './screens/MyAccountScreen';
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

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Exo-font': require('./assets/fonts/Exofont.ttf'),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          ...TransitionPresets.FadeFromBottomAndroid,
          headerStyle: {
            backgroundColor: theme.colors.red, // Red #C04343
          },
          headerTintColor: theme.colors.white, // White
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'Exo-font',
          },
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyAccount"
          component={MyAccountScreen}
          options={{ headerTitle: 'My Account' }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerTitle: 'PlumbSmartAI' }}
        />
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
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
});

export default App;