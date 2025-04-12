import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import OpenAI from 'openai';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import { theme } from '../styles/theme';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const openai = new OpenAI({ apiKey: Constants.expoConfig.extra.openaiApiKey });
const CLOUDINARY_CLOUD_NAME = 'dxntxfdzr';
const CLOUDINARY_API_KEY = '712146825187679';
const CLOUDINARY_API_SECRET = 'WU-vtQj2xDmYgNFqpmieeEZc6oA';
const CLOUDINARY_UPLOAD_PRESET = 'plumbsmartai';

const GasAtmosphericWaterHeater = () => {
    const [symptom, setSymptom] = useState('');
    const [modelSerial, setModelSerial] = useState('');
    const [image, setImage] = useState(null);
    const [advice, setAdvice] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const scalePick = useSharedValue(1);
    const scaleAdvice = useSharedValue(1);

    const pickAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scalePick.value }],
    }));

    const adviceAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scaleAdvice.value }],
    }));

    const rotation = useSharedValue(0);
    const spinAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    useEffect(() => {
        console.log('isLoading:', isLoading);
        if (isLoading) {
            rotation.value = withRepeat(withTiming(360, { duration: 1000, easing: Easing.linear }), -1);
        } else {
            rotation.value = 0;
        }
    }, [isLoading]);

    const handlePickPressIn = () => {
        scalePick.value = withSpring(0.95);
    };

    const handlePickPressOut = () => {
        scalePick.value = withSpring(1);
    };

    const handleAdvicePressIn = () => {
        scaleAdvice.value = withSpring(0.95);
    };

    const handleAdvicePressOut = () => {
        scaleAdvice.value = withSpring(1);
    };

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
            const prompt = `Analyze this Gas Atmospheric Water Heater issue. Symptom: "${symptom}". Model/Serial: "${modelSerial}". Provide detailed repair advice based on the image and inputs.`;
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
                <Text style={styles.title}>Gas Atmospheric Water Heater Troubleshooting</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter symptom (e.g., red light blinking 4 times)"
                    value={symptom}
                    onChangeText={setSymptom}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter model/serial number (e.g., 12345)"
                    value={modelSerial}
                    onChangeText={setModelSerial}
                />
                <Animated.View style={[styles.button, pickAnimatedStyle]}>
                    <TouchableOpacity
                        onPressIn={handlePickPressIn}
                        onPressOut={handlePickPressOut}
                        onPress={pickImage}
                    >
                        <Text style={styles.buttonText}>Pick Image</Text>
                    </TouchableOpacity>
                </Animated.View>
                {image && <Image source={{ uri: image }} style={styles.image} />}
                <Animated.View style={[styles.button, adviceAnimatedStyle]}>
                    <TouchableOpacity
                        onPressIn={handleAdvicePressIn}
                        onPressOut={handleAdvicePressOut}
                        onPress={fetchAIAdvice}
                    >
                        <Text style={styles.buttonText}>Get AI Advice</Text>
                    </TouchableOpacity>
                </Animated.View>
                {isLoading ? (
                    <Animated.View style={[styles.loadingContainer, spinAnimatedStyle]}>
                        <Image
                            source={require('../assets/Logo-NoText.png')} // Updated file
                            style={styles.loadingLogo}
                            resizeMode="contain"
                        />
                    </Animated.View>
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
        backgroundColor: theme.colors.background, // White
    },
    contentContainer: {
        padding: theme.spacing.large,
    },
    title: {
        ...theme.typography.title,
        color: theme.colors.primary, // Logo red (#C04343)
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
        backgroundColor: theme.colors.accent, // Logo red (#C04343)
        padding: theme.spacing.medium,
        borderRadius: theme.borderRadius.medium,
        marginVertical: theme.spacing.small,
        alignItems: 'center',
        ...theme.shadow,
    },
    buttonText: {
        ...theme.typography.body,
        color: theme.colors.textSecondary, // White
    },
    advice: {
        ...theme.typography.body,
        marginTop: theme.spacing.large,
        color: theme.colors.text, // Black
    },
    loadingContainer: {
        marginTop: theme.spacing.large,
        alignItems: 'center',
    },
    loadingLogo: {
        width: 50, // Smaller brain logo
        height: 50,
    },
});

export default GasAtmosphericWaterHeater;