import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TroubleshootingScreen = () => {
    const navigation = useNavigation();

    const waterHeaterTypes = [
        'Gas Atmospheric Water Heater',
        'Gas Power Vent Water Heater',
        'Gas Direct Vent Water Heater',
        'Electric Water Heater',
        'Hybrid Water Heater',
        'Gas Tankless Water Heater',
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Troubleshooting</Text>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {waterHeaterTypes.map((type, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.button}
                        onPress={() => navigation.navigate(type.replace(/\s+/g, ''))}
                    >
                        <Text style={styles.buttonText}>{type}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    scrollContainer: {
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default TroubleshootingScreen;