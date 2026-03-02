'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Download, 
  RefreshCw,
  Filter,
  Search,
  AlertCircle,
  Lock,
  Unlock,
  User,
  Activity,
  Globe,
  Database,
  Wifi,
  WifiOff,
  Ban,
  ShieldOff,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'permission_denied' | 'data_access' | 'system_change' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  user: string;
  ip: string;
  timestamp: string;
  status: 'active' | 'resolved' | 'investigating';
  details: any;
}

interface SecurityMetric {
  label: string;
  value: number;
  total: number;
  status: 'good' | 'warning' | 'critical';
  icon: React.ReactNode;
}

export function SecurityAudit() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);

  useEffect(() => {
    fetchSecurityEvents();
  }, []);

  const fetchSecurityEvents = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const mockEvents: SecurityEvent[] = [
        {
          id: '1',
          type: 'login_attempt',
          severity: 'high',
          title: 'محاولة تسجيل دخول مشبوهة',
          description: 'تم اكتشاف محاولات تسجيل دخول متعددة من عنوان IP غير معروف',
          user: 'admin@ciarcilar.com',
          ip: '192.168.1.100',
          timestamp: '2024-01-15 14:30:00',
          status: 'investigating',
          details: { attempts: 5, duration: '2 دقيقة', location: 'مجهول' }
        },
        {
          id: '2',
          type: 'permission_denied',
          severity: 'medium',
          title: 'محاولة وصول غير مصرح بها',
          description: 'حاول المستخدم الوصول إلى قسم الإعدادات بدون صلاحيات',
          user: 'user@example.com',
          ip: '192.168.1.50',
          timestamp: '2024-01-15 13:45:00',
          status: 'resolved',
          details: { resource: '/admin/settings', action: 'GET' }
        },
        {
          id: '3',
          type: 'data_access',
          severity: 'low',
          title: 'وصول للبيانات',
          description: 'تم الوصول إلى بيانات المستخدمين بشكل طبيعي',
          user: 'manager@ciarcilar.com',
          ip: '192.168.1.30',
          timestamp: '2024-01-15 12:20:00',
          status: 'active',
          details: { records: 150, duration: '30 ثانية' }
        },
        {
          id: '4',
          type: 'suspicious_activity',
          severity: 'critical',
          title: 'نشاط مشبوه',
          description: 'تم اكتشاف أنشطة غير عادية من حساب المستخدم',
          user: 'suspicious@example.com',
          ip: '10.0.0.1',
          timestamp: '2024-01-15 11:15:00',
          status: 'investigating',
          details: { anomalies: ['تسجيل دخول من موقعين مختلفين', 'طلبات غير عادية'] }
        },
        {
          id: '5',
          type: 'system_change',
          severity: 'medium',
          title: 'تغيير في النظام',
          description: 'تم تعديل إعدادات الأمان الأساسية',
          user: 'admin@ciarcilar.com',
          ip: '192.168.1.10',
          timestamp: '2024-01-15 10:30:00',
          status: 'resolved',
          details: { changes: ['تحديث سياسة كلمة المرور', 'تفعيل المصادقة الثنائية'] }
        }
      ];
      setEvents(mockEvents);
    } catch (error) {
      console.error('Failed to fetch security events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const securityMetrics: SecurityMetric[] = [
    {
      label: 'الأحداث الأمنية',
      value: 12,
      total: 100,
      status: 'warning',
      icon: <Shield className="w-4 h-4" />
    },
    {
      label: 'المحاولات المحظورة',
      value: 45,
      total: 50,
      status: 'good',
      icon: <Ban className="w-4 h-4" />
    },
    {
      label: 'التهديدات النشطة',
      value: 3,
      total: 10,
      status: 'critical',
      icon: <AlertTriangle className="w-4 h-4" />
    },
    {
      label: 'الجلسات الآمنة',
      value: 89,
      total: 100,
      status: 'good',
      icon: <Lock className="w-4 h-4" />
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || event.severity === selectedSeverity;
    const matchesType = selectedType === 'all' || event.type === selectedType;
    return matchesSearch && matchesSeverity && matchesType;
  });

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; text: string }> = {
      low: { variant: "outline", text: "منخفض" },
      medium: { variant: "secondary", text: "متوسط" },
      high: { variant: "destructive", text: "عالي" },
      critical: { variant: "destructive", text: "حرج" }
    };
    const config = variants[severity] || variants.low;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; text: string }> = {
      active: { variant: "default", text: "نشط" },
      resolved: { variant: "secondary", text: "تم الحل" },
      investigating: { variant: "outline", text: "قيد التحقيق" }
    };
    const config = variants[status] || variants.active;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      login_attempt: <User className="w-4 h-4" />,
      permission_denied: <Ban className="w-4 h-4" />,
      data_access: <Database className="w-4 h-4" />,
      system_change: <Settings className="w-4 h-4" />,
      suspicious_activity: <AlertTriangle className="w-4 h-4" />
    };
    return icons[type] || <Shield className="w-4 h-4" />;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      good: 'text-green-600',
      warning: 'text-yellow-600',
      critical: 'text-red-600'
    };
    return colors[status] || colors.good;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">التدقيق الأمني</h2>
          <p className="text-gray-600">مراقبة الأحداث الأمنية والتهديدات</p>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Button variant="outline" onClick={fetchSecurityEvents} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 ml-2" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <div className={getStatusColor(metric.status)}>
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <Progress value={(metric.value / metric.total) * 100} className="mt-2" />
              <p className="text-xs text-gray-500 mt-1">
                من {metric.total} إجمالي
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="events" className="space-y-6">
        <TabsList>
          <TabsTrigger value="events">الأحداث الأمنية</TabsTrigger>
          <TabsTrigger value="threats">التهديدات</TabsTrigger>
          <TabsTrigger value="policies">السياسات</TabsTrigger>
          <TabsTrigger value="monitoring">المراقبة</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>الفلاتر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="البحث في الأحداث..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>
                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="الشدة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المستويات</SelectItem>
                    <SelectItem value="low">منخفض</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="high">عالي</SelectItem>
                    <SelectItem value="critical">حرج</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    <SelectItem value="login_attempt">محاولة تسجيل دخول</SelectItem>
                    <SelectItem value="permission_denied">وصول مرفوض</SelectItem>
                    <SelectItem value="data_access">وصول للبيانات</SelectItem>
                    <SelectItem value="system_change">تغيير في النظام</SelectItem>
                    <SelectItem value="suspicious_activity">نشاط مشبوه</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Events Table */}
          <Card>
            <CardHeader>
              <CardTitle>الأحداث الأمنية</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>النوع</TableHead>
                    <TableHead>العنوان</TableHead>
                    <TableHead>المستخدم</TableHead>
                    <TableHead>الشدة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الوقت</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {getTypeIcon(event.type)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-500">{event.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{event.user}</p>
                          <p className="text-sm text-gray-500">{event.ip}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getSeverityBadge(event.severity)}</TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell>{event.timestamp}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedEvent(event)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>تفاصيل الحدث الأمني</DialogTitle>
                              </DialogHeader>
                              {selectedEvent && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">العنوان</label>
                                      <p className="text-sm">{selectedEvent.title}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">النوع</label>
                                      <p className="text-sm">{selectedEvent.type}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">المستخدم</label>
                                      <p className="text-sm">{selectedEvent.user}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">عنوان IP</label>
                                      <p className="text-sm">{selectedEvent.ip}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">الشدة</label>
                                      <div>{getSeverityBadge(selectedEvent.severity)}</div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">الحالة</label>
                                      <div>{getStatusBadge(selectedEvent.status)}</div>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">الوصف</label>
                                    <p className="text-sm">{selectedEvent.description}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">التفاصيل</label>
                                    <pre className="text-xs bg-gray-100 p-2 rounded">
                                      {JSON.stringify(selectedEvent.details, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>التهديدات النشطة</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-900">هجوم بالقوة الغاشمة</h4>
                        <p className="text-sm text-red-700">محاولات تسجيل دخول متعددة</p>
                      </div>
                      <Badge variant="destructive">حرج</Badge>
                    </div>
                  </div>
                  <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-yellow-900">وصول من IP مشبوه</h4>
                        <p className="text-sm text-yellow-700">نشاط غير عادي</p>
                      </div>
                      <Badge variant="secondary">متوسط</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>الحماية النشطة</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Lock className="w-4 h-4 text-green-600" />
                      <span>جدار الحماية</span>
                    </div>
                    <Badge variant="default">نشط</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>الكشف عن التسلل</span>
                    </div>
                    <Badge variant="default">نشط</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Eye className="w-4 h-4 text-green-600" />
                      <span>مراقبة السجلات</span>
                    </div>
                    <Badge variant="default">نشط</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>سياسات الأمان</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">سياسات كلمة المرور</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>الحد الأدنى للطول</span>
                        <Badge>8 أحرف</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>مطلوب أحرف خاصة</span>
                        <Badge variant="default">نعم</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>انتهاء الصلاحية</span>
                        <Badge>90 يوم</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-4">سياسات الوصول</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>المصادقة الثنائية</span>
                        <Badge variant="default">مطلوبة للمسؤولين</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>جلسات متعددة</span>
                        <Badge variant="secondary">مسموح</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>قفل الحساب</span>
                        <Badge>بعد 5 محاولات</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Activity className="w-5 h-5" />
                  <span>نشاط الشبكة</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>الطلبات/دقيقة</span>
                    <span className="font-medium">245</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>النطاق الترددي</span>
                    <span className="font-medium">12.5 MB/s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>الاتصالات النشطة</span>
                    <span className="font-medium">89</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Database className="w-5 h-5" />
                  <span>قاعدة البيانات</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>الاستعلامات/ثانية</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>وقت الاستجابة</span>
                    <span className="font-medium">23ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>حجم البيانات</span>
                    <span className="font-medium">2.3 GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Globe className="w-5 h-5" />
                  <span>الخوادم</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>استخدام CPU</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>استخدام الذاكرة</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>مساحة التخزين</span>
                    <span className="font-medium">78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}