import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GasPowerVentWaterHeater = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gas Power Vent Water Heater Troubleshooting</Text>
            <Text>Placeholder for troubleshooting steps.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
});

export default GasPowerVentWaterHeater;