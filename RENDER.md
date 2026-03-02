# النشر على Render

هذا المشروع **Next.js**؛ الخادم المخصص في `server.ts`. لتقرير مفصل بالمشاكل والحلول وخطوات التشغيل والنشر (بما فيها مشاريع Vite/Express)، راجع **`تقرير-المشروع-والنشر.md`**.

## سبب مشكلة "No open ports detected on 0.0.0.0"

- Render يفحص المنفذ على **0.0.0.0** (كل الواجهات).
- إذا كان الخادم يستمع على **127.0.0.1** (localhost فقط)، يظهر:
  - `No open ports detected on 0.0.0.0`
  - `Detected open ports on localhost`

## ما تم تعديله في هذا المشروع (Next.js)

ملف **`server.ts`** (في الجذر):

- الخادم يستمع على **0.0.0.0** بدلاً من 127.0.0.1.
- المنفذ يُقرأ من **`process.env.PORT`** (الذي تضعه Render تلقائياً).

```ts
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';
// ...
server.listen(port, host, () => { ... });
```

## إعداد الخدمة على Render

### أوامر النشر

| الإعداد | القيمة |
|--------|--------|
| **Build Command** | `npx prisma generate && npx prisma migrate deploy && npm run build` |
| **Start Command** | `npm run start` |

- `prisma generate`: يُنفَّذ تلقائياً في `postinstall` أيضاً.
- `prisma migrate deploy`: يطبّق ترحيلات قاعدة البيانات على السيرفر (مهم عند أول نشر أو بعد تغيير الـ schema).
- Render يضبط **NODE_ENV=production** و **PORT** تلقائياً؛ لا حاجة لتعريفهما في Environment.

### متغيرات البيئة المطلوبة على Render

- **DATABASE_URL** (إجباري): رابط قاعدة البيانات.
  - **PostgreSQL** (موصى به على Render): أنشئ قاعدة بيانات (Render → New → PostgreSQL) وانسخ رابط الاتصال إلى `DATABASE_URL`. غيّر في `prisma/schema.prisma` السطر `provider = "sqlite"` إلى `provider = "postgresql"` ثم أعد تشغيل البناء.
  - **SQLite**: يعمل محلياً؛ على Render يحتاج قرصاً مستمراً (Persistent Disk) لأن الملف يُخزَّن على القرص.
- أي متغيرات أخرى يستخدمها التطبيق (مثل مفاتيح API) أضفها في Environment Variables في لوحة Render.

### التحقق بعد النشر

- يجب أن تظهر في الـ Logs سطور مثل: `Ready on http://0.0.0.0:XXXX` و `Socket.IO server running at ws://0.0.0.0:XXXX/api/socketio`.
- إذا ظهرت "No open ports on 0.0.0.0" فتأكد أن **Start Command** يشغّل `server.ts` (أي `npm run start`) وليس `next start` فقط.

بهذا يكتشف Render المنفذ المفتوح على 0.0.0.0 وتعمل الخدمة بشكل صحيح.
