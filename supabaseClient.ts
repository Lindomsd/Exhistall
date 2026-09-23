import { createClient } from "@supabase/supabase-js";

const configuredSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabasePublishableKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY)?.trim();

/**
 * Supabase client URLs must be the bare project origin. It is common to copy a
 * REST or Storage endpoint from the dashboard; passing one here makes the
 * client generate paths such as `/rest/v1/rest/v1/stalls`.
 */
const normaliseSupabaseUrl = (value?: string) => {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.origin;
  } catch {
    return value.replace(/\/(?:rest|storage|auth)\/v1(?:\/.*)?$/i, "").replace(/\/$/, "");
  }
};

const supabaseUrl = normaliseSupabaseUrl(configuredSupabaseUrl);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabasePublishableKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const requireSupabase = () => {
  if (!supabase) {
    throw new Error("Exhistall is not connected to Supabase yet. Add the public VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY values.");
  }
  return supabase;
};
