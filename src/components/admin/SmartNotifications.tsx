'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Bell, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Settings,
  Send,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  User,
  Mail,
  Smartphone,
  Globe,
  Zap,
  Filter,
  Search,
  Plus,
  Edit,
  Archive
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'system' | 'user' | 'security' | 'performance' | 'business';
  channels: Array<'in_app' | 'email' | 'sms' | 'push'>;
  targetAudience: 'all' | 'admins' | 'users' | 'premium' | 'custom';
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  readCount: number;
  totalRecipients: number;
  createdAt: string;
  createdBy: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

interface NotificationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  conditions: Record<string, any>;
  template: string;
  channels: Array<'email' | 'sms' | 'push'>;
  enabled: boolean;
  createdAt: string;
}

export function SmartNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'صيانة مجدولة للنظام',
      message: 'سيتم إجراء صيانة للنظام يوم الجمعة من الساعة 2 صباحاً حتى 4 صباحاً',
      type: 'warning',
      priority: 'high',
      category: 'system',
      channels: ['in_app', 'email'],
      targetAudience: 'all',
      status: 'scheduled',
      scheduledAt: '2024-01-15T02:00:00Z',
      readCount: 0,
      totalRecipients: 1000,
      createdAt: '2024-01-10T10:00:00Z',
      createdBy: 'admin',
      tags: ['صيانة', 'نظام']
    },
    {
      id: '2',
      title: 'تحديث أمني مهم',
      message: 'تم اكتشاف ثغرة أمنية وتحتاج لتحديث فوري',
      type: 'error',
      priority: 'urgent',
      category: 'security',
      channels: ['in_app', 'email', 'sms'],
      targetAudience: 'admins',
      status: 'sent',
      sentAt: '2024-01-12T15:30:00Z',
      readCount: 5,
      totalRecipients: 8,
      createdAt: '2024-01-12T15:00:00Z',
      createdBy: 'security_system',
      tags: ['أمن', 'تحديث']
    },
    {
      id: '3',
      title: 'ترحيب بالعضو الجديد',
      message: 'مرحباً بك في منصتنا! نحن سعداء بانضمامك إلينا',
      type: 'success',
      priority: 'low',
      category: 'user',
      channels: ['in_app', 'email'],
      targetAudience: 'users',
      status: 'sent',
      sentAt: '2024-01-13T09:00:00Z',
      readCount: 45,
      totalRecipients: 50,
      createdAt: '2024-01-13T08:30:00Z',
      createdBy: 'system',
      tags: ['ترحيب', 'مستخدم جديد']
    }
  ]);

  const [rules, setRules] = useState<NotificationRule[]>([
    {
      id: '1',
      name: 'تنبيهات الأداء',
      description: 'إرسال تنبيه عند تجاوز استخدام المعالج 80%',
      trigger: 'cpu_usage_high',
      conditions: { threshold: 80 },
      template: 'performance_alert',
      channels: ['email', 'push'],
      enabled: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'ترحيب المستخدمين الجدد',
      description: 'إرسال رسالة ترحيب للمستخدمين الجدد',
      trigger: 'user_registered',
      conditions: {},
      template: 'welcome_message',
      channels: ['email', 'in_app'],
      enabled: true,
      createdAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    priority: 'medium' as const,
    category: 'system' as const,
    channels: ['in_app'] as Array<'in_app' | 'email' | 'sms' | 'push'>,
    targetAudience: 'all' as const
  });

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || notification.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: 'secondary',
      medium: 'default',
      high: 'destructive',
      urgent: 'destructive'
    } as const;

    const labels = {
      low: 'منخفض',
      medium: 'متوسط',
      high: 'عالي',
      urgent: 'عاجل'
    };

    return <Badge variant={variants[priority as keyof typeof variants]}>{labels[priority as keyof typeof labels]}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      scheduled: 'default',
      sent: 'default',
      failed: 'destructive'
    } as const;

    const labels = {
      draft: 'مسودة',
      scheduled: 'مجدول',
      sent: 'تم الإرسال',
      failed: 'فشل'
    };

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system':
        return <Settings className="w-4 h-4 text-gray-600" />;
      case 'user':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'security':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'performance':
        return <Zap className="w-4 h-4 text-yellow-600" />;
      case 'business':
        return <Globe className="w-4 h-4 text-green-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <Smartphone className="w-4 h-4" />;
      case 'push':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const handleCreateNotification = () => {
    const notification: Notification = {
      id: Date.now().toString(),
      ...newNotification,
      status: 'draft',
      readCount: 0,
      totalRecipients: 0,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    };

    setNotifications(prev => [notification, ...prev]);
    setIsCreateDialogOpen(false);
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      priority: 'medium',
      category: 'system',
      channels: ['in_app'],
      targetAudience: 'all'
    });
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const getReadRate = (notification: Notification) => {
    if (notification.totalRecipients === 0) return 0;
    return (notification.readCount / notification.totalRecipients) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 space-x-reverse">
          <h2 className="text-2xl font-bold">الإشعارات الذكية</h2>
          <Badge variant="outline">{notifications.length} إشعار</Badge>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="بحث في الإشعارات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 w-64"
            />
          </div>
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="draft">مسودة</SelectItem>
              <SelectItem value="scheduled">مجدول</SelectItem>
              <SelectItem value="sent">تم الإرسال</SelectItem>
              <SelectItem value="failed">فشل</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 ml-2" />
                إشعار جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إنشاء إشعار جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">العنوان</label>
                  <Input
                    value={newNotification.title}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="عنوان الإشعار"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">الرسالة</label>
                  <Textarea
                    value={newNotification.message}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="محتوى الإشعار"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">النوع</label>
                    <Select value={newNotification.type} onValueChange={(value: any) => setNewNotification(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">معلومات</SelectItem>
                        <SelectItem value="success">نجاح</SelectItem>
                        <SelectItem value="warning">تحذير</SelectItem>
                        <SelectItem value="error">خطأ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">الأولوية</label>
                    <Select value={newNotification.priority} onValueChange={(value: any) => setNewNotification(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">منخفض</SelectItem>
                        <SelectItem value="medium">متوسط</SelectItem>
                        <SelectItem value="high">عالي</SelectItem>
                        <SelectItem value="urgent">عاجل</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">الفئة</label>
                    <Select value={newNotification.category} onValueChange={(value: any) => setNewNotification(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">نظام</SelectItem>
                        <SelectItem value="user">مستخدم</SelectItem>
                        <SelectItem value="security">أمن</SelectItem>
                        <SelectItem value="performance">أداء</SelectItem>
                        <SelectItem value="business">أعمال</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">الجمهور المستهدف</label>
                    <Select value={newNotification.targetAudience} onValueChange={(value: any) => setNewNotification(prev => ({ ...prev, targetAudience: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">الكل</SelectItem>
                        <SelectItem value="admins">المديرون</SelectItem>
                        <SelectItem value="users">المستخدمون</SelectItem>
                        <SelectItem value="premium">المميزون</SelectItem>
                        <SelectItem value="custom">مخصص</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">قنوات الإرسال</label>
                  <div className="flex space-x-4 space-x-reverse mt-2">
                    {['in_app', 'email', 'sms', 'push'].map((channel) => (
                      <label key={channel} className="flex items-center space-x-2 space-x-reverse">
                        <input
                          type="checkbox"
                          checked={newNotification.channels.includes(channel as any)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewNotification(prev => ({
                                ...prev,
                                channels: [...prev.channels, channel as any]
                              }));
                            } else {
                              setNewNotification(prev => ({
                                ...prev,
                                channels: prev.channels.filter(c => c !== channel)
                              }));
                            }
                          }}
                        />
                        <span className="text-sm">
                          {channel === 'in_app' ? 'داخل التطبيق' :
                           channel === 'email' ? 'البريد الإلكتروني' :
                           channel === 'sms' ? 'الرسائل النصية' : 'الإشعارات الفورية'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2 space-x-reverse">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleCreateNotification}>
                    إنشاء إشعار
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Notifications List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredNotifications.map((notification) => (
            <Card key={notification.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 space-x-reverse mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        {getPriorityBadge(notification.priority)}
                        {getStatusBadge(notification.status)}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                      <div className="flex items-center space-x-4 space-x-reverse text-xs text-gray-500">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          {getCategoryIcon(notification.category)}
                          <span>{notification.category}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(notification.createdAt).toLocaleDateString('ar-SA')}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <User className="w-3 h-3" />
                          <span>{notification.createdBy}</span>
                        </div>
                      </div>
                      {notification.tags && (
                        <div className="flex items-center space-x-2 space-x-reverse mt-2">
                          {notification.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="text-left">
                      <div className="text-sm font-medium">
                        {notification.readCount}/{notification.totalRecipients}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getReadRate(notification).toFixed(1)}% قراءة
                      </div>
                    </div>
                    <div className="flex space-x-1 space-x-reverse">
                      {notification.channels.map((channel) => (
                        <div key={channel} className="text-gray-400">
                          {getChannelIcon(channel)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Rules Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">قواعد الإشعارات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{rule.name}</h4>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => handleToggleRule(rule.id)}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{rule.description}</p>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {rule.channels.map((channel) => (
                      <div key={channel} className="text-gray-400">
                        {getChannelIcon(channel)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 ml-2" />
                إضافة قاعدة
              </Button>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إحصائيات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">معدل القراءة</span>
                <span className="font-medium">67.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">الإشعارات المرسلة</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">القواعد النشطة</span>
                <span className="font-medium">{rules.filter(r => r.enabled).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">الاستجابة</span>
                <span className="font-medium">12.5%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}