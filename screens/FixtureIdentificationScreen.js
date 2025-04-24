import React, { useState } from 'react';
     import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Linking, TextInput } from 'react-native';
     import * as ImagePicker from 'expo-image-picker';
     import { theme } from '../styles/theme';

     const FixtureIdentificationScreen = () => {
       const [image, setImage] = useState(null);
       const [loading, setLoading] = useState(false);
       const [result, setResult] = useState(null);
       const [feedback, setFeedback] = useState('');
       const [userModelNumber, setUserModelNumber] = useState('');

       const pickImage = async () => {
         try {
           const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
           console.log('Media library permission status:', status);
           if (status !== 'granted') {
             alert('Sorry, we need media library permissions to make this work!');
             return;
           }

           let result = await ImagePicker.launchImageLibraryAsync({
             mediaTypes: ['images'], // Fixed from [ImagePicker.MediaType.images]
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
             mediaTypes: ['images'], // Fixed from [ImagePicker.MediaType.images]
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

           console.log('Submitting feedback to: https://plumbsmartai-backend.herokuapp.com/submit');
           const response = await fetch('https://plumbsmartai-backend.herokuapp.com/submit', {
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

       return (
         <View style={styles.container}>
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
             <ActivityIndicator size="large" color={theme.colors.red} style={styles.loader} />
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
                   {result.purchaseLinks.map((link, index) => (
                     <Text key={index} style={styles.purchaseLink}>
                       <Text
                         style={styles.linkText}
                         onPress={() => Linking.openURL(link.url)}
                       >
                         {link.name}
                       </Text>
                     </Text>
                   ))}
                   <Text style={styles.feedbackPrompt}>Is this correct?</Text>
                   <View style={styles.feedbackButtons}>
                     <TouchableOpacity onPress={() => submitFeedback(true)}>
                       <Text style={styles.feedbackYes}>Yes</Text>
                     </TouchableOpacity>
                     <TouchableOpacity onPress={() => setFeedback('input')}>
                       <Text style={styles.feedbackNo}>No</Text>
                     </TouchableOpacity>
                   </View>
                   {feedback === 'input' && (
                     <>
                       <TextInput
                         style={styles.input}
                         placeholder="Enter correct model number"
                         placeholderTextColor={theme.colors.black}
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
                     placeholderTextColor={theme.colors.black}
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
       );
     };

     const styles = StyleSheet.create({
         container: {
             flex: 1,
             backgroundColor: theme.colors.white,
             alignItems: 'center',
             padding: 20,
         },
         logo: {
             width: 150,
             height: 150,
             marginBottom: 20,
         },
         title: {
             fontFamily: 'Exo-font',
             fontSize: 24,
             color: theme.colors.red,
             marginBottom: 20,
         },
         buttonRow: {
             flexDirection: 'row',
             justifyContent: 'space-between',
             width: '80%',
             marginBottom: 20,
         },
         button: {
             backgroundColor: theme.colors.red,
             padding: 15,
             borderRadius: 5,
             alignItems: 'center',
             marginVertical: 10,
             width: '40%',
         },
         buttonDisabled: {
             backgroundColor: theme.colors.black,
             opacity: 0.5,
         },
         buttonText: {
             fontFamily: 'Exo-font',
             fontSize: 16,
             color: theme.colors.white,
             fontWeight: 'bold',
         },
         uploadedImage: {
             width: 200,
             height: 200,
             marginBottom: 20,
             borderRadius: 10,
         },
         loader: {
             marginTop: 20,
         },
         resultContainer: {
             marginTop: 20,
             alignItems: 'center',
         },
         resultTitle: {
             fontFamily: 'Exo-font',
             fontSize: 18,
             fontWeight: 'bold',
             color: theme.colors.red,
         },
         resultImage: {
             width: 100,
             height: 100,
             marginTop: 10,
             borderRadius: 5,
         },
         resultText: {
             fontFamily: 'Exo-font',
             fontSize: 16,
             color: theme.colors.black,
             marginTop: 5,
         },
         resultSubtitle: {
             fontFamily: 'Exo-font',
             fontSize: 16,
             color: theme.colors.red,
             marginTop: 10,
         },
         purchaseLink: {
             fontFamily: 'Exo-font',
             fontSize: 14,
             marginTop: 5,
         },
         linkText: {
             color: theme.colors.red,
             textDecorationLine: 'underline',
         },
         feedbackPrompt: {
             fontFamily: 'Exo-font',
             fontSize: 16,
             color: theme.colors.black,
             marginTop: 20,
         },
         feedbackButtons: {
             flexDirection: 'row',
             marginTop: 10,
         },
         feedbackYes: {
             fontFamily: 'Exo-font',
             fontSize: 16,
             color: 'green',
             marginRight: 20,
         },
         feedbackNo: {
             fontFamily: 'Exo-font',
             fontSize: 16,
             color: 'red',
         },
         feedbackMessage: {
             fontFamily: 'Exo-font',
             fontSize: 16,
             color: theme.colors.black,
             marginTop: 10,
         },
         input: {
             width: '80%',
             padding: 15,
             borderWidth: 1,
             borderColor: theme.colors.black,
             borderRadius: 5,
             marginTop: 10,
             marginBottom: 10,
             fontFamily: 'Exo-font',
             fontSize: 16,
             color: theme.colors.black,
         },
     });

     export default FixtureIdentificationScreen;