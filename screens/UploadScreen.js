// screens/UploadScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../services/storageService';
import { createPost } from '../services/postService';
import { supabase } from '../services/supabaseClient';

export default function UploadScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function handleUpload() {
    try {
      const user = await supabase.auth.getUser();
      const imageUrl = await uploadImage(imageUri);

      await createPost({
        userId: user.data.user.id,
        imageUrl,
        caption,
        location,
      });

      alert('Post creado con éxito 🚀');
      navigation.navigate('Feed');
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Seleccionar imagen" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
      <TextInput
        style={styles.input}
        placeholder="Caption"
        value={caption}
        onChangeText={setCaption}
      />
      <TextInput
        style={styles.input}
        placeholder="Ubicación"
        value={location}
        onChangeText={setLocation}
      />
      <Button title="Publicar" onPress={handleUpload} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  preview: { width: '100%', height: 300, marginVertical: 10 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
});