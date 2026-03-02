'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Eye,
  MousePointer,
  Clock,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Target,
  Zap,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUp,
  ArrowDown,
  Minus,
  PieChart,
  LineChart,
  AreaChart,
  ScatterChart,
  RadarChart,
  BarChart,
  Timer,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  Award,
  Trophy,
  Medal,
  Flag,
  MapPin,
  Settings,
  Layers,
  Grid3X3,
  List
} from 'lucide-react';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate: number;
  revenue: number;
  orders: number;
  cartAbandonmentRate: number;
  topPages: Array<{
    page: string;
    views: number;
    uniqueVisitors: number;
    avgTime: number;
    bounceRate: number;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
    conversionRate: number;
    revenue: number;
  }>;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  geographicData: Array<{
    country: string;
    visitors: number;
    percentage: number;
    revenue: number;
  }>;
  conversionFunnel: Array<{
    stage: string;
    users: number;
    conversionRate: number;
    dropOffRate: number;
  }>;
  realTimeData: {
    activeUsers: number;
    currentPageViews: number;
    topPages: Array<{
      page: string;
      users: number;
    }>;
  };
}

export function AdvancedAnalytics() {
  const [data, setData] = useState<AnalyticsData>({
    pageViews: 45678,
    uniqueVisitors: 12456,
    bounceRate: 42.3,
    avgSessionDuration: 245,
    conversionRate: 3.8,
    revenue: 89456,
    orders: 342,
    cartAbandonmentRate: 68.7,
    topPages: [
      { page: '/home', views: 12456, uniqueVisitors: 8934, avgTime: 180, bounceRate: 35.2 },
      { page: '/products', views: 9876, uniqueVisitors: 6789, avgTime: 245, bounceRate: 28.7 },
      { page: '/about', views: 5432, uniqueVisitors: 4321, avgTime: 120, bounceRate: 45.6 },
      { page: '/contact', views: 3210, uniqueVisitors: 2876, avgTime: 95, bounceRate: 52.3 },
      { page: '/blog', views: 2876, uniqueVisitors: 2345, avgTime: 320, bounceRate: 22.1 }
    ],
    trafficSources: [
      { source: 'محركات البحث', visitors: 5234, percentage: 42.1, conversionRate: 4.2, revenue: 34567 },
      { source: 'وسائل التواصل', visitors: 3456, percentage: 27.8, conversionRate: 3.1, revenue: 23456 },
      { source: 'زيارات مباشرة', visitors: 2345, percentage: 18.9, conversionRate: 5.1, revenue: 19876 },
      { source: 'البريد الإلكتروني', visitors: 1098, percentage: 8.8, conversionRate: 6.2, revenue: 9876 },
      { source: 'مواقع إحالة', visitors: 323, percentage: 2.6, conversionRate: 2.8, revenue: 2681 }
    ],
    deviceBreakdown: {
      desktop: 58.7,
      mobile: 35.2,
      tablet: 6.1
    },
    geographicData: [
      { country: 'السعودية', visitors: 4567, percentage: 36.7, revenue: 34567 },
      { country: 'الإمارات', visitors: 2345, percentage: 18.8, revenue: 19876 },
      { country: 'مصر', visitors: 1876, percentage: 15.1, revenue: 12345 },
      { country: 'الكويت', visitors: 1234, percentage: 9.9, revenue: 9876 },
      { country: 'قطر', visitors: 987, percentage: 7.9, revenue: 7654 }
    ],
    conversionFunnel: [
      { stage: 'زيارة الموقع', users: 12456, conversionRate: 100, dropOffRate: 0 },
      { stage: 'تصفح المنتجات', users: 6789, conversionRate: 54.5, dropOffRate: 45.5 },
      { stage: 'إضافة للسلة', users: 2345, conversionRate: 18.8, dropOffRate: 65.5 },
      { stage: 'إتمام الشراء', users: 456, conversionRate: 3.7, dropOffRate: 80.5 }
    ],
    realTimeData: {
      activeUsers: 234,
      currentPageViews: 89,
      topPages: [
        { page: '/home', users: 67 },
        { page: '/products', users: 45 },
        { page: '/special-offer', users: 34 }
      ]
    }
  });

  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        realTimeData: {
          ...prev.realTimeData,
          activeUsers: Math.max(0, prev.realTimeData.activeUsers + Math.floor((Math.random() - 0.5) * 20)),
          currentPageViews: Math.max(0, prev.realTimeData.currentPageViews + Math.floor((Math.random() - 0.5) * 10))
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Simulate data refresh
      setData(prev => ({
        ...prev,
        pageViews: prev.pageViews + Math.floor(Math.random() * 1000),
        uniqueVisitors: prev.uniqueVisitors + Math.floor(Math.random() * 100),
        revenue: prev.revenue + Math.floor(Math.random() * 10000)
      }));
    }, 2000);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <ArrowUp className="w-4 h-4 text-green-600" />;
    } else if (current < previous) {
      return <ArrowDown className="w-4 h-4 text-red-600" />;
    } else {
      return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop':
        return <Monitor className="w-4 h-4" />;
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getPerformanceColor = (value: number, type: 'bounce' | 'conversion' | 'duration') => {
    if (type === 'bounce') {
      return value > 60 ? 'text-red-600' : value > 40 ? 'text-yellow-600' : 'text-green-600';
    } else if (type === 'conversion') {
      return value > 5 ? 'text-green-600' : value > 2 ? 'text-yellow-600' : 'text-red-600';
    } else {
      return value > 300 ? 'text-green-600' : value > 180 ? 'text-yellow-600' : 'text-red-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">التحليلات المتقدمة</h2>
            <p className="text-sm text-gray-600">رؤى عميقة حول أداء الموقع</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">آخر 7 أيام</SelectItem>
              <SelectItem value="30d">آخر 30 يوم</SelectItem>
              <SelectItem value="90d">آخر 90 يوم</SelectItem>
              <SelectItem value="1y">سنة</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.realTimeData.activeUsers}</div>
            <p className="text-xs text-blue-600">حالياً على الموقع</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مشاهدات الصفحة</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.realTimeData.currentPageViews}</div>
            <p className="text-xs text-green-600">الصفحات الحالية</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل التحويل</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{data.conversionRate}%</div>
            <p className="text-xs text-purple-600">متوسط التحويل</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(data.revenue)}</div>
            <p className="text-xs text-orange-600">إجمالي الإيرادات</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="traffic">الزيارات</TabsTrigger>
          <TabsTrigger value="behavior">السلوك</TabsTrigger>
          <TabsTrigger value="conversion">التحويل</TabsTrigger>
          <TabsTrigger value="realtime">الوقت الفعلي</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">مشاهدات الصفحة</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.pageViews)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12.5%</span> من الشهر الماضي
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الزوار الفريدون</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.uniqueVisitors)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8.3%</span> من الشهر الماضي
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">معدل الارتداد</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getPerformanceColor(data.bounceRate, 'bounce')}`}>
                  {data.bounceRate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600">+2.1%</span> من الشهر الماضي
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">متوسط الجلسة</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getPerformanceColor(data.avgSessionDuration, 'duration')}`}>
                  {formatDuration(data.avgSessionDuration)}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+15.2%</span> من الشهر الماضي
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Device Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>توزيع الأجهزة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(data.deviceBreakdown).map(([device, percentage]) => (
                  <div key={device} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      {getDeviceIcon(device)}
                      <span className="font-medium">
                        {device === 'desktop' ? 'سطح المكتب' : 
                         device === 'mobile' ? 'الهاتف المحمول' : 'الجهاز اللوحي'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-32">
                        <Progress value={percentage} className="h-2" />
                      </div>
                      <span className="text-sm font-medium w-12">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Traffic Tab */}
        <TabsContent value="traffic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>مصادر الزيارات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Globe className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{source.source}</p>
                        <p className="text-sm text-gray-500">
                          {formatNumber(source.visitors)} زائر • {source.percentage}% من الزيارات
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{source.conversionRate}%</p>
                      <p className="text-sm text-gray-500">معدل التحويل</p>
                      <p className="text-sm font-medium">{formatCurrency(source.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Geographic Data */}
          <Card>
            <CardHeader>
              <CardTitle>البيانات الجغرافية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.geographicData.map((country, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{country.country}</p>
                        <p className="text-sm text-gray-500">
                          {formatNumber(country.visitors)} زائر • {country.percentage}% من الزيارات
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{formatCurrency(country.revenue)}</p>
                      <p className="text-sm text-gray-500">الإيرادات</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavior Tab */}
        <TabsContent value="behavior" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>أهم الصفحات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{page.page}</p>
                        <p className="text-sm text-gray-500">
                          {formatNumber(page.views)} مشاهدة • {formatNumber(page.uniqueVisitors)} زائر فريد
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{formatDuration(page.avgTime)}</p>
                      <p className="text-sm text-gray-500">متوسط الوقت</p>
                      <p className={`text-sm font-medium ${getPerformanceColor(page.bounceRate, 'bounce')}`}>
                        {page.bounceRate}% ارتداد
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversion Tab */}
        <TabsContent value="conversion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>مسار التحويل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.conversionFunnel.map((stage, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{stage.stage}</span>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="text-sm">{formatNumber(stage.users)} مستخدم</span>
                        <Badge variant={stage.conversionRate > 50 ? 'default' : 'secondary'}>
                          {stage.conversionRate.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress value={stage.conversionRate} className="h-3" />
                      {stage.dropOffRate > 0 && (
                        <div className="absolute -bottom-4 left-0 text-xs text-red-600">
                          انخفاض: {stage.dropOffRate.toFixed(1)}%
                        </div>
                      )}
                    </div>
                    {index < data.conversionFunnel.length - 1 && <div className="h-6" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات التحويل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>معدل التحويل العام</span>
                  <span className={`font-bold ${getPerformanceColor(data.conversionRate, 'conversion')}`}>
                    {data.conversionRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>إجمالي الطلبات</span>
                  <span className="font-bold">{formatNumber(data.orders)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>متوسط قيمة الطلب</span>
                  <span className="font-bold">{formatCurrency(data.revenue / data.orders)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>معدل هجر السلة</span>
                  <span className="font-bold text-red-600">{data.cartAbandonmentRate}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الأداء المالي</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>إجمالي الإيرادات</span>
                  <span className="font-bold">{formatCurrency(data.revenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>الإيرادات لكل زائر</span>
                  <span className="font-bold">{formatCurrency(data.revenue / data.uniqueVisitors)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>معدل التحويل المالي</span>
                  <span className="font-bold">{((data.orders / data.uniqueVisitors) * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>قيمة العميل المتوقعة</span>
                  <span className="font-bold">{formatCurrency(data.revenue / data.orders * 3)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Real-time Tab */}
        <TabsContent value="realtime" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>البيانات المباشرة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">النشاط الحالي</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>المستخدمون النشطون</span>
                      <span className="font-bold text-blue-600">{data.realTimeData.activeUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>مشاهدات الصفحة الحالية</span>
                      <span className="font-bold text-green-600">{data.realTimeData.currentPageViews}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>الصفحات الأكثر زيارة</span>
                      <div className="text-left">
                        {data.realTimeData.topPages.map((page, index) => (
                          <div key={index} className="text-sm">
                            {page.page}: {page.users} مستخدم
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">النشاط الأخير</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 space-x-reverse text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>مستخدم جديد دخل للصفحة الرئيسية</span>
                      <span className="text-gray-500">الآن</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>تمت مشاهدة صفحة المنتجات</span>
                      <span className="text-gray-500">قبل دقيقة</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>إضافة منتج للسلة</span>
                      <span className="text-gray-500">قبل دقيقتين</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>تم إتمام عملية شراء</span>
                      <span className="text-gray-500">قبل 3 دقائق</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}