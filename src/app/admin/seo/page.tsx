'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminSeoPage() {
  const { toast } = useToast();
  const [pageTitle, setPageTitle] = useState('CIAR');
  const [metaDescription, setMetaDescription] = useState('');

  const handleSave = () => {
    toast.success('تم حفظ إعدادات تحسين محركات البحث');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">تحسين محركات البحث</h1>
        <p className="text-slate-400 mt-0.5">العنوان والوصف والكلمات المفتاحية</p>
      </div>
      <Card className="bg-slate-800/80 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Search className="w-5 h-5" />
            الصفحة الرئيسية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-300">عنوان الصفحة</Label>
            <Input
              className="mt-1 bg-slate-900/50 border-slate-600 text-slate-100"
              placeholder="CIAR"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-slate-300">وصف الصفحة</Label>
            <Input
              className="mt-1 bg-slate-900/50 border-slate-600 text-slate-100"
              placeholder="Meta description"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSave}>
            حفظ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
