import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../styles/theme';

const DashboardScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>Efficency Reimagined</Text>
            <Text style={styles.subtitle}>Solve plumbing issues with ease</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Troubleshooting')}
            >
                <Text style={styles.buttonText}>Troubleshoot Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => navigation.navigate('FixtureIdentification')}
            >
                <Text style={styles.buttonText}>Identify Fixtures</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background, // White
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.large,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: theme.spacing.large,
    },
    title: {
        ...theme.typography.title,
        color: theme.colors.primary, // Red
        marginBottom: theme.spacing.small,
    },
    subtitle: {
        ...theme.typography.subtitle,
        color: theme.colors.text, // Black
        marginBottom: theme.spacing.large,
    },
    button: {
        backgroundColor: theme.colors.primary, // Red
        paddingVertical: theme.spacing.medium,
        paddingHorizontal: theme.spacing.large,
        borderRadius: theme.borderRadius.medium,
        marginVertical: theme.spacing.small,
        width: '80%',
        alignItems: 'center',
        ...theme.shadow,
    },
    secondaryButton: {
        backgroundColor: theme.colors.secondary, // Black
    },
    buttonText: {
        ...theme.typography.body,
        color: theme.colors.textSecondary, // White
        fontWeight: 'bold',
    },
});

export default DashboardScreen;