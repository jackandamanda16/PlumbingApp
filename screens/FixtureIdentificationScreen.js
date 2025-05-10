import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Linking, TextInput, ScrollView, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Animatable from 'react-native-animatable';
import { theme } from '../styles/theme';

const FixtureIdentificationScreen = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [userModelNumber, setUserModelNumber] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
    })();
  }, []);

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

  const renderPurchaseLink = ({ item }) => (
    <Animatable.View
      animation="fadeInUp"
      duration={300}
      style={styles.purchaseCard}
    >
      <TouchableOpacity
        style={styles.purchaseCardInner}
        onPress={() => Linking.openURL(item.url)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: result.imageUrl }}
          style={styles.purchaseThumbnail}
        />
        <Text style={styles.purchaseStore}>{item.name}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Identify Fixture</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Upload Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
        {image && (
          <Image source={{ uri: image }} style={styles.uploadedImage} />
        )}
        <TouchableOpacity
          style={[styles.button, !image || loading ? styles.buttonDisabled : {}]}
          onPress={searchFixture}
          disabled={!image || loading}
        >
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
        {loading && (
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
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
                  <TouchableOpacity onPress={() => submitFeedback(true)} style={styles.feedbackYes}>
                    <Text style={styles.buttonText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setFeedback('input')} style={styles.feedbackNo}>
                    <Text style={styles.buttonText}>No</Text>
                  </TouchableOpacity>
                </View>
                {feedback === 'input' && (
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter correct model number"
                      placeholderTextColor={theme.colors.text}
                      value={userModelNumber}
                      onChangeText={setUserModelNumber}
                    />
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => submitFeedback(false, userModelNumber)}
                    >
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
                  placeholderTextColor={theme.colors.text}
                  value={userModelNumber}
                  onChangeText={setUserModelNumber}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => submitFeedback(false, userModelNumber)}
                >
                  <Text style={styles.buttonText}>Submit Model Number</Text>
                </TouchableOpacity>
              </>
            )}
            {feedback && !feedback.startsWith('input') && (
              <Text style={styles.feedbackMessage}>{feedback}</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  innerContainer: {
    alignItems: 'center',
    padding: theme.spacing.large,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: theme.spacing.large,
  },
  title: {
    fontFamily: theme.typography.title.fontFamily,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    color: theme.colors.primary,
    marginBottom: theme.spacing.large,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: theme.spacing.large,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    marginVertical: theme.spacing.small,
    width: '40%',
    ...theme.shadow,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.text,
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: theme.typography.body.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  uploadedImage: {
    width: 200,
    height: 200,
    marginBottom: theme.spacing.large,
    borderRadius: theme.borderRadius.medium,
  },
  loader: {
    marginTop: theme.spacing.large,
  },
  resultContainer: {
    marginTop: theme.spacing.large,
    alignItems: 'center',
    width: '100%',
  },
  resultTitle: {
    fontFamily: theme.typography.subtitle.fontFamily,
    fontSize: theme.typography.subtitle.fontSize,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  resultImage: {
    width: 100,
    height: 100,
    marginTop: theme.spacing.small,
    borderRadius: theme.borderRadius.medium,
  },
  resultText: {
    fontFamily: theme.typography.body.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginTop: theme.spacing.small,
  },
  resultSubtitle: {
    fontFamily: theme.typography.subtitle.fontFamily,
    fontSize: theme.typography.subtitle.fontSize,
    color: theme.colors.primary,
    marginTop: theme.spacing.medium,
  },
  purchaseList: {
    marginTop: theme.spacing.medium,
    paddingHorizontal: theme.spacing.small,
  },
  purchaseCard: {
    width: 120,
    marginRight: theme.spacing.medium,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.small,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    ...theme.shadow,
  },
  purchaseCardInner: {
    width: '100%',
    alignItems: 'center',
  },
  purchaseThumbnail: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.medium,
  },
  purchaseStore: {
    fontFamily: theme.typography.body.fontFamily,
    fontSize: 14,
    color: theme.colors.text,
    marginTop: theme.spacing.small,
    textAlign: 'center',
  },
  linkText: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  feedbackPrompt: {
    fontFamily: theme.typography.body.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginTop: theme.spacing.large,
  },
  feedbackButtons: {
    flexDirection: 'row',
    marginTop: theme.spacing.medium,
    justifyContent: 'space-between',
    width: '50%',
  },
  feedbackYes: {
    backgroundColor: 'green',
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    width: '45%',
    ...theme.shadow,
  },
  feedbackNo: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    width: '45%',
    ...theme.shadow,
  },
  feedbackMessage: {
    fontFamily: theme.typography.body.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    marginTop: theme.spacing.medium,
  },
  input: {
    width: '80%',
    padding: theme.spacing.medium,
    borderWidth: 1,
    borderColor: theme.colors.text,
    borderRadius: theme.borderRadius.medium,
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    fontFamily: theme.typography.body.fontFamily,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
  },
});

export default FixtureIdentificationScreen;