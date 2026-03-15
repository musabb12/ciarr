'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Globe,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Bell,
  Wrench,
  Palette,
  FileText,
  Search,
  MailCheck,
  MessageSquare,
  Clock,
  Map,
  BarChart3,
  Cookie,
  Save,
  Shield,
  MousePointer,
  ImageIcon,
} from 'lucide-react';
import type { SiteSettings } from '@/lib/site-settings';
import { ImageUpload } from '@/components/ui/image-upload';

export default function SiteControlsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) setSettings(await res.json());
    } catch {
      toast.error('فشل تحميل الإعدادات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const update = async (partial: Partial<SiteSettings>) => {
    if (!settings) return;
    setSaving(true);
    try {
      const payload = { ...settings, ...partial };
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      });
      const data = await res.json();
      if (res.ok) {
        setSettings(data);
        toast.success('تم الحفظ — التغييرات ستظهر على الموقع فوراً');
      } else {
        toast.error(data?.error || 'فشل الحفظ');
      }
    } catch (err) {
      toast.error('فشل الحفظ: ' + String(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="py-12 text-center text-slate-400">جاري التحميل...</div>;
  }

  const ControlInput = ({ label, value, onChange, placeholder, icon: Icon }: any) => (
    <div className="space-y-2">
      <Label className="text-amber-200/90 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-slate-800/60 border-amber-900/30 text-slate-100"
      />
    </div>
  );

  const ControlSwitch = ({ label, checked, onCheckedChange }: any) => (
    <div className="flex items-center justify-between">
      <Label className="text-amber-200/90">{label}</Label>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">تحكم الموقع</h1>
        <p className="text-amber-200/80 mt-1">20 مكون للتحكم في إعدادات الموقع — التعديلات تُطبّق فوراً</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. اسم الموقع والشعار */}
        <Card className="admin-card-luxury rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Building2 className="w-5 h-5" /> اسم الموقع والشعار
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ControlInput label="اسم الموقع" value={settings.siteName} onChange={(v: string) => update({ siteName: v })} icon={Building2} />
            <ControlInput label="رابط الشعار" value={settings.siteLogo} onChange={(v: string) => update({ siteLogo: v })} placeholder="/logo.png" />
            <ControlInput label="الأيقونة (favicon)" value={settings.favicon} onChange={(v: string) => update({ favicon: v })} placeholder="/favicon.png" />
          </CardContent>
        </Card>

        {/* 2. معلومات الاتصال */}
        <Card className="admin-card-luxury rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Mail className="w-5 h-5" /> معلومات الاتصال
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ControlInput label="البريد الإلكتروني" value={settings.contactEmail} onChange={(v: string) => update({ contactEmail: v })} icon={Mail} />
            <ControlInput label="الهاتف" value={settings.contactPhone} onChange={(v: string) => update({ contactPhone: v })} icon={Phone} />
            <ControlInput label="العنوان" value={settings.contactAddress} onChange={(v: string) => update({ contactAddress: v })} icon={MapPin} />
            <ControlInput label="واتساب" value={settings.whatsappNumber} onChange={(v: string) => update({ whatsappNumber: v })} placeholder="966500000000" icon={MessageCircle} />
          </CardContent>
        </Card>

        {/* 3. روابط السوشيال ميديا */}
        <Card className="admin-card-luxury rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Globe className="w-5 h-5" /> روابط السوشيال ميديا
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ControlInput label="Facebook" value={settings.facebookUrl} onChange={(v: string) => update({ facebookUrl: v })} icon={Globe} />
            <ControlInput label="Twitter" value={settings.twitterUrl} onChange={(v: string) => update({ twitterUrl: v })} icon={Twitter} />
            <ControlInput label="Instagram" value={settings.instagramUrl} onChange={(v: string) => update({ instagramUrl: v })} icon={Instagram} />
            <ControlInput label="LinkedIn" value={settings.linkedinUrl} onChange={(v: string) => update({ linkedinUrl: v })} icon={Linkedin} />
            <ControlInput label="YouTube" value={settings.youtubeUrl} onChange={(v: string) => update({ youtubeUrl: v })} icon={Youtube} />
          </CardContent>
        </Card>

        {/* 4. بانر الإعلانات */}
        <Card className="admin-card-luxury rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Bell className="w-5 h-5" /> بانر الإعلانات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ControlSwitch label="إظهار البانر" checked={settings.announcementVisible} onCheckedChange={(v: boolean) => update({ announcementVisible: v })} />
            <ControlInput label="نص الإعلان" value={settings.announcementText} onChange={(v: string) => update({ announcementText: v })} placeholder="عرض خاص..." />
          </CardContent>
        </Card>

        {/* 5. وضع الصيانة */}
        <Card className="admin-card-luxury rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Wrench className="w-5 h-5" /> وضع الصيانة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ControlSwitch label="تفعيل وضع الصيانة" checked={settings.maintenanceMode} onCheckedChange={(v: boolean) => update({ maintenanceMode: v })} />
            <ControlInput label="رسالة الصيانة" value={settings.maintenanceMessage} onChange={(v: string) => update({ maintenanceMessage: v })} />
          </CardContent>
        </Card>

        {/* 6. اللون الأساسي */}
        <Card className="admin-card-luxury rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Palette className="w-5 h-5" /> اللون الأساسي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ControlInput label="كود اللون" value={settings.primaryColor} onChange={(v: string) => update({ primaryColor: v })} placeholder="#f59e0b" icon={Palette} />
          </CardContent>
        </Card>

        {/* 7. نص الفوتر */}
        <Card className="admin-card-luxury rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <FileText className="w-5 h-5" /> نص الفوتر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ControlInput label="نص الفوتر" value={settings.footerText} onChange={(v: string) => update({ footerText: v })} />
          </CardContent>
        </Card>

        {/* 8. إعدادات SEO */}
        <Card className="admin-card-luxury rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Search className="w-5 h-5" /> إعدادات SEO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ControlInput label="عنوان الصفحة" value={settings.seoTitle} onChange={(v: string) => update({ seoTitle: v })} icon={Search} />
            <div className="space-y-2">
              <Label className="text-amber-200/90">الوصف</Label>
              <Textarea value={settings.seoDescription} onChange={(e) => update({ seoDescription: e.target.value })} className="bg-slate-800/60 border-amber-900/30 text-slate-100" rows={2} />
            </div>
          </CardContent>
        </Card>

        {/* 9. تفعيل النشرة البريدية */}
        <Card className="admin-card-luxury rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <MailCheck className="w-5 h-5" /> النشرة البريدية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ControlSwitch label="إظهار قسم النشرة البريدية" checked={settings.showNewsletter} onCheckedChange={(v: boolean) => update({ showNewsletter: v })} />
          </CardContent>
        </Card>

        {/* 10. تفعيل آراء العملاء */}
        <Card className="admin-card-luxury rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <MessageSquare className="w-5 h-5" /> آراء العملاء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ControlSwitch label="إظهار قسم آراء العملاء" checked={settings.showTestimonials} onCheckedChange={(v: boolean) => update({ showTestimonials: v })} />
          </CardContent>
        </Card>

        {/* 11. أوقات العمل */}
        <Card className="admin-card-luxury rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Clock className="w-5 h-5" /> أوقات العمل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ControlInput label="أوقات العمل" value={settings.openingHours} onChange={(v: string) => update({ openingHours: v })} icon={Clock} placeholder="الأحد - الخميس: 9ص - 6م" />
          </CardContent>
        </Card>

        {/* 12. خريطة الموقع */}
        <Card className="admin-card-luxury rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Map className="w-5 h-5" /> خريطة الموقع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label className="text-amber-200/90">كود تضمين خرائط جوجل</Label>
              <Textarea value={settings.googleMapsEmbed} onChange={(e) => update({ googleMapsEmbed: e.target.value })} className="bg-slate-800/60 border-amber-900/30 text-slate-100 font-mono text-xs" rows={3} placeholder='<iframe src="..." ...></iframe>' />
            </div>
          </CardContent>
        </Card>

        {/* 13. أكواد التحليلات */}
        <Card className="admin-card-luxury rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <BarChart3 className="w-5 h-5" /> أكواد التحليلات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label className="text-amber-200/90">كود Google Analytics أو غيره</Label>
              <Textarea value={settings.analyticsCode} onChange={(e) => update({ analyticsCode: e.target.value })} className="bg-slate-800/60 border-amber-900/30 text-slate-100 font-mono text-xs" rows={4} placeholder="<script>...</script>" />
            </div>
          </CardContent>
        </Card>

        {/* 14. نص موافقة الكوكيز */}
        <Card className="admin-card-luxury rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Cookie className="w-5 h-5" /> موافقة الكوكيز
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label className="text-amber-200/90">نص إشعار الكوكيز</Label>
              <Textarea value={settings.cookieConsentText} onChange={(e) => update({ cookieConsentText: e.target.value })} className="bg-slate-800/60 border-amber-900/30 text-slate-100" rows={2} />
            </div>
          </CardContent>
        </Card>

        {/* 15. شارات الثقة */}
        <Card className="admin-card-luxury rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Shield className="w-5 h-5" /> شارات الثقة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ControlInput label="نص الشارات" value={settings.trustBadgesText} onChange={(v: string) => update({ trustBadgesText: v })} placeholder="دفع آمن | شحن سريع" icon={Shield} />
          </CardContent>
        </Card>

        {/* 16. زر الدعوة للإجراء */}
        <Card className="admin-card-luxury rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <MousePointer className="w-5 h-5" /> زر الدعوة للإجراء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ControlInput label="نص الزر" value={settings.ctaButtonText} onChange={(v: string) => update({ ctaButtonText: v })} icon={MousePointer} />
          </CardContent>
        </Card>

        {/* 17. نموذج الاتصال */}
        <Card className="admin-card-luxury rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Mail className="w-5 h-5" /> نموذج الاتصال
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ControlInput label="عنوان النموذج" value={settings.contactFormTitle} onChange={(v: string) => update({ contactFormTitle: v })} icon={Mail} />
          </CardContent>
        </Card>

        {/* 18. رسالة نجاح النشرة */}
        <Card className="admin-card-luxury rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <MailCheck className="w-5 h-5" /> رسالة نجاح الاشتراك
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ControlInput label="الرسالة" value={settings.newsletterSuccessMessage} onChange={(v: string) => update({ newsletterSuccessMessage: v })} icon={MailCheck} />
          </CardContent>
        </Card>

        {/* 19. صورة خلفية الهيرو */}
        <Card className="admin-card-luxury rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <ImageIcon className="w-5 h-5" /> خلفية الهيرو
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ControlInput label="رابط الصورة الافتراضي" value={settings.heroBackgroundImage} onChange={(v: string) => update({ heroBackgroundImage: v })} placeholder="/hero-bg.jpg" icon={ImageIcon} />
            <div className="flex items-center gap-2 pt-1">
              <Label className="text-slate-400 text-sm">أو رفع صورة من الجهاز</Label>
              <ImageUpload onUploadComplete={(url) => update({ heroBackgroundImage: url })} compact />
            </div>
          </CardContent>
        </Card>

        {/* 20. تفعيل البحث */}
        <Card className="admin-card-luxury rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Search className="w-5 h-5" /> البحث
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ControlSwitch label="تفعيل شريط البحث الرئيسي" checked={settings.enableSearch} onCheckedChange={(v: boolean) => update({ enableSearch: v })} />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => fetchSettings()}
          variant="outline"
          className="border-amber-900/30 text-amber-200"
        >
          تحديث العرض
        </Button>
      </div>
    </div>
  );
}
