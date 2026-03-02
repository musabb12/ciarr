'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Search, 
  Filter, 
  Plus, 
  Send,
  Eye,
  Trash2,
  CheckCircle,
  Info,
  AlertTriangle,
  CheckSquare,
  MessageSquare,
  ShoppingBag,
  Star,
  Calendar
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'order' | 'review' | 'contact';
  userId?: string;
  userName?: string;
  isRead: boolean;
  data?: string;
  createdAt: string;
}

export function NotificationsManagement() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'طلب جديد',
      message: 'لديك طلب جديد #1234 بقيمة 299 ريال',
      type: 'order',
      userId: 'user1',
      userName: 'أحمد محمد',
      isRead: false,
      data: '{"orderId": "1234", "amount": 299}',
      createdAt: '2024-01-20 10:30'
    },
    {
      id: '2',
      title: 'تقييم جديد',
      message: 'قيم العميل منتجك بـ 5 نجوم',
      type: 'review',
      userId: 'user2',
      userName: 'فاطمة علي',
      isRead: false,
      data: '{"reviewId": "567", "rating": 5}',
      createdAt: '2024-01-20 09:15'
    },
    {
      id: '3',
      title: 'رسالة جديدة',
      message: 'لديك رسالة جديدة من صفحة التواصل',
      type: 'contact',
      isRead: true,
      data: '{"contactId": "890"}',
      createdAt: '2024-01-19 16:45'
    },
    {
      id: '4',
      title: 'صيانة مجدولة',
      message: 'سيتم إجراء صيانة للخادم غداً الساعة 2 صباحاً',
      type: 'warning',
      isRead: true,
      createdAt: '2024-01-19 14:20'
    },
    {
      id: '5',
      title: 'تم تحديث النظام',
      message: 'تم تحديث النظام بنجاح إلى الإصدار 2.1.0',
      type: 'success',
      isRead: true,
      createdAt: '2024-01-18 11:00'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    targetAll: true
  });

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'read' && notification.isRead) ||
      (filterStatus === 'unread' && !notification.isRead);
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    const icons = {
      'info': <Info className="w-4 h-4" />,
      'success': <CheckSquare className="w-4 h-4" />,
      'warning': <AlertTriangle className="w-4 h-4" />,
      'error': <AlertTriangle className="w-4 h-4" />,
      'order': <ShoppingBag className="w-4 h-4" />,
      'review': <Star className="w-4 h-4" />,
      'contact': <MessageSquare className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons] || <Info className="w-4 h-4" />;
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'info': { label: 'معلومات', color: 'bg-blue-100 text-blue-800' },
      'success': { label: 'نجاح', color: 'bg-green-100 text-green-800' },
      'warning': { label: 'تحذير', color: 'bg-yellow-100 text-yellow-800' },
      'error': { label: 'خطأ', color: 'bg-red-100 text-red-800' },
      'order': { label: 'طلب', color: 'bg-purple-100 text-purple-800' },
      'review': { label: 'تقييم', color: 'bg-indigo-100 text-indigo-800' },
      'contact': { label: 'رسالة', color: 'bg-pink-100 text-pink-800' }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig];
    return (
      <Badge className={config.color}>
        {getTypeIcon(type)}
        <span className="mr-1">{config.label}</span>
      </Badge>
    );
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const sendNotification = () => {
    if (newNotification.title && newNotification.message) {
      const notification: Notification = {
        id: Date.now().toString(),
        title: newNotification.title,
        message: newNotification.message,
        type: newNotification.type,
        isRead: false,
        createdAt: new Date().toLocaleString('ar-SA')
      };
      setNotifications([notification, ...notifications]);
      setNewNotification({ title: '', message: '', type: 'info', targetAll: true });
      setShowCreateForm(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة الإشعارات</h2>
          <p className="text-gray-600">إدارة جميع إشعارات النظام</p>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCircle className="w-4 h-4 ml-2" />
            تحديد الكل كمقروء
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 ml-2" />
            إشعار جديد
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الإشعارات</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">غير مقروءة</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{unreadCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إشعارات الطلبات</p>
                <p className="text-2xl font-bold">{notifications.filter(n => n.type === 'order').length}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إشعارات التقييمات</p>
                <p className="text-2xl font-bold">{notifications.filter(n => n.type === 'review').length}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Notification Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>إنشاء إشعار جديد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">عنوان الإشعار</label>
                <Input
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  placeholder="أدخل عنوان الإشعار"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">نص الإشعار</label>
                <Input
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  placeholder="أدخل نص الإشعار"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">نوع الإشعار</label>
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({...newNotification, type: e.target.value as any})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="info">معلومات</option>
                  <option value="success">نجاح</option>
                  <option value="warning">تحذير</option>
                  <option value="error">خطأ</option>
                </select>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                <Button onClick={sendNotification}>
                  <Send className="w-4 h-4 ml-2" />
                  إرسال الإشعار
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  إلغاء
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="البحث في الإشعارات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">جميع الأنواع</option>
              <option value="info">معلومات</option>
              <option value="success">نجاح</option>
              <option value="warning">تحذير</option>
              <option value="error">خطأ</option>
              <option value="order">طلبات</option>
              <option value="review">تقييمات</option>
              <option value="contact">رسائل</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">جميع الحالات</option>
              <option value="read">مقروء</option>
              <option value="unread">غير مقروء</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={!notification.isRead ? 'border-blue-200 bg-blue-50' : ''}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 space-x-reverse flex-1">
                  <div className={`p-2 rounded-lg ${
                    notification.type === 'info' ? 'bg-blue-100 text-blue-600' :
                    notification.type === 'success' ? 'bg-green-100 text-green-600' :
                    notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    notification.type === 'error' ? 'bg-red-100 text-red-600' :
                    notification.type === 'order' ? 'bg-purple-100 text-purple-600' :
                    notification.type === 'review' ? 'bg-indigo-100 text-indigo-600' :
                    'bg-pink-100 text-pink-600'
                  }`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {getTypeBadge(notification.type)}
                      {!notification.isRead && (
                        <Badge className="bg-blue-500 text-white">جديد</Badge>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{notification.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {notification.userName && (
                        <span>المستخدم: {notification.userName}</span>
                      )}
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 ml-1" />
                        {notification.createdAt}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 space-x-reverse mr-4">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  {!notification.isRead && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => markAsRead(notification.id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}