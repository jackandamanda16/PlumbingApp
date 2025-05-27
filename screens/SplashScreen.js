import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Reanimated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const SplashScreen = ({ navigation }) => {
  // Reanimated values for animations
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  // Fade-in and scale animation for logo
  useEffect(() => {
    // Animate opacity from 0 to 1
    opacity.value = withTiming(1, { duration: 1000 });
    // Animate scale from 0.8 to 1
    scale.value = withTiming(1, { duration: 1000 });

    const timer = setTimeout(() => {
      navigation.replace('Login'); // Navigate to Login
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  // Animated style for logo
  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <LinearGradient
      colors={['#C04343', '#000000']}
      style={styles.container}
    >
      <Reanimated.View style={[styles.content, animatedLogoStyle]}>
        <Image
          source={require('../assets/logobw.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Reanimated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 400,
    height: 400,
    shadowColor: '#C04343',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
});

export default SplashScreen;