/**
 * عميل Supabase للخادم فقط (يستخدم مفتاح service_role).
 * يُستخدم في مسارات API مثل رفع الملفات — لا يعرّض المفتاح للمتصفح.
 *
 * أضف في .env و Netlify:
 *   SUPABASE_SERVICE_ROLE_KEY = من Supabase → Settings → API → Secret keys (أو Legacy service_role)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export const supabaseAdmin =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })
    : null;
