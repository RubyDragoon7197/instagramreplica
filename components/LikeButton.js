// components/LikeButton.js
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { supabase } from '../services/supabaseClient';

export default function LikeButton({ postId, userId }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Verificar si el usuario ya dio like y contar likes
  useEffect(() => {
    async function fetchLikes() {
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postId);

      if (error) {
        console.error(error);
        return;
      }

      setLikeCount(data.length);
      setLiked(data.some((like) => like.user_id === userId));
    }

    fetchLikes();
  }, [postId, userId]);

  // Dar o quitar like
  async function toggleLike() {
    if (liked) {
      // Quitar like
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (!error) {
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      }
    } else {
      // Dar like
      const { error } = await supabase
        .from('likes')
        .insert([{ post_id: postId, user_id: userId }]);

      if (!error) {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    }
  }

  return (
    <TouchableOpacity style={styles.button} onPress={toggleLike}>
      <Text style={{ color: liked ? 'red' : 'black' }}>
        ❤️ {likeCount}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { padding: 10 },
});