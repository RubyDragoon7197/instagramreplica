// screens/FeedScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { getPosts } from '../services/postService';
import { supabase } from '../services/supabaseClient';
import LikeButton from '../components/LikeButton';
import CommentSection from '../components/CommentSection';

export default function FeedScreen() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        alert(error.message);
      }
    }
    fetchPosts();
  }, []);

  const renderPost = ({ item }) => (
    <View style={styles.card}>
      {/* Header con avatar y username */}
      <View style={styles.header}>
        <Image
          source={{ uri: item.profiles?.avatar_url }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{item.profiles?.username}</Text>
      </View>

      {/* Imagen principal */}
      <Image source={{ uri: item.image_url }} style={styles.image} />

      {/* Caption y ubicación */}
      <Text style={styles.caption}>{item.caption}</Text>
      {item.location && <Text style={styles.location}>📍 {item.location}</Text>}

      {/* Botón de Like */}
      <LikeButton postId={item.id} userId={supabase.auth.user()?.id} />

      {/* Sección de comentarios */}
      <CommentSection postId={item.id} userId={supabase.auth.user()?.id} />
    </View>
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={renderPost}
    />
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 20, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  username: { fontWeight: 'bold' },
  image: { width: '100%', height: 300 },
  caption: { padding: 10 },
  location: { paddingHorizontal: 10, color: 'gray' },
});