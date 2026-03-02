# رفع المشروع إلى GitHub

المشروع جاهز للرفع: يوجد commit واحد (`First commit`) والـ remote مضبوط على:
`https://github.com/musabb12/ciar2.git`

## رفع من الطرفية (مطلوب مرة واحدة)

افتح **PowerShell** أو **Command Prompt** في مجلد المشروع ثم نفّذ:

```powershell
cd C:\Users\DATA\Desktop\ciar
git push -u origin main
```

سيُطلب منك تسجيل الدخول إلى GitHub (متصفح أو اسم مستخدم + Personal Access Token). بعدها سيُرفع المشروع.

---

## إنشاء مستودع جديد (إن لم يكن موجوداً)

## الخطوة 1: إنشاء مستودع جديد على GitHub

1. ادخل إلى [github.com](https://github.com) وسجّل الدخول.
2. اضغط **New repository** (أو **+** → **New repository**).
3. اختر اسم المستودع (مثلاً `ciar` أو `ciar-website`).
4. اختر **Private** أو **Public** حسب رغبتك.
5. **لا** تختر "Add a README" أو "Add .gitignore" لأن المشروع موجود محلياً بالفعل.
6. اضغط **Create repository**.

## الخطوة 2: فتح الطرفية في مجلد المشروع

افتح **PowerShell** أو **Command Prompt** في مجلد المشروع:

```powershell
cd C:\Users\DATA\Desktop\ciar
```

## الخطوة 3: إزالة قفل Git إن وُجد

إذا ظهر خطأ `index.lock` نفّذ:

```powershell
Remove-Item -Force .git\index.lock -ErrorAction SilentlyContinue
```

## الخطوة 4: إضافة الملفات وعمل أول commit

```powershell
git add .
git status
git commit -m "Initial commit: Next.js CIAR admin and public site"
```

## الخطوة 5: ربط المشروع بمستودع GitHub والرفع

استبدل `YOUR_USERNAME` و `YOUR_REPO` باسم المستخدم واسم المستودع على GitHub:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

**مثال:** إذا كان المستودع `https://github.com/ahmed/ciar`:

```powershell
git remote add origin https://github.com/ahmed/ciar.git
git branch -M main
git push -u origin main
```

إذا كان المستودع يستخدم **SSH** بدل HTTPS:

```powershell
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## ملاحظات

- ملف **`.env`** غير مرفوع (مدرج في `.gitignore`)؛ على السيرفر أو عند الاستنساخ أضف `.env` يدوياً من `.env.example`.
- بعد الرفع يمكن ربط المشروع بـ Render أو أي منصة نشر باستخدام التعليمات في **RENDER.md**.
