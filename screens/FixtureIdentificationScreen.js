import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Linking, TextInput, ScrollView, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { theme } from '../styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Reanimated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

const FixtureIdentificationScreen = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [userModelNumber, setUserModelNumber] = useState('');

  // Reanimated values for animations
  const logoScale = useSharedValue(1);
  const buttonGlowOpacity = useSharedValue(0);

  // Single pulse animation for logo
  useEffect(() => {
    logoScale.value = withSpring(1.1, { stiffness: 100, damping: 10 });

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
    })();
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

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Media library permission status:', status);
      if (status !== 'granted') {
        alert('Sorry, we need media library permissions to make this work!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      console.log('Image picker result:', result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setResult(null);
        setFeedback('');
        setUserModelNumber('');
      }
    } catch (error) {
      console.error('Error in pickImage:', error);
      alert('Error accessing media library: ' + error.message);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log('Camera permission status:', status);
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      console.log('Camera result:', result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setResult(null);
        setFeedback('');
        setUserModelNumber('');
      }
    } catch (error) {
      console.error('Error in takePhoto:', error);
      alert('Error accessing camera: ' + error.message);
    }
  };

  const searchFixture = async () => {
    if (!image) {
      alert('Please upload or take a photo first!');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      const extension = image.toLowerCase().endsWith('.png') ? 'png' : 'jpg';
      const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';
      formData.append('photo', {
        uri: image,
        name: `fixture.${extension}`,
        type: mimeType,
      });

      console.log('Sending request to: https://plumbsmartai-backend-efcaac9e4486.herokuapp.com/identify');
      console.log('Image URI:', image);

      const response = await fetch('https://plumbsmartai-backend-efcaac9e4486.herokuapp.com/identify', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error(`Server returned non-JSON response (status: ${response.status}): ${text.substring(0, 100)}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.error) {
        alert('No match found. Try another photo or submit the model number manually.');
        setResult({ imageUrl: data.imageUrl });
      } else {
        setResult(data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Error identifying fixture: ' + error.message);
    }
    setLoading(false);
  };

  const submitFeedback = async (isCorrect, modelNumber) => {
    if (!image || (!isCorrect && !modelNumber)) {
      alert('Please provide a model number for incorrect matches.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('photo', {
        uri: image,
        name: 'fixture.jpg',
        type: 'image/jpeg',
      });
      formData.append('modelNumber', isCorrect ? result.modelNumber : modelNumber);

      console.log('Submitting feedback to: https://plumbsmartai-backend-efcaac9e4486.herokuapp.com/submit');
      const response = await fetch('https://plumbsmartai-backend-efcaac9e4486.herokuapp.com/submit', {
        method: 'POST',
        body: formData,
      });

      console.log('Feedback response status:', response.status);
      const data = await response.json();
      console.log('Feedback response data:', data);

      if (data.status === 'success') {
        setFeedback('Thanks for your feedback!');
        setUserModelNumber('');
      } else {
        throw new Error('Feedback submission failed');
      }
    } catch (error) {
      console.error('Feedback error:', error);
      alert('Error submitting feedback: ' + error.message);
    }
    setLoading(false);
  };

  const renderPurchaseLink = ({ item }) => {
    // Map store names to their logo images
    const storeLogos = {
      "Amazon": require('../assets/amazon_logo.png'),
      "Home Depot": require('../assets/home_depot_logo.png'),
      "Lowe's": require('../assets/lowes_logo.png')
    };

    // Get the logo for the current store, default to Amazon if not found
    const logoSource = storeLogos[item.name] || storeLogos["Amazon"];

    return (
      <View style={styles.purchaseCard}>
        <TouchableOpacity
          style={styles.purchaseCardInner}
          onPress={() => Linking.openURL(item.url)}
          activeOpacity={0.8}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Reanimated.View style={[styles.glowOverlay, animatedGlowStyle]} />
          <Image
            source={logoSource}
            style={styles.purchaseThumbnail}
          />
          <Text style={styles.purchaseStore}>{item.name}</Text>
        </TouchableOpacity>
      </View>
    );
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
          <Text style={styles.title}>Identify Fixture</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={pickImage}
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
            >
              <Reanimated.View style={[styles.glowOverlay, animatedGlowStyle]} />
              <Text style={styles.buttonText}>Upload Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={takePhoto}
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
            >
              <Reanimated.View style={[styles.glowOverlay, animatedGlowStyle]} />
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
          {image && (
            <Image source={{ uri: image }} style={styles.uploadedImage} />
          )}
          <TouchableOpacity
            style={[styles.searchButton, !image || loading ? styles.searchButtonDisabled : {}]}
            onPress={searchFixture}
            disabled={!image || loading}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
          >
            <Reanimated.View style={[styles.glowOverlay, animatedGlowStyle]} />
            <Text style={[styles.searchButtonText, !image || loading ? styles.searchButtonTextDisabled : {}]}>Search</Text>
          </TouchableOpacity>
          {loading && (
            <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
          )}
          {result && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Result:</Text>
              {result.modelNumber ? (
                <>
                  <Image source={{ uri: result.imageUrl }} style={styles.resultImage} />
                  <Text style={styles.resultText}>Model: {result.modelNumber}</Text>
                  <Text style={styles.resultText}>Probability: {(result.probability * 100).toFixed(2)}%</Text>
                  <Text style={styles.resultSubtitle}>Purchase Options:</Text>
                  <FlatList
                    data={result.purchaseLinks}
                    renderItem={renderPurchaseLink}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.purchaseList}
                  />
                  <Text style={styles.feedbackPrompt}>Is this correct?</Text>
                  <View style={styles.feedbackButtons}>
                    <TouchableOpacity
                      onPress={() => submitFeedback(true)}
                      style={styles.feedbackYes}
                      onPressIn={handleButtonPressIn}
                      onPressOut={handleButtonPressOut}
                    >
                      <Reanimated.View style={[styles.glowOverlay, animatedGlowStyle]} />
                      <Text style={styles.buttonText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setFeedback('input')}
                      style={styles.feedbackNo}
                      onPressIn={handleButtonPressIn}
                      onPressOut={handleButtonPressOut}
                    >
                      <Reanimated.View style={[styles.glowOverlay, animatedGlowStyle]} />
                      <Text style={styles.buttonText}>No</Text>
                    </TouchableOpacity>
                  </View>
                  {feedback === 'input' && (
                    <>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter correct model number"
                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                        value={userModelNumber}
                        onChangeText={setUserModelNumber}
                      />
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => submitFeedback(false, userModelNumber)}
                        onPressIn={handleButtonPressIn}
                        onPressOut={handleButtonPressOut}
                      >
                        <Reanimated.View style={[styles.glowOverlay, animatedGlowStyle]} />
                        <Text style={styles.buttonText}>Submit Model Number</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Text style={styles.resultText}>No match found.</Text>
                  <Text style={styles.feedbackPrompt}>Submit the correct model number:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter model number"
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    value={userModelNumber}
                    onChangeText={setUserModelNumber}
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => submitFeedback(false, userModelNumber)}
                    onPressIn={handleButtonPressIn}
                    onPressOut={handleButtonPressOut}
                  >
                    <Reanimated.View style={[styles.glowOverlay, animatedGlowStyle]} />
                    <Text style={styles.buttonText}>Submit Model Number</Text>
                  </TouchableOpacity>
                </>
              )}
              {feedback && !feedback.startsWith('input') && (
                <Text style={styles.feedbackMessage}>{feedback}</Text>
              )}
            </View>
          )}
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
    width: 300,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
    width: '45%',
    shadowColor: '#C04343',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  searchButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
    width: '45%',
    shadowColor: '#C04343',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  buttonDisabled: {
    backgroundColor: '#333333',
    opacity: 0.5,
  },
  searchButtonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: 'Exo-font',
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchButtonText: {
    fontFamily: 'Exo-font',
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchButtonTextDisabled: {
    color: '#666666', // Gray text when disabled
  },
  uploadedImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  loader: {
    marginTop: 20,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  resultTitle: {
    fontFamily: 'Exo-font',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(192, 67, 67, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  resultImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  resultText: {
    fontFamily: 'Exo-font',
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 10,
  },
  resultSubtitle: {
    fontFamily: 'Exo-font',
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 15,
    textShadowColor: 'rgba(192, 67, 67, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  purchaseList: {
    marginTop: 15,
    paddingHorizontal: 5,
  },
  purchaseCard: {
    width: 100,
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#C04343',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  purchaseCardInner: {
    width: '100%',
    alignItems: 'center',
  },
  purchaseThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  purchaseStore: {
    fontFamily: 'Exo-font',
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 5,
    textAlign: 'center',
  },
  feedbackPrompt: {
    fontFamily: 'Exo-font',
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 20,
  },
  feedbackButtons: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    width: '90%',
  },
  feedbackYes: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
    shadowColor: '#C04343',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  feedbackNo: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
    shadowColor: '#C04343',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  feedbackMessage: {
    fontFamily: 'Exo-font',
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 10,
  },
  input: {
    width: '90%',
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'Exo-font',
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#C04343',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
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

export default FixtureIdentificationScreen;