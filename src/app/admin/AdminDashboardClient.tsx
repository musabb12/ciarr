'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Globe,
  Mail,
  Newspaper,
  Briefcase,
  FileText,
  Image,
  Search,
  BarChart3,
  Settings,
  Download,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AdminPageHeader,
  AdminStatCard,
  AdminQuickActions,
  AdminActivityFeed,
  AdminInfoBox,
  AdminMetricTrend,
  AdminEmptyState,
  AdminStatusBadge,
  AdminTabsCard,
  AdminSearchBar,
  AdminChartCard,
  AdminDataTable,
  AdminFilterChips,
  AdminConfirmDialog,
  AdminLoadingOverlay,
  AdminBreadcrumb,
  AdminProgressCard,
  AdminMetricGauge,
  AdminDateRangeDisplay,
  AdminNotificationCard,
  AdminKeyValueList,
  AdminCollapsibleSection,
  AdminBadgeCount,
  AdminTimeline,
  AdminCommandPalette,
} from '@/components/admin';
import { AdminErrorBoundary } from '@/components/admin/AdminErrorBoundary';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalTemplates: number;
  totalMessages: number;
  totalRevenue: number;
  monthlyGrowth: number;
  totalNews?: number;
  totalServices?: number;
  messagesLast30?: number;
}

const quickLinks = [
  { href: '/admin/homepage', label: 'الصفحة الرئيسية', icon: LayoutDashboard },
  { href: '/admin/backgrounds', label: 'خلفيات الهيرو', icon: Image },
  { href: '/admin/users', label: 'المستخدمون', icon: Users },
  { href: '/admin/websites', label: 'المواقع', icon: Globe },
  { href: '/admin/messages', label: 'الرسائل', icon: Mail },
  { href: '/admin/news', label: 'الأخبار', icon: Newspaper },
  { href: '/admin/services', label: 'الخدمات', icon: Briefcase },
  { href: '/admin/content', label: 'نصوص إضافية', icon: FileText },
  { href: '/admin/media', label: 'الوسائط', icon: Image },
  { href: '/admin/seo', label: 'تحسين محركات البحث', icon: Search },
  { href: '/admin/analytics', label: 'التحليلات', icon: BarChart3 },
  { href: '/admin/settings', label: 'إعدادات الموقع', icon: Settings },
];

const sampleActivity = [
  { id: '1', title: 'مستخدم جديد مسجّل', description: 'تم إنشاء حساب', time: 'منذ 5 دقائق', variant: 'success' as const },
  { id: '2', title: 'رسالة جديدة من نموذج الاتصال', description: 'طلب استفسار', time: 'منذ 12 دقيقة', variant: 'info' as const },
  { id: '3', title: 'تحديث المحتوى', description: 'الصفحة الرئيسية', time: 'منذ ساعة', variant: 'default' as const },
  { id: '4', title: 'نسخة احتياطية مكتملة', description: 'جدولة أسبوعية', time: 'منذ 3 ساعات', variant: 'success' as const },
];

const recentItems = [
  { id: '1', name: 'رسالة من أحمد', type: 'رسالة', status: 'جديد', date: '2025-01-31' },
  { id: '2', name: 'مستخدم: سارة', type: 'مستخدم', status: 'نشط', date: '2025-01-30' },
  { id: '3', name: 'تعديل خدمة الاستشارات', type: 'محتوى', status: 'منشور', date: '2025-01-30' },
];

const commandPaletteItems = [
  { id: '1', label: 'لوحة التحكم', icon: LayoutDashboard, action: () => window.location.href = '/admin', keywords: ['لوحة', 'رئيسية'] },
  { id: '2', label: 'المستخدمون', icon: Users, action: () => window.location.href = '/admin/users', keywords: ['مستخدمين'] },
  { id: '3', label: 'الرسائل', icon: Mail, action: () => window.location.href = '/admin/messages', keywords: ['رسائل'] },
  { id: '4', label: 'إعدادات الموقع', icon: Settings, action: () => window.location.href = '/admin/settings', keywords: ['إعدادات'] },
];

const timelineItems = [
  { id: '1', title: 'تسجيل الدخول', description: 'تم تسجيل الدخول بنجاح', time: 'منذ دقائق', variant: 'success' as const },
  { id: '2', title: 'تحميل الإحصائيات', description: 'جلب أحدث البيانات', time: 'منذ 2 دقيقة', variant: 'info' as const },
  { id: '3', title: 'فحص الأمان', description: 'النظام آمن', time: 'منذ 5 دقائق', variant: 'success' as const },
];

