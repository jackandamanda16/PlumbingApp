import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform, Modal, FlatList, Pressable } from 'react-native';
import { theme } from '../styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Reanimated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [plumbingCode, setPlumbingCode] = useState(null);
  const [otherCode, setOtherCode] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);

  const plumbingOptions = [
    { label: 'Select Plumbing Code', value: null },
    { label: 'IPC', value: 'IPC' },
    { label: 'UPC', value: 'UPC' },
    { label: 'Other', value: 'Other' },
  ];

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

  const handleSignup = () => {
    if (!name || !email || !phone || !plumbingCode) {
      alert('Please fill in all fields');
      return;
    }
    if (plumbingCode === 'Other' && !otherCode) {
      alert('Please specify the plumbing code');
      return;
    }
    console.log('Signup with:', { name, email, phone, plumbingCode, otherCode });
    navigation.replace('Dashboard');
  };

  const getPlumbingCodeLabel = () => {
    const selectedOption = plumbingOptions.find(option => option.value === plumbingCode);
    return selectedOption ? selectedOption.label : 'Select Plumbing Code';
  };

  return (
    <LinearGradient
      colors={['#C04343', '#000000']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Reanimated.View style={animatedLogoStyle}>
            <Image
              source={require('../assets/logobw.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Reanimated.View>
          <Text style={styles.title}>Create Account</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone (10 digits)"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            returnKeyType="done"
          />
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setPickerVisible(true)}
            >
              <Text style={styles.pickerButtonText}>{getPlumbingCodeLabel()}</Text>
              <View style={styles.chevronDown} />
            </TouchableOpacity>
            <Modal
              visible={pickerVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setPickerVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <FlatList
                    data={plumbingOptions}
                    keyExtractor={(item) => item.value?.toString() || 'null'}
                    renderItem={({ item }) => (
                      <Pressable
                        style={styles.modalItem}
                        onPress={() => {
                          setPlumbingCode(item.value);
                          setPickerVisible(false);
                        }}
                      >
                        <Text style={styles.modalItemText}>{item.label}</Text>
                      </Pressable>
                    )}
                  />
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setPickerVisible(false)}
                  >
                    <Text style={styles.modalCloseButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
          {plumbingCode === 'Other' && (
            <TextInput
              style={styles.input}
              placeholder="Specify Plumbing Code"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={otherCode}
              onChangeText={setOtherCode}
              returnKeyType="done"
            />
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSignup}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
          >
            <Reanimated.View style={[styles.glowOverlay, animatedGlowStyle]} />
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
          >
            <Reanimated.View style={[styles.glowOverlay, animatedGlowStyle]} />
            <Text style={styles.link}>Already have an account? Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingContainer: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
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
  input: {
    width: '90%',
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    marginBottom: 15,
    fontFamily: 'Exo-font',
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#C04343',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  pickerContainer: {
    width: '90%',
    marginBottom: 15,
  },
  pickerButton: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#C04343',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  pickerButtonText: {
    fontFamily: 'Exo-font',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  chevronDown: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderTopWidth: 8,
    borderRightWidth: 4,
    borderBottomWidth: 0,
    borderLeftWidth: 4,
    borderTopColor: '#FFFFFF',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1C2526',
    borderRadius: 10,
    width: '80%',
    maxHeight: '50%',
    padding: 20,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalItemText: {
    fontFamily: 'Exo-font',
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalCloseButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#C04343',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontFamily: 'Exo-font',
    fontSize: 16,
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 5,
    width: '90%',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#C04343',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  buttonText: {
    fontFamily: 'Exo-font',
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  link: {
    fontFamily: 'Exo-font',
    fontSize: 16,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
    marginTop: 10,
    marginBottom: 10,
    textShadowColor: 'rgba(192, 67, 67, 0.5)',
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
    backgroundColor: 'rgba(192, 67, 67, 0.3)',
    shadowColor: '#C04343',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
});

export default SignupScreen;