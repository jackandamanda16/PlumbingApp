import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { theme } from '../styles/theme';

const SplashScreen = ({ navigation }) => {
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.8);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    useEffect(() => {
        // Fade in and scale up
        opacity.value = withTiming(1, {
            duration: 1000,
            easing: Easing.out(Easing.exp),
        });
        scale.value = withTiming(1, {
            duration: 1000,
            easing: Easing.out(Easing.exp),
        });

        // Navigate to Dashboard after 3 seconds
        const timer = setTimeout(() => {
            navigation.replace('Dashboard');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.content, animatedStyle]}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.text}>Plumbing Reimagined</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background, // White
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logo: {
        width: 250,
        height: 250,
        marginBottom: theme.spacing.large,
    },
    text: {
        ...theme.typography.title,
        color: theme.colors.primary, // Red
        fontSize: 28,
        fontWeight: '900',
        textAlign: 'center',
    },
});

export default SplashScreen;