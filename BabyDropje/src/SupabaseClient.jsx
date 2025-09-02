import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://xcnzoclizhitpjmxqwwa.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjbnpvY2xpemhpdHBqbXhxd3dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4Mzc2MjUsImV4cCI6MjA3MjQxMzYyNX0.YzKJlEwYz69AU7lFa9chxF9yqk9MuKbw-K6Bg48LZmk"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

