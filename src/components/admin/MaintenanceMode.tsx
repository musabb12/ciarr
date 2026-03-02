'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  AlertTriangle, 
  Clock, 
  Eye, 
  EyeOff, 
  Save, 
  RefreshCw, 
  Users, 
  Shield, 
  Mail, 
  MessageSquare, 
  Calendar,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Globe,
  Lock,
  Unlock,
  Bell,
  FileText,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface MaintenanceSettings {
  enabled: boolean;
  message: string;
  title: string;
  startTime: string;
  endTime: string;
  allowedIps: string[];
  allowedUsers: string[];
  notifyUsers: boolean;
  redirectUrl: string;
  showCountdown: boolean;
  allowAdminAccess: boolean;
}

interface MaintenanceSchedule {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  type: 'scheduled' | 'immediate' | 'recurring';
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  notifyUsers: boolean;
  createdBy: string;
  createdAt: string;
}

interface MaintenanceLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  status: 'success' | 'error' | 'warning';
}

export function MaintenanceMode() {
  const [settings, setSettings] = useState<MaintenanceSettings>({
    enabled: false,
    message: 'نحن نقوم بأعمال صيانة حالية. سنكون قريباً معكم. شكراً لصبركم.',
    title: 'وضع الصيانة',
    startTime: '',
    endTime: '',
    allowedIps: ['127.0.0.1', '::1'],
    allowedUsers: [],
    notifyUsers: true,
    redirectUrl: '',
    showCountdown: true,
    allowAdminAccess: true
  });

  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([
    {
      id: '1',
      title: 'تحديث النظام الشهري',
      description: 'تحديثات أمنية وتحسينات الأداء',
      startTime: '2024-01-20 02:00:00',
      endTime: '2024-01-20 06:00:00',
      type: 'scheduled',
      status: 'pending',
      notifyUsers: true,
      createdBy: 'admin',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'صيانة قاعدة البيانات',
      description: 'تحسين وضغط قاعدة البيانات',
      startTime: '2024-01-18 23:00:00',
      endTime: '2024-01-19 01:00:00',
      type: 'scheduled',
      status: 'completed',
      notifyUsers: true,
      createdBy: 'admin',
      createdAt: '2024-01-10'
    }
  ]);

  const [logs] = useState<MaintenanceLog[]>([
    {
      id: '1',
      action: 'تفعيل وضع الصيانة',
      user: 'admin',
      timestamp: '2024-01-15 14:30:00',
      details: 'تم تفعيل وضع الصيانة للتحديثات الأمنية',
      status: 'success'
    },
    {
      id: '2',
      action: 'إضافة IP للقائمة البيضاء',
      user: 'admin',
      timestamp: '2024-01-15 14:25:00',
      details: 'تم إضافة IP 192.168.1.100 للقائمة البيضاء',
      status: 'success'
    },
    {
      id: '3',
      action: 'تعديل رسالة الصيانة',
      user: 'admin',
      timestamp: '2024-01-15 14:20:00',
      details: 'تم تحديث رسالة الصيانة',
      status: 'success'
    }
  ]);

  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    type: 'scheduled' as const,
    notifyUsers: true
  });

  const [newIp, setNewIp] = useState('');
  const [newUser, setNewUser] = useState('');

  useEffect(() => {
    // Simulate real-time status check
    const interval = setInterval(() => {
      // Check if maintenance should be activated/deactivated based on schedule
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleSaveSettings = () => {
    // Save settings to backend
    console.log('Saving maintenance settings:', settings);
  };

  const handleToggleMaintenance = () => {
    setSettings({ ...settings, enabled: !settings.enabled });
  };

  const handleAddIp = () => {
    if (newIp.trim() && !settings.allowedIps.includes(newIp.trim())) {
      setSettings({
        ...settings,
        allowedIps: [...settings.allowedIps, newIp.trim()]
      });
      setNewIp('');
    }
  };

  const handleRemoveIp = (ip: string) => {
    setSettings({
      ...settings,
      allowedIps: settings.allowedIps.filter(allowedIp => allowedIp !== ip)
    });
  };

  const handleAddUser = () => {
    if (newUser.trim() && !settings.allowedUsers.includes(newUser.trim())) {
      setSettings({
        ...settings,
        allowedUsers: [...settings.allowedUsers, newUser.trim()]
      });
      setNewUser('');
    }
  };

  const handleRemoveUser = (user: string) => {
    setSettings({
      ...settings,
      allowedUsers: settings.allowedUsers.filter(allowedUser => allowedUser !== user)
    });
  };

  const handleCreateSchedule = () => {
    const schedule: MaintenanceSchedule = {
      id: Date.now().toString(),
      ...newSchedule,
      status: 'pending',
      createdBy: 'admin',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSchedules([...schedules, schedule]);
    setNewSchedule({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      type: 'scheduled',
      notifyUsers: true
    });
    setIsScheduleDialogOpen(false);
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  const handleCancelSchedule = (id: string) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id ? { ...schedule, status: 'cancelled' as const } : schedule
    ));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary' as const, text: 'في الانتظار', icon: Clock },
      active: { variant: 'default' as const, text: 'نشط', icon: CheckCircle },
      completed: { variant: 'outline' as const, text: 'مكتمل', icon: CheckCircle },
      cancelled: { variant: 'destructive' as const, text: 'ملغي', icon: XCircle }
    };
    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const getLogStatusBadge = (status: string) => {
    const variants = {
      success: { variant: 'default' as const, text: 'نجح', icon: CheckCircle },
      error: { variant: 'destructive' as const, text: 'خطأ', icon: XCircle },
      warning: { variant: 'secondary' as const, text: 'تحذير', icon: AlertTriangle }
    };
    const config = variants[status as keyof typeof variants] || variants.success;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">وضع الصيانة</h2>
          <p className="text-gray-600">إدارة وضع الصيانة والتحكم في وصول المستخدمين</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? <EyeOff className="w-4 h-4 ml-2" /> : <Eye className="w-4 h-4 ml-2" />}
            {isPreviewMode ? 'إيقاف المعاينة' : 'معاينة'}
          </Button>
          <Button
            variant={settings.enabled ? 'destructive' : 'default'}
            onClick={handleToggleMaintenance}
          >
            {settings.enabled ? <Unlock className="w-4 h-4 ml-2" /> : <Lock className="w-4 h-4 ml-2" />}
            {settings.enabled ? 'إلغاء الصيانة' : 'تفعيل الصيانة'}
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card className={settings.enabled ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${settings.enabled ? 'bg-red-100' : 'bg-green-100'}`}>
                {settings.enabled ? <AlertTriangle className="w-6 h-6 text-red-600" /> : <CheckCircle className="w-6 h-6 text-green-600" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  وضع الصيانة {settings.enabled ? 'نشط' : 'غير نشط'}
                </h3>
                <p className="text-gray-600">
                  {settings.enabled ? 'الموقع حالياً في وضع الصيانة' : 'الموقع يعمل بشكل طبيعي'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={settings.enabled}
                onCheckedChange={handleToggleMaintenance}
              />
              <span className="text-sm font-medium">
                {settings.enabled ? 'نشط' : 'غير نشط'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          <TabsTrigger value="schedule">جدولة الصيانة</TabsTrigger>
          <TabsTrigger value="access">الوصول المسموح</TabsTrigger>
          <TabsTrigger value="logs">السجلات</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  الإعدادات الأساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">عنوان رسالة الصيانة</Label>
                  <Input
                    id="title"
                    value={settings.title}
                    onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                    placeholder="عنوان رسالة الصيانة"
                  />
                </div>

                <div>
                  <Label htmlFor="message">رسالة الصيانة</Label>
                  <Textarea
                    id="message"
                    value={settings.message}
                    onChange={(e) => setSettings({ ...settings, message: e.target.value })}
                    placeholder="رسالة تظهر للمستخدمين أثناء الصيانة"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="redirectUrl">رابط التحويل (اختياري)</Label>
                  <Input
                    id="redirectUrl"
                    type="url"
                    value={settings.redirectUrl}
                    onChange={(e) => setSettings({ ...settings, redirectUrl: e.target.value })}
                    placeholder="https://example.com/maintenance"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showCountdown">عرض العد التنازلي</Label>
                    <Switch
                      id="showCountdown"
                      checked={settings.showCountdown}
                      onCheckedChange={(checked) => setSettings({ ...settings, showCountdown: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowAdminAccess">سماح للمديرين بالوصول</Label>
                    <Switch
                      id="allowAdminAccess"
                      checked={settings.allowAdminAccess}
                      onCheckedChange={(checked) => setSettings({ ...settings, allowAdminAccess: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifyUsers">إشعار المستخدمين</Label>
                    <Switch
                      id="notifyUsers"
                      checked={settings.notifyUsers}
                      onCheckedChange={(checked) => setSettings({ ...settings, notifyUsers: checked })}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveSettings} className="w-full">
                  <Save className="w-4 h-4 ml-2" />
                  حفظ الإعدادات
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  جدولة الصيانة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="startTime">وقت البدء</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={settings.startTime}
                    onChange={(e) => setSettings({ ...settings, startTime: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="endTime">وقت الانتهاء</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={settings.endTime}
                    onChange={(e) => setSettings({ ...settings, endTime: e.target.value })}
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">معلومات الجدولة</h4>
                  {settings.startTime && settings.endTime ? (
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>المدة: {Math.round((new Date(settings.endTime).getTime() - new Date(settings.startTime).getTime()) / (1000 * 60 * 60))} ساعة</p>
                      <p>الحالة: {new Date(settings.startTime) > new Date() ? 'مجدول' : new Date(settings.endTime) > new Date() ? 'نشط' : 'منتهي'}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">لم يتم تحديد أوقات</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          {isPreviewMode && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  معاينة صفحة الصيانة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="p-4 bg-yellow-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <AlertTriangle className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">{settings.title}</h1>
                    <p className="text-gray-600 mb-6">{settings.message}</p>
                    {settings.showCountdown && settings.startTime && (
                      <div className="mb-6">
                        <p className="text-sm text-gray-500 mb-2">الوقت المتبقي:</p>
                        <div className="text-3xl font-bold text-blue-600">
                          {Math.max(0, Math.floor((new Date(settings.endTime).getTime() - new Date().getTime()) / (1000 * 60 * 60)))} ساعة
                        </div>
                      </div>
                    )}
                    <div className="flex justify-center gap-4">
                      <Button variant="outline">
                        <RefreshCw className="w-4 h-4 ml-2" />
                        تحديث
                      </Button>
                      {settings.redirectUrl && (
                        <Button>
                          <ExternalLink className="w-4 h-4 ml-2" />
                          زيارة الرابط
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">جدول الصيانة</h3>
            <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 ml-2" />
                  جدولة صيانة جديدة
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>جدولة صيانة جديدة</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="schedule-title">العنوان</Label>
                    <Input
                      id="schedule-title"
                      value={newSchedule.title}
                      onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                      placeholder="عنوان الصيانة"
                    />
                  </div>

                  <div>
                    <Label htmlFor="schedule-description">الوصف</Label>
                    <Textarea
                      id="schedule-description"
                      value={newSchedule.description}
                      onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}
                      placeholder="وصف أعمال الصيانة"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="schedule-startTime">وقت البدء</Label>
                      <Input
                        id="schedule-startTime"
                        type="datetime-local"
                        value={newSchedule.startTime}
                        onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="schedule-endTime">وقت الانتهاء</Label>
                      <Input
                        id="schedule-endTime"
                        type="datetime-local"
                        value={newSchedule.endTime}
                        onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="schedule-type">النوع</Label>
                    <Select value={newSchedule.type} onValueChange={(value: any) => setNewSchedule({ ...newSchedule, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">مجدول</SelectItem>
                        <SelectItem value="immediate">فوري</SelectItem>
                        <SelectItem value="recurring">متكرر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="schedule-notify">إشعار المستخدمين</Label>
                    <Switch
                      id="schedule-notify"
                      checked={newSchedule.notifyUsers}
                      onCheckedChange={(checked) => setNewSchedule({ ...newSchedule, notifyUsers: checked })}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleCreateSchedule}>
                      إنشاء الجدولة
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {schedules.map((schedule) => (
              <Card key={schedule.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 space-x-reverse">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{schedule.title}</h4>
                          {getStatusBadge(schedule.status)}
                          <Badge variant="outline">{schedule.type}</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{schedule.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {schedule.startTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {schedule.endTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {schedule.createdBy}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {schedule.status === 'pending' && (
                        <Button variant="outline" size="sm" onClick={() => handleCancelSchedule(schedule.id)}>
                          إلغاء
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleDeleteSchedule(schedule.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  عناوين IP المسموح بها
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="أدخل عنوان IP"
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                  />
                  <Button onClick={handleAddIp}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {settings.allowedIps.map((ip) => (
                    <div key={ip} className="flex items-center justify-between p-2 border rounded">
                      <code className="text-sm">{ip}</code>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveIp(ip)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-gray-500">
                  هذه العناوين يمكنها الوصول للموقع حتى أثناء الصيانة
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  المستخدمون المسموح لهم
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="أدخل اسم المستخدم أو البريد الإلكتروني"
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                  />
                  <Button onClick={handleAddUser}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {settings.allowedUsers.map((user) => (
                    <div key={user} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{user}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveUser(user)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-gray-500">
                  هؤلاء المستخدمون يمكنهم الوصول للموقع حتى أثناء الصيانة
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                سجلات الصيانة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getLogStatusBadge(log.status)}
                      <div>
                        <p className="font-medium">{log.action}</p>
                        <p className="text-sm text-gray-500">{log.details}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-500">{log.user}</p>
                      <p className="text-xs text-gray-400">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}