'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import type { SiteContent, FontSettings, FontKey } from '@/lib/site-content-store';
import { FONT_KEYS } from '@/lib/site-content-store';

const isValidFontKey = (v: string): v is FontKey =>
  (FONT_KEYS as readonly string[]).includes(v);

/** 20 خيار خط — التطبيق على كامل الموقع يتم بالضغط على "حفظ" */
const FONT_OPTIONS: { value: FontKey; labelAr: string }[] = [
  { value: 'amiri', labelAr: 'أميري (كلاسيكي)' },
  { value: 'cairo', labelAr: 'القاهرة (واضح)' },
  { value: 'tajawal', labelAr: 'تجوال (عصري)' },
  { value: 'almarai', labelAr: 'المراعي' },
  { value: 'changa', labelAr: 'تشانقا' },
  { value: 'el_messiri', labelAr: 'المسيري' },
  { value: 'lateef', labelAr: 'لطيف' },
  { value: 'noto_kufi_arabic', labelAr: 'نوتو كوفي عربي' },
  { value: 'noto_naskh_arabic', labelAr: 'نوتو نسخ عربي' },
  { value: 'noto_sans_arabic', labelAr: 'نوتو سانس عربي' },
  { value: 'scheherazade_new', labelAr: 'شهرزاد جديد' },
  { value: 'ibm_plex_sans_arabic', labelAr: 'آي بي إم بلكس عربي' },
  { value: 'readex_pro', labelAr: 'ريديكس برو' },
  { value: 'rubik', labelAr: 'روبيك' },
  { value: 'rakkas', labelAr: 'رَقّاس' },
  { value: 'aref_ruqaa', labelAr: 'عارض رقعة' },
  { value: 'katibeh', labelAr: 'كاتبة' },
  { value: 'lemonada', labelAr: 'ليمونادة' },
  { value: 'markazi_text', labelAr: 'مركزي تكست' },
  { value: 'jomhuria', labelAr: 'جمهورية' },
];

export function FontSettingsManagement() {
  const { toast } = useToast();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heading, setHeading] = useState<FontSettings['heading']>('amiri');
  const [body, setBody] = useState<FontSettings['body']>('cairo');
  const [modern, setModern] = useState<FontSettings['modern']>('tajawal');

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/site-content');
      if (res.ok) {
        const data = await res.json();
        setContent(data);
        const fs = data?.fontSettings;
        if (fs) {
          setHeading(isValidFontKey(fs.heading) ? fs.heading : 'amiri');
          setBody(isValidFontKey(fs.body) ? fs.body : 'cairo');
          setModern(isValidFontKey(fs.modern) ? fs.modern : 'tajawal');
        }
      }
    } catch {
      toast.error('فشل تحميل المحتوى');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const updated: SiteContent = {
        ...content,
        fontSettings: { heading, body, modern },
      };
      const res = await fetch('/api/admin/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const data = await res.json();
        setContent(data);
        toast.success('تم الحفظ — الخطوط مُطبَّقة الآن على كامل الموقع');
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || 'فشل الحفظ');
      }
    } catch {
      toast.error('فشل الحفظ');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return (
      <div className="admin-font-settings-card admin-card-luxury flex min-h-[320px] items-center justify-center rounded-xl p-8">
        <p className="text-[#475569] dark:text-slate-400">جاري تحميل إعدادات الخطوط...</p>
      </div>
    );
  }

  const selectTriggerClass =
    'h-12 rounded-lg border bg-white px-4 text-[#0f172a] shadow-sm transition-colors hover:bg-slate-50 focus:ring-2 focus:ring-[#475569]/25 focus:ring-offset-0 dark:bg-slate-800/60 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus:ring-slate-500/30';

  return (
    <div className="space-y-6">
      <Card className="admin-card-luxury admin-font-settings-card">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="admin-card-title text-xl font-semibold">
            اختيار الخطوط
          </CardTitle>
          <CardDescription className="admin-card-sub text-sm leading-relaxed max-w-2xl">
            اختر خط العناوين، خط النص الأساسي، وخط النص العصري (20 خياراً). عند الضغط على «حفظ» تُطبَّق الخطوط على كامل الموقع فوراً.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
            <div className="space-y-3">
              <Label
                htmlFor="font-heading"
                className="admin-card-sub text-sm font-medium"
              >
                خط العناوين (h1, h2, …)
              </Label>
              <Select
                value={heading}
                onValueChange={(v) => setHeading(v as FontSettings['heading'])}
              >
                <SelectTrigger id="font-heading" className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:border-slate-600 dark:bg-slate-800/95">
                  {FONT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.labelAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="font-body"
                className="admin-card-sub text-sm font-medium"
              >
                خط النص الأساسي
              </Label>
              <Select
                value={body ?? 'cairo'}
                onValueChange={(v) => setBody(v as FontKey)}
              >
                <SelectTrigger id="font-body" className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:border-slate-600 dark:bg-slate-800/95">
                  {FONT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.labelAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="font-modern"
                className="admin-card-sub text-sm font-medium"
              >
                خط النص العصري (فقرات، أزرار)
              </Label>
              <Select
                value={modern ?? 'tajawal'}
                onValueChange={(v) => setModern(v as FontKey)}
              >
                <SelectTrigger id="font-modern" className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:border-slate-600 dark:bg-slate-800/95">
                  {FONT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.labelAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-6 dark:border-slate-600">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="h-11 min-w-[200px] rounded-lg bg-slate-800 px-6 font-medium text-white shadow-sm transition-colors hover:bg-slate-700 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500"
            >
              <Save className="w-4 h-4 ml-2" />
              {saving ? 'جاري الحفظ...' : 'حفظ إعدادات الخطوط'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
