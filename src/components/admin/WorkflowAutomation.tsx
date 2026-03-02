'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  Edit, 
  Trash2, 
  Plus, 
  Settings, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Zap,
  GitBranch,
  ArrowRight,
  Filter,
  Calendar,
  Mail,
  Database,
  FileText,
  User,
  Shield,
  BarChart3,
  RefreshCw,
  Save,
  Copy,
  Eye,
  MoreHorizontal
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  config: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  category: 'automation' | 'notification' | 'integration' | 'monitoring';
  status: 'active' | 'inactive' | 'error' | 'running';
  trigger: string;
  steps: WorkflowStep[];
  schedule?: string;
  lastRun?: string;
  nextRun?: string;
  runCount: number;
  successRate: number;
  createdAt: string;
  updatedAt: string;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  duration?: number;
  steps: Array<{
    stepId: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    startTime?: string;
    endTime?: string;
    error?: string;
  }>;
}

export function WorkflowAutomation() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'ترحيب المستخدمين الجدد',
      description: 'إرسال رسالة ترحيب تلقائية للمستخدمين الجدد',
      category: 'notification',
      status: 'active',
      trigger: 'user_registered',
      steps: [
        {
          id: '1',
          name: 'مستخدم جديد سجل',
          type: 'trigger',
          config: { event: 'user_registered' },
          position: { x: 100, y: 100 },
          connections: ['2']
        },
        {
          id: '2',
          name: 'إرسال بريد ترحيب',
          type: 'action',
          config: { action: 'send_email', template: 'welcome' },
          position: { x: 300, y: 100 },
          connections: ['3']
        },
        {
          id: '3',
          name: 'إضافة إلى قائمة المستخدمين النشطين',
          type: 'action',
          config: { action: 'add_to_list', list: 'active_users' },
          position: { x: 500, y: 100 },
          connections: []
        }
      ],
      runCount: 156,
      successRate: 98.7,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'مراقبة أداء النظام',
      description: 'إرسال تنبيه عند تجاوز استخدام المعالج 80%',
      category: 'monitoring',
      status: 'active',
      trigger: 'cpu_usage_high',
      steps: [
        {
          id: '1',
          name: 'استخدام المعالج مرتفع',
          type: 'trigger',
          config: { threshold: 80 },
          position: { x: 100, y: 100 },
          connections: ['2']
        },
        {
          id: '2',
          name: 'إرسال تنبيه للمديرين',
          type: 'action',
          config: { action: 'send_notification', recipients: ['admins'] },
          position: { x: 300, y: 100 },
          connections: []
        }
      ],
      runCount: 23,
      successRate: 100,
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-15T14:20:00Z'
    },
    {
      id: '3',
      name: 'توليد التقارير اليومية',
      description: 'إنشاء وإرسال تقارير الأداء اليومية',
      category: 'automation',
      status: 'inactive',
      trigger: 'schedule',
      schedule: '0 8 * * *',
      steps: [
        {
          id: '1',
          name: 'الجدولة اليومية',
          type: 'trigger',
          config: { cron: '0 8 * * *' },
          position: { x: 100, y: 100 },
          connections: ['2']
        },
        {
          id: '2',
          name: 'جمع البيانات',
          type: 'action',
          config: { action: 'collect_metrics' },
          position: { x: 300, y: 100 },
          connections: ['3']
        },
        {
          id: '3',
          name: 'إنشاء التقرير',
          type: 'action',
          config: { action: 'generate_report' },
          position: { x: 500, y: 100 },
          connections: ['4']
        },
        {
          id: '4',
          name: 'إرسال التقرير',
          type: 'action',
          config: { action: 'send_email', template: 'daily_report' },
          position: { x: 700, y: 100 },
          connections: []
        }
      ],
      runCount: 0,
      successRate: 0,
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z'
    }
  ]);

  const [executions, setExecutions] = useState<WorkflowExecution[]>([
    {
      id: '1',
      workflowId: '1',
      status: 'completed',
      startTime: '2024-01-15T15:30:00Z',
      endTime: '2024-01-15T15:30:15Z',
      duration: 15,
      steps: [
        { stepId: '1', status: 'completed', startTime: '2024-01-15T15:30:00Z', endTime: '2024-01-15T15:30:02Z' },
        { stepId: '2', status: 'completed', startTime: '2024-01-15T15:30:02Z', endTime: '2024-01-15T15:30:12Z' },
        { stepId: '3', status: 'completed', startTime: '2024-01-15T15:30:12Z', endTime: '2024-01-15T15:30:15Z' }
      ]
    },
    {
      id: '2',
      workflowId: '2',
      status: 'running',
      startTime: '2024-01-15T15:45:00Z',
      steps: [
        { stepId: '1', status: 'completed', startTime: '2024-01-15T15:45:00Z', endTime: '2024-01-15T15:45:01Z' },
        { stepId: '2', status: 'running', startTime: '2024-01-15T15:45:01Z' }
      ]
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      error: 'destructive',
      running: 'default'
    } as const;

    const labels = {
      active: 'نشط',
      inactive: 'غير نشط',
      error: 'خطأ',
      running: 'يعمل',
      completed: 'مكتمل',
      failed: 'فشل'
    };

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'automation':
        return <Zap className="w-4 h-4 text-blue-600" />;
      case 'notification':
        return <Mail className="w-4 h-4 text-green-600" />;
      case 'integration':
        return <GitBranch className="w-4 h-4 text-purple-600" />;
      case 'monitoring':
        return <BarChart3 className="w-4 h-4 text-orange-600" />;
      default:
        return <Settings className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'trigger':
        return <Play className="w-4 h-4 text-green-600" />;
      case 'action':
        return <Zap className="w-4 h-4 text-blue-600" />;
      case 'condition':
        return <Filter className="w-4 h-4 text-yellow-600" />;
      case 'delay':
        return <Clock className="w-4 h-4 text-gray-600" />;
      default:
        return <Settings className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleToggleWorkflow = (workflowId: string) => {
    setWorkflows(prev => 
      prev.map(w => 
        w.id === workflowId 
          ? { ...w, status: w.status === 'active' ? 'inactive' : 'active' }
          : w
      )
    );
  };

  const handleRunWorkflow = (workflowId: string) => {
    const execution: WorkflowExecution = {
      id: Date.now().toString(),
      workflowId,
      status: 'running',
      startTime: new Date().toISOString(),
      steps: workflows.find(w => w.id === workflowId)?.steps.map(step => ({
        stepId: step.id,
        status: 'pending'
      })) || []
    };
    setExecutions(prev => [execution, ...prev]);
  };

  const filteredWorkflows = workflows.filter(workflow => 
    selectedCategory === 'all' || workflow.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <GitBranch className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">أتمتة سير العمل</h2>
            <p className="text-sm text-gray-600">إنشاء وإدارة عمليات تلقائية ذكية</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="automation">أتمتة</SelectItem>
              <SelectItem value="notification">إشعارات</SelectItem>
              <SelectItem value="integration">تكامل</SelectItem>
              <SelectItem value="monitoring">مراقبة</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 ml-2" />
                سير عمل جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إنشاء سير عمل جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">الاسم</label>
                  <Input placeholder="أدخل اسم سير العمل" />
                </div>
                <div>
                  <label className="text-sm font-medium">الوصف</label>
                  <Textarea placeholder="وصف سير العمل" rows={3} />
                </div>
                <div>
                  <label className="text-sm font-medium">الفئة</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automation">أتمتة</SelectItem>
                      <SelectItem value="notification">إشعارات</SelectItem>
                      <SelectItem value="integration">تكامل</SelectItem>
                      <SelectItem value="monitoring">مراقبة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2 space-x-reverse">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>
                    إنشاء
                  </Button>
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
            <CardTitle className="text-sm font-medium">إجمالي سير العمل</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.length}</div>
            <p className="text-xs text-muted-foreground">
              {workflows.filter(w => w.status === 'active').length} نشط
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العمليات الجارية</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{executions.filter(e => e.status === 'running').length}</div>
            <p className="text-xs text-muted-foreground">
              {executions.filter(e => e.status === 'completed').length} مكتمل اليوم
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل النجاح</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(workflows.reduce((acc, w) => acc + w.successRate, 0) / workflows.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              متوسط جميع سير العمل
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العمليات المنفذة</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.reduce((acc, w) => acc + w.runCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              إجمالي العمليات
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflows List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>سير العمل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredWorkflows.map((workflow) => (
                  <div key={workflow.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 space-x-reverse">
                        <div className="mt-1">
                          {getCategoryIcon(workflow.category)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{workflow.name}</h3>
                            {getStatusBadge(workflow.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Play className="w-3 h-3" />
                              <span>{workflow.runCount} عملية</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>{workflow.successRate.toFixed(1)}% نجاح</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>آخر تشغيل: {workflow.lastRun ? new Date(workflow.lastRun).toLocaleDateString('ar-SA') : 'لم يتم'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            {workflow.steps.slice(0, 3).map((step, index) => (
                              <div key={step.id} className="flex items-center">
                                {getStepIcon(step.type)}
                                {index < workflow.steps.slice(0, 3).length - 1 && (
                                  <ArrowRight className="w-3 h-3 mx-1 text-gray-400" />
                                )}
                              </div>
                            ))}
                            {workflow.steps.length > 3 && (
                              <span className="text-xs text-gray-500">+{workflow.steps.length - 3} خطوات</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Switch
                          checked={workflow.status === 'active'}
                          onCheckedChange={() => handleToggleWorkflow(workflow.id)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRunWorkflow(workflow.id)}
                          disabled={workflow.status !== 'active'}
                        >
                          <Play className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedWorkflow(workflow)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Executions Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">العمليات الحالية</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {executions.map((execution) => {
                    const workflow = workflows.find(w => w.id === execution.workflowId);
                    return (
                      <div key={execution.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{workflow?.name}</span>
                          {getStatusBadge(execution.status)}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          بدأ: {new Date(execution.startTime).toLocaleTimeString('ar-SA')}
                        </div>
                        {execution.duration && (
                          <div className="text-xs text-gray-500 mb-2">
                            المدة: {execution.duration} ثانية
                          </div>
                        )}
                        <div className="space-y-1">
                          {execution.steps.map((step, index) => (
                            <div key={step.stepId} className="flex items-center gap-2 text-xs">
                              {getStepIcon(workflow?.steps.find(s => s.id === step.stepId)?.type || 'action')}
                              <span className="flex-1">
                                الخطوة {index + 1}: {getStatusBadge(step.status)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إحصائيات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">سير العمل النشط</span>
                <span className="font-medium">{workflows.filter(w => w.status === 'active').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">العمليات اليوم</span>
                <span className="font-medium">{executions.filter(e => 
                  new Date(e.startTime).toDateString() === new Date().toDateString()
                ).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">متوسط المدة</span>
                <span className="font-medium">
                  {executions.filter(e => e.duration).length > 0 
                    ? (executions.filter(e => e.duration).reduce((acc, e) => acc + (e.duration || 0), 0) / 
                       executions.filter(e => e.duration).length).toFixed(1)
                    : 0} ثانية
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">معدل الخطأ</span>
                <span className="font-medium text-red-600">
                  {executions.filter(e => e.status === 'failed').length > 0 
                    ? ((executions.filter(e => e.status === 'failed').length / executions.length) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}