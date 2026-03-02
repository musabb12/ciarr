'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Package,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Zap,
  Award,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  conversionRate: number;
  averageOrderValue: number;
  cartAbandonmentRate: number;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
    growth: number;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
    conversionRate: number;
  }>;
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  salesByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
    customers: number;
  }>;
}

export function AdvancedDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    cartAbandonmentRate: 0,
    topProducts: [],
    trafficSources: [],
    deviceStats: {
      desktop: 0,
      mobile: 0,
      tablet: 0
    },
    salesByMonth: []
  });

  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, [selectedPeriod]);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMetrics({
        totalRevenue: 458290,
        totalOrders: 1847,
        totalCustomers: 892,
        conversionRate: 3.2,
        averageOrderValue: 248.15,
        cartAbandonmentRate: 68.4,
        topProducts: [
          { name: 'قالب متجر إلكتروني احترافي', sales: 342, revenue: 68400, growth: 12.5 },
          { name: 'حزمة التصميم المتقدم', sales: 287, revenue: 43050, growth: 8.3 },
          { name: 'نظام إدارة المحتوى', sales: 234, revenue: 58500, growth: -2.1 },
          { name: 'قالب الشركة المتطور', sales: 198, revenue: 35640, growth: 15.7 },
          { name: 'الباقة الشاملة للمطورين', sales: 156, revenue: 46800, growth: 6.9 }
        ],
        trafficSources: [
          { source: 'محركات البحث', visitors: 45234, percentage: 42.3, conversionRate: 3.8 },
          { source: 'وسائل التواصل الاجتماعي', visitors: 28901, percentage: 27.1, conversionRate: 2.9 },
          { source: 'زيارات مباشرة', visitors: 18765, percentage: 17.5, conversionRate: 4.2 },
          { source: 'البريد الإلكتروني', visitors: 8923, percentage: 8.3, conversionRate: 5.1 },
          { source: 'مواقع إحالة', visitors: 5432, percentage: 5.1, conversionRate: 3.4 }
        ],
        deviceStats: {
          desktop: 58.7,
          mobile: 35.2,
          tablet: 6.1
        },
        salesByMonth: [
          { month: 'يناير', revenue: 32450, orders: 142, customers: 89 },
          { month: 'فبراير', revenue: 38920, orders: 167, customers: 102 },
          { month: 'مارس', revenue: 45670, orders: 198, customers: 121 },
          { month: 'أبريل', revenue: 42340, orders: 187, customers: 115 },
          { month: 'مايو', revenue: 52190, orders: 223, customers: 138 },
          { month: 'يونيو', revenue: 48920, orders: 209, customers: 127 }
        ]
      });
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };

  const getGrowthIndicator = (growth: number) => {
    if (growth > 0) {
      return (
        <div className="flex items-center text-green-600">
          <TrendingUp className="w-4 h-4 ml-1" />
          <span className="text-sm">+{growth.toFixed(1)}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-red-600">
          <TrendingDown className="w-4 h-4 ml-1" />
          <span className="text-sm">{growth.toFixed(1)}%</span>
        </div>
      );
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

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 space-x-reverse">
          <h2 className="text-2xl font-bold">لوحة التحكم المتقدمة</h2>
          <Badge variant="outline">المبيعات</Badge>
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
          <Button variant="outline" size="sm" onClick={fetchMetrics} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18.2%</span> من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.totalOrders)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العملاء</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.totalCustomers)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.7%</span> من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل التحويل</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">-0.3%</span> من الشهر الماضي
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط قيمة الطلب</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5.2%</span> من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل هجر السلة</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cartAbandonmentRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-2.1%</span> من الشهر الماضي
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">المنتجات الأكثر مبيعاً</TabsTrigger>
          <TabsTrigger value="traffic">مصادر الزيارات</TabsTrigger>
          <TabsTrigger value="devices">الأجهزة</TabsTrigger>
          <TabsTrigger value="sales">المبيعات الشهرية</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>المنتجات الأكثر مبيعاً</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatNumber(product.sales)} مبيعات • {formatCurrency(product.revenue)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      {getGrowthIndicator(product.growth)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic">
          <Card>
            <CardHeader>
              <CardTitle>مصادر الزيارات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.trafficSources.map((source, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{source.source}</span>
                      </div>
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <span className="text-sm text-gray-500">
                          {formatNumber(source.visitors)} زائر
                        </span>
                        <Badge variant="outline">{source.percentage}%</Badge>
                        <Badge variant="secondary">{source.conversionRate}% تحويل</Badge>
                      </div>
                    </div>
                    <Progress value={source.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>إحصائيات الأجهزة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(metrics.deviceStats).map(([device, percentage]) => (
                  <div key={device} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {getDeviceIcon(device)}
                        <span className="font-medium">
                          {device === 'desktop' ? 'سطح المكتب' : 
                           device === 'mobile' ? 'الهاتف المحمول' : 'الجهاز اللوحي'}
                        </span>
                      </div>
                      <Badge variant="outline">{percentage}%</Badge>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>المبيعات الشهرية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.salesByMonth.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium">{month.month}</p>
                        <p className="text-sm text-gray-500">
                          {formatNumber(month.orders)} طلب • {formatNumber(month.customers)} عميل
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-bold">{formatCurrency(month.revenue)}</p>
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