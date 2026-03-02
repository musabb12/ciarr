# حل مشكلة التسجيل و Prisma

## السبب: القرص ممتلئ
الخطأ: `ENOSPC: no space left on device` — لا توجد مساحة كافية على القرص.

## الخطوات لحل المشكلة

### 1. تحرير مساحة على القرص
- احذف الملفات غير الضرورية
- أفرغ سلة المحذوفات
- احذف مجلد `.next` من المشروع (سيُعاد إنشاؤه):
  ```
  Remove-Item -Recurse -Force .next
  ```
- احذف مجلد `node_modules\.cache` إذا وُجد

### 2. بعد تحرير المساحة (يفضل 500MB+)، نفّذ بالترتيب:

```powershell
cd C:\Users\DATA\Desktop\ciar

# 1. أوقف خادم التطوير (Ctrl+C)

# 2. توليد Prisma Client
npx prisma generate

# 3. مزامنة قاعدة البيانات
npx prisma db push

# 4. حذف كاش Next.js
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# 5. تشغيل الخادم
npm run dev
```

### 3. جرّب التسجيل مرة أخرى

## التغييرات التي تم تطبيقها
- `serverExternalPackages` لـ Prisma في `next.config.ts`
- صفحة التسجيل تعرض النموذج مباشرة دون انتظار
- ملف `.env` يحتوي على مسار قاعدة البيانات
