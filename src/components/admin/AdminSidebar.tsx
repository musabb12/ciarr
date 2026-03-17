'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Menu,
  Settings,
  FileStack,
  Shield,
  User,
  Home,
  ImageIcon,
  SlidersHorizontal,
  Type,
  Boxes,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navSections = [
  {
    title: 'رئيسي',
    items: [
      { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
    ],
  },
  {
    title: 'محتوى الموقع',
    items: [
      { href: '/admin/homepage', label: 'الصفحة الرئيسية', icon: Home },
      { href: '/admin/backgrounds', label: 'خلفيات الهيرو', icon: ImageIcon },
      { href: '/admin/content', label: 'نصوص إضافية', icon: FileText },
      { href: '/admin/websites', label: 'المواقع', icon: Globe },
      { href: '/admin/news', label: 'الأخبار', icon: Newspaper },
      { href: '/admin/services', label: 'الخدمات', icon: Briefcase },
    ],
  },
  {
    title: 'التواصل والمستخدمون',
    items: [
      { href: '/admin/users', label: 'المستخدمون', icon: Users },
      { href: '/admin/messages', label: 'الرسائل', icon: Mail },
    ],
  },
  {
    title: 'الوسائط والنظام',
    items: [
      { href: '/admin/site-controls', label: 'تحكم الموقع', icon: SlidersHorizontal },
      { href: '/admin/components', label: '20 مكون احترافي', icon: Boxes },
      { href: '/admin/fonts', label: 'إعدادات الخطوط', icon: Type },
      { href: '/admin/media', label: 'الوسائط', icon: Image },
      { href: '/admin/menus', label: 'القوائم', icon: Menu },
      { href: '/admin/seo', label: 'تحسين محركات البحث', icon: Search },
      { href: '/admin/analytics', label: 'التحليلات', icon: BarChart3 },
      { href: '/admin/logs', label: 'سجلات النظام', icon: FileStack },
      { href: '/admin/security', label: 'الأمان', icon: Shield },
      { href: '/admin/settings', label: 'إعدادات الموقع', icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="admin-glass-sidebar w-72 shrink-0 flex flex-col relative z-20"
      dir="rtl"
    >
      <div className="p-6 border-b admin-sidebar-border">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="admin-logo-glow w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center ring-2 ring-amber-400/30 transition-transform group-hover:scale-105">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="admin-sidebar-title font-arabic-heading block">لوحة الإدارة</span>
            <p className="admin-sidebar-sub mt-0.5">CIAR</p>
          </div>
        </Link>
      </div>
      <div className="p-5 flex flex-col items-center border-b admin-sidebar-border">
        <div className="admin-sidebar-user-box w-16 h-16 rounded-2xl flex items-center justify-center ring-4 ring-amber-500/10">
          <User className="w-8 h-8 text-slate-600 dark:text-slate-400" />
        </div>
        <p className="mt-3 font-semibold admin-sidebar-title text-sm">المدير</p>
        <p className="admin-sidebar-sub">مدير CIAR</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-7">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="admin-sidebar-section mb-3 px-3">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      prefetch
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent',
                        isActive
                          ? 'bg-gradient-to-l from-amber-600/90 to-amber-700/80 text-white shadow-lg shadow-amber-900/40 border-amber-500/30'
                          : 'admin-sidebar-link'
                      )}
                    >
                      <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-white' : '')} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
