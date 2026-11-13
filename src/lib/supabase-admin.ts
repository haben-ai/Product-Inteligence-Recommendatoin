import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Uses Supabase's SECRET key, which bypasses row-level security.
// Server-only: imported solely by admin pages / route handlers that call requireAdmin() first.

let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  client ??= createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
