'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminContentPage() {
  const { toast } = useToast();
  const [title, setTitle] = useState('عرض جميع مواقعنا الـ 14');
  const [description, setDescription] = useState('قطاعاتنا وخدماتنا');

  const handleSave = () => {
    toast.success('تم حفظ التغييرات بنجاح');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">المحتوى</h1>
        <p className="text-slate-400 mt-0.5">تعديل نصوص وعناوين الصفحة الرئيسية وأقسام الموقع</p>
      </div>
      <Card className="bg-slate-800/80 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <FileText className="w-5 h-5" />
            الصفحة الرئيسية
          </CardTitle>
          <p className="text-sm text-slate-400">العنوان الرئيسي، الوصف، والعبارات الظاهرة على الصفحة الأولى</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-300">العنوان الرئيسي</Label>
            <Input
              className="mt-1 bg-slate-900/50 border-slate-600 text-slate-100"
              placeholder="عنوان الصفحة الرئيسية"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-slate-300">الوصف</Label>
            <Textarea
              className="mt-1 bg-slate-900/50 border-slate-600 text-slate-100 min-h-[100px]"
              placeholder="وصف الموقع"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSave}>
            <Save className="w-4 h-4 ml-2" />
            حفظ التغييرات
          </Button>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/80 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100 text-base">أقسام أخرى</CardTitle>
          <p className="text-sm text-slate-400">يمكن إضافة أقسام لتحرير: لماذا تختارنا، كيف نعمل، الخطط، التذييل، إلخ.</p>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-sm">ربط كل قسم بمصدر بيانات (API أو قاعدة بيانات) لاحقاً للتحكم الكامل.</p>
        </CardContent>
      </Card>
    </div>
  );
}
