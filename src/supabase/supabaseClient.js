import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    storageKey: "supabase-auth",
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
