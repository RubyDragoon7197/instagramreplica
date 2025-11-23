// services/authService.js
import { supabase } from './supabaseClient';

// Registrar usuario
export async function signUp({ email, password, username, fullName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
}

// Iniciar sesión
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// Cerrar sesión
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Obtener usuario actual
export function getCurrentUser() {
  return supabase.auth.getUser();
}