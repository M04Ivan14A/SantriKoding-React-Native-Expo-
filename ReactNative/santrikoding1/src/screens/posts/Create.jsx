import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

// Ganti import ke expo-image-picker
import * as ImagePicker from 'expo-image-picker';

import Api from '../../services/api';
import { handleErrors } from '../../utils/handleErrors';

export default function PostCreate({ navigation }) {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Method Memilih Gambar dengan Expo Image Picker
  const handleChoosePhoto = async () => {
    // Minta izin akses galeri
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Izin Ditolak', 'Aplikasi membutuhkan izin untuk mengakses galeri.');
      return;
    }

    // Buka Galeri
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Simpan objek asset pertama
      setImage(result.assets[0]);
    }
  };

  // Method Simpan Postingan
  const storePost = async () => {
    setLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    if (image) {
      // Ambil nama file dan tipe mime
      const uri = image.uri;
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri: uri,
        name: filename || 'upload.jpg',
        type: type,
      });
    }

    try {
      await Api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Navigasi kembali ke halaman index
      navigation.navigate('PostIndex');
    } catch (error) {
      console.log('Error store post:', error?.response?.data);
      const apiErrors = error.response?.data?.errors || error.response?.data?.message;
      handleErrors(apiErrors, setErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Tambah Postingan</Text>

      {/* Upload Gambar */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Gambar</Text>
        <TouchableOpacity style={styles.btnChoose} onPress={handleChoosePhoto}>
          <Text style={styles.btnChooseText}>Pilih Gambar dari Galeri</Text>
        </TouchableOpacity>

        {image && (
          <Image source={{ uri: image.uri }} style={styles.previewImage} />
        )}
        {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
      </View>

      {/* Input Title */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Judul</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan Judul Post"
          value={title}
          onChangeText={setTitle}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
      </View>

      {/* Input Content */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Konten</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Masukkan Konten Post"
          multiline
          numberOfLines={4}
          value={content}
          onChangeText={setContent}
        />
        {errors.content && <Text style={styles.errorText}>{errors.content}</Text>}
      </View>

      {/* Tombol Simpan */}
      <TouchableOpacity
        style={styles.btnSubmit}
        onPress={storePost}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnSubmitText}>Simpan Postingan</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  btnChoose: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnChooseText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 6,
    marginTop: 10,
  },
  btnSubmit: {
    backgroundColor: '#e91e63',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  btnSubmitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#d9534f',
    fontSize: 12,
    marginTop: 4,
  },
});