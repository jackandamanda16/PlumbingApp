import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { theme } from '../styles/theme';
import LinearGradient from 'react-native-linear-gradient'; // Import for gradient background
import * as Animatable from 'react-native-animatable'; // Import for entrance animations
import Reanimated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming } from 'react-native-reanimated'; // Import Reanimated

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Reanimated values for animations
  const logoScale = useSharedValue(1); // For pulsing logo
  const buttonGlowOpacity = useSharedValue(0); // For button glow on press

  // Pulsing animation for logo
  useEffect(() => {
    logoScale.value = withRepeat(
      withSpring(1.1, { stiffness: 100, damping: 10 }),
      -1, // Infinite loop
      true // Reverse
    );
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

  const handleLogin = () => {
    console.log('Login with:', { username, password });
    navigation.replace('Dashboard');
  };

  const handleForgotPassword = () => {
    console.log('Forgot password for:', { username });
    alert('Password reset link sent (placeholder)');
  };

  return (
    <LinearGradient
      colors={['#C04343', '#000000']} // Gradient from red (#C04343) to black
      style={styles.container}
    >
      <Reanimated.View style={animatedLogoStyle}>
        <Animatable.Image
          animation="zoomIn"
          duration={1000}
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Reanimated.View>
      <Animatable.Text
        animation="fadeInDown"
        duration={800}
        style={styles.title}
      >
        Welcome to PlumbSmartAI
      </Animatable.Text>
      <Animatable.View animation="fadeInUp" duration={800} delay={200}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="rgba(255, 255, 255, 0.7)" // Light gray for contrast
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </Animatable.View>
      <Animatable.View animation="fadeInUp" duration={800} delay={400}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="rgba(255, 255, 255, 0.7)" // Light gray for contrast
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </Animatable.View>
      <Animatable.View animation="fadeInUp" duration={800} delay={600}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Reanimated.View style={[styles.glowOverlay, animatedGlowStyle]} />
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </Animatable.View>
      <Animatable.View animation="fadeInUp" duration={800} delay={800}>
        <TouchableOpacity
          onPress={handleForgotPassword}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Reanimated.View style={[styles.glowOverlay, animatedGlowStyle]} />
          <Text style={styles.link}>Forgot My Password</Text>
        </TouchableOpacity>
      </Animatable.View>
      <Animatable.View animation="fadeInUp" duration={800} delay={1000}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Reanimated.View style={[styles.glowOverlay, animatedGlowStyle]} />
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 10,
  },
  title: {
    fontFamily: 'Exo-font',
    fontSize: 24,
    color: '#FFFFFF', // White for contrast on gradient background
    marginBottom: 20,
    textShadowColor: 'rgba(192, 67, 67, 0.5)', // Red glow (#C04343)
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)', // Subtle white border
    borderRadius: 5,
    marginBottom: 15,
    fontFamily: 'Exo-font',
    fontSize: 16,
    color: '#FFFFFF', // White text for contrast
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slightly transparent futuristic input
    shadowColor: '#C04343', // Red glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  button: {
    backgroundColor: '#000000', // Black button
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#C04343', // Red glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  buttonText: {
    fontFamily: 'Exo-font',
    fontSize: 18,
    color: '#FFFFFF', // White text
    fontWeight: 'bold',
  },
  link: {
    fontFamily: 'Exo-font',
    fontSize: 16,
    color: '#FFFFFF', // White for contrast
    textDecorationLine: 'underline',
    marginTop: 10,
    textShadowColor: 'rgba(192, 67, 67, 0.5)', // Red glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 5,
    backgroundColor: 'rgba(192, 67, 67, 0.3)', // Red glow (#C04343 with opacity)
    shadowColor: '#C04343',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
});

export default LoginScreen;