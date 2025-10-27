import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bxrcvseffobewihdwrbo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4cmN2c2VmZm9iZXdpaGR3cmJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NTk2NzYsImV4cCI6MjA3NzAzNTY3Nn0.j3wZvj3giKjp8f0ywQKwF42KmBuz4mNP5hzFikpaxVE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);