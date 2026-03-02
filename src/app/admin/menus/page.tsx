'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Plus, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MenuItem {
  id: string;
  label: string;
  href: string;
}

export default function AdminMenusPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<MenuItem[]>([{ id: '1', label: 'الرئيسية', href: '/' }]);
  const [newLabel, setNewLabel] = useState('');
  const [newHref, setNewHref] = useState('');

  const handleAdd = () => {
    if (!newLabel.trim() || !newHref.trim()) {
      toast.error('أدخل نص الرابط والرابط');
      return;
    }
    setItems((prev) => [...prev, { id: Date.now().toString(), label: newLabel.trim(), href: newHref.trim() }]);
    setNewLabel('');
    setNewHref('');
    toast.success('تم إضافة الرابط');
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success('تم حذف الرابط');
  };

  const handleSave = () => {
    toast.success('تم حفظ القائمة بنجاح');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">القوائم</h1>
        <p className="text-slate-400 mt-0.5">إدارة قائمة التنقل الرئيسية والفوتر</p>
      </div>
      <Card className="bg-slate-800/80 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Menu className="w-5 h-5" />
            القائمة الرئيسية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Input
              className="bg-slate-900/50 border-slate-600 text-slate-100 flex-1 min-w-[120px]"
              placeholder="نص الرابط"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
            <Input
              className="bg-slate-900/50 border-slate-600 text-slate-100 flex-1 min-w-[120px]"
              placeholder="الرابط"
              value={newHref}
              onChange={(e) => setNewHref(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300" onClick={handleAdd}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة رابط
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSave}>
              <Save className="w-4 h-4 ml-2" />
              حفظ القائمة
            </Button>
          </div>
          {items.length > 0 && (
            <ul className="space-y-2 mt-4 border-t border-slate-700 pt-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-2 py-2 border-b border-slate-700/50 last:border-0">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-slate-500 text-sm truncate max-w-[200px]">{item.href}</span>
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={() => handleRemove(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
