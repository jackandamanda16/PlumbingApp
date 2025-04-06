import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function FixtureIdentificationScreen() {
  const [search, setSearch] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Shower Cartridge'); // State for category selection

  // Sample fixture data using local images with category property
  const fixtures = [
    { id: '1', name: 'Delta RP46074', image: require('../assets/fixtures/delta_rp46074.png'), category: 'Shower Cartridge' },
    { id: '2', name: 'Delta RP19804', image: require('../assets/fixtures/delta_rp19804.png'), category: 'Shower Cartridge' },
    { id: '3', name: 'Moen Positemp 1222', image: require('../assets/fixtures/moen_1222_positemp.png'), category: 'Shower Cartridge' },
    { id: '4', name: 'Placeholder Faucet Cartridge', image: require('../assets/fixtures/delta_rp46074.png'), category: 'Faucet Cartridge' },
  ];

  // Filter fixtures based on both search term and selected category
  const filteredFixtures = fixtures.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) && f.category === selectedCategory
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
      {/* Category selection buttons */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === 'Shower Cartridge' && styles.selectedCategoryButton,
          ]}
          onPress={() => setSelectedCategory('Shower Cartridge')}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === 'Shower Cartridge' && styles.selectedCategoryText,
            ]}
          >
            Shower Cartridge
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === 'Faucet Cartridge' && styles.selectedCategoryButton,
          ]}
          onPress={() => setSelectedCategory('Faucet Cartridge')}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === 'Faucet Cartridge' && styles.selectedCategoryText,
            ]}
          >
            Faucet Cartridge
          </Text>
        </TouchableOpacity>
      </View>
      {/* Display "No Results" message if no fixtures match, otherwise show FlatList */}
      {filteredFixtures.length === 0 ? (
        <Text style={styles.noResults}>No fixtures found</Text>
      ) : (
        <FlatList
          data={filteredFixtures}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Image source={item.image} style={styles.image} />
              <Text>{item.name}</Text>
            </View>
          )}
          numColumns={2}
        />
      )}
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
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  selectedCategoryButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  item: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120, // Increased height to accommodate image and text
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 5,
    borderRadius: 10, // Rounded corners for images
    borderWidth: 1, // Add a border
    borderColor: '#ccc',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});