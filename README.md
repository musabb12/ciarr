# CIAR

## إجراءات إعداد قاعدة البيانات على Netlify

إذا ظهرت رسالة **"قاعدة البيانات غير مضبوطة"** عند الحفظ من لوحة الأدمن، نفّذ التالي بالترتيب:

### 1. الحصول على رابط الاتصال من Supabase

- ادخل إلى [supabase.com](https://supabase.com) → مشروعك → **Project Settings** → **Database**
- في **Connection string** اختر **URI** ثم **Session pooler** (وليس Direct)
- انسخ الرابط واستبدل `[YOUR-PASSWORD]` بكلمة مرور قاعدة البيانات

### 2. إضافة المتغير في Netlify

- ادخل إلى [app.netlify.com](https://app.netlify.com) → موقعك (ciarr) → **Site configuration** → **Environment variables**
- **Add a variable** أو **New variable**
- **Key:** `DATABASE_URL`
- **Value:** استخدم هذا القالب (واستبدل `كلمة_المرور` بكلمة مرور قاعدة البيانات الفعلية):
  ```
  postgresql://postgres.lcjhmwogaixgcndkchxw:كلمة_المرور@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
  ```
  إذا كانت كلمة المرور تحتوي على رموز خاصة (مثل `@` أو `#`) فانسخ الرابط من Supabase: **Project Settings** → **Database** → **Session pooler**.
- احفظ (Save)

### 3. إعادة النشر

- من **Deploys** اضغط **Trigger deploy** → **Deploy site**
- انتظر انتهاء النشر ثم جرّب الحفظ من لوحة الأدمن مرة أخرى

### 4. المايجريشن (مرة واحدة فقط)

إن لم تكن شغّلت المايجريشن على قاعدة Supabase من قبل، نفّذ محلياً (مع `.env` صحيح):

```bash
npx prisma migrate deploy
```

---

## النشر على Netlify (تفاصيل)

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

بدون `DATABASE_URL` على Netlify، الحفظ من لوحة الأدمن سيعرض رسالة "قاعدة البيانات غير مضبوطة"، ولن تُخزَّن التعديلات في قاعدة مشتركة.
