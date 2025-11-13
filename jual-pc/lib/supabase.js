import { createClient } from '@supabase/supabase-js';

// ⚠️ GANTI dengan URL dan Publishable (anon) KEY dari Supabase Project-mu
const SUPABASE_URL = "https://bboltjzurlpkvzcpyblk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib2x0anp1cmxwa3Z6Y3B5YmxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1Njk0NzIsImV4cCI6MjA3ODE0NTQ3Mn0.sj3Gpuj7p2ETrNrseOAvz53I4fwg8Urkk857AG923nY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);