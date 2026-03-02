'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Users, Globe, Server, Database, Wifi, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface RealTimeStats {
  activeUsers: number;
  pageViews: number;
  serverLoad: number;
  memoryUsage: number;
  diskUsage: number;
  networkTraffic: number;
  errorRate: number;
  responseTime: number;
  uptime: number;
  activeConnections: number;
  databaseConnections: number;
  cacheHitRate: number;
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export function RealTimeMonitor() {
  const [stats, setStats] = useState<RealTimeStats>({
    activeUsers: 0,
    pageViews: 0,
    serverLoad: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkTraffic: 0,
    errorRate: 0,
    responseTime: 0,
    uptime: 0,
    activeConnections: 0,
    databaseConnections: 0,
    cacheHitRate: 0
  });

  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      type: 'warning',
      message: 'استخدام المعالج مرتفع',
      timestamp: new Date().toISOString(),
      resolved: false
    },
    {
      id: '2',
      type: 'info',
      message: 'تم تحديث النظام بنجاح',
      timestamp: new Date().toISOString(),
      resolved: true
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        activeUsers: Math.max(0, prev.activeUsers + Math.floor((Math.random() - 0.5) * 10)),
        pageViews: prev.pageViews + Math.floor(Math.random() * 5),
        serverLoad: Math.max(0, Math.min(100, prev.serverLoad + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        diskUsage: Math.max(0, Math.min(100, prev.diskUsage + Math.random() * 0.1)),
        networkTraffic: Math.max(0, Math.min(1000, prev.networkTraffic + (Math.random() - 0.5) * 100)),
        errorRate: Math.max(0, Math.min(10, prev.errorRate + (Math.random() - 0.95) * 2)),
        responseTime: Math.max(0, Math.min(1000, prev.responseTime + (Math.random() - 0.5) * 50)),
        uptime: Math.min(100, prev.uptime + Math.random() * 0.01),
        activeConnections: Math.max(0, prev.activeConnections + Math.floor((Math.random() - 0.5) * 5)),
        databaseConnections: Math.max(0, Math.min(100, prev.databaseConnections + Math.floor((Math.random() - 0.5) * 3))),
        cacheHitRate: Math.max(0, Math.min(100, prev.cacheHitRate + (Math.random() - 0.5) * 5))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, type: 'load' | 'memory' | 'disk' | 'error' | 'response') => {
    if (type === 'error') {
      return value > 5 ? 'text-red-600' : value > 2 ? 'text-yellow-600' : 'text-green-600';
    }
    if (type === 'response') {
      return value > 500 ? 'text-red-600' : value > 200 ? 'text-yellow-600' : 'text-green-600';
    }
    if (type === 'disk') {
      return value > 90 ? 'text-red-600' : value > 70 ? 'text-yellow-600' : 'text-green-600';
    }
    return value > 80 ? 'text-red-600' : value > 60 ? 'text-yellow-600' : 'text-green-600';
  };

  const getProgressBarColor = (value: number, type: 'load' | 'memory' | 'disk' | 'error' | 'response') => {
    if (type === 'error') {
      return value > 5 ? 'bg-red-500' : value > 2 ? 'bg-yellow-500' : 'bg-green-500';
    }
    if (type === 'response') {
      return value > 500 ? 'bg-red-500' : value > 200 ? 'bg-yellow-500' : 'bg-green-500';
    }
    if (type === 'disk') {
      return value > 90 ? 'bg-red-500' : value > 70 ? 'bg-yellow-500' : 'bg-green-500';
    }
    return value > 80 ? 'bg-red-500' : value > 60 ? 'bg-yellow-500' : 'bg-green-500';
  };

  const getAlertIcon = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  const getAlertBadge = (type: 'error' | 'warning' | 'info') => {
    const variants = {
      error: 'destructive',
      warning: 'secondary',
      info: 'default'
    } as const;

    const labels = {
      error: 'خطأ',
      warning: 'تحذير',
      info: 'معلومات'
    };

    return <Badge variant={variants[type]}>{labels[type]}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Real-time Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{Math.floor(Math.random() * 20)}%</span> من الساعة الماضية
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مشاهدات الصفحة</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+{Math.floor(Math.random() * 100)}</span> اليوم
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حمل الخادم</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(stats.serverLoad, 'load')}`}>
              {stats.serverLoad.toFixed(1)}%
            </div>
            <Progress value={stats.serverLoad} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">استخدام الذاكرة</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(stats.memoryUsage, 'memory')}`}>
              {stats.memoryUsage.toFixed(1)}%
            </div>
            <Progress value={stats.memoryUsage} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">استخدام القرص</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(stats.diskUsage, 'disk')}`}>
              {stats.diskUsage.toFixed(1)}%
            </div>
            <Progress value={stats.diskUsage} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">النطاق الترددي</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.networkTraffic / 1000).toFixed(2)} GB/s</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-purple-600">نشط</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الخطأ</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(stats.errorRate, 'error')}`}>
              {stats.errorRate.toFixed(2)}%
            </div>
            <Progress value={stats.errorRate * 10} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">وقت الاستجابة</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(stats.responseTime, 'response')}`}>
              {stats.responseTime.toFixed(0)}ms
            </div>
            <Progress value={(stats.responseTime / 1000) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            تنبيهات النظام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  alert.resolved ? 'bg-gray-50 opacity-60' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(alert.timestamp).toLocaleString('ar-SA')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getAlertBadge(alert.type)}
                  {alert.resolved && (
                    <Badge variant="outline" className="text-green-600">
                      تم الحل
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connection Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الاتصالات النشطة</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeConnections}</div>
            <Progress value={(stats.activeConnections / 1000) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">اتصالات قاعدة البيانات</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.databaseConnections}</div>
            <Progress value={stats.databaseConnections} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل命中率 للكاش</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cacheHitRate.toFixed(1)}%</div>
            <Progress value={stats.cacheHitRate} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}