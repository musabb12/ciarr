# CIAR

## النشر على Netlify

لكي تظهر تعديلات لوحة الأدمن على الموقع وعلى كل الأجهزة:

1. **إضافة متغير البيئة `DATABASE_URL` في Netlify**
   - من لوحة Netlify: **Site configuration** → **Environment variables**
   - أضف متغيراً:
     - **Key:** `DATABASE_URL`
     - **Value:** رابط اتصال Supabase (Session Pooler)، مثل:
       ```
       postgresql://postgres.XXXX:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
       ```
   - استخدم **Session Pooler** من Supabase (وليس Direct connection) لتفادي مشاكل الشبكة.
   - بعد الحفظ، أعد نشر الموقع (Deploy) أو شغّل "Trigger deploy" إذا لزم.

2. **تشغيل المايجريشن على Supabase مرة واحدة**
   - محلياً (مع `.env` يحتوي على نفس `DATABASE_URL`):
     ```bash
     npx prisma migrate deploy
     ```
   - أو من Supabase SQL Editor تشغيل الـ migrations يدوياً إن رغبت.

بدون `DATABASE_URL` على Netlify، الحفظ من لوحة الأدمن قد يظهر "تم الحفظ" لكن التعديلات لا تُخزَّن في قاعدة مشتركة، فلا تظهر على الموقع أو على أجهزة أخرى.
