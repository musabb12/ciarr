'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Star, 
  Download,
  BarChart3,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export function DashboardOverview() {
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: 'إجمالي المستخدمين',
      value: '1,234',
      change: 12.5,
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'المواقع المباعة',
      value: '456',
      change: 8.2,
      icon: <ShoppingBag className="w-6 h-6" />,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'الإيرادات',
      value: '45,678 ريال',
      change: 23.1,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      title: 'الرسائل الجديدة',
      value: '23',
      change: -5.4,
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'text-purple-600 bg-purple-100'
    }
  ]);

  const [recentActivity] = useState([
    { id: 1, type: 'order', message: 'طلب جديد #1234', time: 'منذ 5 دقائق' },
    { id: 2, type: 'user', message: 'مستخدم جديد: أحمد محمد', time: 'منذ 15 دقيقة' },
    { id: 3, type: 'review', message: 'تقييم جديد: 5 نجوم', time: 'منذ 30 دقيقة' },
    { id: 4, type: 'contact', message: 'رسالة جديدة من العميل', time: 'منذ ساعة' }
  ]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                {stat.change > 0 ? (
                  <ArrowUp className="w-3 h-3 text-green-500 ml-1" />
                ) : (
                  <ArrowDown className="w-3 h-3 text-red-500 ml-1" />
                )}
                <span className={stat.change > 0 ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(stat.change)}%
                </span>
                <span className="mr-1">من الشهر الماضي</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 ml-2" />
              إحصائيات المبيعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>مخطط المبيعات</p>
                <p className="text-sm">سيتم عرض المخطط هنا</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 ml-2" />
              النشاط الأخير
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm">إضافة مستخدم</span>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <ShoppingBag className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm">إضافة موقع</span>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <MessageSquare className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm">الرسائل</span>
            </button>
            <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
              <BarChart3 className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <span className="text-sm">التقارير</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}