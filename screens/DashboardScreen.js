import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Reanimated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

const DashboardScreen = () => {
  const navigation = useNavigation();

  // Reanimated values for animations
  const logoScale = useSharedValue(1);
  const buttonGlowOpacity = useSharedValue(0);

  // Single pulse animation for logo
  useEffect(() => {
    logoScale.value = withSpring(1.1, { stiffness: 100, damping: 10 });
  }, []);

  // Glow animation for buttons on press
  const handleButtonPressIn = () => {
    buttonGlowOpacity.value = withTiming(1, { duration: 200 });
  };

  const handleButtonPressOut = () => {
    buttonGlowOpacity.value = withTiming(0, { duration: 200 });
  };

  // Animated style for logo
  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
    };
  });

  // Animated style for button glow
  const animatedGlowStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonGlowOpacity.value,
    };
  });

  return (
    <LinearGradient
      colors={['#C04343', '#000000']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Reanimated.View style={animatedLogoStyle}>
          <Image
            source={require('../assets/logobw.png')} // Use the same logo as LoginScreen and SignupScreen
            style={styles.logo}
            resizeMode="contain"
          />
        </Reanimated.View>
        <Text style={styles.title}>Plumbing Reimagined</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Troubleshooting')}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Reanimated.View style={[styles.glowOverlay, animatedGlowStyle]} />
          <Text style={styles.buttonText}>Troubleshoot Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('FixtureIdentification')}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Reanimated.View style={[styles.glowOverlay, animatedGlowStyle]} />
          <Text style={styles.buttonText}>Identify Fixtures</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('MyAccount')}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Reanimated.View style={[styles.glowOverlay, animatedGlowStyle]} />
          <Text style={styles.buttonText}>My Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 300, // Match LoginScreen and SignupScreen logo size
    height: 300,
    marginBottom: 15,
    shadowColor: '#C04343',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  title: {
    fontFamily: 'Exo-font',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
    textShadowColor: 'rgba(192, 67, 67, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  button: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 5,
    width: '90%', // Match LoginScreen and SignupScreen button width
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#C04343',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  secondaryButton: {
    // Keep the same styling as primary button (no color change needed)
  },
  buttonText: {
    fontFamily: 'Exo-font',
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 5,
    backgroundColor: 'rgba(192, 67, 67, 0.3)',
    shadowColor: '#C04343',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
});

export default DashboardScreen;