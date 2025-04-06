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
    { id: '4', name: 'Moen 1200', image: require('../assets/fixtures/moen_1200.png'), category: 'Shower Cartridge' },
    { id: '5', name: 'Moen 1225', image: require('../assets/fixtures/moen_1225.png'), category: 'Shower Cartridge' },
    { id: '6', name: 'Delta RP1991', image: require('../assets/fixtures/delta_rp1991.png'), category: 'Shower Cartridge' },
    { id: '7', name: 'Delta RP32104', image: require('../assets/fixtures/delta_rp32104.png'), category: 'Shower Cartridge' },
    { id: '8', name: 'Delta RP46463', image: require('../assets/fixtures/delta_rp46463.png'), category: 'Shower Cartridge' },
    { id: '9', name: 'Delta RP47201', image: require('../assets/fixtures/delta_rp47201.png'), category: 'Shower Cartridge' },
    { id: '10', name: 'Grohe Thermostatic', image: require('../assets/fixtures/grohe_47582000.png'), category: 'Shower Cartridge' },
    { id: '11', name: 'Kohler 800881', image: require('../assets/fixtures/kohler_800881.png'), category: 'Shower Cartridge' },
    { id: '12', name: 'Kohler 1021119', image: require('../assets/fixtures/kohler_1021119.png'), category: 'Shower Cartridge' },
    { id: '13', name: 'Kohler GP800820', image: require('../assets/fixtures/kohler_gp800820.png'), category: 'Shower Cartridge' },
    { id: '14', name: 'Kohler GP876851', image: require('../assets/fixtures/kohler_gp876851.png'), category: 'Shower Cartridge' },
    { id: '15', name: 'Kohler GP114492', image: require('../assets/fixtures/kohler_gp1144925.png'), category: 'Shower Cartridge' },
    { id: '16', name: 'Kohler K1046104', image: require('../assets/fixtures/kohler_k1046104.png'), category: 'Shower Cartridge' },
    { id: '17', name: 'Kohler K1145688', image: require('../assets/fixtures/kohler_K1145688.png'), category: 'Shower Cartridge' },
    { id: '18', name: 'Delta RP50587', image: require('../assets/fixtures/delta_rp50587.png'), category: 'Faucet Cartridge' },
    { id: '19', name: 'Moen 1224', image: require('../assets/fixtures/moen_1224.png'), category: 'Faucet Cartridge' },
    { id: '20', name: 'Moen 1248', image: require('../assets/fixtures/moen_1248.png'), category: 'Faucet Cartridge' },
    { id: '21', name: 'Moen 4000r', image: require('../assets/fixtures/moen_4000r.png'), category: 'Faucet Cartridge' },
    { id: '22', name: 'Moen 130157', image: require('../assets/fixtures/moen_130157.png'), category: 'Faucet Cartridge' },
    { id: '23', name: 'Moen 163127', image: require('../assets/fixtures/moen_163127.png'), category: 'Faucet Cartridge' },
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