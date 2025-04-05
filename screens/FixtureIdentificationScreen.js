import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function FixtureIdentificationScreen() {
  const [search, setSearch] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // Sample fixture data (replace with real data later)
  const fixtures = [
    { id: '1', name: 'Sink Valve', image: 'https://via.placeholder.com/100' },
    { id: '2', name: 'Toilet Cartridge', image: 'https://via.placeholder.com/100' },
    { id: '3', name: 'Shower Head', image: 'https://via.placeholder.com/100' },
  ];

  const filteredFixtures = fixtures.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      // Add AI logic here later (e.g., upload to AWS Rekognition)
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search fixtures..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredFixtures}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
          </View>
        )}
        numColumns={2}
      />
      <Button title="Take Photo" onPress={pickImage} />
      {selectedImage && <Text>Image selected: {selectedImage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
  item: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
});