'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin';
import {
  AdminResourceUsage,
  AdminQuickStatsBar,
  AdminApiHealthCheck,
  AdminCacheStatus,
  AdminScheduledTasksList,
  AdminAuditLogViewer,
  AdminFileDropZone,
  AdminColorPickerField,
  AdminJsonViewer,
  AdminMarkdownPreview,
  AdminCodeBlock,
  AdminFeatureToggle,
  AdminSystemInfoCard,
  AdminBulkActionBar,
  AdminQuickReply,
  AdminRateLimitDisplay,
  AdminWebhookLog,
  AdminDatabaseHealth,
  AdminEnvBadge,
  AdminShortcutHint,
} from '@/components/admin';
import { Users, BarChart3 } from 'lucide-react';

export default function AdminComponentsPage() {
  const [color, setColor] = useState('#3b82f6');
  const [md, setMd] = useState('## عنوان\n\nنص **عريض** و *مائل*.');
  const [features, setFeatures] = useState([
    { key: 'dark_mode', label: 'الوضع الداكن', description: 'تفعيل الثيم الداكن', enabled: true },
    { key: 'notifications', label: 'الإشعارات', description: 'إشعارات فورية', enabled: true },
    { key: 'beta_ui', label: 'واجهة تجريبية', description: 'ميزات قيد التطوير', enabled: false },
  ]);
  const [bulkSelected, setBulkSelected] = useState(3);

  return (
    <div className="space-y-8 p-6">
      <AdminPageHeader
        title="20 مكون احترافي"
        description="مكونات لوحة أدمن جاهزة لوظائف مراقبة، تحرير، وإدارة احترافية"
      />
      <div className="flex flex-wrap gap-2 mb-6">
        <AdminEnvBadge env="development" />
        <AdminEnvBadge env="staging" />
        <AdminEnvBadge env="production" />
      </div>

      <section>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">إحصائيات ومراقبة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminResourceUsage cpu={42} memory={68} disk={55} />
          <AdminQuickStatsBar
            items={[
              { label: 'المستخدمون', value: '1,234', icon: Users, trend: 'up' },
              { label: 'الطلبات اليوم', value: '89', icon: BarChart3, trend: 'down' },
            ]}
          />
          <AdminApiHealthCheck />
          <AdminDatabaseHealth />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">الكاش والمهام والسجلات</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <AdminCacheStatus totalSize="2.4 MB" entries={[{ key: 'site_content' }, { key: 'user_session:abc' }]} />
          <AdminScheduledTasksList />
          <AdminAuditLogViewer />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">رفع الملفات والألوان والمحررات</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <AdminFileDropZone maxFiles={3} onFiles={(f) => console.log(f.length)} />
          <AdminColorPickerField value={color} onChange={setColor} />
          <AdminJsonViewer data={{ name: 'CIAR', version: '1.0' }} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <AdminMarkdownPreview value={md} onChange={setMd} />
          <AdminCodeBlock code="const x = () => console.log('hello');" language="javascript" title="مثال كود" />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">ميزات وإجراءات جماعية ورد سريع</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <AdminFeatureToggle
            features={features}
            onToggle={(key, enabled) =>
              setFeatures((prev) => prev.map((f) => (f.key === key ? { ...f, enabled } : f)))
            }
          />
          <AdminQuickReply onSend={(body) => console.log(body)} />
          <AdminSystemInfoCard env="development" nodeVersion="20.x" uptime="2d 5h" />
        </div>
        <div className="mt-4">
          <AdminBulkActionBar
            selectedCount={bulkSelected}
            onClear={() => setBulkSelected(0)}
            actions={[
              { id: 'export', label: 'تصدير', onClick: () => {} },
              { id: 'delete', label: 'حذف', variant: 'destructive', onClick: () => {} },
            ]}
          />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">معدلات الطلبات والويب هوك والاختصارات</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AdminRateLimitDisplay used={450} limit={500} resetIn="ساعة" />
          <AdminWebhookLog />
          <AdminShortcutHint />
        </div>
      </section>
    </div>
  );
}
