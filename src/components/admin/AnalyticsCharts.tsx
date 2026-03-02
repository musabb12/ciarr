'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Eye, Download, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
  }[];
}

interface AnalyticsChartsProps {
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
}

export function AnalyticsCharts({ timeRange = 'month' }: AnalyticsChartsProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState({
    users: { labels: [], data: [] },
    revenue: { labels: [], data: [] },
    templates: { labels: [], data: [] },
    traffic: { labels: [], data: [] }
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedTimeRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Mock data - in real app, this would come from API
      const mockData = generateMockData(selectedTimeRange);
      setChartData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockData = (range: string) => {
    const periods = {
      week: 7,
      month: 30,
      quarter: 90,
      year: 365
    };

    const days = periods[range as keyof typeof periods] || 30;
    const labels = Array.from({ length: Math.min(days, 12) }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i * Math.floor(days / 12)));
      return date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
    });

    return {
      users: {
        labels,
        data: labels.map(() => Math.floor(Math.random() * 100) + 50)
      },
      revenue: {
        labels,
        data: labels.map(() => Math.floor(Math.random() * 5000) + 1000)
      },
      templates: {
        labels,
        data: labels.map(() => Math.floor(Math.random() * 20) + 5)
      },
      traffic: {
        labels,
        data: labels.map(() => Math.floor(Math.random() * 1000) + 200)
      }
    };
  };

  const renderBarChart = (data: { labels: string[]; data: number[] }, title: string, color: string) => {
    const maxValue = Math.max(...data.data);
    
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge variant="outline">{selectedTimeRange}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>الإجمالي</span>
              <span className="font-semibold">
                {data.data.reduce((sum, val) => sum + val, 0).toLocaleString('ar-SA')}
              </span>
            </div>
            <div className="space-y-2">
              {data.labels.map((label, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-16 text-xs text-gray-600 text-right">{label}</div>
                  <div className="flex-1 relative">
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div
                        className={`h-6 rounded-full transition-all duration-500 ${color}`}
                        style={{ width: `${(data.data[index] / maxValue) * 100}%` }}
                      />
                    </div>
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs font-medium">
                      {data.data[index]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderLineChart = (data: { labels: string[]; data: number[] }, title: string, color: string) => {
    const maxValue = Math.max(...data.data);
    const points = data.data.map((value, index) => {
      const x = (index / (data.data.length - 1)) * 100;
      const y = 100 - (value / maxValue) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge variant="outline">{selectedTimeRange}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>المتوسط</span>
              <span className="font-semibold">
                {Math.round(data.data.reduce((sum, val) => sum + val, 0) / data.data.length).toLocaleString('ar-SA')}
              </span>
            </div>
            <div className="relative h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="100"
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="0.5"
                  />
                ))}
                {/* Data line */}
                <polyline
                  points={points}
                  fill="none"
                  stroke={color.replace('bg-', '#').replace('500', '600')}
                  strokeWidth="2"
                />
                {/* Data points */}
                {data.data.map((_, index) => {
                  const x = (index / (data.data.length - 1)) * 100;
                  const y = 100 - (data.data[index] / maxValue) * 100;
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="2"
                      fill={color.replace('bg-', '#').replace('500', '600')}
                    />
                  );
                })}
              </svg>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              {data.labels.map((label, index) => (
                <span key={index} className="text-right">{label}</span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPieChart = (data: { label: string; value: number; color: string }[], title: string) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative h-48">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {data.map((item, index) => {
                  const percentage = (item.value / total) * 100;
                  const angle = (percentage / 100) * 360;
                  const startAngle = data.slice(0, index).reduce((sum, prev) => {
                    return sum + (prev.value / total) * 360;
                  }, 0);
                  
                  const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                  const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
                  const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);
                  
                  const largeArcFlag = angle > 180 ? 1 : 0;
                  
                  return (
                    <path
                      key={index}
                      d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={item.color.replace('bg-', '#').replace('500', '600')}
                      stroke="white"
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>
            </div>
            <div className="space-y-2">
              {data.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.value}</span>
                    <span className="text-xs text-gray-500">
                      ({Math.round((item.value / total) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const categoryData = [
    { label: 'التجارة الإلكترونية', value: 45, color: 'bg-blue-500' },
    { label: 'المطاعم', value: 30, color: 'bg-green-500' },
    { label: 'المعارض', value: 20, color: 'bg-purple-500' },
    { label: 'المدونات', value: 15, color: 'bg-orange-500' },
    { label: 'البرمجيات', value: 25, color: 'bg-red-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">التحليلات والإحصائيات</h2>
        <div className="flex items-center gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">أسبوع</SelectItem>
              <SelectItem value="month">شهر</SelectItem>
              <SelectItem value="quarter">ربع سنة</SelectItem>
              <SelectItem value="year">سنة</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchAnalyticsData} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderBarChart(chartData.users, 'نمو المستخدمين', 'bg-blue-500')}
        {renderLineChart(chartData.revenue, 'الإيرادات', 'bg-green-500')}
        {renderBarChart(chartData.templates, 'القوالب المباعة', 'bg-purple-500')}
        {renderLineChart(chartData.traffic, 'حركة المرور', 'bg-orange-500')}
      </div>

      {/* Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderPieChart(categoryData, 'توزيع الفئات')}
        
        {/* Top Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">أهم مؤشرات الأداء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">معدل التحويل</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">3.2%</span>
                  <Badge variant="default" className="text-xs">+0.5%</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-sm">متوسط قيمة الطلب</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">$125</span>
                  <Badge variant="default" className="text-xs">+$15</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">معدل النقر إلى الظهور</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">2.8%</span>
                  <Badge variant="destructive" className="text-xs">-0.2%</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">معدل الاحتفاظ بالعملاء</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">78%</span>
                  <Badge variant="default" className="text-xs">+5%</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}