'use client';

import { useState, useEffect } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  Play, 
  Pause,
  RefreshCw,
  Clock,
  Calendar,
  HardDrive,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Plus,
  Eye,
  MoreHorizontal,
  Zap,
  Shield,
  Cloud,
  Server,
  Save,
  FolderOpen,
  Search,
  Filter,
  ChevronDown,
  Timer,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Backup {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'completed' | 'running' | 'failed' | 'scheduled';
  size: number;
  location: 'local' | 'cloud' | 'both';
  path?: string;
  cloudProvider?: 'aws' | 'google' | 'azure' | 'custom';
  createdAt: string;
  completedAt?: string;
  duration?: number;
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  includes: string[];
  excludes: string[];
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    time: string;
    enabled: boolean;
  };
  metadata?: {
    tables: number;
    records: number;
    checksum: string;
  };
}

interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupTime: string;
  retentionDays: number;
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  encryptionKey?: string;
  backupLocation: 'local' | 'cloud' | 'both';
  localPath: string;
  cloudProvider: 'aws' | 'google' | 'azure' | 'custom';
  cloudCredentials: {
    accessKey?: string;
    secretKey?: string;
    bucket?: string;
    region?: string;
  };
  notifications: {
    email: boolean;
    onSuccess: boolean;
    onFailure: boolean;
    recipients: string[];
  };
}

interface BackupProgress {
  id: string;
  backupId: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  estimatedTimeRemaining?: number;
  startedAt: string;
}

