'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  Search, 
  Filter,
  Calendar,
  Clock,
  Eye,
  MousePointer,
  Download,
  Upload,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Share2,
  Heart,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  User,
  MapPin,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ChevronDown,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface UserActivityItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  actionType: 'login' | 'logout' | 'view' | 'click' | 'download' | 'upload' | 'edit' | 'delete' | 'share' | 'like' | 'comment';
  resource: string;
  resourceType: 'page' | 'file' | 'template' | 'user' | 'service' | 'message' | 'image';
  ipAddress: string;
  userAgent: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  location: {
    country: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  duration?: number;
  metadata?: Record<string, any>;
}

interface ActivityStats {
  totalActivities: number;
  activeUsers: number;
  averageSessionDuration: number;
  topPages: Array<{ page: string; views: number }>;
  topActions: Array<{ action: string; count: number }>;
  deviceDistribution: Array<{ device: string; count: number; percentage: number }>;
  hourlyActivity: Array<{ hour: number; count: number }>;
  userActivityMap: Array<{ userId: string; userName: string; activityCount: number }>;
}

export function UserActivity() {
  const [activities, setActivities] = useState<UserActivityItem[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<UserActivityItem | null>(null);
  const [activeTab, setActiveTab] = useState('activities');

  useEffect(() => {
    fetchActivities();
    fetchStats();
  }, [selectedTimeRange]);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/user-activities?timeRange=${selectedTimeRange}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Failed to fetch user activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/admin/user-activities/stats?timeRange=${selectedTimeRange}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch activity stats:', error);
    }
  };

  const getActionIcon = (actionType: string) => {
    const icons: Record<string, React.ReactNode> = {
      login: <LogIn className="w-4 h-4 text-green-500" />,
      logout: <LogOut className="w-4 h-4 text-red-500" />,
      view: <Eye className="w-4 h-4 text-blue-500" />,
      click: <MousePointer className="w-4 h-4 text-purple-500" />,
      download: <Download className="w-4 h-4 text-orange-500" />,
      upload: <Upload className="w-4 h-4 text-cyan-500" />,
      edit: <Edit className="w-4 h-4 text-yellow-500" />,
      delete: <Trash2 className="w-4 h-4 text-red-500" />,
      share: <Share2 className="w-4 h-4 text-indigo-500" />,
      like: <Heart className="w-4 h-4 text-pink-500" />,
      comment: <MessageSquare className="w-4 h-4 text-teal-500" />
    };
    return icons[actionType] || <Activity className="w-4 h-4 text-gray-500" />;
  };

  const getDeviceIcon = (device: string) => {
    const icons: Record<string, React.ReactNode> = {
      desktop: <Monitor className="w-4 h-4" />,
      mobile: <Smartphone className="w-4 h-4" />,
      tablet: <Tablet className="w-4 h-4" />
    };
    return icons[device] || <Monitor className="w-4 h-4" />;
  };

  const getActionBadge = (actionType: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; text: string }> = {
      login: { variant: "default", text: "دخول" },
      logout: { variant: "secondary", text: "خروج" },
      view: { variant: "outline", text: "معاينة" },
      click: { variant: "outline", text: "نقر" },
      download: { variant: "secondary", text: "تحميل" },
      upload: { variant: "secondary", text: "رفع" },
      edit: { variant: "outline", text: "تعديل" },
      delete: { variant: "destructive", text: "حذف" },
      share: { variant: "outline", text: "مشاركة" },
      like: { variant: "outline", text: "إعجاب" },
      comment: { variant: "outline", text: "تعليق" }
    };
    const config = variants[actionType] || variants.view;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = selectedAction === 'all' || activity.actionType === selectedAction;
    const matchesDevice = selectedDevice === 'all' || activity.device === selectedDevice;
    return matchesSearch && matchesAction && matchesDevice;
  });

  const openDetailDialog = (activity: UserActivityItem) => {
    setSelectedActivity(activity);
    setIsDetailDialogOpen(true);
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds} ثانية`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} دقيقة`;
    return `${Math.floor(seconds / 3600)} ساعة`;
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">نشاط المستخدمين</h3>
          <p className="text-sm text-muted-foreground">مراقبة وتحليل نشاط المستخدمين</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => {
            fetchActivities();
            fetchStats();
          }}>
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي النشاط</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalActivities.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> من الفترة السابقة
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> من الفترة السابقة
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">متوسط الجلسة</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(stats.averageSessionDuration)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-orange-600">-2%</span> من الفترة السابقة
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">أكثر الصفحات</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.topPages[0]?.page || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">
                {stats.topPages[0]?.views || 0} معاينة
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activities">النشاط</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          <TabsTrigger value="users">المستخدمون</TabsTrigger>
        </TabsList>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="بحث عن نشاط..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="الفترة الزمنية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">آخر ساعة</SelectItem>
                <SelectItem value="24h">آخر 24 ساعة</SelectItem>
                <SelectItem value="7d">آخر 7 أيام</SelectItem>
                <SelectItem value="30d">آخر 30 يوم</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="نوع النشاط" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنشطة</SelectItem>
                <SelectItem value="login">دخول</SelectItem>
                <SelectItem value="logout">خروج</SelectItem>
                <SelectItem value="view">معاينة</SelectItem>
                <SelectItem value="click">نقر</SelectItem>
                <SelectItem value="download">تحميل</SelectItem>
                <SelectItem value="upload">رفع</SelectItem>
                <SelectItem value="edit">تعديل</SelectItem>
                <SelectItem value="delete">حذف</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDevice} onValueChange={setSelectedDevice}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="الجهاز" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأجهزة</SelectItem>
                <SelectItem value="desktop">كمبيوتر</SelectItem>
                <SelectItem value="mobile">موبايل</SelectItem>
                <SelectItem value="tablet">تابلت</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Activities Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المستخدم</TableHead>
                    <TableHead>النشاط</TableHead>
                    <TableHead>المورد</TableHead>
                    <TableHead>الجهاز</TableHead>
                    <TableHead>الموقع</TableHead>
                    <TableHead>الوقت</TableHead>
                    <TableHead>المدة</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="font-medium">{activity.userName}</div>
                            <div className="text-sm text-muted-foreground">{activity.userEmail}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(activity.actionType)}
                          <div>
                            <div className="font-medium">{activity.action}</div>
                            {getActionBadge(activity.actionType)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{activity.resource}</div>
                          <Badge variant="outline" className="text-xs">
                            {activity.resourceType}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(activity.device)}
                          <div>
                            <div className="text-sm">{activity.device}</div>
                            <div className="text-xs text-muted-foreground">{activity.browser}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <div>
                            <div className="text-sm">{activity.location.city}</div>
                            <div className="text-xs text-muted-foreground">{activity.location.country}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <div>
                            <div className="text-sm">
                              {new Date(activity.timestamp).toLocaleDateString('ar-SA')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleTimeString('ar-SA')}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {activity.duration ? (
                          <div className="text-sm">{formatDuration(activity.duration)}</div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => openDetailDialog(activity)}>
                              <Eye className="w-4 h-4 ml-2" />
                              التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <User className="w-4 h-4 ml-2" />
                              ملف المستخدم
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                        توزيع الأجهزة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {stats.deviceDistribution.map((device) => (
                          <div key={device.device} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getDeviceIcon(device.device)}
                              <span className="font-medium">{device.device}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-24">
                                <Progress value={device.percentage} className="h-2" />
                              </div>
                              <span className="text-sm text-muted-foreground w-12">
                                {device.percentage}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        أكثر الأنشطة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {stats.topActions.map((action, index) => (
                          <div key={action.action} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-muted-foreground w-6">
                                #{index + 1}
                              </span>
                              <div className="flex items-center gap-2">
                                {getActionIcon(action.action)}
                                <span>{action.action}</span>
                              </div>
                            </div>
                            <Badge variant="outline">{action.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Pages */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        أكثر الصفحات زيارة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {stats.topPages.map((page, index) => (
                          <div key={page.page} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-muted-foreground w-6">
                                #{index + 1}
                              </span>
                              <span>{page.page}</span>
                            </div>
                            <Badge variant="outline">{page.views}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Hourly Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LineChart className="w-5 h-5" />
                        النشاط بالساعة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {stats.hourlyActivity.map((hour) => (
                          <div key={hour.hour} className="flex items-center justify-between">
                            <span className="text-sm">{hour.hour}:00</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24">
                                <Progress 
                                  value={(hour.count / Math.max(...stats.hourlyActivity.map(h => h.count))) * 100} 
                                  className="h-2" 
                                />
                              </div>
                              <span className="text-sm text-muted-foreground w-8">
                                {hour.count}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              {stats && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      نشاط المستخدمين
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.userActivityMap.map((user, index) => (
                        <div key={user.userId} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-muted-foreground w-6">
                              #{index + 1}
                            </span>
                            <div>
                              <div className="font-medium">{user.userName}</div>
                              <div className="text-sm text-muted-foreground">
                                {user.activityCount} نشاط
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-32">
                              <Progress 
                                value={(user.activityCount / Math.max(...stats.userActivityMap.map(u => u.activityCount))) * 100} 
                                className="h-2" 
                              />
                            </div>
                            <Badge variant="outline">{user.activityCount}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Activity Detail Dialog */}
          <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>تفاصيل النشاط</DialogTitle>
              </DialogHeader>
              {selectedActivity && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>المستخدم</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{selectedActivity.userName}</div>
                          <div className="text-sm text-muted-foreground">{selectedActivity.userEmail}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>النشاط</Label>
                      <div className="flex items-center gap-2 mt-1">
                        {getActionIcon(selectedActivity.actionType)}
                        <div>
                          <div className="font-medium">{selectedActivity.action}</div>
                          {getActionBadge(selectedActivity.actionType)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>المورد</Label>
                      <div className="mt-1">
                        <div className="font-medium">{selectedActivity.resource}</div>
                        <Badge variant="outline" className="text-xs">
                          {selectedActivity.resourceType}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label>الجهاز</Label>
                      <div className="flex items-center gap-2 mt-1">
                        {getDeviceIcon(selectedActivity.device)}
                        <div>
                          <div className="font-medium">{selectedActivity.device}</div>
                          <div className="text-sm text-muted-foreground">
                            {selectedActivity.browser} - {selectedActivity.os}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>الموقع</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{selectedActivity.location.city}</div>
                          <div className="text-sm text-muted-foreground">
                            {selectedActivity.location.country}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>الوقت</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4" />
                        <div>
                          <div className="font-medium">
                            {new Date(selectedActivity.timestamp).toLocaleDateString('ar-SA')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(selectedActivity.timestamp).toLocaleTimeString('ar-SA')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>عنوان IP</Label>
                    <div className="mt-1 font-mono text-sm">{selectedActivity.ipAddress}</div>
                  </div>

                  {selectedActivity.duration && (
                    <div>
                      <Label>المدة</Label>
                      <div className="mt-1 font-medium">{formatDuration(selectedActivity.duration)}</div>
                    </div>
                  )}

                  <div>
                    <Label>معلومات إضافية</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                        {JSON.stringify(selectedActivity.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      );
    }