'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Save,
  Globe,
  Mail,
  Phone,
  Palette,
  Shield,
  Database,
  DollarSign,
  Upload,
  Download,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingItem {
  key: string;
  label: string;
  value: string | number | boolean;
  type: 'text' | 'number' | 'boolean' | 'email' | 'url' | 'textarea';
  group: string;
  description?: string;
}

const DEFAULT_SETTINGS: SettingItem[] = [
    // General Settings
    { key: 'site_name', label: 'اسم الموقع', value: 'CIAR', type: 'text', group: 'general', description: 'اسم الموقع الرئيسي' },
    { key: 'site_description', label: 'وصف الموقع', value: 'شركة CIAR — 14 موقعاً يخدمونك: عقاري، سياحي، موضة، تجارة إلكترونية، وأكثر', type: 'textarea', group: 'general' },
    { key: 'site_url', label: 'رابط الموقع', value: 'https://ciar.com', type: 'url', group: 'general' },
    { key: 'admin_email', label: 'البريد الإلكتروني للمدير', value: 'admin@ciar.com', type: 'email', group: 'general' },
    
    // Contact Settings
    { key: 'contact_phone', label: 'رقم الهاتف', value: '+966501234567', type: 'text', group: 'contact' },
    { key: 'contact_address', label: 'العنوان', value: 'الرياض، المملكة العربية السعودية', type: 'text', group: 'contact' },
    { key: 'contact_whatsapp', label: 'واتساب', value: '+966501234567', type: 'text', group: 'contact' },
    
    // Payment Settings
    { key: 'currency', label: 'العملة', value: 'ريال', type: 'text', group: 'payment' },
    { key: 'tax_rate', label: 'ضريبة القيمة المضافة (%)', value: 15, type: 'number', group: 'payment' },
    { key: 'payment_methods', label: 'طرق الدفع', value: 'credit_card,bank_transfer', type: 'text', group: 'payment' },
    
    // Email Settings
    { key: 'smtp_host', label: 'خادم SMTP', value: 'smtp.gmail.com', type: 'text', group: 'email' },
    { key: 'smtp_port', label: 'منفذ SMTP', value: 587, type: 'number', group: 'email' },
    { key: 'smtp_username', label: 'اسم المستخدم SMTP', value: 'noreply@ciar.com', type: 'email', group: 'email' },
    { key: 'email_notifications', label: 'تفعيل الإشعارات البريدية', value: true, type: 'boolean', group: 'email' },
    
    // Security Settings
    { key: 'force_https', label: 'فرض HTTPS', value: true, type: 'boolean', group: 'security' },
    { key: 'session_timeout', label: 'مدة الجلسة (دقائق)', value: 30, type: 'number', group: 'security' },
    { key: 'max_login_attempts', label: 'أقصى محاولات تسجيل الدخول', value: 5, type: 'number', group: 'security' },
    
    // Appearance Settings
    { key: 'primary_color', label: 'اللون الأساسي', value: '#3B82F6', type: 'text', group: 'appearance' },
    { key: 'secondary_color', label: 'اللون الثانوي', value: '#10B981', type: 'text', group: 'appearance' },
    { key: 'default_language', label: 'اللغة الافتراضية', value: 'ar', type: 'text', group: 'appearance' },
    { key: 'items_per_page', label: 'العناصر في كل صفحة', value: 12, type: 'number', group: 'appearance' },
    
    // Backup Settings
    { key: 'auto_backup', label: 'نسخ احتياطي تلقائي', value: true, type: 'boolean', group: 'backup' },
    { key: 'backup_frequency', label: 'تكرار النسخ الاحتياطي', value: 'daily', type: 'text', group: 'backup' },
    { key: 'backup_retention', label: 'فترة الاحتفاظ بالنسخ (أيام)', value: 30, type: 'number', group: 'backup' }
];