export function BackupManager() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [backupSettings, setBackupSettings] = useState<BackupSettings>({
    autoBackup: false,
    backupFrequency: 'daily',
    backupTime: '02:00',
    retentionDays: 30,
    compressionEnabled: true,
    encryptionEnabled: false,
    backupLocation: 'local',
    localPath: '/backups',
    cloudProvider: 'aws',
    cloudCredentials: {},
    notifications: {
      email: true,
      onSuccess: true,
      onFailure: true,
      recipients: []
    }
  });
  const [backupProgress, setBackupProgress] = useState<BackupProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('backups');

  // Form state for creating backup
  const [backupForm, setBackupForm] = useState({
    name: '',
    type: 'full' as Backup['type'],
    location: 'local' as Backup['location'],
    compressionEnabled: true,
    encryptionEnabled: false,
    includes: ['database', 'uploads', 'config'],
    excludes: ['cache', 'logs', 'temp']
  });

  useEffect(() => {
    fetchBackups();
    fetchBackupSettings();
    fetchBackupProgress();
  }, []);

  const fetchBackups = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/backups');
      if (response.ok) {
        const data = await response.json();
        setBackups(data);
      }
    } catch (error) {
      console.error('Failed to fetch backups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBackupSettings = async () => {
    try {
      const response = await fetch('/api/admin/backups/settings');
      if (response.ok) {
        const data = await response.json();
        setBackupSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch backup settings:', error);
    }
  };

  const fetchBackupProgress = async () => {
    try {
      const response = await fetch('/api/admin/backups/progress');
      if (response.ok) {
        const data = await response.json();
        setBackupProgress(data);
      }
    } catch (error) {
      console.error('Failed to fetch backup progress:', error);
    }
  };

  const handleCreateBackup = async () => {
    try {
      const response = await fetch('/api/admin/backups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backupForm),
      });

      if (response.ok) {
        await fetchBackups();
        setIsCreateDialogOpen(false);
        resetBackupForm();
      }
    } catch (error) {
      console.error('Failed to create backup:', error);
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    try {
      const response = await fetch(`/api/admin/backups/${backupId}/restore`, {
        method: 'POST',
      });

      if (response.ok) {
        // Show success message
      }
    } catch (error) {
      console.error('Failed to restore backup:', error);
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    try {
      const response = await fetch(`/api/admin/backups/${backupId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBackups(prev => prev.filter(backup => backup.id !== backupId));
      }
    } catch (error) {
      console.error('Failed to delete backup:', error);
    }
  };

  const handleDownloadBackup = async (backupId: string) => {
    try {
      const response = await fetch(`/api/admin/backups/${backupId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = backups.find(b => b.id === backupId)?.name || 'backup.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to download backup:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/admin/backups/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backupSettings),
      });

      if (response.ok) {
        setIsSettingsDialogOpen(false);
        // Show success message
      }
    } catch (error) {
      console.error('Failed to save backup settings:', error);
    }
  };

  const resetBackupForm = () => {
    setBackupForm({
      name: '',
      type: 'full',
      location: 'local',
      compressionEnabled: true,
      encryptionEnabled: false,
      includes: ['database', 'uploads', 'config'],
      excludes: ['cache', 'logs', 'temp']
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; text: string }> = {
      completed: { variant: "default", text: "مكتمل" },
      running: { variant: "secondary", text: "قيد التشغيل" },
      failed: { variant: "destructive", text: "فشل" },
      scheduled: { variant: "outline", text: "مجدول" }
    };
    const config = variants[status] || variants.completed;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; text: string }> = {
      full: { variant: "default", text: "كامل" },
      incremental: { variant: "secondary", text: "تزايدي" },
      differential: { variant: "outline", text: "تفاضلي" }
    };
    const config = variants[type] || variants.full;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds} ثانية`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} دقيقة`;
    return `${Math.floor(seconds / 3600)} ساعة`;
  };

  const filteredBackups = backups.filter(backup => {
    const matchesSearch = backup.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || backup.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || backup.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const runningBackups = backupProgress.filter(progress => progress.status === 'running');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">مدير النسخ الاحتياطي</h3>
          <p className="text-sm text-muted-foreground">إدارة نسخ البيانات الاحتياطية</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 ml-2" />
                الإعدادات
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إعدادات النسخ الاحتياطي</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>النسخ التلقائي</Label>
                      <p className="text-sm text-muted-foreground">تفعيل النسخ الاحتياطي التلقائي</p>
                    </div>
                    <Switch
                      checked={backupSettings.autoBackup}
                      onCheckedChange={(checked) => 
                        setBackupSettings(prev => ({ ...prev, autoBackup: checked }))
                      }
                    />
                  </div>

                  {backupSettings.autoBackup && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="backupFrequency">التكرار</Label>
                        <Select 
                          value={backupSettings.backupFrequency} 
                          onValueChange={(value: any) => 
                            setBackupSettings(prev => ({ ...prev, backupFrequency: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">يومياً</SelectItem>
                            <SelectItem value="weekly">أسبوعياً</SelectItem>
                            <SelectItem value="monthly">شهرياً</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="backupTime">الوقت</Label>
                        <Input
                          id="backupTime"
                          type="time"
                          value={backupSettings.backupTime}
                          onChange={(e) => 
                            setBackupSettings(prev => ({ ...prev, backupTime: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="retentionDays">فترة الاحتفاظ (أيام)</Label>
                    <Input
                      id="retentionDays"
                      type="number"
                      value={backupSettings.retentionDays}
                      onChange={(e) => 
                        setBackupSettings(prev => ({ ...prev, retentionDays: parseInt(e.target.value) }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>الضغط</Label>
                      <p className="text-sm text-muted-foreground">ضغط ملفات النسخ الاحتياطي</p>
                    </div>
                    <Switch
                      checked={backupSettings.compressionEnabled}
                      onCheckedChange={(checked) => 
                        setBackupSettings(prev => ({ ...prev, compressionEnabled: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>التشفير</Label>
                      <p className="text-sm text-muted-foreground">تشفير ملفات النسخ الاحتياطي</p>
                    </div>
                    <Switch
                      checked={backupSettings.encryptionEnabled}
                      onCheckedChange={(checked) => 
                        setBackupSettings(prev => ({ ...prev, encryptionEnabled: checked }))
                      }
                    />
                  </div>

                  {backupSettings.encryptionEnabled && (
                    <div>
                      <Label htmlFor="encryptionKey">مفتاح التشفير</Label>
                      <Input
                        id="encryptionKey"
                        type="password"
                        value={backupSettings.encryptionKey || ''}
                        onChange={(e) => 
                          setBackupSettings(prev => ({ ...prev, encryptionKey: e.target.value }))
                        }
                        placeholder="أدخل مفتاح التشفير"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="backupLocation">موقع التخزين</Label>
                    <Select 
                      value={backupSettings.backupLocation} 
                      onValueChange={(value: any) => 
                        setBackupSettings(prev => ({ ...prev, backupLocation: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">محلي</SelectItem>
                        <SelectItem value="cloud">سحابي</SelectItem>
                        <SelectItem value="both">كلاهما</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(backupSettings.backupLocation === 'local' || backupSettings.backupLocation === 'both') && (
                    <div>
                      <Label htmlFor="localPath">المسار المحلي</Label>
                      <Input
                        id="localPath"
                        value={backupSettings.localPath}
                        onChange={(e) => 
                          setBackupSettings(prev => ({ ...prev, localPath: e.target.value }))
                        }
                      />
                    </div>
                  )}

                  {(backupSettings.backupLocation === 'cloud' || backupSettings.backupLocation === 'both') && (
                    <div>
                      <Label htmlFor="cloudProvider">مزود السحابة</Label>
                      <Select 
                        value={backupSettings.cloudProvider} 
                        onValueChange={(value: any) => 
                          setBackupSettings(prev => ({ ...prev, cloudProvider: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aws">Amazon S3</SelectItem>
                          <SelectItem value="google">Google Cloud</SelectItem>
                          <SelectItem value="azure">Azure Blob</SelectItem>
                          <SelectItem value="custom">مخصص</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ الإعدادات
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetBackupForm}>
                <Plus className="w-4 h-4 ml-2" />
                نسخة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إنشاء نسخة احتياطية جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="backupName">اسم النسخة</Label>
                  <Input
                    id="backupName"
                    value={backupForm.name}
                    onChange={(e) => setBackupForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="أدخل اسم النسخة الاحتياطية"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="backupType">النوع</Label>
                    <Select 
                      value={backupForm.type} 
                      onValueChange={(value: any) => setBackupForm(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">كامل</SelectItem>
                        <SelectItem value="incremental">تزايدي</SelectItem>
                        <SelectItem value="differential">تفاضلي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="backupLocation">الموقع</Label>
                    <Select 
                      value={backupForm.location} 
                      onValueChange={(value: any) => setBackupForm(prev => ({ ...prev, location: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">محلي</SelectItem>
                        <SelectItem value="cloud">سحابي</SelectItem>
                        <SelectItem value="both">كلاهما</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>الضغط</Label>
                      <p className="text-sm text-muted-foreground">ضغط الملفات لتوفير المساحة</p>
                    </div>
                    <Switch
                      checked={backupForm.compressionEnabled}
                      onCheckedChange={(checked) => setBackupForm(prev => ({ ...prev, compressionEnabled: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>التشفير</Label>
                      <p className="text-sm text-muted-foreground">تشفير الملفات للأمان</p>
                    </div>
                    <Switch
                      checked={backupForm.encryptionEnabled}
                      onCheckedChange={(checked) => setBackupForm(prev => ({ ...prev, encryptionEnabled: checked }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleCreateBackup}>
                    <Play className="w-4 h-4 ml-2" />
                    بدء النسخ
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Running Backups */}
      {runningBackups.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium">النسخ قيد التشغيل</h4>
          <div className="grid gap-4">
            {runningBackups.map((progress) => (
              <Card key={progress.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">
                        {backups.find(b => b.id === progress.backupId)?.name || 'نسخة احتياطية'}
                      </span>
                    </div>
                    <Badge variant="secondary">{progress.currentStep}</Badge>
                  </div>
                  <Progress value={progress.progress} className="mb-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{progress.progress}% مكتمل</span>
                    {progress.estimatedTimeRemaining && (
                      <span>متبقي: {formatDuration(progress.estimatedTimeRemaining)}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="backups">النسخ الاحتياطية</TabsTrigger>
          <TabsTrigger value="schedule">الجدولة</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        {/* Backups Tab */}
        <TabsContent value="backups" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="بحث عن نسخ احتياطية..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="full">كامل</SelectItem>
                <SelectItem value="incremental">تزايدي</SelectItem>
                <SelectItem value="differential">تفاضلي</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="running">قيد التشغيل</SelectItem>
                <SelectItem value="failed">فشل</SelectItem>
                <SelectItem value="scheduled">مجدول</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Backups Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الحجم</TableHead>
                    <TableHead>الموقع</TableHead>
                    <TableHead>الإنشاء</TableHead>
                    <TableHead>المدة</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBackups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-blue-500" />
                          <div>
                            <div className="font-medium">{backup.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {backup.compressionEnabled && 'مضغوط'}
                              {backup.encryptionEnabled && ' • مشفر'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(backup.type)}</TableCell>
                      <TableCell>{getStatusBadge(backup.status)}</TableCell>
                      <TableCell>{formatFileSize(backup.size)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {backup.location === 'local' && <HardDrive className="w-4 h-4" />}
                          {backup.location === 'cloud' && <Cloud className="w-4 h-4" />}
                          {backup.location === 'both' && <Server className="w-4 h-4" />}
                          <span className="text-sm">{backup.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(backup.createdAt).toLocaleDateString('ar-SA')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(backup.createdAt).toLocaleTimeString('ar-SA')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {backup.duration ? (
                          <div className="text-sm">{formatDuration(backup.duration)}</div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleDownloadBackup(backup.id)}>
                              <Download className="w-4 h-4 ml-2" />
                              تحميل
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRestoreBackup(backup.id)}>
                              <RefreshCw className="w-4 h-4 ml-2" />
                              استعادة
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 ml-2" />
                              التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteBackup(backup.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 ml-2" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                جدولة النسخ الاحتياطي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">النسخ الاحتياطي التلقائي</h4>
                    <p className="text-sm text-muted-foreground">
                      {backupSettings.autoBackup 
                        ? `يعمل ${backupSettings.backupFrequency} في ${backupSettings.backupTime}`
                        : 'معطل'
                      }
                    </p>
                  </div>
                  <Switch
                    checked={backupSettings.autoBackup}
                    onCheckedChange={(checked) => 
                      setBackupSettings(prev => ({ ...prev, autoBackup: checked }))
                    }
                  />
                </div>

                {backupSettings.autoBackup && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="backupFrequency">التكرار</Label>
                      <Select 
                        value={backupSettings.backupFrequency} 
                        onValueChange={(value: any) => 
                          setBackupSettings(prev => ({ ...prev, backupFrequency: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">يومياً</SelectItem>
                          <SelectItem value="weekly">أسبوعياً</SelectItem>
                          <SelectItem value="monthly">شهرياً</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="backupTime">الوقت</Label>
                      <Input
                        id="backupTime"
                        type="time"
                        value={backupSettings.backupTime}
                        onChange={(e) => 
                          setBackupSettings(prev => ({ ...prev, backupTime: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ الجدولة
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                إعدادات النسخ الاحتياطي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="retentionDays">فترة الاحتفاظ (أيام)</Label>
                    <Input
                      id="retentionDays"
                      type="number"
                      value={backupSettings.retentionDays}
                      onChange={(e) => 
                        setBackupSettings(prev => ({ ...prev, retentionDays: parseInt(e.target.value) }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>الضغط</Label>
                      <p className="text-sm text-muted-foreground">ضغط ملفات النسخ الاحتياطي</p>
                    </div>
                    <Switch
                      checked={backupSettings.compressionEnabled}
                      onCheckedChange={(checked) => 
                        setBackupSettings(prev => ({ ...prev, compressionEnabled: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>التشفير</Label>
                      <p className="text-sm text-muted-foreground">تشفير ملفات النسخ الاحتياطي</p>
                    </div>
                    <Switch
                      checked={backupSettings.encryptionEnabled}
                      onCheckedChange={(checked) => 
                        setBackupSettings(prev => ({ ...prev, encryptionEnabled: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ الإعدادات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}