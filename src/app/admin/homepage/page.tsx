'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Image, Save, RotateCcw, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SiteContent } from '@/lib/site-content-store';

export default function AdminHomepagePage() {
  const { toast } = useToast();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/site-content');
      if (res.ok) {
        const data = await res.json();
        setContent(data);
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

  const handleSave = async (partial: Partial<SiteContent>) => {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...content, ...partial }),
      });
      if (res.ok) {
        const updated = await res.json();
        setContent(updated);
        toast.success('تم حفظ التغييرات');
      } else {
        const data = await res.json().catch(() => ({}));
        const msg = data?.error || 'فشل الحفظ. تحقق من إعدادات قاعدة البيانات (DATABASE_URL على Netlify).';
        toast.error(msg);
      }
    } catch {
      toast.error('فشل الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('استعادة المحتوى الافتراضي؟ سيُفقد تعديلاتك الحالية.')) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/site-content?action=reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setContent(data);
        toast.success('تم استعادة المحتوى الافتراضي');
      }
    } catch {
      toast.error('فشل الاستعادة');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return (
      <div className="py-12 text-center text-slate-400">
        جاري تحميل محتوى الصفحة الرئيسية...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">محتوى الصفحة الرئيسية</h1>
          <p className="text-slate-400 mt-0.5">التحكم في نصوص الهيرو، الإحصائيات، المميزات، آراء العملاء، الخطط، الأسئلة الشائعة وغيرها</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300" asChild>
            <Link href="/admin/backgrounds">
              <Image className="w-4 h-4 ml-2" />
              خلفيات الهيرو
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300" asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Home className="w-4 h-4 ml-2" />
              معاينة الموقع
            </a>
          </Button>
          <Button variant="outline" size="sm" className="border-slate-500 text-slate-700 dark:border-slate-500 dark:text-slate-300" onClick={handleReset} disabled={saving}>
            <RotateCcw className="w-4 h-4 ml-2" />
            استعادة الافتراضي
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="bg-slate-800/80 border border-slate-700 p-1 flex flex-wrap gap-1">
          <TabsTrigger value="hero" className="data-[state=active]:bg-indigo-600 text-slate-300">الهيرو</TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-indigo-600 text-slate-300">الإحصائيات</TabsTrigger>
          <TabsTrigger value="features" className="data-[state=active]:bg-indigo-600 text-slate-300">المميزات</TabsTrigger>
          <TabsTrigger value="testimonials" className="data-[state=active]:bg-indigo-600 text-slate-300">آراء العملاء</TabsTrigger>
          <TabsTrigger value="process" className="data-[state=active]:bg-indigo-600 text-slate-300">كيف نعمل</TabsTrigger>
          <TabsTrigger value="plans" className="data-[state=active]:bg-indigo-600 text-slate-300">الخطط</TabsTrigger>
          <TabsTrigger value="faq" className="data-[state=active]:bg-indigo-600 text-slate-300">الأسئلة الشائعة</TabsTrigger>
          <TabsTrigger value="cta" className="data-[state=active]:bg-indigo-600 text-slate-300">دعوة للإجراء</TabsTrigger>
          <TabsTrigger value="footer" className="data-[state=active]:bg-indigo-600 text-slate-300">التذييل</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">نصوص قسم الهيرو</CardTitle>
              <p className="text-sm text-slate-400">العنوان والعبارة و placeholder البحث</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-400">العنوان الرئيسي</Label>
                <Input
                  className="mt-1 bg-slate-900/50 border-slate-600 text-slate-100"
                  value={content.hero.title}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                />
              </div>
              <div>
                <Label className="text-slate-400">العبارة التحتية</Label>
                <Input
                  className="mt-1 bg-slate-900/50 border-slate-600 text-slate-100"
                  value={content.hero.subtitle}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                />
              </div>
              <div>
                <Label className="text-slate-400">نص placeholder البحث</Label>
                <Input
                  className="mt-1 bg-slate-900/50 border-slate-600 text-slate-100"
                  value={content.hero.searchPlaceholder}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, searchPlaceholder: e.target.value } })}
                />
              </div>
              <Button onClick={() => handleSave({ hero: content.hero })} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                <Save className="w-4 h-4 ml-2" />
                {saving ? 'جاري الحفظ...' : 'حفظ الهيرو'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">أرقام الإحصائيات (4 بطاقات)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.stats.map((stat, i) => (
                <div key={i} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label className="text-slate-400">الرقم {i + 1}</Label>
                    <Input
                      className="mt-1 bg-slate-900/50 border-slate-600 text-slate-100"
                      value={stat.number}
                      onChange={(e) => {
                        const next = [...content.stats];
                        next[i] = { ...next[i], number: e.target.value };
                        setContent({ ...content, stats: next });
                      }}
                    />
                  </div>
                  <div className="flex-[2]">
                    <Label className="text-slate-400">التسمية</Label>
                    <Input
                      className="mt-1 bg-slate-900/50 border-slate-600 text-slate-100"
                      value={stat.label}
                      onChange={(e) => {
                        const next = [...content.stats];
                        next[i] = { ...next[i], label: e.target.value };
                        setContent({ ...content, stats: next });
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button onClick={() => handleSave({ stats: content.stats })} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ الإحصائيات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">لماذا تختارنا؟ (المميزات)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.features.map((f, i) => (
                <div key={i} className="p-4 rounded-lg bg-slate-900/50 border border-slate-700 space-y-2">
                  <Input
                    className="bg-slate-800 border-slate-600 text-slate-100"
                    placeholder="العنوان"
                    value={f.title}
                    onChange={(e) => {
                      const next = [...content.features];
                      next[i] = { ...next[i], title: e.target.value };
                      setContent({ ...content, features: next });
                    }}
                  />
                  <Input
                    className="bg-slate-800 border-slate-600 text-slate-100"
                    placeholder="الوصف"
                    value={f.desc}
                    onChange={(e) => {
                      const next = [...content.features];
                      next[i] = { ...next[i], desc: e.target.value };
                      setContent({ ...content, features: next });
                    }}
                  />
                </div>
              ))}
              <Button onClick={() => handleSave({ features: content.features })} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ المميزات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-4">
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">آراء العملاء</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.testimonials.map((t, i) => (
                <div key={i} className="p-4 rounded-lg bg-slate-900/50 border border-slate-700 space-y-2">
                  <Input
                    className="bg-slate-800 border-slate-600 text-slate-100"
                    placeholder="الاسم"
                    value={t.name}
                    onChange={(e) => {
                      const next = [...content.testimonials];
                      next[i] = { ...next[i], name: e.target.value };
                      setContent({ ...content, testimonials: next });
                    }}
                  />
                  <Input
                    className="bg-slate-800 border-slate-600 text-slate-100"
                    placeholder="الدور/الوصف"
                    value={t.role}
                    onChange={(e) => {
                      const next = [...content.testimonials];
                      next[i] = { ...next[i], role: e.target.value };
                      setContent({ ...content, testimonials: next });
                    }}
                  />
                  <Textarea
                    className="bg-slate-800 border-slate-600 text-slate-100 min-h-[80px]"
                    placeholder="نص الرأي"
                    value={t.content}
                    onChange={(e) => {
                      const next = [...content.testimonials];
                      next[i] = { ...next[i], content: e.target.value };
                      setContent({ ...content, testimonials: next });
                    }}
                  />
                </div>
              ))}
              <Button onClick={() => handleSave({ testimonials: content.testimonials })} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ آراء العملاء
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process" className="space-y-4">
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">كيف نعمل (الخطوات)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.process.map((p, i) => (
                <div key={i} className="p-4 rounded-lg bg-slate-900/50 border border-slate-700 space-y-2">
                  <Input
                    className="bg-slate-800 border-slate-600 text-slate-100 w-16"
                    placeholder="الرقم"
                    value={p.step}
                    onChange={(e) => {
                      const next = [...content.process];
                      next[i] = { ...next[i], step: e.target.value };
                      setContent({ ...content, process: next });
                    }}
                  />
                  <Input
                    className="bg-slate-800 border-slate-600 text-slate-100"
                    placeholder="العنوان"
                    value={p.title}
                    onChange={(e) => {
                      const next = [...content.process];
                      next[i] = { ...next[i], title: e.target.value };
                      setContent({ ...content, process: next });
                    }}
                  />
                  <Input
                    className="bg-slate-800 border-slate-600 text-slate-100"
                    placeholder="الوصف"
                    value={p.desc}
                    onChange={(e) => {
                      const next = [...content.process];
                      next[i] = { ...next[i], desc: e.target.value };
                      setContent({ ...content, process: next });
                    }}
                  />
                </div>
              ))}
              <Button onClick={() => handleSave({ process: content.process })} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ الخطوات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">الخطط والأسعار</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.plans.map((p, i) => (
                <div key={i} className="p-4 rounded-lg bg-slate-900/50 border border-slate-700 space-y-2">
                  <div className="flex gap-2 items-center">
                    <Input
                      className="bg-slate-800 border-slate-600 text-slate-100 flex-1"
                      placeholder="اسم الخطة"
                      value={p.name}
                      onChange={(e) => {
                        const next = [...content.plans];
                        next[i] = { ...next[i], name: e.target.value };
                        setContent({ ...content, plans: next });
                      }}
                    />
                    <label className="flex items-center gap-2 text-slate-400 text-sm">
                      <input
                        type="checkbox"
                        checked={p.popular || false}
                        onChange={(e) => {
                          const next = [...content.plans];
                          next[i] = { ...next[i], popular: e.target.checked };
                          setContent({ ...content, plans: next });
                        }}
                      />
                      الأكثر شعبية
                    </label>
                  </div>
                  <Input
                    className="bg-slate-800 border-slate-600 text-slate-100"
                    placeholder="السعر (مثال: 99 ريال/شهرياً)"
                    value={p.price}
                    onChange={(e) => {
                      const next = [...content.plans];
                      next[i] = { ...next[i], price: e.target.value };
                      setContent({ ...content, plans: next });
                    }}
                  />
                  <Textarea
                    className="bg-slate-800 border-slate-600 text-slate-100 min-h-[60px]"
                    placeholder="المميزات (سطر واحد لكل مميزة)"
                    value={p.features.join('\n')}
                    onChange={(e) => {
                      const next = [...content.plans];
                      next[i] = { ...next[i], features: e.target.value.split('\n').filter(Boolean) };
                      setContent({ ...content, plans: next });
                    }}
                  />
                </div>
              ))}
              <Button onClick={() => handleSave({ plans: content.plans })} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ الخطط
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">الأسئلة الشائعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.faq.map((f, i) => (
                <div key={i} className="p-4 rounded-lg bg-slate-900/50 border border-slate-700 space-y-2">
                  <Input
                    className="bg-slate-800 border-slate-600 text-slate-100"
                    placeholder="السؤال"
                    value={f.q}
                    onChange={(e) => {
                      const next = [...content.faq];
                      next[i] = { ...next[i], q: e.target.value };
                      setContent({ ...content, faq: next });
                    }}
                  />
                  <Textarea
                    className="bg-slate-800 border-slate-600 text-slate-100 min-h-[60px]"
                    placeholder="الإجابة"
                    value={f.a}
                    onChange={(e) => {
                      const next = [...content.faq];
                      next[i] = { ...next[i], a: e.target.value };
                      setContent({ ...content, faq: next });
                    }}
                  />
                </div>
              ))}
              <Button onClick={() => handleSave({ faq: content.faq })} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ الأسئلة الشائعة
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cta" className="space-y-4">
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">قسم الدعوة للإجراء (CTA)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-400">العنوان</Label>
                <Input
                  className="mt-1 bg-slate-900/50 border-slate-600 text-slate-100"
                  value={content.ctaTitle}
                  onChange={(e) => setContent({ ...content, ctaTitle: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-slate-400">العبارة التحتية</Label>
                <Input
                  className="mt-1 bg-slate-900/50 border-slate-600 text-slate-100"
                  value={content.ctaSubtitle}
                  onChange={(e) => setContent({ ...content, ctaSubtitle: e.target.value })}
                />
              </div>
              <Button onClick={() => handleSave({ ctaTitle: content.ctaTitle, ctaSubtitle: content.ctaSubtitle })} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer" className="space-y-4">
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">نص التذييل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-slate-400">وصف التذييل</Label>
                <Textarea
                  className="mt-1 bg-slate-900/50 border-slate-600 text-slate-100 min-h-[80px]"
                  value={content.footerDescription}
                  onChange={(e) => setContent({ ...content, footerDescription: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-slate-400">عنوان النشرة البريدية</Label>
                <Input
                  className="mt-1 bg-slate-900/50 border-slate-600 text-slate-100"
                  value={content.newsletterTitle}
                  onChange={(e) => setContent({ ...content, newsletterTitle: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-slate-400">عبارة النشرة</Label>
                <Input
                  className="mt-1 bg-slate-900/50 border-slate-600 text-slate-100"
                  value={content.newsletterSubtitle}
                  onChange={(e) => setContent({ ...content, newsletterSubtitle: e.target.value })}
                />
              </div>
              <Button onClick={() => handleSave({ footerDescription: content.footerDescription, newsletterTitle: content.newsletterTitle, newsletterSubtitle: content.newsletterSubtitle })} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ التذييل والنشرة
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
