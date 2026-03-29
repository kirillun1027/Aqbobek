import { createClient, SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/database"

// ============================================================
// SUPABASE CONFIGURATION - ADD YOUR CREDENTIALS HERE
// ============================================================
// 
// Option 1: Set environment variables (recommended for production)
//   NEXT_PUBLIC_SUPABASE_URL=your-project-url
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
//
// Option 2: Replace the fallback values below (for quick testing only)
// ============================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const isSupabaseConfigured = 
  Boolean(supabaseUrl) && 
  Boolean(supabaseAnonKey) &&
  supabaseUrl.startsWith("https://")

// Create client lazily only when actually configured
let _supabaseClient: SupabaseClient<Database> | null = null

export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured) {
    return null
  }
  if (!_supabaseClient) {
    _supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return _supabaseClient
}

// For backward compatibility - will be null if not configured
export const supabase = isSupabaseConfigured 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey) 
  : (null as unknown as SupabaseClient<Database>)
