import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function TroubleshootingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Troubleshooting</Text>
      <Button title="Leaking Pipe" onPress={() => {}} />
      <Button title="Low Pressure" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});