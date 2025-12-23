import { createClient } from '@supabase/supabase-js';

// Configuration for Supabase
const SUPABASE_URL = 'https://xuclabrymfzopizhdtkk.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1Y2xhYnJ5bWZ6b3BpemhkdGtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0NDkzMDAsImV4cCI6MjA4MjAyNTMwMH0.kdk_JFND0XEVV9bekIuMDFd6r-SqpxyJvSqoKGGLVuI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const isSupabaseConfigured = () => {
  return !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
};