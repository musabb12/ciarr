'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plug, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Download, 
  Upload,
  Link,
  Unlink,
  Key,
  Shield,
  Database,
  Mail,
  MessageSquare,
  Calendar,
  FileText,
  Globe,
  Smartphone,
  Cloud,
  Zap,
  Activity,
  Clock,
  Users,
  BarChart3,
  PieChart,
  LineChart,
  GitBranch,
  Api,
  Code,
  Terminal,
  Server,
  HardDrive,
  Wifi,
  Lock,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Save,
  TestTube,
  Play,
  Pause,
  Square,
  CreditCard
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'payment' | 'communication' | 'analytics' | 'storage' | 'crm' | 'custom';
  status: 'connected' | 'disconnected' | 'error' | 'configuring';
  icon: string;
  version: string;
  lastSync?: string;
  dataPoints: number;
  apiCalls: number;
  errorRate: number;
  config: Record<string, any>;
  webhooks: Array<{
    id: string;
    url: string;
    events: string[];
    active: boolean;
    lastTriggered?: string;
  }>;
  credentials: {
    apiKey?: string;
    secret?: string;
    webhookUrl?: string;
    [key: string]: any;
  };
}

interface IntegrationLog {
  id: string;
  integrationId: string;
  type: 'api_call' | 'webhook' | 'sync' | 'error';
  status: 'success' | 'error' | 'pending';
  message: string;
  timestamp: string;
  duration?: number;
  requestData?: any;
  responseData?: any;
}

interface IntegrationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  popular: boolean;
  setupTime: string;
  features: string[];
}

