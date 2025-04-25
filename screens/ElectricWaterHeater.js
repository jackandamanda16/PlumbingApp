import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import OpenAI from 'openai';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import { theme } from '../styles/theme';
import * as Animatable from 'react-native-animatable';

const openai = new OpenAI({ apiKey: Constants.expoConfig.extra.openaiApiKey });
const CLOUDINARY_CLOUD_NAME = 'dxntxfdzr';
const CLOUDINARY_API_KEY = '712146825187679';
const CLOUDINARY_API_SECRET = 'WU-vtQj2xDmYgNFqpmieeEZc6oA';
const CLOUDINARY_UPLOAD_PRESET = 'plumbsmartai';

const ElectricWaterHeater = () => {
    const [symptom, setSymptom] = useState('');
    const [modelSerial, setModelSerial] = useState('');
    const [image, setImage] = useState(null);
    const [advice, setAdvice] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadImageToCloudinary = async (uri) => {
        const file = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
        const formData = new FormData();
        formData.append('file', `data:image/jpeg;base64,${file}`);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('api_key', CLOUDINARY_API_KEY);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'Upload failed');
        await new Promise(resolve => setTimeout(resolve, 2000));
        return data.secure_url;
    };

    const fetchAIAdvice = async () => {
        setIsLoading(true);
        try {
            let imageUrl = null;
            if (image) {
                imageUrl = await uploadImageToCloudinary(image);
                console.log('Uploaded image URL:', imageUrl);
            }
            const prompt = `Analyze this Electric Water Heater issue. Symptom: "${symptom}". Model/Serial: "${modelSerial}". Provide detailed repair advice based on the image and inputs.`;
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: prompt },
                            imageUrl ? { type: 'image_url', image_url: { url: imageUrl } } : null,
                        ].filter(Boolean),
                    },
                ],
            });
            setAdvice(response.choices[0].message.content);
        } catch (error) {
            setAdvice('Error fetching advice. Try again.');
            console.error('Cloudinary/OpenAI error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Electric Water Heater Troubleshooting</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter symptom (e.g., fan not running)"
                    value={symptom}
                    onChangeText={setSymptom}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter model/serial number (e.g., 12345)"
                    value={modelSerial}
                    onChangeText={setModelSerial}
                />
                <Animatable.View
                    animation="bounceIn"
                    duration={300}
                    style={styles.button}
                >
                    <TouchableOpacity
                        onPress={pickImage}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Pick Image</Text>
                    </TouchableOpacity>
                </Animatable.View>
                {image && <Image source={{ uri: image }} style={styles.image} />}
                <Animatable.View
                    animation="bounceIn"
                    duration={300}
                    style={styles.button}
                >
                    <TouchableOpacity
                        onPress={fetchAIAdvice}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Get AI Advice</Text>
                    </TouchableOpacity>
                </Animatable.View>
                {isLoading ? (
                    <Animatable.View
                        animation="rotate"
                        iterationCount="infinite"
                        duration={1000}
                        style={styles.loadingContainer}
                    >
                        <Image
                            source={require('../assets/Logo-NoText.png')}
                            style={styles.loadingLogo}
                            resizeMode="contain"
                        />
                    </Animatable.View>
                ) : advice ? (
                    <Text style={styles.advice}>{advice}</Text>
                ) : null}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    contentContainer: {
        padding: theme.spacing.large,
    },
    title: {
        ...theme.typography.title,
        color: theme.colors.primary,
        marginBottom: theme.spacing.large,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.medium,
        borderRadius: theme.borderRadius.medium,
        marginBottom: theme.spacing.medium,
        backgroundColor: theme.colors.background,
        ...theme.typography.body,
    },
    image: {
        width: 200,
        height: 200,
        marginVertical: theme.spacing.medium,
        alignSelf: 'center',
        borderRadius: theme.borderRadius.medium,
    },
    button: {
        backgroundColor: theme.colors.accent,
        padding: theme.spacing.medium,
        borderRadius: theme.borderRadius.medium,
        marginVertical: theme.spacing.small,
        alignItems: 'center',
        ...theme.shadow,
    },
    buttonText: {
        ...theme.typography.body,
        color: theme.colors.red,
    },
    advice: {
        ...theme.typography.body,
        marginTop: theme.spacing.large,
        color: theme.colors.text,
    },
    loadingContainer: {
        marginTop: theme.spacing.large,
        alignItems: 'center',
    },
    loadingLogo: {
        width: 50,
        height: 50,
    },
});

export default ElectricWaterHeater;