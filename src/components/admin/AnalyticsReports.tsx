'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Download,
  Calendar,
  Users,
  DollarSign,
  Eye,
  ShoppingCart,
  FileText,
  Star,
  ArrowUp,
  ArrowDown,
  Filter
} from 'lucide-react';

interface AnalyticsData {
  period: string;
  users: number;
  revenue: number;
  orders: number;
  views: number;
  conversionRate: number;
}

export function AnalyticsReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [analyticsData] = useState<AnalyticsData[]>([
    { period: 'اليوم', users: 234, revenue: 4567, orders: 12, views: 1234, conversionRate: 3.2 },
    { period: 'أمس', users: 189, revenue: 3234, orders: 8, views: 987, conversionRate: 2.8 },
    { period: 'قبل 3 أيام', users: 267, revenue: 5432, orders: 15, views: 1567, conversionRate: 3.8 },
    { period: 'قبل 4 أيام', users: 145, revenue: 2345, orders: 6, views: 765, conversionRate: 2.1 },
    { period: 'قبل 5 أيام', users: 298, revenue: 6789, orders: 18, views: 1876, conversionRate: 4.2 },
    { period: 'قبل 6 أيام', users: 312, revenue: 7234, orders: 21, views: 2098, conversionRate: 4.5 },
    { period: 'قبل أسبوع', users: 276, revenue: 5678, orders: 14, views: 1654, conversionRate: 3.6 }
  ]);

  const [topPages] = useState([
    { page: '/websites', views: 5432, percentage: 35.2 },
    { page: '/services', views: 3210, percentage: 20.8 },
    { page: '/about', views: 2345, percentage: 15.2 },
    { page: '/contact', views: 1876, percentage: 12.2 },
    { page: '/blog', views: 1543, percentage: 10.0 }
  ]);

  const [revenueByCategory] = useState([
    { category: 'مواقع', revenue: 45678, percentage: 65.3 },
    { category: 'خدمات', revenue: 23456, percentage: 33.5 },
    { category: 'استشارات', revenue: 567, percentage: 0.8 },
    { category: 'أخرى', revenue: 234, percentage: 0.4 }
  ]);

  const totalRevenue = analyticsData.reduce((sum, data) => sum + data.revenue, 0);
  const totalUsers = analyticsData.reduce((sum, data) => sum + data.users, 0);
  const totalOrders = analyticsData.reduce((sum, data) => sum + data.orders, 0);
  const totalViews = analyticsData.reduce((sum, data) => sum + data.views, 0);
  const avgConversionRate = analyticsData.reduce((sum, data) => sum + data.conversionRate, 0) / analyticsData.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">التحليلات والتقارير</h2>
          <p className="text-gray-600">عرض إحصائيات مفصلة عن أداء الموقع</p>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="7d">آخر 7 أيام</option>
            <option value="30d">آخر 30 يوم</option>
            <option value="90d">آخر 90 يوم</option>
            <option value="1y">آخر سنة</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 ml-2" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} ريال</p>
                <div className="flex items-center text-xs text-green-500 mt-1">
                  <ArrowUp className="w-3 h-3 ml-1" />
                  12.5% من الشهر الماضي
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المستخدمون</p>
                <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
                <div className="flex items-center text-xs text-green-500 mt-1">
                  <ArrowUp className="w-3 h-3 ml-1" />
                  8.2% من الشهر الماضي
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الطلبات</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
                <div className="flex items-center text-xs text-red-500 mt-1">
                  <ArrowDown className="w-3 h-3 ml-1" />
                  3.1% من الشهر الماضي
                </div>
              </div>
              <ShoppingCart className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المشاهدات</p>
                <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
                <div className="flex items-center text-xs text-green-500 mt-1">
                  <ArrowUp className="w-3 h-3 ml-1" />
                  15.7% من الشهر الماضي
                </div>
              </div>
              <Eye className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">معدل التحويل</p>
                <p className="text-2xl font-bold">{avgConversionRate.toFixed(1)}%</p>
                <div className="flex items-center text-xs text-green-500 mt-1">
                  <ArrowUp className="w-3 h-3 ml-1" />
                  2.3% من الشهر الماضي
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 ml-2" />
              إحصائيات الإيرادات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>مخطط الإيرادات اليومية</p>
                <p className="text-sm">سيتم عرض المخطط هنا</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 ml-2" />
              مصادر الزيارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>مخطط مصادر الزيارات</p>
                <p className="text-sm">سيتم عرض المخطط هنا</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 ml-2" />
              أكثر الصفحات زيارة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{page.page}</div>
                      <div className="text-sm text-gray-500">{page.views.toLocaleString()} زيارة</div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{page.percentage}%</div>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${page.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 ml-2" />
              الإيرادات حسب الفئة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenueByCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-600">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{category.category}</div>
                      <div className="text-sm text-gray-500">{category.revenue.toLocaleString()} ريال</div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{category.percentage}%</div>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 ml-2" />
            مؤشرات الأداء الرئيسية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2.3 ثانية</div>
              <div className="text-sm text-gray-600">متوسط وقت تحميل الصفحة</div>
              <Badge className="bg-green-100 text-green-800 mt-2">ممتاز</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">94.5%</div>
              <div className="text-sm text-gray-600">معدل التوافر</div>
              <Badge className="bg-green-100 text-green-800 mt-2">ممتاز</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">87%</div>
              <div className="text-sm text-gray-600">معدل رضا العملاء</div>
              <Badge className="bg-yellow-100 text-yellow-800 mt-2">جيد جداً</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}