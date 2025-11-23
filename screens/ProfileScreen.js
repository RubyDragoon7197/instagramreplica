// screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { signOut } from '../services/authService';

export default function ProfileScreen({ route, navigation }) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const userId = route.params?.userId || supabase.auth.user()?.id;

  useEffect(() => {
    async function fetchProfile() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      setProfile(data);
    }

    async function fetchPosts() {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      setPosts(data);
    }

    async function fetchFollowData() {
      const currentUser = supabase.auth.user()?.id;
      if (!currentUser) return;

      const { data: followData } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', currentUser)
        .eq('following_id', userId);
      setIsFollowing(followData.length > 0);

      const { count: followers } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);
      setFollowersCount(followers);

      const { count: following } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);
      setFollowingCount(following);
    }

    fetchProfile();
    fetchPosts();
    fetchFollowData();
  }, [userId]);

  async function toggleFollow() {
    const currentUser = supabase.auth.user()?.id;
    if (!currentUser) return;

    if (isFollowing) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', currentUser)
        .eq('following_id', userId);
      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
    } else {
      await supabase
        .from('follows')
        .insert([{ follower_id: currentUser, following_id: userId }]);
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
    }
  }

  async function handleLogout() {
    try {
      await signOut();
      navigation.replace('Login'); // volver a la pantalla de login
    } catch (error) {
      alert(error.message);
    }
  }

  const renderPost = ({ item }) => (
    <Image source={{ uri: item.image_url }} style={styles.postImage} />
  );

  if (!profile) return <Text>Cargando perfil...</Text>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
      <Text style={styles.username}>{profile.username}</Text>
      {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
      {profile.website && <Text style={styles.website}>{profile.website}</Text>}

      <View style={styles.stats}>
        <Text>{followersCount} Seguidores</Text>
        <Text>{followingCount} Siguiendo</Text>
      </View>

      {userId !== supabase.auth.user()?.id && (
        <Button
          title={isFollowing ? 'Dejar de seguir' : 'Seguir'}
          onPress={toggleFollow}
        />
      )}

      {/* Botón de logout solo si es tu propio perfil */}
      {userId === supabase.auth.user()?.id && (
        <Button title="Cerrar sesión" color="red" onPress={handleLogout} />
      )}

      <Text style={styles.sectionTitle}>Publicaciones</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        numColumns={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  username: { fontSize: 20, fontWeight: 'bold' },
  bio: { marginVertical: 5, textAlign: 'center' },
  website: { color: 'blue', marginBottom: 10 },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  sectionTitle: { fontSize: 18, marginVertical: 10 },
  postImage: { width: 100, height: 100, margin: 5 },
});