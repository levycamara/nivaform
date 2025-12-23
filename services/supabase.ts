import { createClient } from '@supabase/supabase-js';

// Atualizado com a URL do seu projeto
const SUPABASE_URL: string = 'https://xuclabrymfzopizhdtkk.supabase.co'; 

// Chave anon public configurada
const SUPABASE_ANON_KEY: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1Y2xhYnJ5bWZ6b3BpemhkdGtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0NDkzMDAsImV4cCI6MjA4MjAyNTMwMH0.kdk_JFND0XEVV9bekIuMDFd6r-SqpxyJvSqoKGGLVuI';

// Check if variables have been updated
const isConfigured = SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL' && 
                     !SUPABASE_URL.includes('YOUR_SUPABASE_PROJECT_URL') &&
                     SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';

// Use a valid dummy URL to prevent "Invalid URL" error during initialization if not configured
// The app checks isSupabaseConfigured() before making actual requests, so this client won't be used if invalid.
const urlToUse = isConfigured ? SUPABASE_URL : 'https://placeholder.supabase.co';
const keyToUse = isConfigured ? SUPABASE_ANON_KEY : 'placeholder';

export const supabase = createClient(urlToUse, keyToUse);

export const isSupabaseConfigured = () => isConfigured;