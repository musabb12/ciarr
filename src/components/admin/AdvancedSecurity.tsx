'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Download, 
  Upload,
  Ban,
  User,
  Globe,
  Wifi,
  Database,
  FileText,
  Settings,
  Zap,
  Activity,
  Clock,
  MapPin,
  Terminal,
  Bug,
  Search,
  Filter,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Fingerprint,
  Smartphone,
  Mail,
  CreditCard,
  UserCheck,
  UserX,
  Cpu,
  HardDrive,
  Monitor
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'login' | 'access' | 'attack' | 'data_breach' | 'malware' | 'phishing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  source: {
    ip: string;
    country: string;
    userAgent: string;
  };
  target: string;
  timestamp: string;
  status: 'active' | 'resolved' | 'investigating';
  assignedTo?: string;
  actions: string[];
}

interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  description: string;
}

interface Threat {
  id: string;
  name: string;
  type: 'malware' | 'phishing' | 'ddos' | 'injection' | 'brute_force';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  affected: number;
  detected: string;
  status: 'active' | 'blocked' | 'investigating';
}

interface SecurityRule {
  id: string;
  name: string;
  description: string;
  type: 'firewall' | 'ips' | 'antivirus' | 'access_control' | 'encryption';
  enabled: boolean;
  lastTriggered?: string;
  blockedCount: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export function AdvancedSecurity() {
  const [events, setEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'attack',
      severity: 'high',
      title: 'محاولة اختراق متكررة',
      description: 'تم اكتشاف محاولات دخول متكررة من عنوان IP 192.168.1.100',
      source: {
        ip: '192.168.1.100',
        country: 'السعودية',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      target: '/admin/login',
      timestamp: new Date().toISOString(),
      status: 'active',
      assignedTo: 'security_team',
      actions: ['blocked_ip', 'alert_sent']
    },
    {
      id: '2',
      type: 'access',
      severity: 'medium',
      title: 'وصول غير مصرح به',
      description: 'محاولة الوصول إلى ملفات حساسة بدون صلاحيات',
      source: {
        ip: '10.0.0.15',
        country: 'الإمارات',
        userAgent: 'curl/7.68.0'
      },
      target: '/api/admin/users',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'resolved',
      actions: ['access_denied', 'user_notified']
    },
    {
      id: '3',
      type: 'phishing',
      severity: 'critical',
      title: 'هجوم تصيد احتيالي',
      description: 'تم اكتشاف محاولة تصيد عبر بريد إلكتروني مزيف',
      source: {
        ip: '172.16.0.5',
        country: 'مصر',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
      },
      target: 'email_system',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'investigating',
      assignedTo: 'security_analyst',
      actions: ['email_blocked', 'users_alerted']
    }
  ]);

  const [metrics, setMetrics] = useState<SecurityMetric[]>([
    {
      id: '1',
      name: 'مستوى الأمان',
      value: 87,
      unit: '%',
      status: 'good',
      trend: 'up',
      description: 'مستوى الأمان العام للنظام'
    },
    {
      id: '2',
      name: 'التهديدات المحظورة',
      value: 1247,
      unit: '',
      status: 'good',
      trend: 'up',
      description: 'عدد التهديدات التي تم حظرها'
    },
    {
      id: '3',
      name: 'محاولات الاختراق',
      value: 23,
      unit: '',
      status: 'warning',
      trend: 'down',
      description: 'محاولات الاختراق خلال 24 ساعة'
    },
    {
      id: '4',
      name: 'الثغرات الأمنية',
      value: 3,
      unit: '',
      status: 'critical',
      trend: 'stable',
      description: 'الثغرات الأمنية غير المعالجة'
    }
  ]);

