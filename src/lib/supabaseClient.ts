/**
 * عميل Supabase للاستخدام في Next.js (مكونات العميل أو الخادم).
 * يستخدم NEXT_PUBLIC_* حتى يعمل في المتصفح و Netlify.
 * لا يُنشئ العميل عند البناء إذا غابت المتغيرات (لتجنب خطأ Netlify build).
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
