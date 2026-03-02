'use client';

import { useState, useEffect } from 'react';
import { Shield, Users, Key, Eye, Edit, Trash2, Plus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
  createdAt: string;
}

interface Permission {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
}

interface RoleManagementProps {
  onRoleChange?: (role: Role) => void;
}

export function RoleManagement({ onRoleChange }: RoleManagementProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    permissions: [] as string[]
  });

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      // Mock data - in real app, this would come from API
      const mockRoles: Role[] = [
        {
          id: '1',
          name: 'admin',
          displayName: 'مدير النظام',
          description: 'صلاحيات كاملة على جميع أجزاء النظام',
          permissions: ['users.create', 'users.read', 'users.update', 'users.delete', 'content.create', 'content.read', 'content.update', 'content.delete', 'system.manage', 'analytics.view'],
          userCount: 2,
          isSystem: true,
          createdAt: '2024-01-01'
        },
        {
          id: '2',
          name: 'moderator',
          displayName: 'مشرف',
          description: 'صلاحيات إدارية محدودة',
          permissions: ['users.read', 'users.update', 'content.create', 'content.read', 'content.update', 'analytics.view'],
          userCount: 5,
          isSystem: true,
          createdAt: '2024-01-01'
        },
        {
          id: '3',
          name: 'editor',
          displayName: 'محرر',
          description: 'صلاحيات إدارة المحتوى فقط',
          permissions: ['content.create', 'content.read', 'content.update'],
          userCount: 8,
          isSystem: false,
          createdAt: '2024-01-15'
        },
        {
          id: '4',
          name: 'user',
          displayName: 'مستخدم عادي',
          description: 'صلاحيات محدودة للمستخدمين',
          permissions: ['content.read'],
          userCount: 1245,
          isSystem: true,
          createdAt: '2024-01-01'
        }
      ];
      setRoles(mockRoles);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      // Mock permissions
      const mockPermissions: Permission[] = [
        { id: 'users.create', name: 'users.create', displayName: 'إنشاء المستخدمين', description: 'إنشاء مستخدمين جدد', category: 'المستخدمون' },
        { id: 'users.read', name: 'users.read', displayName: 'عرض المستخدمين', description: 'عرض قائمة المستخدمين', category: 'المستخدمون' },
        { id: 'users.update', name: 'users.update', displayName: 'تعديل المستخدمين', description: 'تعديل بيانات المستخدمين', category: 'المستخدمون' },
        { id: 'users.delete', name: 'users.delete', displayName: 'حذف المستخدمين', description: 'حذف المستخدمين', category: 'المستخدمون' },
        { id: 'content.create', name: 'content.create', displayName: 'إنشاء المحتوى', description: 'إنشاء محتوى جديد', category: 'المحتوى' },
        { id: 'content.read', name: 'content.read', displayName: 'عرض المحتوى', description: 'عرض المحتوى', category: 'المحتوى' },
        { id: 'content.update', name: 'content.update', displayName: 'تعديل المحتوى', description: 'تعديل المحتوى', category: 'المحتوى' },
        { id: 'content.delete', name: 'content.delete', displayName: 'حذف المحتوى', description: 'حذف المحتوى', category: 'المحتوى' },
        { id: 'system.manage', name: 'system.manage', displayName: 'إدارة النظام', description: 'إعدادات النظام', category: 'النظام' },
        { id: 'analytics.view', name: 'analytics.view', displayName: 'عرض التحليلات', description: 'عرض الإحصائيات والتحليلات', category: 'التحليلات' }
      ];
      setPermissions(mockPermissions);
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    }
  };

  const handleCreateRole = async () => {
    setIsLoading(true);
    try {
      const newRole: Role = {
        id: Date.now().toString(),
        name: formData.name,
        displayName: formData.displayName,
        description: formData.description,
        permissions: formData.permissions,
        userCount: 0,
        isSystem: false,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setRoles(prev => [...prev, newRole]);
      setIsCreateDialogOpen(false);
      resetForm();
      
      if (onRoleChange) {
        onRoleChange(newRole);
      }
    } catch (error) {
      console.error('Failed to create role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    try {
      const updatedRole: Role = {
        ...selectedRole,
        name: formData.name,
        displayName: formData.displayName,
        description: formData.description,
        permissions: formData.permissions
      };

      setRoles(prev => prev.map(role => 
        role.id === selectedRole.id ? updatedRole : role
      ));
      setIsEditDialogOpen(false);
      setSelectedRole(null);
      resetForm();
      
      if (onRoleChange) {
        onRoleChange(updatedRole);
      }
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الدور؟')) return;

    setIsLoading(true);
    try {
      setRoles(prev => prev.filter(role => role.id !== roleId));
    } catch (error) {
      console.error('Failed to delete role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      displayName: '',
      description: '',
      permissions: []
    });
  };

  const openEditDialog = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      displayName: role.displayName,
      description: role.description,
      permissions: role.permissions
    });
    setIsEditDialogOpen(true);
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const getPermissionsByCategory = () => {
    const grouped: Record<string, Permission[]> = {};
    permissions.forEach(permission => {
      if (!grouped[permission.category]) {
        grouped[permission.category] = [];
      }
      grouped[permission.category].push(permission);
    });
    return grouped;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <h2 className="text-xl font-semibold">إدارة الأدوار والصلاحيات</h2>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              دور جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إنشاء دور جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">اسم الدور (بالإنجليزية)</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="مثال: editor"
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label htmlFor="displayName">اسم الدور (بالعربية)</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="مثال: محرر"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف الدور ومسؤولياته"
                />
              </div>

              <div>
                <Label>الصلاحيات</Label>
                <div className="mt-2 space-y-4 max-h-64 overflow-y-auto border rounded-lg p-4">
                  {Object.entries(getPermissionsByCategory()).map(([category, categoryPermissions]) => (
                    <div key={category}>
                      <h4 className="font-medium text-sm mb-2">{category}</h4>
                      <div className="space-y-2">
                        {categoryPermissions.map(permission => (
                          <div key={permission.id} className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox
                              id={permission.id}
                              checked={formData.permissions.includes(permission.id)}
                              onCheckedChange={() => togglePermission(permission.id)}
                            />
                            <Label htmlFor={permission.id} className="text-sm">
                              {permission.displayName}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleCreateRole} disabled={isLoading}>
                  {isLoading ? 'جاري الإنشاء...' : 'إنشاء الدور'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            الأدوار الحالية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم الدور</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>الصلاحيات</TableHead>
                <TableHead>المستخدمون</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{role.displayName}</div>
                      <div className="text-sm text-gray-500">{role.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{role.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{role.permissions.length} صلاحية</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{role.userCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {role.isSystem ? (
                      <Badge variant="secondary">نظام</Badge>
                    ) : (
                      <Badge variant="outline">مخصص</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => openEditDialog(role)}>
                          <Edit className="w-4 h-4 ml-2" />
                          تعديل
                        </DropdownMenuItem>
                        {!role.isSystem && (
                          <DropdownMenuItem 
                            onClick={() => handleDeleteRole(role.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل الدور</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">اسم الدور (بالإنجليزية)</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثال: editor"
                  dir="ltr"
                  disabled={selectedRole?.isSystem}
                />
              </div>
              <div>
                <Label htmlFor="edit-displayName">اسم الدور (بالعربية)</Label>
                <Input
                  id="edit-displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="مثال: محرر"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-description">الوصف</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="وصف الدور ومسؤولياته"
              />
            </div>

            <div>
              <Label>الصلاحيات</Label>
              <div className="mt-2 space-y-4 max-h-64 overflow-y-auto border rounded-lg p-4">
                {Object.entries(getPermissionsByCategory()).map(([category, categoryPermissions]) => (
                  <div key={category}>
                    <h4 className="font-medium text-sm mb-2">{category}</h4>
                    <div className="space-y-2">
                      {categoryPermissions.map(permission => (
                        <div key={permission.id} className="flex items-center space-x-2 space-x-reverse">
                          <Checkbox
                            id={`edit-${permission.id}`}
                            checked={formData.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                            disabled={selectedRole?.isSystem && permission.id === 'system.manage'}
                          />
                          <Label htmlFor={`edit-${permission.id}`} className="text-sm">
                            {permission.displayName}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleUpdateRole} disabled={isLoading}>
                {isLoading ? 'جاري التحديث...' : 'تحديث الدور'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}