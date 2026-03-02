# إصلاح الرفع إلى GitHub (إزالة السر من السجل)

GitHub يمنع الرفع لأن في السجل ملفاً يحتوي على نمط يشبه **Stripe API Key** داخل مجلد `ciar/` (مخرجات البناء).

## ما تم تنفيذه تلقائياً
- إضافة `ciar/` إلى `.gitignore`
- إزالة مجلد `ciar/` من تتبع Git (`git rm -r --cached ciar`)

## ما يجب تنفيذه يدوياً (في PowerShell من مجلد المشروع)

### الطريقة 1: إعادة كتابة السجل ثم الرفع (موصى بها)

```powershell
cd C:\Users\DATA\Desktop\ciar

# التأكد من الفرع الحالي
git branch

# إذا كان لديك تغييرات غير مُحققة (حذف ciar وتعديل .gitignore)، احفظها:
git add .
git commit -m "chore: remove ciar build output from repo and ignore it"

# إزالة مجلد ciar من كل الـ commits في السجل
git filter-branch --force --index-filter "git rm -rf --cached --ignore-unmatch ciar" --prune-empty HEAD

# الرفع (ستُطلب منك بيانات الدخول أو Token)
git push origin main --force
```

إذا ظهرت رسالة أن `filter-branch` غير مستحسنة، يمكنك استخدام:

```powershell
git filter-repo --path ciar --invert-paths --force
```

(يتطلب تثبيت [git-filter-repo](https://github.com/newren/git-filter-repo) أولاً.)

---

### الطريقة 2: تاريخ جديد ب commit واحد فقط (بدون أي سجل قديم)

```powershell
cd C:\Users\DATA\Desktop\ciar

git checkout --orphan temp_main
git add -A
git commit -m "Initial commit: ciar project"

git branch -D main
git branch -m main
git push origin main --force
```

بعدها سيصبح لديك فرع `main` ب commit واحد فقط، بدون المجلد أو الملف الذي يحتوي على السر.

---

### الطريقة 3: السماح بالسر مرة واحدة من GitHub (أقل أماناً)

إذا كان المفتاح المُكتشف **ليس** مفتاح Stripe حقيقي (مثلاً مجرد نص تجريبي)، يمكنك فتح الرابط الذي أرسله GitHub والموافقة على السماح بهذه الدفعة مرة واحدة:

```
https://github.com/musabb12/ciarr/security/secret-scanning/unblock-secret/3ANSp0hJAz3Ua0qPyQxbeKVW3p8
```

ثم إعادة المحاولة:

```powershell
git push -u origin main
```

---

## بعد نجاح الرفع
- تأكد أن مجلد `ciar/` مضاف في `.gitignore` حتى لا يُرفع مرة أخرى مع `npm run build` أو ما شابهه.
