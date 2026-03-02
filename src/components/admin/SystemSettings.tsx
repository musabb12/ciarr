'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Globe, 
  Mail, 
  Shield, 
  Database,
  Bell,
  Palette,
  Users,
  Clock,
  Smartphone,
  Monitor,
  Key,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Zap,
  HardDrive,
  Wifi,
  Cloud,
  FileText,
  Image,
  Video,
  Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';

interface SystemSetting {
  key: string;
  value: string | number | boolean;
  type: 'string' | 'number' | 'boolean' | 'json';
  category: string;
  description: string;
}

interface SystemInfo {
  version: string;
  environment: string;
  uptime: string;
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
  cpu: {
    usage: number;
    cores: number;
  };
  database: {
    status: 'connected' | 'disconnected' | 'error';
    size: string;
    connections: number;
  };
}

export function SystemSettings() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);

  // Form states for different categories
  const [generalSettings, setGeneralSettings] = useState({
    siteName: '',
    siteDescription: '',
    siteUrl: '',
    adminEmail: '',
    timezone: '',
    language: 'ar',
    maintenanceMode: false,
    debugMode: false
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    smtpEncryption: 'tls',
    fromEmail: '',
    fromName: '',
    emailQueueEnabled: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    enable2FA: false,
    sessionTimeout: 30,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    enableCaptcha: false
  });

  const [storageSettings, setStorageSettings] = useState({
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'png', 'gif', 'pdf', 'doc', 'docx'],
    storagePath: '/uploads',
    enableImageCompression: true,
    imageQuality: 80,
    enableVideoProcessing: false,
    autoCleanup: true,
    cleanupDays: 30
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    notificationFrequency: 'immediate',
    enableDigest: false,
    digestFrequency: 'daily'
  });

  useEffect(() => {
    fetchSettings();
    fetchSystemInfo();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        
        // Populate form states
        data.forEach((setting: SystemSetting) => {
          switch (setting.category) {
            case 'general':
              setGeneralSettings(prev => ({ ...prev, [setting.key]: setting.value }));
              break;
            case 'email':
              setEmailSettings(prev => ({ ...prev, [setting.key]: setting.value }));
              break;
            case 'security':
              setSecuritySettings(prev => ({ ...prev, [setting.key]: setting.value }));
              break;
            case 'storage':
              setStorageSettings(prev => ({ ...prev, [setting.key]: setting.value }));
              break;
            case 'notifications':
              setNotificationSettings(prev => ({ ...prev, [setting.key]: setting.value }));
              break;
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSystemInfo = async () => {
    try {
      const response = await fetch('/api/admin/system-info');
      if (response.ok) {
        const data = await response.json();
        setSystemInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch system info:', error);
    }
  };

  const handleSaveSettings = async (category: string, settingsData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          settings: settingsData
        }),
      });

      if (response.ok) {
        setHasChanges(false);
        // Show success message
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      const response = await fetch('/api/admin/settings/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailSettings),
      });

      if (response.ok) {
        // Show success message
      }
    } catch (error) {
      console.error('Failed to test email:', error);
    }
  };

  const handleClearCache = async () => {
    try {
      const response = await fetch('/api/admin/settings/clear-cache', {
        method: 'POST',
      });

      if (response.ok) {
        // Show success message
        await fetchSystemInfo();
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  const handleRestartSystem = async () => {
    try {
      const response = await fetch('/api/admin/settings/restart', {
        method: 'POST',
      });

      if (response.ok) {
        // Show success message
      }
    } catch (error) {
      console.error('Failed to restart system:', error);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">إعدادات النظام</h3>
          <p className="text-sm text-muted-foreground">تكوين وإدارة إعدادات النظام</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleClearCache}>
            <RefreshCw className="w-4 h-4 ml-2" />
            مسح التخزين المؤقت
          </Button>
          <Button variant="outline" onClick={fetchSystemInfo}>
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* System Info */}
      {systemInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">النسخة</CardTitle>
              <Info className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemInfo.version}</div>
              <p className="text-xs text-muted-foreground">
                {systemInfo.environment}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الذاكرة</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemInfo.memory.percentage}%</div>
              <p className="text-xs text-muted-foreground">
                {formatBytes(systemInfo.memory.used)} / {formatBytes(systemInfo.memory.total)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">القرص</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemInfo.disk.percentage}%</div>
              <p className="text-xs text-muted-foreground">
                {formatBytes(systemInfo.disk.used)} / {formatBytes(systemInfo.disk.total)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">قاعدة البيانات</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {systemInfo.database.status === 'connected' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm font-medium">
                  {systemInfo.database.status === 'connected' ? 'متصلة' : 'غير متصلة'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {systemInfo.database.connections} اتصال
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="email">البريد</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
          <TabsTrigger value="storage">التخزين</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                الإعدادات العامة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">اسم الموقع</Label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) => {
                      setGeneralSettings(prev => ({ ...prev, siteName: e.target.value }));
                      setHasChanges(true);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="siteUrl">رابط الموقع</Label>
                  <Input
                    id="siteUrl"
                    value={generalSettings.siteUrl}
                    onChange={(e) => {
                      setGeneralSettings(prev => ({ ...prev, siteUrl: e.target.value }));
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="siteDescription">وصف الموقع</Label>
                <Textarea
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) => {
                    setGeneralSettings(prev => ({ ...prev, siteDescription: e.target.value }));
                    setHasChanges(true);
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adminEmail">البريد الإلكتروني للمدير</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={generalSettings.adminEmail}
                    onChange={(e) => {
                      setGeneralSettings(prev => ({ ...prev, adminEmail: e.target.value }));
                      setHasChanges(true);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">المنطقة الزمنية</Label>
                  <Select value={generalSettings.timezone} onValueChange={(value) => {
                    setGeneralSettings(prev => ({ ...prev, timezone: value }));
                    setHasChanges(true);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المنطقة الزمنية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Riyadh">الرياض</SelectItem>
                      <SelectItem value="Asia/Dubai">دبي</SelectItem>
                      <SelectItem value="Asia/Cairo">القاهرة</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>وضع الصيانة</Label>
                  <p className="text-sm text-muted-foreground">إيقاف الموقع مؤقتاً للصيانة</p>
                </div>
                <Switch
                  checked={generalSettings.maintenanceMode}
                  onCheckedChange={(checked) => {
                    setGeneralSettings(prev => ({ ...prev, maintenanceMode: checked }));
                    setHasChanges(true);
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>وضع التصحيح</Label>
                  <p className="text-sm text-muted-foreground">عرض معلومات التصحيح للمطورين</p>
                </div>
                <Switch
                  checked={generalSettings.debugMode}
                  onCheckedChange={(checked) => {
                    setGeneralSettings(prev => ({ ...prev, debugMode: checked }));
                    setHasChanges(true);
                  }}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSaveSettings('general', generalSettings)}
                  disabled={!hasChanges || isLoading}
                >
                  <Save className="w-4 h-4 ml-2" />
                  حفظ الإعدادات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                إعدادات البريد الإلكتروني
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">خادم SMTP</Label>
                  <Input
                    id="smtpHost"
                    value={emailSettings.smtpHost}
                    onChange={(e) => {
                      setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }));
                      setHasChanges(true);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">منفذ SMTP</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) => {
                      setEmailSettings(prev => ({ ...prev, smtpPort: parseInt(e.target.value) }));
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpUsername">اسم المستخدم</Label>
                  <Input
                    id="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={(e) => {
                      setEmailSettings(prev => ({ ...prev, smtpUsername: e.target.value }));
                      setHasChanges(true);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">كلمة المرور</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => {
                      setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }));
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromEmail">البريد المرسل</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => {
                      setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }));
                      setHasChanges(true);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="fromName">اسم المرسل</Label>
                  <Input
                    id="fromName"
                    value={emailSettings.fromName}
                    onChange={(e) => {
                      setEmailSettings(prev => ({ ...prev, fromName: e.target.value }));
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="smtpEncryption">التشفير</Label>
                <Select value={emailSettings.smtpEncryption} onValueChange={(value: any) => {
                  setEmailSettings(prev => ({ ...prev, smtpEncryption: value }));
                  setHasChanges(true);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">بدون تشفير</SelectItem>
                    <SelectItem value="tls">TLS</SelectItem>
                    <SelectItem value="ssl">SSL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>تفعيل قائمة الانتظار</Label>
                  <p className="text-sm text-muted-foreground">إرسال الرسائل عبر قائمة الانتظار</p>
                </div>
                <Switch
                  checked={emailSettings.emailQueueEnabled}
                  onCheckedChange={(checked) => {
                    setEmailSettings(prev => ({ ...prev, emailQueueEnabled: checked }));
                    setHasChanges(true);
                  }}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSaveSettings('email', emailSettings)}
                  disabled={!hasChanges || isLoading}
                >
                  <Save className="w-4 h-4 ml-2" />
                  حفظ الإعدادات
                </Button>
                <Button variant="outline" onClick={handleTestEmail}>
                  <Mail className="w-4 h-4 ml-2" />
                  اختبار البريد
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                إعدادات الأمان
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>المصادقة الثنائية</Label>
                  <p className="text-sm text-muted-foreground">تفعيل المصادقة الثنائية للمستخدمين</p>
                </div>
                <Switch
                  checked={securitySettings.enable2FA}
                  onCheckedChange={(checked) => {
                    setSecuritySettings(prev => ({ ...prev, enable2FA: checked }));
                    setHasChanges(true);
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">مدة الجلسة (دقيقة)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => {
                      setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }));
                      setHasChanges(true);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="passwordMinLength">الحد الأدنى لطول كلمة المرور</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => {
                      setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }));
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxLoginAttempts">الحد الأقصى لمحاولات الدخول</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => {
                      setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }));
                      setHasChanges(true);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="lockoutDuration">مدة الحظر (دقيقة)</Label>
                  <Input
                    id="lockoutDuration"
                    type="number"
                    value={securitySettings.lockoutDuration}
                    onChange={(e) => {
                      setSecuritySettings(prev => ({ ...prev, lockoutDuration: parseInt(e.target.value) }));
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>متطلبات كلمة المرور</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm">حروف كبيرة</span>
                  <Switch
                    checked={securitySettings.passwordRequireUppercase}
                    onCheckedChange={(checked) => {
                      setSecuritySettings(prev => ({ ...prev, passwordRequireUppercase: checked }));
                      setHasChanges(true);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">أرقام</span>
                  <Switch
                    checked={securitySettings.passwordRequireNumbers}
                    onCheckedChange={(checked) => {
                      setSecuritySettings(prev => ({ ...prev, passwordRequireNumbers: checked }));
                      setHasChanges(true);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">رموز</span>
                  <Switch
                    checked={securitySettings.passwordRequireSymbols}
                    onCheckedChange={(checked) => {
                      setSecuritySettings(prev => ({ ...prev, passwordRequireSymbols: checked }));
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>تفعيل CAPTCHA</Label>
                  <p className="text-sm text-muted-foreground">حماية من الروبوتات</p>
                </div>
                <Switch
                  checked={securitySettings.enableCaptcha}
                  onCheckedChange={(checked) => {
                    setSecuritySettings(prev => ({ ...prev, enableCaptcha: checked }));
                    setHasChanges(true);
                  }}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSaveSettings('security', securitySettings)}
                  disabled={!hasChanges || isLoading}
                >
                  <Save className="w-4 h-4 ml-2" />
                  حفظ الإعدادات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Storage Settings */}
        <TabsContent value="storage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                إعدادات التخزين
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxFileSize">الحد الأقصى لحجم الملف (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={storageSettings.maxFileSize}
                    onChange={(e) => {
                      setStorageSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }));
                      setHasChanges(true);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="storagePath">مسار التخزين</Label>
                  <Input
                    id="storagePath"
                    value={storageSettings.storagePath}
                    onChange={(e) => {
                      setStorageSettings(prev => ({ ...prev, storagePath: e.target.value }));
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>

              <div>
                <Label>جودة الصورة المضغوطة</Label>
                <div className="mt-2">
                  <Slider
                    value={[storageSettings.imageQuality]}
                    onValueChange={(value) => {
                      setStorageSettings(prev => ({ ...prev, imageQuality: value[0] }));
                      setHasChanges(true);
                    }}
                    max={100}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>منخفض</span>
                    <span>{storageSettings.imageQuality}%</span>
                    <span>عالي</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>أنواع الملفات المسموحة</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['jpg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx'].map((type) => (
                    <div key={type} className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="checkbox"
                        id={type}
                        checked={storageSettings.allowedFileTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setStorageSettings(prev => ({ 
                              ...prev, 
                              allowedFileTypes: [...prev.allowedFileTypes, type] 
                            }));
                          } else {
                            setStorageSettings(prev => ({ 
                              ...prev, 
                              allowedFileTypes: prev.allowedFileTypes.filter(t => t !== type) 
                            }));
                          }
                          setHasChanges(true);
                        }}
                      />
                      <Label htmlFor={type} className="text-sm">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>ضغط الصور</Label>
                    <p className="text-sm text-muted-foreground">ضغط الصور تلقائياً عند الرفع</p>
                  </div>
                  <Switch
                    checked={storageSettings.enableImageCompression}
                    onCheckedChange={(checked) => {
                      setStorageSettings(prev => ({ ...prev, enableImageCompression: checked }));
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>معالجة الفيديو</Label>
                    <p className="text-sm text-muted-foreground">معالجة الفيديوهات تلقائياً</p>
                  </div>
                  <Switch
                    checked={storageSettings.enableVideoProcessing}
                    onCheckedChange={(checked) => {
                      setStorageSettings(prev => ({ ...prev, enableVideoProcessing: checked }));
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>التنظيف التلقائي</Label>
                    <p className="text-sm text-muted-foreground">حذف الملفات القديمة تلقائياً</p>
                  </div>
                  <Switch
                    checked={storageSettings.autoCleanup}
                    onCheckedChange={(checked) => {
                      setStorageSettings(prev => ({ ...prev, autoCleanup: checked }));
                      setHasChanges(true);
                    }}
                  />
                </div>

                {storageSettings.autoCleanup && (
                  <div>
                    <Label htmlFor="cleanupDays">فترة التنظيف (يوم)</Label>
                    <Input
                      id="cleanupDays"
                      type="number"
                      value={storageSettings.cleanupDays}
                      onChange={(e) => {
                        setStorageSettings(prev => ({ ...prev, cleanupDays: parseInt(e.target.value) }));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSaveSettings('storage', storageSettings)}
                  disabled={!hasChanges || isLoading}
                >
                  <Save className="w-4 h-4 ml-2" />
                  حفظ الإعدادات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                إعدادات الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>الإشعارات البريدية</Label>
                    <p className="text-sm text-muted-foreground">إرسال الإشعارات عبر البريد الإلكتروني</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => {
                      setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }));
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>الإشعارات الفورية</Label>
                    <p className="text-sm text-muted-foreground">إرسال الإشعارات الفورية في المتصفح</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => {
                      setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }));
                      setHasChanges(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>الإشعارات النصية</Label>
                    <p className="text-sm text-muted-foreground">إرسال الإشعارات عبر الرسائل النصية</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => {
                      setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }));
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notificationFrequency">تكرار الإشعارات</Label>
                <Select value={notificationSettings.notificationFrequency} onValueChange={(value: any) => {
                  setNotificationSettings(prev => ({ ...prev, notificationFrequency: value }));
                  setHasChanges(true);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">فوري</SelectItem>
                    <SelectItem value="hourly">كل ساعة</SelectItem>
                    <SelectItem value="daily">يومياً</SelectItem>
                    <SelectItem value="weekly">أسبوعياً</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>تفعيل الملخص</Label>
                    <p className="text-sm text-muted-foreground">إرسال ملخص دوري للإشعارات</p>
                  </div>
                  <Switch
                    checked={notificationSettings.enableDigest}
                    onCheckedChange={(checked) => {
                      setNotificationSettings(prev => ({ ...prev, enableDigest: checked }));
                      setHasChanges(true);
                    }}
                  />
                </div>

                {notificationSettings.enableDigest && (
                  <div>
                    <Label htmlFor="digestFrequency">تكرار الملخص</Label>
                    <Select value={notificationSettings.digestFrequency} onValueChange={(value: any) => {
                      setNotificationSettings(prev => ({ ...prev, digestFrequency: value }));
                      setHasChanges(true);
                    }}>
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
                )}
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSaveSettings('notifications', notificationSettings)}
                  disabled={!hasChanges || isLoading}
                >
                  <Save className="w-4 h-4 ml-2" />
                  حفظ الإعدادات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}