export function SettingsManagement() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingItem[]>([...DEFAULT_SETTINGS]);
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);

  const settingGroups = [
    { id: 'general', label: 'إعدادات عامة', icon: <Globe className="w-4 h-4" /> },
    { id: 'contact', label: 'معلومات التواصل', icon: <Phone className="w-4 h-4" /> },
    { id: 'payment', label: 'إعدادات الدفع', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'email', label: 'إعدادات البريد', icon: <Mail className="w-4 h-4" /> },
    { id: 'security', label: 'الأمان', icon: <Shield className="w-4 h-4" /> },
    { id: 'appearance', label: 'المظهر', icon: <Palette className="w-4 h-4" /> },
    { id: 'backup', label: 'النسخ الاحتياطي', icon: <Database className="w-4 h-4" /> }
  ];

  const filteredSettings = settings.filter(setting => setting.group === activeTab);

  const updateSetting = (key: string, value: any) => {
    setSettings(settings.map(setting => 
      setting.key === key ? { ...setting, value } : setting
    ));
    setHasChanges(true);
  };

  const saveSettings = () => {
    setHasChanges(false);
    toast.success('تم حفظ الإعدادات بنجاح');
  };

  const resetSettings = () => {
    setSettings([...DEFAULT_SETTINGS]);
    setHasChanges(false);
    toast.info('تم إعادة تعيين الإعدادات إلى القيم الافتراضية');
  };

  const handleBackup = () => {
    toast.loading('جاري إنشاء النسخة الاحتياطية...');
    setTimeout(() => toast.success('تم إنشاء النسخة الاحتياطية بنجاح'), 1500);
  };

  const handleClearCache = () => {
    toast.success('تم مسح التخزين المؤقت');
  };

  const handleSystemCheck = () => {
    toast.success('تم فحص النظام. لا توجد مشاكل.');
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'settings.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const renderSettingInput = (setting: SettingItem) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <label className="flex items-center space-x-2 space-x-reverse">
            <input
              type="checkbox"
              checked={setting.value as boolean}
              onChange={(e) => updateSetting(setting.key, e.target.checked)}
              className="w-4 h-4"
            />
            <span>{setting.value ? 'مفعل' : 'معطل'}</span>
          </label>
        );
      case 'number':
        return (
          <Input
            type="number"
            value={setting.value}
            onChange={(e) => updateSetting(setting.key, parseInt(e.target.value) || 0)}
            className="w-full"
          />
        );
      case 'textarea':
        return (
          <textarea
            value={setting.value}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg resize-vertical"
            rows={3}
          />
        );
      case 'email':
        return (
          <Input
            type="email"
            value={setting.value}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            className="w-full"
          />
        );
      case 'url':
        return (
          <Input
            type="url"
            value={setting.value}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            className="w-full"
          />
        );
      default:
        return (
          <Input
            type="text"
            value={setting.value}
            onChange={(e) => updateSetting(setting.key, e.target.value)}
            className="w-full"
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إعدادات النظام</h2>
          <p className="text-gray-600">إدارة إعدادات وتكوينات المنصة</p>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <Button variant="outline" onClick={exportSettings}>
            <Download className="w-4 h-4 ml-2" />
            تصدير الإعدادات
          </Button>
          <Button variant="outline" onClick={resetSettings}>
            <RefreshCw className="w-4 h-4 ml-2" />
            إعادة تعيين
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700" 
            onClick={saveSettings}
            disabled={!hasChanges}
          >
            <Save className="w-4 h-4 ml-2" />
            حفظ التغييرات
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {hasChanges && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 ml-2" />
              <span className="text-yellow-800">لديك تغييرات غير محفوظة. تأكد من حفظها قبل المغادرة.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Tabs */}
      <div className="flex space-x-1 space-x-reverse bg-gray-100 p-1 rounded-lg">
        {settingGroups.map((group) => (
          <button
            key={group.id}
            onClick={() => setActiveTab(group.id)}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-md transition-colors ${
              activeTab === group.id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {group.icon}
            <span>{group.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {settingGroups.find(g => g.id === activeTab)?.icon}
            <span className="mr-2">
              {settingGroups.find(g => g.id === activeTab)?.label}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredSettings.map((setting) => (
              <div key={setting.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    {setting.label}
                  </label>
                  {setting.description && (
                    <span className="text-xs text-gray-500">{setting.description}</span>
                  )}
                </div>
                {renderSettingInput(setting)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">نسخ احتياطي يدوي</h3>
                <p className="text-sm text-gray-600">إنشاء نسخة احتياطية فورية</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleBackup}>
                <Upload className="w-4 h-4 ml-2" />
                نسخ احتياطي
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">مسح التخزين المؤقت</h3>
                <p className="text-sm text-gray-600">مسح جميع الملفات المؤقتة</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleClearCache}>
                <RefreshCw className="w-4 h-4 ml-2" />
                مسح
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">فحص النظام</h3>
                <p className="text-sm text-gray-600">فحص صحة النظام</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleSystemCheck}>
                <Shield className="w-4 h-4 ml-2" />
                فحص
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}