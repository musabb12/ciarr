# حل مشاكل التشغيل (404، 500، missing error components)

اتبع الخطوات **بالترتيب**.

---

## خطأ 500 على react-refresh.js / main.js / _app.js / _error.js

**المعنى:** الخادم يرد بـ 500 عند طلب ملفات Next.js (غالباً Turbopack على Windows أو بناء تالف).

**الحل:**

1. **إيقاف كل الخوادم** — اضغط **Ctrl+C** في أي طرفية تشغّل المشروع.

2. **حذف مجلد البناء ثم التشغيل (السكربت الافتراضي يستخدم Webpack):**
   ```powershell
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   npm run dev
   ```
   انتظر: `✓ Ready in ...` ثم افتح **http://localhost:3000** واعمل **Hard Refresh** (Ctrl+Shift+R).

3. **إن استمر الخطأ 500:** أعد تثبيت الحزم ثم شغّل التطوير:
   ```powershell
   Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   npm install
   npm run dev
   ```
   انسخ أي رسالة خطأ تظهر في **الطرفية** عند فتح الصفحة — ستساعد في تحديد السبب.

**ملاحظة:** `npm run dev` يشغّل الآن `next dev --webpack` لتجنب مشكلة `spawn EPERM` مع Turbopack على Windows. لاستخدام Turbopack استخدم `npm run dev:turbo`.

---

## خطأ "missing required error components"

1. **إيقاف كل الخوادم** (Ctrl+C).

2. **حذف مجلد البناء:**
   ```powershell
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   ```

3. **تشغيل Next.js (السكربت الافتراضي):**
   ```powershell
   npm run dev
   ```
   - انتظر: `✓ Ready in ...`
   - افتح: **http://localhost:3000**

**ملاحظة:** `npm run dev` يشغّل `next dev`. لاستخدام الخادم المخصص مع Socket.IO استخدم `npm run dev:server` بعد التأكد أن الموقع يعمل بـ `npm run dev`.
