'use client';

import { useState, useEffect } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Wifi, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Server,
  Zap,
  Clock,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    temperature: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    upload: number;
    download: number;
    latency: number;
  };
  uptime: string;
  processes: number;
}

interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: { usage: 45, cores: 8, temperature: 65 },
    memory: { used: 8.2, total: 16, percentage: 51 },
    disk: { used: 250, total: 500, percentage: 50 },
    network: { upload: 12.5, download: 45.8, latency: 25 },
    uptime: '15 days, 8 hours',
    processes: 127
  });

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      message: 'استخدام المعالج مرتفع بشكل غير عادي',
      timestamp: '2024-01-15 14:30:00',
      resolved: false
    },
    {
      id: '2',
      type: 'info',
      message: 'تم تحديث النظام بنجاح',
      timestamp: '2024-01-15 13:15:00',
      resolved: true
    },
    {
      id: '3',
      type: 'critical',
      message: 'مساحة القرص منخفضة - أقل من 20%',
      timestamp: '2024-01-15 12:00:00',
      resolved: false
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setMetrics(prev => ({
        ...prev,
        cpu: {
          ...prev.cpu,
          usage: Math.max(10, Math.min(95, prev.cpu.usage + (Math.random() - 0.5) * 10))
        },
        memory: {
          ...prev.memory,
          percentage: Math.max(20, Math.min(90, prev.memory.percentage + (Math.random() - 0.5) * 5))
        }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'bg-red-500';
    if (value >= thresholds.warning) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getAlertBadge = (type: string) => {
    const variants = {
      warning: { variant: 'secondary' as const, text: 'تحذير', icon: AlertTriangle },
      critical: { variant: 'destructive' as const, text: 'حرج', icon: AlertTriangle },
      info: { variant: 'default' as const, text: 'معلومات', icon: Activity }
    };
    return variants[type as keyof typeof variants] || variants.info;
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">مراقب الأداء</h2>
          <p className="text-gray-600">مراقبة أداء النظام في الوقت الفعلي</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="1h">آخر ساعة</option>
            <option value="6h">آخر 6 ساعات</option>
            <option value="24h">آخر 24 ساعة</option>
            <option value="7d">آخر 7 أيام</option>
          </select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ml-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المعالج</CardTitle>
            <Cpu className={`h-4 w-4 ${getStatusColor(metrics.cpu.usage, { warning: 70, critical: 90 })}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cpu.usage.toFixed(1)}%</div>
            <Progress 
              value={metrics.cpu.usage} 
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-2">
              {metrics.cpu.cores} أنوية • {metrics.cpu.temperature}°C
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الذاكرة</CardTitle>
            <Server className={`h-4 w-4 ${getStatusColor(metrics.memory.percentage, { warning: 75, critical: 90 })}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.memory.percentage.toFixed(1)}%</div>
            <Progress 
              value={metrics.memory.percentage} 
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-2">
              {metrics.memory.used.toFixed(1)}GB / {metrics.memory.total}GB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">القرص</CardTitle>
            <HardDrive className={`h-4 w-4 ${getStatusColor(metrics.disk.percentage, { warning: 80, critical: 95 })}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.disk.percentage.toFixed(1)}%</div>
            <Progress 
              value={metrics.disk.percentage} 
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-2">
              {metrics.disk.used}GB / {metrics.disk.total}GB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الشبكة</CardTitle>
            <Wifi className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.network.latency}ms</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-xs">⬆ {metrics.network.upload}Mbps</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <TrendingDown className="w-3 h-3 text-blue-600" />
              <span className="text-xs">⬇ {metrics.network.download}Mbps</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="processes">العمليات</TabsTrigger>
          <TabsTrigger value="alerts">التنبيهات</TabsTrigger>
          <TabsTrigger value="history">السجل</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  معلومات النظام
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">وقت التشغيل</span>
                  <span className="text-sm font-medium">{metrics.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">عدد العمليات</span>
                  <span className="text-sm font-medium">{metrics.processes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">حالة النظام</span>
                  <Badge variant="default">نشط</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">آخر تحديث</span>
                  <span className="text-sm font-medium">الآن</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  استهلاك الموارد
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">المعالج</span>
                    <span className="text-sm font-medium">{metrics.cpu.usage.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.cpu.usage} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">الذاكرة</span>
                    <span className="text-sm font-medium">{metrics.memory.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.memory.percentage} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">القرص</span>
                    <span className="text-sm font-medium">{metrics.disk.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.disk.percentage} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="processes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>العمليات النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'nginx', pid: 1234, cpu: 12.5, memory: 45.2 },
                  { name: 'node', pid: 5678, cpu: 8.3, memory: 23.7 },
                  { name: 'mysql', pid: 9012, cpu: 15.8, memory: 67.4 },
                  { name: 'redis', pid: 3456, cpu: 2.1, memory: 12.8 },
                  { name: 'postgres', pid: 7890, cpu: 6.7, memory: 34.5 }
                ].map((process) => (
                  <div key={process.pid} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">{process.name}</p>
                        <p className="text-sm text-gray-500">PID: {process.pid}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-left">
                        <p className="text-sm font-medium">{process.cpu}%</p>
                        <p className="text-xs text-gray-500">CPU</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{process.memory}%</p>
                        <p className="text-xs text-gray-500">Memory</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>التنبيهات النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => {
                  const badgeConfig = getAlertBadge(alert.type);
                  const Icon = badgeConfig.icon;
                  return (
                    <div key={alert.id} className={`flex items-center justify-between p-4 border rounded-lg ${alert.resolved ? 'bg-gray-50' : ''}`}>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${alert.type === 'critical' ? 'text-red-600' : alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'}`} />
                        <div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-gray-500">{alert.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={badgeConfig.variant}>
                          {badgeConfig.text}
                        </Badge>
                        {alert.resolved && (
                          <Badge variant="outline">تم الحل</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>سجل الأداء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: '14:30', cpu: 45, memory: 52, disk: 50 },
                  { time: '14:25', cpu: 42, memory: 51, disk: 50 },
                  { time: '14:20', cpu: 48, memory: 53, disk: 50 },
                  { time: '14:15', cpu: 51, memory: 54, disk: 50 },
                  { time: '14:10', cpu: 44, memory: 50, disk: 50 }
                ].map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{record.time}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-left">
                        <p className="text-sm font-medium">{record.cpu}%</p>
                        <p className="text-xs text-gray-500">CPU</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{record.memory}%</p>
                        <p className="text-xs text-gray-500">Memory</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{record.disk}%</p>
                        <p className="text-xs text-gray-500">Disk</p>
                      </div>
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