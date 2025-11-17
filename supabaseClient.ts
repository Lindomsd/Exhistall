// This file assumes that the Supabase client is loaded from a CDN in index.html
// @ts-nocheck

// IMPORTANT: Replace these with your actual Supabase Project URL and public anon key.
const supabaseUrl = 'https://mculbqeiwilkcwvyqwtg.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jdWxicWVpd2lsa2N3dnlxd3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNjg3OTYsImV4cCI6MjA3ODk0NDc5Nn0.j5t2uK01DTjizx7Un8hhFg40AY7sIoeQ5Az5FeA3MI0';

// This boolean will be checked by the app to show a setup guide if needed.
export const isSupabaseConfigured = 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseUrl !== '' &&
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
  supabaseAnonKey !== '';

// Initialize the client only if it's configured.
// The createClient function is available on the global `window.supabase` object from the CDN script.
export const supabase = isSupabaseConfigured
  ? window.supabase.createClient(supabaseUrl, supabaseAnonKey)
  : null;