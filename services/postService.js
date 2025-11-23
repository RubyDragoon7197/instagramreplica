// services/postService.js
import { supabase } from './supabaseClient';

// Crear un nuevo post
export async function createPost({ userId, imageUrl, caption, location }) {
  const { data, error } = await supabase
    .from('posts')
    .insert([{ user_id: userId, image_url: imageUrl, caption, location }]);

  if (error) throw error;
  return data;
}

// Obtener todos los posts con info del usuario
export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      image_url,
      caption,
      location,
      created_at,
      profiles (
        username,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Eliminar un post
export async function deletePost(postId, userId) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', userId);

  if (error) throw error;
}