import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../styles/theme';
import * as Animatable from 'react-native-animatable';

const DashboardScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>Plumbing Reimagined</Text>
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
            <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => navigation.navigate('MyAccount')}
            >
                <Text style={styles.buttonText}>My Account</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
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
        color: theme.colors.primary,
        marginBottom: theme.spacing.small,
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.medium,
        paddingHorizontal: theme.spacing.large,
        borderRadius: theme.borderRadius.medium,
        marginVertical: theme.spacing.small,
        width: '80%',
        alignItems: 'center',
        ...theme.shadow,
    },
    secondaryButton: {
        backgroundColor: theme.colors.secondary,
    },
    buttonText: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
    },
});

export default DashboardScreen;