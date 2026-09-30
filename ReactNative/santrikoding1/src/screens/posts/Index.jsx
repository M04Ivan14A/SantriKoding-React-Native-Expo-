import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ToastAndroid,
} from 'react-native';

// Import hook useFocusEffect dari React Navigation untuk auto-refresh data
import { useFocusEffect } from '@react-navigation/native';

import Api from '../../services/api';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_API_URL || 'http://10.0.2.2:3000';

export default function PostIndex({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Method fetch data postingan
  const fetchDataPosts = async () => {
    setLoading(true);
    try {
      const response = await Api.get('/posts');
      const dataPosts = response.data?.data || response.data || [];
      setPosts(dataPosts);
    } catch (error) {
      console.log('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Menggunakan useFocusEffect agar data diperbarui setiap kali layar ini aktif/fokus kembali
  useFocusEffect(
    useCallback(() => {
      fetchDataPosts();
    }, [])
  );

  // Method delete post
  const deletePost = (id) => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus postingan ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await Api.delete(`/posts/${id}`);
              ToastAndroid.show('Post berhasil dihapus!', ToastAndroid.SHORT);
              // Refresh daftar post setelah berhasil dihapus
              fetchDataPosts();
            } catch (error) {
              console.log('Error deleting post:', error);
              Alert.alert('Error', 'Gagal menghapus postingan.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tutorial Express + React Native</Text>
      <View style={styles.line}></View>

      {/* Data Posts */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#e91e63"
          style={{ marginTop: 20 }}
        />
      ) : posts && posts.length > 0 ? (
        <ScrollView style={{ flex: 1 }}>
          {posts.map((post, index) => {
          // Helper untuk membentuk URL gambar yang aman
          const getImageUrl = (image) => {
            if (!image) return 'https://via.placeholder.com/50';

            // Jika dari API sudah berupa URL utuh (http://...)
            if (image.startsWith('http://') || image.startsWith('https://')) {
              // Hapus '/api' jika tidak sengaja tersambung di URL gambar
              return image.replace('/api/uploads/', '/uploads/');
            }

            // Ambil hanya nama file (misal: c42831273e49755e10ee3c0721658f05.jpeg)
            const filename = image.split('/').pop();

            // Susun URL tanpa '/api'
            // Nilai BACKEND_URL harus 'http://192.168.5.13:3000' (TANPA /api di ujungnya)
            const BASE_HOST = 'http://192.168.5.13:3000'; 
            return `${BASE_HOST}/uploads/${filename}`;
          };

          const imageUrl = getImageUrl(post.image);

          return (
            <View key={post.id || index} style={styles.postContainer}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.avatar}
                resizeMode="cover"
                onError={(e) => console.log('Image load error for URL:', imageUrl, e.nativeEvent.error)}
              />
              <View style={styles.content}>
                <Text style={styles.title}>{post.title}</Text>
              </View>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  onPress={() => navigation?.push('PostEdit', { id: post.id })}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deletePost(post.id)}
                  style={[styles.button, styles.buttonDelete]}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Data postingan kosong / belum ada data.</Text>
        </View>
      )}

      {/* Floating Button Create */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation?.push('PostCreate')}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  line: {
    marginTop: 15,
    width: '100%',
    backgroundColor: '#ddd',
    height: 2,
  },
  postContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginLeft: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: '#e91e63',
  },
  buttonDelete: {
    backgroundColor: '#d9534f',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#777',
    fontSize: 14,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});