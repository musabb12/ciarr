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
import { Save, Type } from 'lucide-react';
import type { SiteContent, FontSettings } from '@/lib/site-content-store';

const FONT_OPTIONS: { value: FontSettings['heading']; labelAr: string; labelEn: string }[] = [
  { value: 'amiri', labelAr: 'أميري (كلاسيكي)', labelEn: 'Amiri (classic)' },
  { value: 'cairo', labelAr: 'القاهرة (واضح)', labelEn: 'Cairo (clear)' },
  { value: 'tajawal', labelAr: 'تجوال (عصري)', labelEn: 'Tajawal (modern)' },
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
          setHeading(fs.heading ?? 'amiri');
          setBody(fs.body ?? 'cairo');
          setModern(fs.modern ?? 'tajawal');
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
        toast.success('تم حفظ إعدادات الخطوط');
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
      <div className="py-12 text-center text-muted-foreground">
        جاري تحميل إعدادات الخطوط...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="admin-card-luxury border border-amber-500/20 bg-gradient-to-br from-slate-900/80 to-slate-800/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-100">
            <Type className="w-5 h-5" />
            إعدادات الخطوط
          </CardTitle>
          <CardDescription className="text-slate-400">
            اختر خط العناوين، خط النص الأساسي، وخط النص العصري. التغييرات تظهر على الصفحة الرئيسية والصفحات العامة.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="font-heading" className="text-slate-300">
                خط العناوين (h1, h2, ...)
              </Label>
              <Select
                value={heading}
                onValueChange={(v) => setHeading(v as FontSettings['heading'])}
              >
                <SelectTrigger id="font-heading" className="bg-slate-800/50 border-slate-600 text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.labelAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="font-body" className="text-slate-300">
                خط النص الأساسي
              </Label>
              <Select
                value={body}
                onValueChange={(v) => setBody(v as FontSettings['body'])}
              >
                <SelectTrigger id="font-body" className="bg-slate-800/50 border-slate-600 text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.labelAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="font-modern" className="text-slate-300">
                خط النص العصري (فقرات، أزرار)
              </Label>
              <Select
                value={modern}
                onValueChange={(v) => setModern(v as FontSettings['modern'])}
              >
                <SelectTrigger id="font-modern" className="bg-slate-800/50 border-slate-600 text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.labelAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="pt-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
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
