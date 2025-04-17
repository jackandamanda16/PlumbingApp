import React, { useState } from 'react';
     import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
     import RNPickerSelect from 'react-native-picker-select';
     import { theme } from '../styles/theme';

     const SignupScreen = ({ navigation }) => {
       const [name, setName] = useState('');
       const [email, setEmail] = useState('');
       const [phone, setPhone] = useState('');
       const [plumbingCode, setPlumbingCode] = useState(null);
       const [otherCode, setOtherCode] = useState('');

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

       return (
         <KeyboardAvoidingView
           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
           style={styles.keyboardAvoidingContainer}
         >
           <ScrollView
             contentContainerStyle={styles.scrollContainer}
             keyboardShouldPersistTaps="handled"
           >
             <View style={styles.container}>
               <Image
                 source={require('../assets/logo.png')}
                 style={styles.logo}
                 resizeMode="contain"
               />
               <Text style={styles.title}>Create Account</Text>
               <TextInput
                 style={styles.input}
                 placeholder="Name"
                 placeholderTextColor={theme.colors.black}
                 value={name}
                 onChangeText={setName}
               />
               <TextInput
                 style={styles.input}
                 placeholder="Email"
                 placeholderTextColor={theme.colors.black}
                 value={email}
                 onChangeText={setEmail}
                 keyboardType="email-address"
                 autoCapitalize="none"
               />
               <TextInput
                 style={styles.input}
                 placeholder="Phone (10 digits)"
                 placeholderTextColor={theme.colors.black}
                 value={phone}
                 onChangeText={setPhone}
                 keyboardType="phone-pad"
                 returnKeyType="done"
               />
               <View style={styles.pickerContainer}>
                 <RNPickerSelect
                   onValueChange={(value) => setPlumbingCode(value)}
                   items={[
                     { label: 'IPC', value: 'IPC' },
                     { label: 'UPC', value: 'UPC' },
                     { label: 'Other', value: 'Other' },
                   ]}
                   style={{
                     inputIOS: styles.pickerInput,
                     inputAndroid: styles.pickerInput,
                     placeholder: { color: theme.colors.black },
                   }}
                   placeholder={{ label: 'Select Plumbing Code', value: null }}
                   value={plumbingCode}
                   useNativeAndroidPickerStyle={false}
                 />
               </View>
               {plumbingCode === 'Other' && (
                 <TextInput
                   style={styles.input}
                   placeholder="Specify Plumbing Code"
                   placeholderTextColor={theme.colors.black}
                   value={otherCode}
                   onChangeText={setOtherCode}
                   returnKeyType="done"
                 />
               )}
               <TouchableOpacity style={styles.button} onPress={handleSignup}>
                 <Text style={styles.buttonText}>Sign Up</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                 <Text style={styles.link}>Already have an account? Login</Text>
               </TouchableOpacity>
             </View>
           </ScrollView>
         </KeyboardAvoidingView>
       );
     };

     const styles = StyleSheet.create({
       keyboardAvoidingContainer: {
         flex: 1,
         backgroundColor: theme.colors.white,
       },
       scrollContainer: {
         flexGrow: 1,
         justifyContent: 'center',
       },
       container: {
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
       input: {
         width: '100%',
         padding: 15,
         borderWidth: 1,
         borderColor: theme.colors.black,
         borderRadius: 5,
         marginBottom: 15,
         fontFamily: 'Exo-font',
         fontSize: 16,
         color: theme.colors.black,
       },
       pickerContainer: {
         width: '100%',
         marginBottom: 15,
       },
       pickerInput: {
         width: '100%',
         padding: 15,
         borderWidth: 1,
         borderColor: theme.colors.black,
         borderRadius: 5,
         fontFamily: 'Exo-font',
         fontSize: 16,
         color: theme.colors.black,
         height: 50,
       },
       button: {
         backgroundColor: theme.colors.red,
         padding: 15,
         borderRadius: 5,
         width: '100%',
         alignItems: 'center',
         marginBottom: 15,
       },
       buttonText: {
         fontFamily: 'Exo-font',
         fontSize: 18,
         color: theme.colors.white,
         fontWeight: 'bold',
       },
       link: {
         fontFamily: 'Exo-font',
         fontSize: 16,
         color: theme.colors.red,
         textDecorationLine: 'underline',
       },
     });

     export default SignupScreen;