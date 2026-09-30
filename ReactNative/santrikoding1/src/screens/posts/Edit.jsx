import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ToastAndroid,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import Api from '../../services/api';
import styles from '../../styles';
import { handleErrors } from '../../utils/handleErrors';

// Pastikan BASE_HOST adalah domain server tanpa /api
const BASE_HOST = process.env.EXPO_PUBLIC_BACKEND_API_URL 
  ? process.env.EXPO_PUBLIC_BACKEND_API_URL.replace(/\/api\/?$/, '') 
  : 'http://192.168.5.13:3000';

export default function PostEdit({ route, navigation }) {
  const { id } = route.params;

  // Init state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null); // Objek foto baru dari galeri
  const [oldImage, setOldImage] = useState(null); // Nama file gambar lama

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch Detail Post
  const fetchDetailPost = async () => {
    try {
      const response = await Api.get(`/posts/${id}`);
      const data = response.data?.data || response.data;

      setTitle(data.title || '');
      setContent(data.content || '');
      setOldImage(data.image || null);
    } catch (error) {
      console.log('Error fetch detail post:', error);
      Alert.alert('Error', 'Gagal mengambil data postingan');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchDetailPost();
  }, [id]);

  // Handle Pilih Foto
  const handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Izin Ditolak', 'Aplikasi membutuhkan izin untuk mengakses galeri.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  // Update Post
  const updatePost = async () => {
    setLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    // Jika pengguna memilih gambar baru dari galeri
    if (image) {
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
      // Mengirimkan POST dengan query _method=PUT (standar Express/Multer method spoofing)
      await Api.put(`/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      ToastAndroid.show('Post Updated Successfully!', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      console.log('Error update post:', error?.response?.data || error?.message);
      
      // Mengatasi penanganan error validation dari API
      const apiErrors = error.response?.data?.errors || error.response?.data?.message;
      if (apiErrors && typeof handleErrors === 'function') {
        handleErrors(apiErrors, setErrors);
      } else if (typeof apiErrors === 'string') {
        Alert.alert('Gagal', apiErrors);
      } else {
        Alert.alert('Error', 'Gagal memperbarui postingan.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  // Tentukan URL gambar lama secara bersih tanpa /api
  const cleanOldImageName = oldImage ? oldImage.split('/').pop() : null;
  const oldImageUrl = cleanOldImageName ? `${BASE_HOST}/uploads/${cleanOldImageName}` : null;

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        
        {/* Button Pilih Gambar */}
        <View style={styles.upload}>
          <Button title="Choose Image" color="gray" onPress={handleChoosePhoto} />
        </View>

        {/* Preview Gambar Baru / Gambar Lama */}
        {image ? (
          <Image
            source={{ uri: image.uri }}
            style={{ width: '100%', height: 150, borderRadius: 8, marginVertical: 10 }}
          />
        ) : oldImageUrl ? (
          <Image
            source={{ uri: oldImageUrl }}
            style={{ width: '100%', height: 150, borderRadius: 8, marginVertical: 10 }}
          />
        ) : null}

        {errors?.image && <Text style={styles.error}>{errors?.image}</Text>}

        {/* Input Title */}
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        {errors?.title && <Text style={styles.error}>{errors?.title}</Text>}

        {/* Input Content */}
        <TextInput
          style={styles.textarea}
          placeholder="Content"
          multiline
          value={content}
          onChangeText={setContent}
        />
        {errors?.content && <Text style={styles.error}>{errors?.content}</Text>}

        {/* Button Update */}
        <View style={{ padding: 10 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={updatePost}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>UPDATE</Text>
            )}
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}