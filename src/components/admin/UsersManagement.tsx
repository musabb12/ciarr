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
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Shield,
  UserCheck,
  UserX,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

function mapApiUser(api: { id: string; name: string; email: string; role: string; status: string; joinDate: string; lastLogin?: string }): User {
  const roleMap: Record<string, string> = { admin: 'ADMIN', moderator: 'ADMIN', user: 'USER' };
  return {
    id: api.id,
    name: api.name,
    email: api.email,
    role: roleMap[api.role] || api.role.toUpperCase(),
    isActive: api.status === 'active',
    createdAt: api.joinDate,
    lastLogin: api.lastLogin,
  };
}

export function UsersManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [addOpen, setAddOpen] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState('user');
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers((data || []).map(mapApiUser));
      }
    } catch (e) {
      toast.error('فشل تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      SUPER_ADMIN: 'bg-red-100 text-red-800',
      ADMIN: 'bg-blue-100 text-blue-800',
      USER: 'bg-green-100 text-green-800',
    };
    const labels: Record<string, string> = {
      SUPER_ADMIN: 'مدير عام',
      ADMIN: 'مدير',
      USER: 'مستخدم',
    };
    return (
      <Badge className={colors[role] || 'bg-gray-100 text-gray-800'}>
        {labels[role] || role}
      </Badge>
    );
  };

  const handleAdd = async () => {
    if (!formName.trim() || !formEmail.trim()) {
      toast.error('الاسم والبريد مطلوبان');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          email: formEmail.trim(),
          role: formRole,
          status: 'active',
        }),
      });
      if (res.ok) {
        toast.success('تم إضافة المستخدم');
        setAddOpen(false);
        setFormName('');
        setFormEmail('');
        setFormRole('user');
        fetchUsers();
      } else {
        toast.error('فشل إضافة المستخدم');
      }
    } catch {
      toast.error('فشل إضافة المستخدم');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editUser || !formName.trim() || !formEmail.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editUser.id,
          name: formName.trim(),
          email: formEmail.trim(),
          role: formRole,
          status: editUser.isActive ? 'active' : 'inactive',
        }),
      });
      if (res.ok) {
        toast.success('تم تحديث المستخدم');
        setEditUser(null);
        fetchUsers();
      } else {
        toast.error('فشل تحديث المستخدم');
      }
    } catch {
      toast.error('فشل تحديث المستخدم');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(deleteUser.id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('تم حذف المستخدم');
        setDeleteUser(null);
        fetchUsers();
      } else {
        toast.error('فشل حذف المستخدم');
      }
    } catch {
      toast.error('فشل حذف المستخدم');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (u: User) => {
    setEditUser(u);
    setFormName(u.name);
    setFormEmail(u.email);
    setFormRole(u.role === 'ADMIN' || u.role === 'SUPER_ADMIN' ? 'admin' : 'user');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">إدارة المستخدمين</h2>
          <p className="text-slate-400">إدارة جميع مستخدمي المنصة</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة مستخدم
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/80 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-slate-100">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/80 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">نشطون</p>
                <p className="text-2xl font-bold text-slate-100">{users.filter((u) => u.isActive).length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/80 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">غير نشطين</p>
                <p className="text-2xl font-bold text-slate-100">{users.filter((u) => !u.isActive).length}</p>
              </div>
              <UserX className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/80 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">المديرون</p>
                <p className="text-2xl font-bold text-slate-100">{users.filter((u) => u.role !== 'USER').length}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
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
                placeholder="البحث بالاسم أو البريد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 bg-slate-900/50 border-slate-600 text-slate-100"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-600 text-slate-100"
            >
              <option value="all">جميع الأدوار</option>
              <option value="USER">المستخدمون</option>
              <option value="ADMIN">المديرون</option>
              <option value="SUPER_ADMIN">المديرون العامون</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/80 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100">قائمة المستخدمين</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-400 py-4">جاري التحميل...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-right p-3 text-slate-400">المستخدم</th>
                    <th className="text-right p-3 text-slate-400">الدور</th>
                    <th className="text-right p-3 text-slate-400">الحالة</th>
                    <th className="text-right p-3 text-slate-400">تاريخ الإنشاء</th>
                    <th className="text-right p-3 text-slate-400">آخر تسجيل</th>
                    <th className="text-right p-3 text-slate-400">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="p-3">
                        <div>
                          <div className="font-medium text-slate-100">{user.name}</div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="p-3">{getRoleBadge(user.role)}</td>
                      <td className="p-3">
                        <Badge
                          className={
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }
                        >
                          {user.isActive ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-slate-300">{user.createdAt}</td>
                      <td className="p-3 text-sm text-slate-300">{user.lastLogin || '—'}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-600 text-slate-300"
                            onClick={() => setViewUser(user)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-600 text-slate-300"
                            onClick={() => openEdit(user)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-500/50 hover:bg-red-500/10"
                            onClick={() => setDeleteUser(user)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle>إضافة مستخدم</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-slate-400">الاسم</label>
              <Input
                className="mt-1 bg-slate-900/50 border-slate-600"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="الاسم الكامل"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">البريد الإلكتروني</label>
              <Input
                type="email"
                className="mt-1 bg-slate-900/50 border-slate-600"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">الدور</label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-600 text-slate-100"
              >
                <option value="user">مستخدم</option>
                <option value="admin">مدير</option>
                <option value="moderator">مشرف</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} className="border-slate-600 text-slate-300">
              إلغاء
            </Button>
            <Button onClick={handleAdd} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? 'جاري الحفظ...' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={!!viewUser} onOpenChange={(open) => !open && setViewUser(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle>تفاصيل المستخدم</DialogTitle>
          </DialogHeader>
          {viewUser && (
            <div className="space-y-2 py-4">
              <p><span className="text-slate-400">الاسم:</span> {viewUser.name}</p>
              <p><span className="text-slate-400">البريد:</span> {viewUser.email}</p>
              <p><span className="text-slate-400">الدور:</span> {getRoleBadge(viewUser.role)}</p>
              <p><span className="text-slate-400">الحالة:</span> {viewUser.isActive ? 'نشط' : 'غير نشط'}</p>
              <p><span className="text-slate-400">تاريخ الانضمام:</span> {viewUser.createdAt}</p>
              <p><span className="text-slate-400">آخر تسجيل:</span> {viewUser.lastLogin || '—'}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewUser(null)} className="border-slate-600 text-slate-300">
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle>تعديل المستخدم</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-slate-400">الاسم</label>
              <Input
                className="mt-1 bg-slate-900/50 border-slate-600"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">البريد الإلكتروني</label>
              <Input
                type="email"
                className="mt-1 bg-slate-900/50 border-slate-600"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">الدور</label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-600 text-slate-100"
              >
                <option value="user">مستخدم</option>
                <option value="admin">مدير</option>
                <option value="moderator">مشرف</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)} className="border-slate-600 text-slate-300">
              إلغاء
            </Button>
            <Button onClick={handleEdit} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <p className="py-4 text-slate-300">
            هل أنت متأكد من حذف المستخدم &quot;{deleteUser?.name}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUser(null)} className="border-slate-600 text-slate-300">
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving}
            >
              {saving ? 'جاري الحذف...' : 'حذف'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