  const [threats, setThreats] = useState<Threat[]>([
    {
      id: '1',
      name: 'SQL Injection Attack',
      type: 'injection',
      severity: 'high',
      confidence: 0.92,
      affected: 5,
      detected: new Date().toISOString(),
      status: 'blocked'
    },
    {
      id: '2',
      name: 'Phishing Email Campaign',
      type: 'phishing',
      severity: 'critical',
      confidence: 0.87,
      affected: 12,
      detected: new Date(Date.now() - 3600000).toISOString(),
      status: 'investigating'
    },
    {
      id: '3',
      name: 'DDoS Attack',
      type: 'ddos',
      severity: 'medium',
      confidence: 0.78,
      affected: 1,
      detected: new Date(Date.now() - 7200000).toISOString(),
      status: 'active'
    }
  ]);

  const [rules, setRules] = useState<SecurityRule[]>([
    {
      id: '1',
      name: 'حماية جدار الحماية',
      description: 'منع الوصول من عناوين IP المشبوهة',
      type: 'firewall',
      enabled: true,
      lastTriggered: new Date().toISOString(),
      blockedCount: 156,
      severity: 'high'
    },
    {
      id: '2',
      name: 'نظام كشف التسلل',
      description: 'مراقبة الأنشطة المشبوهة في الشبكة',
      type: 'ips',
      enabled: true,
      lastTriggered: new Date(Date.now() - 3600000).toISOString(),
      blockedCount: 23,
      severity: 'medium'
    },
    {
      id: '3',
      name: 'الحماية من الفيروسات',
      description: 'فحص الملفات المرفوعة بحثاً عن برامج ضارة',
      type: 'antivirus',
      enabled: true,
      blockedCount: 89,
      severity: 'high'
    }
  ]);

