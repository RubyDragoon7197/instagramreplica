// components/CommentSection.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../services/supabaseClient';

export default function CommentSection({ postId, userId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  // Obtener comentarios del post
  useEffect(() => {
    async function fetchComments() {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          text,
          created_at,
          profiles (
            username
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        return;
      }
      setComments(data);
    }

    fetchComments();
  }, [postId]);

  // Insertar nuevo comentario
  async function addComment() {
    if (!text.trim()) return;

    const { error } = await supabase
      .from('comments')
      .insert([{ post_id: postId, user_id: userId, text }]);

    if (error) {
      alert(error.message);
      return;
    }

    setText('');
    // Refrescar comentarios
    const { data } = await supabase
      .from('comments')
      .select(`
        id,
        text,
        created_at,
        profiles (
          username
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    setComments(data);
  }

  const renderComment = ({ item }) => (
    <View style={styles.comment}>
      <Text style={styles.username}>{item.profiles?.username}: </Text>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderComment}
      />
      <TextInput
        style={styles.input}
        placeholder="Escribe un comentario..."
        value={text}
        onChangeText={setText}
      />
      <Button title="Comentar" onPress={addComment} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  comment: { flexDirection: 'row', marginBottom: 5 },
  username: { fontWeight: 'bold' },
  input: { borderWidth: 1, padding: 8, marginVertical: 5, borderRadius: 5 },
});