export function AdvancedIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Stripe',
      description: 'معالجة الدفعات الإلكترونية الآمنة',
      category: 'payment',
      status: 'connected',
      icon: '💳',
      version: '2.0.0',
      lastSync: new Date().toISOString(),
      dataPoints: 1234,
      apiCalls: 5678,
      errorRate: 0.1,
      config: {
        currency: 'SAR',
        webhookSecret: 'whsec_***'
      },
      webhooks: [
        {
          id: '1',
          url: 'https://yourapp.com/webhooks/stripe',
          events: ['payment_intent.succeeded', 'payment_intent.payment_failed'],
          active: true,
          lastTriggered: new Date().toISOString()
        }
      ],
      credentials: {
        apiKey: 'ciar_demo_key_***',
        webhookUrl: 'https://yourapp.com/webhooks/stripe'
      }
    },
    {
      id: '2',
      name: 'SendGrid',
      description: 'خدمة البريد الإلكتروني المتقدمة',
      category: 'communication',
      status: 'connected',
      icon: '📧',
      version: '3.0.0',
      lastSync: new Date(Date.now() - 3600000).toISOString(),
      dataPoints: 567,
      apiCalls: 2345,
      errorRate: 0.0,
      config: {
        fromEmail: 'noreply@yourapp.com',
        templates: ['welcome', 'reset_password', 'newsletter']
      },
      webhooks: [
        {
          id: '2',
          url: 'https://yourapp.com/webhooks/sendgrid',
          events: ['delivered', 'opened', 'clicked'],
          active: true,
          lastTriggered: new Date(Date.now() - 1800000).toISOString()
        }
      ],
      credentials: {
        apiKey: 'SG.***'
      }
    },
    {
      id: '3',
      name: 'Google Analytics',
      description: 'تحليلات وتتبع أداء الموقع',
      category: 'analytics',
      status: 'error',
      icon: '📊',
      version: '4.0.0',
      lastSync: new Date(Date.now() - 7200000).toISOString(),
      dataPoints: 8901,
      apiCalls: 12345,
      errorRate: 2.3,
      config: {
        trackingId: 'GA-XXXXXXX-X',
        dimensions: ['page', 'source', 'medium']
      },
      webhooks: [],
      credentials: {
        clientId: '***.apps.googleusercontent.com',
        clientSecret: '***'
      }
    },
    {
      id: '4',
      name: 'AWS S3',
      description: 'تخزين الملفات السحابي',
      category: 'storage',
      status: 'disconnected',
      icon: '☁️',
      version: '1.0.0',
      dataPoints: 0,
      apiCalls: 0,
      errorRate: 0.0,
      config: {
        bucket: 'your-app-bucket',
        region: 'me-south-1'
      },
      webhooks: [],
      credentials: {
        accessKeyId: '***',
        secretAccessKey: '***'
      }
    }
  ]);

  const [logs, setLogs] = useState<IntegrationLog[]>([
    {
      id: '1',
      integrationId: '1',
      type: 'api_call',
      status: 'success',
      message: 'Payment intent created successfully',
      timestamp: new Date().toISOString(),
      duration: 245,
      requestData: { amount: 999, currency: 'SAR' },
      responseData: { id: 'pi_1234567890', status: 'requires_payment_method' }
    },
    {
      id: '2',
      integrationId: '2',
      type: 'webhook',
      status: 'success',
      message: 'Email delivered successfully',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      duration: 1234,
      requestData: { to: 'user@example.com', template: 'welcome' }
    },
    {
      id: '3',
      integrationId: '3',
      type: 'error',
      status: 'error',
      message: 'Authentication failed: Invalid credentials',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      duration: 0,
      requestData: { endpoint: '/analytics/data' }
    }
  ]);

  const [templates] = useState<IntegrationTemplate[]>([
    {
      id: '1',
      name: 'Slack',
      description: 'التواصل الفوري مع الفريق',
      category: 'communication',
      icon: '💬',
      popular: true,
      setupTime: '5 دقائق',
      features: ['الإشعارات الفورية', 'التكامل مع القنوات', 'الأوامر المخصصة']
    },
    {
      id: '2',
      name: 'GitHub',
      description: 'إدارة وتتبع الكود المصدري',
      category: 'development',
      icon: '🐙',
      popular: true,
      setupTime: '3 دقائق',
      features: ['Webhooks', 'API access', 'Repository sync']
    },
    {
      id: '3',
      name: 'HubSpot',
      description: 'نظام إدارة علاقات العملاء',
      category: 'crm',
      icon: '🎯',
      popular: false,
      setupTime: '10 دقائق',
      features: ['Contact sync', 'Deal tracking', 'Email automation']
    },
    {
      id: '4',
      name: 'Twilio',
      description: 'خدمات الرسائل النصية والمكالمات',
      category: 'communication',
      icon: '📱',
      popular: false,
      setupTime: '7 دقائق',
      features: ['SMS', 'Voice calls', 'WhatsApp integration']
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isTestingConnection, setIsTestingConnection] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const variants = {
      connected: 'default',
      disconnected: 'secondary',
      error: 'destructive',
      configuring: 'default'
    } as const;

    const labels = {
      connected: 'متصل',
      disconnected: 'غير متصل',
      error: 'خطأ',
      configuring: 'قيد الإعداد'
    };

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment':
        return <CreditCard className="w-4 h-4 text-green-600" />;
      case 'communication':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'analytics':
        return <BarChart3 className="w-4 h-4 text-purple-600" />;
      case 'storage':
        return <HardDrive className="w-4 h-4 text-orange-600" />;
      case 'crm':
        return <Users className="w-4 h-4 text-red-600" />;
      default:
        return <Plug className="w-4 h-4 text-gray-600" />;
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'api_call':
        return <Api className="w-4 h-4 text-blue-600" />;
      case 'webhook':
        return <Link className="w-4 h-4 text-green-600" />;
      case 'sync':
        return <RefreshCw className="w-4 h-4 text-purple-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? { 
              ...integration, 
              status: integration.status === 'connected' ? 'disconnected' : 'connected' 
            }
          : integration
      )
    );
  };

  const handleTestConnection = async (integrationId: string) => {
    setIsTestingConnection(integrationId);
    
    // Simulate connection test
    setTimeout(() => {
      const success = Math.random() > 0.3;
      
      const newLog: IntegrationLog = {
        id: Date.now().toString(),
        integrationId,
        type: 'api_call',
        status: success ? 'success' : 'error',
        message: success ? 'Connection test successful' : 'Connection test failed',
        timestamp: new Date().toISOString(),
        duration: Math.floor(Math.random() * 1000) + 100
      };
      
      setLogs(prev => [newLog, ...prev]);
      setIsTestingConnection(null);
      
      if (success) {
        setIntegrations(prev => 
          prev.map(integration => 
            integration.id === integrationId 
              ? { ...integration, status: 'connected', lastSync: new Date().toISOString() }
              : integration
          )
        );
      }
    }, 2000);
  };

  const handleSyncIntegration = (integrationId: string) => {
    const newLog: IntegrationLog = {
      id: Date.now().toString(),
      integrationId,
      type: 'sync',
      status: 'pending',
      message: 'Sync started',
      timestamp: new Date().toISOString()
    };
    
    setLogs(prev => [newLog, ...prev]);
    
    // Simulate sync completion
    setTimeout(() => {
      setLogs(prev => 
        prev.map(log => 
          log.id === newLog.id 
            ? { 
                ...log, 
                status: 'success', 
                message: 'Sync completed successfully',
                duration: Math.floor(Math.random() * 5000) + 1000
              }
            : log
        )
      );
      
      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === integrationId 
            ? { 
                ...integration, 
                lastSync: new Date().toISOString(),
                dataPoints: integration.dataPoints + Math.floor(Math.random() * 100),
                apiCalls: integration.apiCalls + Math.floor(Math.random() * 50)
              }
            : integration
        )
      );
    }, 3000);
  };

  const filteredIntegrations = integrations.filter(integration => 
    selectedCategory === 'all' || integration.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Plug className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">التكاملات المتقدمة</h2>
            <p className="text-sm text-gray-600">ربط النظام مع الخدمات الخارجية</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="payment">الدفعات</SelectItem>
              <SelectItem value="communication">التواصل</SelectItem>
              <SelectItem value="analytics">التحليلات</SelectItem>
              <SelectItem value="storage">التخزين</SelectItem>
              <SelectItem value="crm">إدارة العملاء</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 ml-2" />
                إضافة تكامل
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إضافة تكامل جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 space-x-reverse mb-2">
                          <span className="text-2xl">{template.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-semibold">{template.name}</h3>
                            <p className="text-sm text-gray-600">{template.description}</p>
                          </div>
                          {template.popular && (
                            <Badge variant="secondary">شائع</Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          ⏱️ {template.setupTime}
                        </div>
                        <div className="space-y-1">
                          {template.features.slice(0, 2).map((feature, index) => (
                            <div key={index} className="text-xs text-gray-600">
                              • {feature}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التكاملات النشطة</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.filter(i => i.status === 'connected').length}
            </div>
            <p className="text-xs text-muted-foreground">
              من أصل {integrations.length} تكامل
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مجموع API Calls</CardTitle>
            <Api className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.reduce((acc, i) => acc + i.apiCalls, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              اليوم
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نقاط البيانات</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.reduce((acc, i) => acc + i.dataPoints, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              إجمالي البيانات
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الخطأ</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {(integrations.reduce((acc, i) => acc + i.errorRate, 0) / integrations.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              متوسط الخطأ
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="integrations">التكاملات</TabsTrigger>
          <TabsTrigger value="logs">السجلات</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-2xl">{integration.icon}</span>
                      <div>
                        <h3 className="font-semibold">{integration.name}</h3>
                        <p className="text-xs text-gray-500">v{integration.version}</p>
                      </div>
                    </div>
                    {getStatusBadge(integration.status)}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                  
                  <div className="flex items-center space-x-2 space-x-reverse mb-3">
                    {getCategoryIcon(integration.category)}
                    <span className="text-xs text-gray-500">{integration.category}</span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span>API Calls:</span>
                      <span>{integration.apiCalls.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>نقاط البيانات:</span>
                      <span>{integration.dataPoints.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>معدل الخطأ:</span>
                      <span className={integration.errorRate > 1 ? 'text-red-600' : 'text-green-600'}>
                        {integration.errorRate}%
                      </span>
                    </div>
                    {integration.lastSync && (
                      <div className="flex justify-between text-xs">
                        <span>آخر مزامنة:</span>
                        <span>{new Date(integration.lastSync).toLocaleTimeString('ar-SA')}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 space-x-reverse">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection(integration.id)}
                      disabled={isTestingConnection === integration.id}
                    >
                      {isTestingConnection === integration.id ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <TestTube className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSyncIntegration(integration.id)}
                      disabled={integration.status !== 'connected'}
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedIntegration(integration);
                        setIsConfigDialogOpen(true);
                      }}
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                    <Switch
                      checked={integration.status === 'connected'}
                      onCheckedChange={() => handleToggleIntegration(integration.id)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>سجلات النشاط</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.map((log) => {
                  const integration = integrations.find(i => i.id === log.integrationId);
                  return (
                    <div key={log.id} className="flex items-start space-x-3 space-x-reverse p-3 border rounded-lg">
                      <div className="mt-1">
                        {getLogIcon(log.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 space-x-reverse mb-1">
                          <span className="font-medium">{integration?.name}</span>
                          <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                            {log.status}
                          </Badge>
                          {log.duration && (
                            <span className="text-xs text-gray-500">{log.duration}ms</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{log.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Webhooks النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.filter(i => i.webhooks.length > 0).map((integration) => (
                  <div key={integration.id} className="space-y-3">
                    <h3 className="font-semibold flex items-center space-x-2 space-x-reverse">
                      <span>{integration.icon}</span>
                      <span>{integration.name}</span>
                    </h3>
                    {integration.webhooks.map((webhook) => (
                      <div key={webhook.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 space-x-reverse mb-2">
                              <Link className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-sm">{webhook.url}</span>
                              <Badge variant={webhook.active ? 'default' : 'secondary'}>
                                {webhook.active ? 'نشط' : 'غير نشط'}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              الأحداث: {webhook.events.join(', ')}
                            </div>
                            {webhook.lastTriggered && (
                              <div className="text-xs text-gray-500">
                                آخر تشغيل: {new Date(webhook.lastTriggered).toLocaleString('ar-SA')}
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="outline" size="sm">
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Switch
                              checked={webhook.active}
                              onCheckedChange={() => {
                                // Toggle webhook active state
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Configuration Dialog */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>إعدادات التكامل</DialogTitle>
          </DialogHeader>
          {selectedIntegration && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">اسم التكامل</label>
                  <Input value={selectedIntegration.name} disabled />
                </div>
                <div>
                  <label className="text-sm font-medium">الحالة</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedIntegration.status)}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">مفتاح API</label>
                <div className="flex space-x-2 space-x-reverse mt-1">
                  <Input 
                    type={selectedIntegration.credentials.apiKey ? 'password' : 'text'}
                    value={selectedIntegration.credentials.apiKey || ''}
                    placeholder="أدخل مفتاح API"
                  />
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Webhook URL</label>
                <Input 
                  value={selectedIntegration.credentials.webhookUrl || ''}
                  placeholder="أدخل عنوان Webhook"
                  className="mt-1"
                />
              </div>
              
              <div className="flex justify-end space-x-2 space-x-reverse">
                <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={() => setIsConfigDialogOpen(false)}>
                  حفظ
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}