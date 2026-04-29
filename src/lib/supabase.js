import { createClient } from '@supabase/supabase-js';

// Ambil variabel dan bersihkan dari spasi/karakter tak terlihat
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

let supabaseInstance = null;

if (isValidUrl(supabaseUrl) && supabaseAnonKey) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error('Supabase Initialization Error:', err);
  }
} else {
  console.warn('Supabase Config Missing:', { 
    hasUrl: !!supabaseUrl, 
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl 
  });
}

export const supabase = supabaseInstance;
