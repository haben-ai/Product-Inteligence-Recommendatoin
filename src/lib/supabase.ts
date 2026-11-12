import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-side only: imported solely by the survey Server Action.
// The key is Supabase's public "publishable" (or legacy "anon") key; row-level security
// (supabase/schema.sql) limits it to inserting survey responses.

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  client ??= createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