  const [selectedTab, setSelectedTab] = useState('overview');
  const [isScanning, setIsScanning] = useState(false);

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: 'secondary',
      medium: 'default',
      high: 'destructive',
      critical: 'destructive'
    } as const;

    const labels = {
      low: 'منخفض',
      medium: 'متوسط',
      high: 'عالي',
      critical: 'حرج'
    };

    return <Badge variant={variants[severity as keyof typeof variants]}>{labels[severity as keyof typeof labels]}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'destructive',
      resolved: 'default',
      investigating: 'secondary',
      blocked: 'default'
    } as const;

    const labels = {
      active: 'نشط',
      resolved: 'تم الحل',
      investigating: 'قيد التحقيق',
      blocked: 'محظور'
    };

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>;
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'malware':
        return <Bug className="w-4 h-4 text-red-600" />;
      case 'phishing':
        return <Mail className="w-4 h-4 text-orange-600" />;
      case 'ddos':
        return <Wifi className="w-4 h-4 text-purple-600" />;
      case 'injection':
        return <Terminal className="w-4 h-4 text-blue-600" />;
      case 'brute_force':
        return <Key className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRuleIcon = (type: string) => {
    switch (type) {
      case 'firewall':
        return <Shield className="w-4 h-4 text-red-600" />;
      case 'ips':
        return <Eye className="w-4 h-4 text-blue-600" />;
      case 'antivirus':
        return <Bug className="w-4 h-4 text-green-600" />;
      case 'access_control':
        return <Lock className="w-4 h-4 text-yellow-600" />;
      case 'encryption':
        return <Key className="w-4 h-4 text-purple-600" />;
      default:
        return <Settings className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleSecurityScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Add new security event
      const newEvent: SecurityEvent = {
        id: Date.now().toString(),
        type: 'attack',
        severity: 'medium',
        title: 'فحص أمني مكتمل',
        description: 'تم إجراء فحص أمني شامل للنظام',
        source: {
          ip: '127.0.0.1',
          country: 'السعودية',
          userAgent: 'Security Scanner v1.0'
        },
        target: 'system',
        timestamp: new Date().toISOString(),
        status: 'resolved',
        actions: ['scan_completed']
      };
      setEvents(prev => [newEvent, ...prev]);
    }, 5000);
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => 
      prev.map(rule => 
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">الأمان المتقدم</h2>
            <p className="text-sm text-gray-600">حماية شاملة للنظام والبيانات</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <Button 
            variant="outline" 
            onClick={handleSecurityScan}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                جاري الفحص...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 ml-2" />
                فحص أمني
              </>
            )}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 ml-2" />
            تقرير الأمان
          </Button>
        </div>
      </div>

      {/* Security Score Alert */}
      <Alert className={metrics[0].status === 'good' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
        <ShieldCheck className="h-4 w-4" />
        <AlertTitle>مستوى الأمان الحالي</AlertTitle>
        <AlertDescription>
          مستوى الأمان العام للنظام هو {metrics[0].value}% - 
          {metrics[0].status === 'good' ? ' النظام آمن' : ' هناك تهديدات تتطلب الاهتمام'}
        </AlertDescription>
      </Alert>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="events">الأحداث</TabsTrigger>
          <TabsTrigger value="threats">التهديدات</TabsTrigger>
          <TabsTrigger value="rules">القواعد</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Security Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getMetricColor(metric.status)}`}>
                    {metric.value}{metric.unit}
                  </div>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                  <div className="flex items-center mt-2">
                    {metric.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-600 ml-1" />}
                    {metric.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-600 ml-1" />}
                    <span className="text-xs text-gray-500">
                      {metric.trend === 'up' ? 'تحسن' : metric.trend === 'down' ? 'تراجع' : 'مستقر'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle>الأحداث الأمنية الأخيرة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <AlertTriangle className={`w-4 h-4 ${
                        event.severity === 'critical' ? 'text-red-600' :
                        event.severity === 'high' ? 'text-orange-600' :
                        event.severity === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                      }`} />
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <div className="flex items-center space-x-2 space-x-reverse mt-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{event.source.country}</span>
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {new Date(event.timestamp).toLocaleTimeString('ar-SA')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      {getSeverityBadge(event.severity)}
                      {getStatusBadge(event.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>جميع الأحداث الأمنية</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 space-x-reverse">
                          <AlertTriangle className={`w-5 h-5 mt-1 ${
                            event.severity === 'critical' ? 'text-red-600' :
                            event.severity === 'high' ? 'text-orange-600' :
                            event.severity === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{event.title}</h3>
                              {getSeverityBadge(event.severity)}
                              {getStatusBadge(event.status)}
                            </div>
                            <p className="text-gray-600 mb-3">{event.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">المصدر:</span>
                                <div className="text-gray-600">
                                  <div>IP: {event.source.ip}</div>
                                  <div>الدولة: {event.source.country}</div>
                                </div>
                              </div>
                              <div>
                                <span className="font-medium">الهدف:</span>
                                <div className="text-gray-600">{event.target}</div>
                              </div>
                            </div>
                            {event.assignedTo && (
                              <div className="mt-2 text-sm">
                                <span className="font-medium">المسؤول:</span> {event.assignedTo}
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-3">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {new Date(event.timestamp).toLocaleString('ar-SA')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Threats Tab */}
        <TabsContent value="threats">
          <Card>
            <CardHeader>
              <CardTitle>التهديدات الأمنية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threats.map((threat) => (
                  <div key={threat.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 space-x-reverse">
                        <div className="mt-1">
                          {getThreatIcon(threat.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{threat.name}</h3>
                            {getSeverityBadge(threat.severity)}
                            {getStatusBadge(threat.status)}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">الثقة:</span>
                              <div className="flex items-center gap-2">
                                <Progress value={threat.confidence * 100} className="flex-1 h-2" />
                                <span>{(threat.confidence * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">المتأثرين:</span>
                              <div>{threat.affected}</div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            تم اكتشافه: {new Date(threat.detected).toLocaleString('ar-SA')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>قواعد الأمان</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div key={rule.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 space-x-reverse">
                        <div className="mt-1">
                          {getRuleIcon(rule.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{rule.name}</h3>
                            {getSeverityBadge(rule.severity)}
                            <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                              {rule.enabled ? 'نشط' : 'غير نشط'}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{rule.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">المحظورات:</span>
                              <div>{rule.blockedCount} محاولة</div>
                            </div>
                            {rule.lastTriggered && (
                              <div>
                                <span className="font-medium">آخر تفعيل:</span>
                                <div>{new Date(rule.lastTriggered).toLocaleString('ar-SA')}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={() => handleToggleRule(rule.id)}
                        />
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