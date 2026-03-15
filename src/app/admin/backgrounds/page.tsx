'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Image as ImageIcon, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ui/image-upload';

interface BgImage {
  id: string;
  url: string;
  title: string;
  active: boolean;
  order: number;
  createdAt?: string;
}

export default function AdminBackgroundsPage() {
  const { toast } = useToast();
  const [images, setImages] = useState<BgImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editImage, setEditImage] = useState<BgImage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formUrl, setFormUrl] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/background-images');
      if (res.ok) {
        const data = await res.json();
        setImages(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error('فشل تحميل الخلفيات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleAdd = async () => {
    if (!formUrl.trim()) {
      toast.error('أدخل رابط الصورة أو ارفع صورة من الجهاز');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/background-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formUrl.trim(), title: formTitle.trim() || 'خلفية', active: true }),
      });
      if (res.ok) {
        toast.success('تم إضافة الخلفية');
        setAddOpen(false);
        setFormUrl('');
        setFormTitle('');
        fetchImages();
      } else toast.error('فشل الإضافة');
    } catch {
      toast.error('فشل الإضافة');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editImage) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/background-images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editImage.id, url: formUrl.trim(), title: formTitle.trim() }),
      });
      if (res.ok) {
        toast.success('تم التحديث');
        setEditImage(null);
        fetchImages();
      } else toast.error('فشل التحديث');
    } catch {
      toast.error('فشل التحديث');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/background-images?id=${encodeURIComponent(deleteId)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('تم الحذف');
        setDeleteId(null);
        fetchImages();
      } else toast.error('فشل الحذف');
    } catch {
      toast.error('فشل الحذف');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (img: BgImage) => {
    setEditImage(img);
    setFormUrl(img.url);
    setFormTitle(img.title);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">خلفيات الهيرو</h1>
          <p className="text-slate-400 mt-0.5">إدارة صور خلفية قسم الهيرو في الصفحة الرئيسية</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300" asChild>
            <Link href="/admin/homepage">
              <ArrowLeft className="w-4 h-4 ml-2" />
              محتوى الصفحة الرئيسية
            </Link>
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4 ml-2" />
            إضافة خلفية
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400 py-8">جاري التحميل...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((img) => (
            <Card key={img.id} className="bg-slate-800/80 border-slate-700 overflow-hidden">
              <div className="aspect-video bg-slate-900 relative">
                {img.url ? (
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <p className="text-slate-200 text-sm font-medium truncate" title={img.title}>
                  {img.title || 'بدون عنوان'}
                </p>
                <p className="text-slate-500 text-xs truncate" title={img.url}>
                  {img.url}
                </p>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 flex-1"
                    onClick={() => openEdit(img)}
                  >
                    <Edit className="w-3 h-3 ml-1" />
                    تعديل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-400 border-red-500/50"
                    onClick={() => setDeleteId(img.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle>إضافة خلفية</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-slate-400">رابط الصورة</Label>
              <Input
                className="mt-1 bg-slate-900/50 border-slate-600"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="مثال: https://images.pexels.com/photos/260689/pexels-photo-260689.jpeg"
              />
            </div>
            <div>
              <Label className="text-slate-400">أو رفع صورة من الجهاز</Label>
              <div className="mt-1">
                <ImageUpload onUploadComplete={(url) => setFormUrl(url)} compact />
              </div>
            </div>
            <div>
              <Label className="text-slate-400">العنوان (اختياري)</Label>
              <Input
                className="mt-1 bg-slate-900/50 border-slate-600"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="وصف الخلفية"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} className="border-slate-600 text-slate-300">
              إلغاء
            </Button>
            <Button onClick={handleAdd} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
              {saving ? 'جاري الحفظ...' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editImage} onOpenChange={(open) => !open && setEditImage(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle>تعديل الخلفية</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-slate-400">رابط الصورة</Label>
              <Input
                className="mt-1 bg-slate-900/50 border-slate-600"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-slate-400">أو رفع صورة من الجهاز</Label>
              <div className="mt-1">
                <ImageUpload onUploadComplete={(url) => setFormUrl(url)} compact />
              </div>
            </div>
            <div>
              <Label className="text-slate-400">العنوان</Label>
              <Input
                className="mt-1 bg-slate-900/50 border-slate-600"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditImage(null)} className="border-slate-600 text-slate-300">
              إلغاء
            </Button>
            <Button onClick={handleEdit} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
              {saving ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-slate-300">هل أنت متأكد من حذف هذه الخلفية؟</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="border-slate-600 text-slate-300">
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving ? 'جاري الحذف...' : 'حذف'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
