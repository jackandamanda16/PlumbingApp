import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function DashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plumbing App Dashboard</Text>
      <Button
        title="Fixture Identification"
        onPress={() => navigation.navigate('FixtureIdentification')}
      />
      <Button
        title="Troubleshooting"
        onPress={() => navigation.navigate('Troubleshooting')} // Updated to navigate
      />
      <Button title="Sizing Calculators" onPress={() => {}} />
      <Button title="Code Reference" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});