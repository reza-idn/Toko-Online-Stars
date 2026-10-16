import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://fppcfsfyvzbozxudbxyq.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwcGNmc2Z5dnpib3p4dWRieHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMjk5NjksImV4cCI6MjEwNzcwNTk2OX0.sJiNO7mYIzlL0msxHCXcfW9GZqFKNE14bmaOWxSTkKY";

export const supabase =
  typeof window !== "undefined"
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
