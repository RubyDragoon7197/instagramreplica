// services/storageService.js
import { supabase } from './supabaseClient';

// Subir imagen al bucket "posts"
export async function uploadImage(fileUri) {
  try {
    // Convertir la URI en blob
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const fileName = `${Date.now()}.jpg`;

    // Subir al bucket
    const { data, error } = await supabase.storage
      .from('posts')
      .upload(fileName, blob);

    if (error) throw error;

    // Obtener URL pública
    const { data: publicData } = supabase.storage
      .from('posts')
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  } catch (err) {
    throw err;
  }
}