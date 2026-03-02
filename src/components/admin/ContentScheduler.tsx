'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Send, 
  FileText, 
  Image, 
  Video, 
  Link,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  MoreHorizontal,
  Repeat,
  Globe,
  Mail,
  MessageSquare,
  Bell
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

interface ScheduledContent {
  id: string;
  title: string;
  type: 'post' | 'email' | 'social' | 'notification';
  content: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'published' | 'failed' | 'cancelled';
  channels: string[];
  repeatPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  targetAudience?: string;
  tags: string[];
  createdAt: string;
  publishedAt?: string;
}

interface Channel {
  id: string;
  name: string;
  type: 'email' | 'social' | 'push' | 'sms';
  icon: React.ReactNode;
  active: boolean;
}

interface Template {
  id: string;
  name: string;
  type: string;
  content: string;
  variables: string[];
}

export function ContentScheduler() {
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([
    {
      id: '1',
      title: 'عرض خاص على المنتجات الجديدة',
      type: 'email',
      content: 'نقدم لكم عرضاً خاصاً على منتجاتنا الجديدة...',
      scheduledDate: '2024-01-20',
      scheduledTime: '10:00',
      status: 'scheduled',
      channels: ['email', 'social'],
      targetAudience: 'all',
      tags: ['عرض', 'منتجات جديدة', 'تسويق'],
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'تحديثات النظام الأسبوعية',
      type: 'post',
      content: 'تحديثات جديدة وميزات محسنة هذا الأسبوع...',
      scheduledDate: '2024-01-18',
      scheduledTime: '14:00',
      status: 'published',
      channels: ['blog'],
      tags: ['تحديثات', 'نظام', 'ميزات'],
      createdAt: '2024-01-14',
      publishedAt: '2024-01-18'
    },
    {
      id: '3',
      title: 'تذكير بفعالية نهاية الأسبوع',
      type: 'notification',
      content: 'لا تنسوا فعاليتنا المميزة نهاية الأسبوع...',
      scheduledDate: '2024-01-19',
      scheduledTime: '18:00',
      status: 'failed',
      channels: ['push'],
      targetAudience: 'premium',
      tags: ['فعالية', 'تذكير', 'نهاية الأسبوع'],
      createdAt: '2024-01-13'
    }
  ]);

  const [channels] = useState<Channel[]>([
    { id: 'email', name: 'البريد الإلكتروني', type: 'email', icon: <Mail className="w-4 h-4" />, active: true },
    { id: 'social', name: 'وسائل التواصل الاجتماعي', type: 'social', icon: <MessageSquare className="w-4 h-4" />, active: true },
    { id: 'push', name: 'الإشعارات الفورية', type: 'push', icon: <Bell className="w-4 h-4" />, active: true },
    { id: 'blog', name: 'المدونة', type: 'blog', icon: <FileText className="w-4 h-4" />, active: true },
    { id: 'sms', name: 'الرسائل النصية', type: 'sms', icon: <MessageSquare className="w-4 h-4" />, active: false }
  ]);

  const [templates] = useState<Template[]>([
    {
      id: '1',
      name: 'قالب التسويق',
      type: 'email',
      content: 'مرحباً {{name}}، نقدم لكم {{offer}}...',
      variables: ['name', 'offer']
    },
    {
      id: '2',
      name: 'قالب التحديثات',
      type: 'post',
      content: 'تحديث جديد: {{title}} - {{description}}...',
      variables: ['title', 'description']
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ScheduledContent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const [newContent, setNewContent] = useState({
    title: '',
    type: 'post' as const,
    content: '',
    scheduledDate: '',
    scheduledTime: '',
    channels: [] as string[],
    repeatPattern: undefined as 'daily' | 'weekly' | 'monthly' | 'yearly' | undefined,
    targetAudience: 'all',
    tags: [] as string[]
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: { variant: 'default' as const, text: 'مجدول', icon: Clock },
      published: { variant: 'secondary' as const, text: 'منشور', icon: CheckCircle },
      failed: { variant: 'destructive' as const, text: 'فشل', icon: XCircle },
      cancelled: { variant: 'outline' as const, text: 'ملغي', icon: AlertCircle }
    };
    const config = variants[status as keyof typeof variants] || variants.scheduled;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      post: <FileText className="w-4 h-4" />,
      email: <Mail className="w-4 h-4" />,
      social: <MessageSquare className="w-4 h-4" />,
      notification: <Bell className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons] || icons.post;
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      post: { variant: 'default' as const, text: 'منشور' },
      email: { variant: 'secondary' as const, text: 'بريد' },
      social: { variant: 'outline' as const, text: 'تواصل' },
      notification: { variant: 'destructive' as const, text: 'إشعار' }
    };
    const config = variants[type as keyof typeof variants] || variants.post;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const filteredContent = scheduledContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || content.status === statusFilter;
    const matchesType = typeFilter === 'all' || content.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateContent = () => {
    const content: ScheduledContent = {
      id: Date.now().toString(),
      ...newContent,
      status: 'scheduled',
      tags: newContent.tags,
      createdAt: new Date().toISOString()
    };
    setScheduledContent([...scheduledContent, content]);
    setNewContent({
      title: '',
      type: 'post',
      content: '',
      scheduledDate: '',
      scheduledTime: '',
      channels: [],
      repeatPattern: undefined,
      targetAudience: 'all',
      tags: []
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditContent = () => {
    if (selectedContent) {
      setScheduledContent(scheduledContent.map(content => 
        content.id === selectedContent.id ? selectedContent : content
      ));
      setIsEditDialogOpen(false);
      setSelectedContent(null);
    }
  };

  const handleDeleteContent = (id: string) => {
    setScheduledContent(scheduledContent.filter(content => content.id !== id));
  };

  const handlePublishNow = (id: string) => {
    setScheduledContent(scheduledContent.map(content => 
      content.id === id 
        ? { ...content, status: 'published' as const, publishedAt: new Date().toISOString() }
        : content
    ));
  };

  const handleCancelSchedule = (id: string) => {
    setScheduledContent(scheduledContent.map(content => 
      content.id === id ? { ...content, status: 'cancelled' as const } : content
    ));
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">منسق المحتوى</h2>
          <p className="text-gray-600">جدولة وإدارة المحتوى عبر القنوات المختلفة</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              جدولة محتوى جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>جدولة محتوى جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">العنوان</Label>
                <Input
                  id="title"
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  placeholder="أدخل عنوان المحتوى"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">النوع</Label>
                  <Select value={newContent.type} onValueChange={(value: any) => setNewContent({ ...newContent, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">منشور</SelectItem>
                      <SelectItem value="email">بريد إلكتروني</SelectItem>
                      <SelectItem value="social">وسائل التواصل</SelectItem>
                      <SelectItem value="notification">إشعار</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="audience">الجمهور المستهدف</Label>
                  <Select value={newContent.targetAudience} onValueChange={(value) => setNewContent({ ...newContent, targetAudience: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الجميع</SelectItem>
                      <SelectItem value="premium">المميزون</SelectItem>
                      <SelectItem value="new">الجدد</SelectItem>
                      <SelectItem value="active">النشطون</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="content">المحتوى</Label>
                <Textarea
                  id="content"
                  value={newContent.content}
                  onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                  placeholder="أدخل المحتوى"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">التاريخ</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newContent.scheduledDate}
                    onChange={(e) => setNewContent({ ...newContent, scheduledDate: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="time">الوقت</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newContent.scheduledTime}
                    onChange={(e) => setNewContent({ ...newContent, scheduledTime: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>القنوات</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {channels.map((channel) => (
                    <div key={channel.id} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={channel.id}
                        checked={newContent.channels.includes(channel.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewContent({ ...newContent, channels: [...newContent.channels, channel.id] });
                          } else {
                            setNewContent({ ...newContent, channels: newContent.channels.filter(c => c !== channel.id) });
                          }
                        }}
                      />
                      <Label htmlFor={channel.id} className="flex items-center gap-2">
                        {channel.icon}
                        {channel.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="repeat">نمط التكرار</Label>
                <Select value={newContent.repeatPattern || ''} onValueChange={(value: any) => setNewContent({ ...newContent, repeatPattern: value || undefined })}>
                  <SelectTrigger>
                    <SelectValue placeholder="بدون تكرار" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">بدون تكرار</SelectItem>
                    <SelectItem value="daily">يومي</SelectItem>
                    <SelectItem value="weekly">أسبوعي</SelectItem>
                    <SelectItem value="monthly">شهري</SelectItem>
                    <SelectItem value="yearly">سنوي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleCreateContent}>
                  جدولة المحتوى
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="البحث في المحتوى..."
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
            <SelectItem value="scheduled">مجدول</SelectItem>
            <SelectItem value="published">منشور</SelectItem>
            <SelectItem value="failed">فشل</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            <SelectItem value="post">منشور</SelectItem>
            <SelectItem value="email">بريد</SelectItem>
            <SelectItem value="social">تواصل</SelectItem>
            <SelectItem value="notification">إشعار</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="scheduled" className="space-y-6">
        <TabsList>
          <TabsTrigger value="scheduled">المجدول</TabsTrigger>
          <TabsTrigger value="published">المنشور</TabsTrigger>
          <TabsTrigger value="calendar">التقويم</TabsTrigger>
          <TabsTrigger value="templates">القوالب</TabsTrigger>
          <TabsTrigger value="channels">القنوات</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-6">
          <div className="grid gap-4">
            {filteredContent
              .filter(content => content.status === 'scheduled')
              .map((content) => (
              <Card key={content.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 space-x-reverse">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getTypeIcon(content.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{content.title}</h3>
                          {getTypeBadge(content.type)}
                          {getStatusBadge(content.status)}
                          {content.repeatPattern && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Repeat className="w-3 h-3" />
                              {content.repeatPattern}
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{content.content}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {content.scheduledDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {content.scheduledTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            {content.channels.length} قنوات
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {content.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => {
                          setSelectedContent(content);
                          setIsEditDialogOpen(true);
                        }}>
                          <Edit className="w-4 h-4 ml-2" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePublishNow(content.id)}>
                          <Send className="w-4 h-4 ml-2" />
                          نشر الآن
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCancelSchedule(content.id)}>
                          <XCircle className="w-4 h-4 ml-2" />
                          إلغاء الجدولة
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteContent(content.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="published" className="space-y-6">
          <div className="grid gap-4">
            {filteredContent
              .filter(content => content.status === 'published')
              .map((content) => (
              <Card key={content.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 space-x-reverse">
                      <div className="p-2 bg-green-100 rounded-lg">
                        {getTypeIcon(content.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{content.title}</h3>
                          {getTypeBadge(content.type)}
                          {getStatusBadge(content.status)}
                        </div>
                        <p className="text-gray-600 mb-3">{content.content}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            تم النشر: {content.publishedAt}
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            {content.channels.length} قنوات
                          </div>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 ml-2" />
                          عرض التفاصيل
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Repeat className="w-4 h-4 ml-2" />
                          إعادة الجدولة
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تقويم المحتوى</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">عرض التقويم الشهري للمحتوى المجدول</p>
                <p className="text-sm text-gray-400 mt-2">سيتم عرض المحتوى المجدول حسب التواريخ</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>قوالب المحتوى</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium mb-2">{template.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{template.content}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{template.type}</Badge>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <span>المتغيرات:</span>
                              {template.variables.map((variable) => (
                                <Badge key={variable} variant="secondary" className="text-xs">
                                  {variable}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm">
                            استخدم
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>القنوات المتاحة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {channels.map((channel) => (
                  <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${channel.active ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {channel.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{channel.name}</h4>
                        <p className="text-sm text-gray-500">{channel.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={channel.active} />
                      <Badge variant={channel.active ? 'default' : 'secondary'}>
                        {channel.active ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تعديل المحتوى المجدول</DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">العنوان</Label>
                <Input
                  id="edit-title"
                  value={selectedContent.title}
                  onChange={(e) => setSelectedContent({ ...selectedContent, title: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-content">المحتوى</Label>
                <Textarea
                  id="edit-content"
                  value={selectedContent.content}
                  onChange={(e) => setSelectedContent({ ...selectedContent, content: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-date">التاريخ</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={selectedContent.scheduledDate}
                    onChange={(e) => setSelectedContent({ ...selectedContent, scheduledDate: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-time">الوقت</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={selectedContent.scheduledTime}
                    onChange={(e) => setSelectedContent({ ...selectedContent, scheduledTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleEditContent}>
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