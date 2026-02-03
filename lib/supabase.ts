import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let supabase: SupabaseClient | null = null;

export const getSupabase = (telegramUserId: string) => {
  if (supabase) return supabase;

  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        "x-telegram-user-id": telegramUserId,
      },
    },
  });

  return supabase;
};