export function AdminDashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChips, setFilterChips] = useState([{ id: 'f1', label: 'الحالة', value: 'نشط' }]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleConfirmRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
  };

  const removeChip = (id: string) => setFilterChips((c) => c.filter((x) => x.id !== id));

  const trendValue = stats != null ? (stats.monthlyGrowth ?? 0) : undefined;
  const totalNews = stats?.totalNews ?? 0;
  const totalServices = stats?.totalServices ?? 0;
  const totalTemplates = stats?.totalTemplates ?? 0;
  const messagesLast30 = stats?.messagesLast30 ?? stats?.totalMessages ?? 0;

  return (
    <AdminErrorBoundary>
    <div className="space-y-8">
      <AdminLoadingOverlay visible={refreshing} message="جاري تحديث البيانات..." />

      <AdminCommandPalette
        items={commandPaletteItems}
        open={commandOpen}
        onOpenChange={setCommandOpen}
      />

      <AdminBreadcrumb items={[{ label: 'لوحة تحكم الإدارة', href: '/admin' }, { label: 'نظرة عامة تشغيلية' }]} />

      <AdminPageHeader
        title="لوحة تحكم الإدارة"
        description="نظرة عامة تشغيلية على مؤشرات الاستخدام والرسائل والخدمات."
        actions={
          <>
            <AdminSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={(q) => setSearchQuery(q)}
              placeholder="بحث في بيانات لوحة الإدارة..."
              className="max-w-xs hidden sm:flex"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCommandOpen(true)}
              className="border-slate-600 text-slate-100 hover:bg-slate-800/60 text-xs"
            >
              Ctrl+K لوحة الأوامر
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmOpen(true)}
              disabled={refreshing}
              className="border-slate-600 text-slate-100 hover:bg-slate-800/60 hover:border-slate-400 transition-colors"
            >
              <Download className="w-4 h-4 ml-2" />
              تحديث البيانات
            </Button>
          </>
        }
      />

      {confirmOpen && (
        <AdminConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="تحديث بيانات لوحة الإدارة"
          description="سيتم إعادة جلب أحدث الإحصائيات من الخادم. هل تريد المتابعة؟"
          confirmLabel="تحديث"
          onConfirm={handleConfirmRefresh}
          loading={refreshing}
        />
      )}

      {filterChips.length > 0 && (
        <AdminFilterChips chips={filterChips} onRemove={removeChip} onClearAll={() => setFilterChips([])} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          title="إجمالي المستخدمين"
          value={loading ? '—' : (stats?.totalUsers ?? 0).toLocaleString('ar-SA')}
          subtitle={`نشط: ${stats?.activeUsers ?? '—'}`}
          icon={Users}
        />
        <AdminStatCard
          title="المواقع / القوالب"
          value={loading ? '—' : (stats?.totalTemplates ?? 0).toLocaleString('ar-SA')}
          icon={Globe}
        />
        <AdminStatCard
          title="الرسائل"
          value={loading ? '—' : (stats?.totalMessages ?? 0).toLocaleString('ar-SA')}
          icon={Mail}
        />
        <AdminStatCard
          title="الأخبار"
          value={loading ? '—' : totalNews.toLocaleString('ar-SA')}
          icon={Newspaper}
        />
        <AdminStatCard
          title="الخدمات"
          value={loading ? '—' : totalServices.toLocaleString('ar-SA')}
          icon={Briefcase}
        />
        <AdminStatCard
          title="الرسائل آخر 30 يوماً"
          value={loading ? '—' : messagesLast30.toLocaleString('ar-SA')}
          subtitle={`النمو: ${trendValue ?? 0}%`}
          trend={trendValue !== undefined ? { value: trendValue, label: 'آخر 30 يوماً' } : undefined}
          trendUp={trendValue !== undefined ? trendValue >= 0 : undefined}
          icon={Mail}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <AdminMetricTrend
          title="نمو المستخدمين"
          value={stats?.activeUsers ?? '—'}
          trend="up"
          trendLabel="+12% عن الشهر الماضي"
          sparkline={[4, 6, 5, 8, 7, 10, 9, 12]}
          icon={Users}
        />
        <AdminMetricTrend
          title="الرسائل الجديدة"
          value={messagesLast30 || '—'}
          trend={trendValue !== undefined ? (trendValue >= 0 ? 'up' : 'down') : 'neutral'}
          trendLabel={trendValue !== undefined ? `${trendValue}% مقابل الفترة السابقة` : '—'}
          sparkline={[2, 3, 4, 6, 5, 7, 8, 9]}
          icon={Mail}
        />
        <AdminProgressCard
          title="معدل تفعيل المستخدمين"
          value={stats?.totalUsers ? Math.round(((stats.activeUsers ?? 0) / stats.totalUsers) * 100) : 0}
          label="نشط/إجمالي"
          icon={Users}
        />
        <AdminMetricGauge
          title="إنجاز المحتوى"
          value={Math.min(100, totalTemplates * 5)}
          unit="%"
          icon={FileText}
        />
      </div>

      <AdminQuickActions
        title="الوصول السريع"
        description="روابط مباشرة لأقسام الإدارة الرئيسية"
        actions={quickLinks}
        columns={5}
      />

      <div className="flex gap-3 items-center flex-wrap">
        <AdminDateRangeDisplay start={new Date('2025-01-01')} end={new Date('2025-01-31')} />
        <AdminBadgeCount count={stats?.totalMessages ?? 0} label="رسالة" icon={Mail} variant="default" />
        <AdminBadgeCount count={stats?.totalUsers ?? 0} label="مستخدم" icon={Users} variant="success" />
        <AdminBadgeCount count={totalNews} label="خبر" icon={Newspaper} variant="warning" />
        <AdminBadgeCount count={totalServices} label="خدمة" icon={Briefcase} variant="default" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminActivityFeed title="النشاط الأخير" items={sampleActivity} maxItems={5} />
        <AdminTabsCard
          title="مركز المراقبة"
          tabs={[
            {
              value: 'tips',
              label: 'مؤشرات تشغيلية',
              content: (
                <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside">
                  <li>مراجعة الرسائل الواردة والمؤشرات الحرجة بشكل يومي.</li>
                  <li>متابعة نمو المستخدمين والرسائل مقارنة بالفترات السابقة.</li>
                  <li>مراقبة الخدمات والمواقع ذات النشاط الأعلى لاتخاذ قرارات تشغيلية.</li>
                  <li>مراجعة إعدادات النظام بشكل دوري لضمان توافقها مع سياسة الشركة.</li>
                </ul>
              ),
            },
            {
              value: 'support',
              label: 'إجراءات الحوكمة',
              content: (
                <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside">
                  <li>الالتزام بجداول النسخ الاحتياطي المعتمدة للبيانات.</li>
                  <li>تحديث بيانات الدخول الإدارية بشكل دوري ومراقبة محاولات الدخول الفاشلة.</li>
                  <li>مراجعة سجلات النظام للأحداث غير الاعتيادية وإغلاق البلاغات المفتوحة.</li>
                </ul>
              ),
            },
          ]}
        />
      </div>

      <AdminInfoBox variant="info" title="ملاحظة تشغيلية">
        تم تصميم هذه اللوحة لعرض ملخص تنفيذي للحركة على المنصة. استخدم شريط البحث والوصول السريع للانتقال مباشرة إلى أقسام الإدارة المتقدمة.
      </AdminInfoBox>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminDataTable
          title="أحدث العمليات"
          description="سجل مختصر لآخر التغييرات في النظام"
          columns={[
            { key: 'name', label: 'الاسم' },
            { key: 'type', label: 'النوع' },
            {
              key: 'status',
              label: 'الحالة',
              render: (row) => (
                <AdminStatusBadge variant={row.status === 'نشط' ? 'success' : row.status === 'جديد' ? 'info' : 'neutral'}>
                  {row.status}
                </AdminStatusBadge>
              ),
            },
            { key: 'date', label: 'التاريخ' },
          ]}
          data={recentItems}
          keyExtractor={(row) => row.id}
          emptyMessage="لا توجد عناصر حديثة"
        />
        <AdminChartCard
          title="نظرة عامة على الزيارات"
          description="اتجاهات الزيارات خلال آخر 7 أيام"
          onExport={() => {}}
          exportLabel="تصدير"
        >
          <div className="h-48 flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/40 text-slate-300 text-sm font-medium">
            مخطط الزيارات غير مفعّل حالياً. يمكن ربطه لاحقاً ببيانات Recharts أو أي نظام تقارير آخر.
          </div>
        </AdminChartCard>
      </div>

      <AdminEmptyState
        icon={MessageSquare}
        title="لا توجد رسائل قيد المعالجة"
        description="سيتم عرض الرسائل التي تتطلب متابعة إدارية في هذا القسم عند توفرها."
        action={{
          label: 'فتح الرسائل',
          onClick: () => {
            if (typeof window !== 'undefined') window.location.assign('/admin/messages');
          },
        }}
      />
    </div>
    </AdminErrorBoundary>
  );
}
