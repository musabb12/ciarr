'use client';

import { useState, useEffect } from 'react';
import { 
  Key, 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  Settings, 
  RefreshCw,
  Search,
  Filter,
  MoreHorizontal,
  Globe,
  Lock,
  Unlock,
  Activity,
  Calendar,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'expired' | 'revoked';
  createdAt: string;
  expiresAt?: string;
  lastUsed?: string;
  usageCount: number;
  rateLimit: number;
  createdBy: string;
  description?: string;
  allowedIps: string[];
  webhookUrl?: string;
}

interface ApiUsage {
  date: string;
  requests: number;
  errors: number;
  responseTime: number;
}

interface ApiEndpoint {
  path: string;
  method: string;
  description: string;
  requiredPermissions: string[];
}

export function ApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'مفتاح التطبيق الرئيسي',
      key: 'ciar_main_key_1_demo_only_no_real_access',
      permissions: ['read', 'write', 'delete'],
      status: 'active',
      createdAt: '2024-01-01',
      expiresAt: '2025-01-01',
      lastUsed: '2024-01-15 14:30:00',
      usageCount: 15420,
      rateLimit: 1000,
      createdBy: 'admin',
      description: 'مفتاح API للتطبيق الرئيسي',
      allowedIps: ['192.168.1.1', '10.0.0.1'],
      webhookUrl: 'https://app.example.com/webhook'
    },
    {
      id: '2',
      name: 'مفتاح القراءة فقط',
      key: 'ciar_read_only_key_2_demo',
      permissions: ['read'],
      status: 'active',
      createdAt: '2024-01-10',
      usageCount: 3420,
      rateLimit: 500,
      createdBy: 'admin',
      description: 'مفتاح للوصول للقراءة فقط',
      allowedIps: []
    },
    {
      id: '3',
      name: 'مفتاح الطرف الثالث',
      key: 'ciar_third_party_key_3_demo_expired',
      permissions: ['read', 'write'],
      status: 'expired',
      createdAt: '2023-06-01',
      expiresAt: '2023-12-01',
      usageCount: 8920,
      rateLimit: 200,
      createdBy: 'admin',
      description: 'مفتاح لخدمة الطرف الثالث',
      allowedIps: ['203.0.113.1']
    }
  ]);

  const [apiUsage] = useState<ApiUsage[]>([
    { date: '2024-01-15', requests: 1250, errors: 12, responseTime: 145 },
    { date: '2024-01-14', requests: 1180, errors: 8, responseTime: 138 },
    { date: '2024-01-13', requests: 1320, errors: 15, responseTime: 152 },
    { date: '2024-01-12', requests: 980, errors: 6, responseTime: 128 },
    { date: '2024-01-11', requests: 1450, errors: 18, responseTime: 165 }
  ]);

  const [endpoints] = useState<ApiEndpoint[]>([
    { path: '/api/users', method: 'GET', description: 'الحصول على قائمة المستخدمين', requiredPermissions: ['read'] },
    { path: '/api/users', method: 'POST', description: 'إنشاء مستخدم جديد', requiredPermissions: ['write'] },
    { path: '/api/users/{id}', method: 'PUT', description: 'تحديث معلومات المستخدم', requiredPermissions: ['write'] },
    { path: '/api/users/{id}', method: 'DELETE', description: 'حذف مستخدم', requiredPermissions: ['delete'] },
    { path: '/api/content', method: 'GET', description: 'الحصول على المحتوى', requiredPermissions: ['read'] },
    { path: '/api/content', method: 'POST', description: 'إنشاء محتوى جديد', requiredPermissions: ['write'] }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const [newKey, setNewKey] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
    rateLimit: 1000,
    expiresAt: '',
    allowedIps: [] as string[],
    webhookUrl: ''
  });

  const permissions = [
    { id: 'read', name: 'قراءة', description: 'الوصول للقراءة فقط' },
    { id: 'write', name: 'كتابة', description: 'إنشاء وتعديل البيانات' },
    { id: 'delete', name: 'حذف', description: 'حذف البيانات' },
    { id: 'admin', name: 'إدارة', description: 'صلاحيات المدير الكاملة' }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: 'default' as const, text: 'نشط', icon: CheckCircle },
      inactive: { variant: 'secondary' as const, text: 'غير نشط', icon: Lock },
      expired: { variant: 'destructive' as const, text: 'منتهي', icon: AlertTriangle },
      revoked: { variant: 'outline' as const, text: 'ملغي', icon: Shield }
    };
    const config = variants[status as keyof typeof variants] || variants.active;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const getPermissionBadge = (permission: string) => {
    const variants = {
      read: { variant: 'secondary' as const, text: 'قراءة' },
      write: { variant: 'default' as const, text: 'كتابة' },
      delete: { variant: 'destructive' as const, text: 'حذف' },
      admin: { variant: 'outline' as const, text: 'إدارة' }
    };
    const config = variants[permission as keyof typeof variants] || variants.read;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const filteredKeys = apiKeys.filter(key => {
    const matchesSearch = key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         key.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || key.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const generateApiKey = () => {
    const prefix = 'ciar_demo_';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = prefix;
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const handleCreateKey = () => {
    const apiKey: ApiKey = {
      id: Date.now().toString(),
      name: newKey.name,
      key: generateApiKey(),
      permissions: newKey.permissions,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: newKey.expiresAt || undefined,
      usageCount: 0,
      rateLimit: newKey.rateLimit,
      createdBy: 'admin',
      description: newKey.description,
      allowedIps: newKey.allowedIps,
      webhookUrl: newKey.webhookUrl || undefined
    };
    setApiKeys([...apiKeys, apiKey]);
    setNewKey({
      name: '',
      description: '',
      permissions: [],
      rateLimit: 1000,
      expiresAt: '',
      allowedIps: [],
      webhookUrl: ''
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditKey = () => {
    if (selectedKey) {
      setApiKeys(apiKeys.map(key => 
        key.id === selectedKey.id ? selectedKey : key
      ));
      setIsEditDialogOpen(false);
      setSelectedKey(null);
    }
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, status: 'revoked' as const } : key
    ));
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const maskKey = (key: string) => {
    if (key.length <= 10) return key;
    return key.substring(0, 10) + '*'.repeat(key.length - 20) + key.substring(key.length - 10);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">مفاتيح API</h2>
          <p className="text-gray-600">إدارة ومتابعة مفاتيح الوصول للواجهة البرمجية</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              إنشاء مفتاح جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إنشاء مفتاح API جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">اسم المفتاح</Label>
                <Input
                  id="name"
                  value={newKey.name}
                  onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                  placeholder="أدخل اسم المفتاح"
                />
              </div>
              
              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={newKey.description}
                  onChange={(e) => setNewKey({ ...newKey, description: e.target.value })}
                  placeholder="وصف المفتاح واستخدامه"
                  rows={3}
                />
              </div>

              <div>
                <Label>الصلاحيات</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={permission.id}
                        checked={newKey.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewKey({ ...newKey, permissions: [...newKey.permissions, permission.id] });
                          } else {
                            setNewKey({ ...newKey, permissions: newKey.permissions.filter(p => p !== permission.id) });
                          }
                        }}
                      />
                      <Label htmlFor={permission.id} className="flex items-center gap-2">
                        <span>{permission.name}</span>
                        <span className="text-xs text-gray-500">({permission.description})</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rateLimit">حد الطلبات (لكل ساعة)</Label>
                  <Input
                    id="rateLimit"
                    type="number"
                    value={newKey.rateLimit}
                    onChange={(e) => setNewKey({ ...newKey, rateLimit: parseInt(e.target.value) })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="expiresAt">تاريخ الانتهاء</Label>
                  <Input
                    id="expiresAt"
                    type="date"
                    value={newKey.expiresAt}
                    onChange={(e) => setNewKey({ ...newKey, expiresAt: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="allowedIps">عناوين IP المسموح بها (سطر واحد لكل عنوان)</Label>
                <Textarea
                  id="allowedIps"
                  value={newKey.allowedIps.join('\n')}
                  onChange={(e) => setNewKey({ ...newKey, allowedIps: e.target.value.split('\n').filter(ip => ip.trim()) })}
                  placeholder="192.168.1.1&#10;10.0.0.1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="webhookUrl">رابط Webhook (اختياري)</Label>
                <Input
                  id="webhookUrl"
                  type="url"
                  value={newKey.webhookUrl}
                  onChange={(e) => setNewKey({ ...newKey, webhookUrl: e.target.value })}
                  placeholder="https://example.com/webhook"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleCreateKey}>
                  إنشاء المفتاح
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المفاتيح</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiKeys.length}</div>
            <p className="text-xs text-muted-foreground">
              {apiKeys.filter(k => k.status === 'active').length} نشط
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الطلبات اليوم</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> من أمس
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الخطأ</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.96%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-0.2%</span> من أمس
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط الاستجابة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145ms</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-15ms</span> من أمس
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="البحث في المفاتيح..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="inactive">غير نشط</SelectItem>
            <SelectItem value="expired">منتهي</SelectItem>
            <SelectItem value="revoked">ملغي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="keys">المفاتيح</TabsTrigger>
          <TabsTrigger value="usage">الاستخدام</TabsTrigger>
          <TabsTrigger value="endpoints">النقاط الطرفية</TabsTrigger>
          <TabsTrigger value="logs">السجلات</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>المفتاح</TableHead>
                  <TableHead>الصلاحيات</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الاستخدام</TableHead>
                  <TableHead>آخر استخدام</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{key.name}</p>
                        {key.description && (
                          <p className="text-sm text-gray-500">{key.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {showKeys[key.id] ? key : maskKey(key)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(key.id)}
                        >
                          {showKeys[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyKey(key)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {key.permissions.map((permission) => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {getPermissionBadge(permission)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(key.status)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{key.usageCount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">/{key.rateLimit}/ساعة</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {key.lastUsed || 'لم يستخدم'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => {
                            setSelectedKey(key);
                            setIsEditDialogOpen(true);
                          }}>
                            <Edit className="w-4 h-4 ml-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyKey(key)}>
                            <Copy className="w-4 h-4 ml-2" />
                            نسخ
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRevokeKey(key.id)}
                            className="text-yellow-600"
                          >
                            <Shield className="w-4 h-4 ml-2" />
                            إلغاء
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteKey(key.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات الاستخدام</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiUsage.map((usage) => (
                  <div key={usage.date} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{usage.date}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-lg font-bold">{usage.requests.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">طلبات</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-red-600">{usage.errors}</p>
                        <p className="text-xs text-gray-500">أخطاء</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold">{usage.responseTime}ms</p>
                        <p className="text-xs text-gray-500">متوسط الاستجابة</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>النقاط الطرفية المتاحة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>النقطة الطرفية</TableHead>
                      <TableHead>الطريقة</TableHead>
                      <TableHead>الوصف</TableHead>
                      <TableHead>الصلاحيات المطلوبة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {endpoints.map((endpoint, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {endpoint.path}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                            {endpoint.method}
                          </Badge>
                        </TableCell>
                        <TableCell>{endpoint.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {endpoint.requiredPermissions.map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {getPermissionBadge(permission)}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>سجلات API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Activity className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">سجلات طلبات API الأخيرة</p>
                <p className="text-sm text-gray-400 mt-2">سيتم عرض سجلات الاستخدام والأخطاء هنا</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تعديل مفتاح API</DialogTitle>
          </DialogHeader>
          {selectedKey && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">اسم المفتاح</Label>
                <Input
                  id="edit-name"
                  value={selectedKey.name}
                  onChange={(e) => setSelectedKey({ ...selectedKey, name: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description">الوصف</Label>
                <Textarea
                  id="edit-description"
                  value={selectedKey.description || ''}
                  onChange={(e) => setSelectedKey({ ...selectedKey, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-rateLimit">حد الطلبات (لكل ساعة)</Label>
                  <Input
                    id="edit-rateLimit"
                    type="number"
                    value={selectedKey.rateLimit}
                    onChange={(e) => setSelectedKey({ ...selectedKey, rateLimit: parseInt(e.target.value) })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-expiresAt">تاريخ الانتهاء</Label>
                  <Input
                    id="edit-expiresAt"
                    type="date"
                    value={selectedKey.expiresAt || ''}
                    onChange={(e) => setSelectedKey({ ...selectedKey, expiresAt: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleEditKey}>
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}