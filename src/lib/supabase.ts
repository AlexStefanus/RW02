import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL:', supabaseUrl);
  console.error('Supabase Key exists:', !!supabaseAnonKey);
  throw new Error('Missing Supabase environment variables');
}

console.log('Supabase initialized with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

export const db = supabase;
export const auth = supabase.auth;
export const storage = supabase.storage;

