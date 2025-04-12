import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../styles/theme';

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
            <Text style={styles.title}>Troubleshooting</Text>
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
        backgroundColor: theme.colors.background, // White
        padding: theme.spacing.large,
    },
    title: {
        ...theme.typography.title,
        color: theme.colors.primary, // Red
        textAlign: 'center',
        marginBottom: theme.spacing.large,
    },
    scrollContainer: {
        alignItems: 'center',
    },
    button: {
        backgroundColor: theme.colors.secondary, // Black
        padding: theme.spacing.medium,
        borderRadius: theme.borderRadius.medium,
        marginVertical: theme.spacing.small,
        width: '80%',
        alignItems: 'center',
        ...theme.shadow,
    },
    buttonText: {
        ...theme.typography.body,
        color: theme.colors.textSecondary, // White
        fontWeight: 'bold',
    },
});

export default TroubleshootingScreen;