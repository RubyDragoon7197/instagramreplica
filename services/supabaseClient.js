// services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// ⚠️ Reemplaza con tus credenciales de Supabase
const SUPABASE_URL = 'https://bmdqgjlcxizlcjjqcuvi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZHFnamxjeGl6bGNqanFjdXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MjU2OTUsImV4cCI6MjA3OTUwMTY5NX0.Sk_cj3U1pc784NE2QKgfPsnvs-MXUTq-PP6kK1vZ1Io';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);