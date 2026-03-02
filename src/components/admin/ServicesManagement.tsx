'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  active: boolean;
  order: number;
}

export function ServicesManagement() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [addOpen, setAddOpen] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);
  const [deleteService, setDeleteService] = useState<Service | null>(null);
  const [viewService, setViewService] = useState<Service | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/services');
      if (res.ok) {
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error('فشل تحميل الخدمات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive =
      filterActive === 'all' ||
      (filterActive === 'active' && s.active) ||
      (filterActive === 'inactive' && !s.active);
    return matchesSearch && matchesActive;
  });

  const handleAdd = async () => {
    if (!formTitle.trim()) {
      toast.error('أدخل عنوان الخدمة');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formTitle.trim(), description: formDescription.trim(), active: formActive }),
      });
      if (res.ok) {
        toast.success('تم إضافة الخدمة');
        setAddOpen(false);
        setFormTitle('');
        setFormDescription('');
        setFormActive(true);
        fetchServices();
      } else toast.error('فشل إضافة الخدمة');
    } catch {
      toast.error('فشل إضافة الخدمة');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editService) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editService.id,
          title: formTitle.trim() || editService.title,
          description: formDescription.trim(),
          active: formActive,
        }),
      });
      if (res.ok) {
        toast.success('تم تحديث الخدمة');
        setEditService(null);
        fetchServices();
      } else toast.error('فشل تحديث الخدمة');
    } catch {
      toast.error('فشل تحديث الخدمة');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteService) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/services?id=${encodeURIComponent(deleteService.id)}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('تم حذف الخدمة');
        setDeleteService(null);
        fetchServices();
      } else toast.error('فشل حذف الخدمة');
    } catch {
      toast.error('فشل حذف الخدمة');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (s: Service) => {
    setEditService(s);
    setFormTitle(s.title);
    setFormDescription(s.description);
    setFormActive(s.active);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">إدارة الخدمات</h2>
          <p className="text-slate-400">إدارة الخدمات المعروضة على الموقع</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة خدمة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/80 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">إجمالي الخدمات</p>
                <p className="text-2xl font-bold text-slate-100">{services.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/80 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">نشطة</p>
                <p className="text-2xl font-bold text-slate-100">{services.filter((s) => s.active).length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/80 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">غير نشطة</p>
                <p className="text-2xl font-bold text-slate-100">{services.filter((s) => !s.active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/80 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100">البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="البحث عن خدمة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 bg-slate-900/50 border-slate-600 text-slate-100"
              />
            </div>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-600 text-slate-100"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشطة</option>
              <option value="inactive">غير نشطة</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {loading ? (
          <p className="text-slate-400 py-4">جاري التحميل...</p>
        ) : (
          filteredServices.map((service) => (
            <Card key={service.id} className="bg-slate-800/80 border-slate-700">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-100">{service.title}</h3>
                    <p className="text-slate-400 text-sm mt-1">{service.description}</p>
                    <Badge className={service.active ? 'bg-green-100 text-green-800 mt-2' : 'bg-red-100 text-red-800 mt-2'}>
                      {service.active ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300" onClick={() => setViewService(service)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300" onClick={() => openEdit(service)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-500/50 hover:bg-red-500/10" onClick={() => setDeleteService(service)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle>إضافة خدمة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-slate-400">العنوان</label>
              <Input className="mt-1 bg-slate-900/50 border-slate-600" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="عنوان الخدمة" />
            </div>
            <div>
              <label className="text-sm text-slate-400">الوصف</label>
              <Input className="mt-1 bg-slate-900/50 border-slate-600" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="وصف الخدمة" />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} className="rounded" />
              <span className="text-slate-300">نشط</span>
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} className="border-slate-600 text-slate-300">إلغاء</Button>
            <Button onClick={handleAdd} disabled={saving} className="bg-blue-600 hover:bg-blue-700">{saving ? 'جاري الحفظ...' : 'إضافة'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editService} onOpenChange={(open) => !open && setEditService(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle>تعديل الخدمة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-slate-400">العنوان</label>
              <Input className="mt-1 bg-slate-900/50 border-slate-600" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-slate-400">الوصف</label>
              <Input className="mt-1 bg-slate-900/50 border-slate-600" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} className="rounded" />
              <span className="text-slate-300">نشط</span>
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditService(null)} className="border-slate-600 text-slate-300">إلغاء</Button>
            <Button onClick={handleEdit} disabled={saving} className="bg-blue-600 hover:bg-blue-700">{saving ? 'جاري الحفظ...' : 'حفظ'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewService} onOpenChange={(open) => !open && setViewService(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle>تفاصيل الخدمة</DialogTitle>
          </DialogHeader>
          {viewService && (
            <div className="space-y-2 py-4">
              <p><span className="text-slate-400">العنوان:</span> {viewService.title}</p>
              <p><span className="text-slate-400">الوصف:</span> {viewService.description}</p>
              <p><span className="text-slate-400">الحالة:</span> {viewService.active ? 'نشط' : 'غير نشط'}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewService(null)} className="border-slate-600 text-slate-300">إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteService} onOpenChange={(open) => !open && setDeleteService(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-slate-300">هل أنت متأكد من حذف الخدمة &quot;{deleteService?.title}&quot;؟</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteService(null)} className="border-slate-600 text-slate-300">إلغاء</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>{saving ? 'جاري الحذف...' : 'حذف'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
