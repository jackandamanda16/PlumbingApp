import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function FixtureIdentificationScreen() {
  const [search, setSearch] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // Sample fixture data using local images
  const fixtures = [
    { id: '1', name: 'Delta RP46074', image: require('../assets/fixtures/delta_rp46074.png') },
    { id: '2', name: 'Delta RP19804', image: require('../assets/fixtures/delta_rp19804.png') },
    { id: '3', name: 'Moen Positemp 1222', image: require('../assets/fixtures/moen_1222_positemp.png') },
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
            <Image source={item.image} style={styles.image} />
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
    height: 100,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
});