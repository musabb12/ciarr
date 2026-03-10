/**
 * عميل Supabase للاستخدام في Next.js (مكونات العميل أو الخادم).
 * يستخدم NEXT_PUBLIC_* حتى يعمل في المتصفح و Netlify.
 *
 * القيم من .env.local محلياً أو Environment variables في Netlify:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
