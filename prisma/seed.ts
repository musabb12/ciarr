/**
 * تهيئة قاعدة البيانات بالبيانات الافتراضية
 * تشغيل: npx prisma db seed
 */
import { PrismaClient, UserRole, ContactStatus } from '@prisma/client';
import { hashPassword } from '../src/lib/user-auth';

const prisma = new PrismaClient();

const initialWebsites = [
  { title: 'CIAR موضة نسائية و رجالية', slug: 'ciar-fashion', description: 'منصة أزياء متكاملة...', url: 'https://fashion.ciar.com', category: 'الموضة', technologies: '["Next.js","Tailwind CSS","Shopify Headless","Stripe"]', images: '["/template-ecommerce.jpg"]', badges: '["مميز","ترند"]', tags: '["أزياء","متجر إلكتروني","موضة"]', featured: true, status: 'active', client: 'متاجر CIAR', hidden: false, displayOrder: 1 },
  { title: 'CIAR VIP للأزياء الفاخرة', slug: 'ciar-vip-fashion', description: 'تجربة حصرية لكبار الشخصيات...', url: 'https://vip-fashion.ciar.com', category: 'الموضة الفاخرة', technologies: '["Next.js","GraphQL","Sanity CMS","Cloudinary"]', images: '["/template-ecommerce.jpg"]', badges: '["حصري","خدمة شخصية"]', tags: '["VIP","أزياء فاخرة"]', featured: true, status: 'active', client: 'CIAR VIP', hidden: false, displayOrder: 2 },
  { title: 'CIAR للمنتجات الصينية والدولية', slug: 'ciar-china-b2b', description: 'دليل تجارة بين الشركات...', url: 'https://b2b.ciar.com', category: 'تجارة بين الشركات', technologies: '["Next.js","Node.js","MongoDB","ElasticSearch"]', images: '["/template-ecommerce.jpg"]', badges: '["B2B","دولي"]', tags: '["مصانع","استيراد"]', featured: true, status: 'active', client: 'CIAR Global Trade', hidden: false, displayOrder: 3 },
  { title: 'CIAR مول إلكتروني عالمي', slug: 'ciar-global-mall', description: 'مول رقمي يضم آلاف العروض...', url: 'https://mall.ciar.com', category: 'التجارة الإلكترونية', technologies: '["Next.js","Redis","Stripe","Algolia"]', images: '["/template-ecommerce.jpg"]', badges: '["عروض يومية"]', tags: '["تخفيضات","مول"]', featured: true, status: 'active', client: 'CIAR Commerce', hidden: false, displayOrder: 4 },
  { title: 'CIAR الدليل الوسيط السياحي', slug: 'ciar-travel-guide', description: 'مرجع سياحي عالمي...', url: 'https://travel.ciar.com', category: 'السياحة', technologies: '["Next.js","Supabase","Mapbox","Stripe"]', images: '["/template-restaurant.jpg"]', badges: '["حجوزات"]', tags: '["دول","رحلات"]', featured: false, status: 'active', client: 'CIAR Travel', hidden: false, displayOrder: 5 },
];

const defaultSiteSettings = {
  siteName: 'CIAR',
  siteLogo: '/logo.png',
  favicon: '/favicon.png',
  contactEmail: 'info@ciar.com',
  contactPhone: '+966500000000',
  contactAddress: 'الرياض، المملكة العربية السعودية',
  whatsappNumber: '',
  primaryColor: '#f59e0b',
  footerText: 'شركة CIAR — 14 موقعاً يخدمونك',
  seoTitle: 'CIAR - شركة خدمات رقمية',
  seoDescription: 'شركة CIAR تقدم خدماتها عبر 14 موقعاً إلكترونياً',
  heroBackgroundImage: '/hero-bg.jpg',
  enableSearch: true,
};

async function main() {
  console.log('بدء تهيئة قاعدة البيانات...');

  // إعدادات الموقع (مفتاح واحد، القيمة JSON)
  await prisma.setting.upsert({
    where: { key: 'site_settings' },
    create: { key: 'site_settings', value: JSON.stringify(defaultSiteSettings), type: 'json', group: 'general' },
    update: {},
  });

  // مستخدم أدمن افتراضي (كلمة المرور: Admin123!)
  const adminEmail = 'admin@ciar.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashed = hashPassword('Admin123!');
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'مدير النظام',
        password: hashed,
        role: UserRole.ADMIN,
        isActive: true,
        lastLogin: new Date(),
      },
    });
    console.log('تم إنشاء مستخدم الأدمن: admin@ciar.com / Admin123!');
  }

  // مواقع العرض (DisplayWebsite)
  const displayCount = await prisma.displayWebsite.count();
  if (displayCount === 0) {
    for (const w of initialWebsites) {
      await prisma.displayWebsite.create({ data: w });
    }
    console.log('تم إضافة', initialWebsites.length, 'موقع عرض.');
  }

  // أخبار افتراضية
  const newsCount = await prisma.newsItem.count();
  if (newsCount === 0) {
    await prisma.newsItem.createMany({
      data: [
        { text: '🎉 خصم 20% على جميع قوالب المواقع هذا الأسبوع', icon: '🎉', active: true, priority: 'high' },
        { text: '🚀 إطلاق ميزات جديدة في لوحة التحكم', icon: '🚀', active: true, priority: 'medium' },
        { text: '📢 صيانة مجدولة يوم الجمعة من 2 صباحاً إلى 4 صباحاً', icon: '📢', active: false, priority: 'low' },
      ],
    });
    console.log('تم إضافة أخبار افتراضية.');
  }

  // خدمات الموقع
  const servicesCount = await prisma.siteService.count();
  if (servicesCount === 0) {
    await prisma.siteService.createMany({
      data: [
        { title: 'تطوير المواقع', description: 'تطوير مواقع ويب احترافية باستخدام أحدث التقنيات', icon: 'Code', active: true, sortOrder: 1 },
        { title: 'التصميم الجرافيكي', description: 'تصميم هويات بصرية وشعارات احترافية', icon: 'Palette', active: true, sortOrder: 2 },
        { title: 'تطبيقات الجوال', description: 'تطوير تطبيقات جوال أصلية لهواتف iOS و Android', icon: 'Smartphone', active: true, sortOrder: 3 },
        { title: 'التسويق الرقمي', description: 'حملات تسويقية شاملة لزيادة وجودك الرقمي', icon: 'TrendingUp', active: false, sortOrder: 4 },
      ],
    });
    console.log('تم إضافة خدمات الموقع.');
  }

  // خلفيات هيرو افتراضية
  const bgCount = await prisma.backgroundImage.count();
  if (bgCount === 0) {
    await prisma.backgroundImage.createMany({
      data: [
        { url: '/header-bg-1.jpg', title: 'تصميم أعمال حديث وأنيق', active: true, sortOrder: 1 },
        { url: '/header-bg-2.jpg', title: 'هيئة شركة فاخرة بالذهبي والأزرق', active: true, sortOrder: 2 },
        { url: '/header-bg-3.jpg', title: 'شركة تكنولوجيا احترافية', active: true, sortOrder: 3 },
        { url: '/header-bg-4.jpg', title: 'تصميم بسيط وأنيق بالأخضر', active: true, sortOrder: 4 },
        { url: '/header-bg-5.jpg', title: 'أفق دبي الحديث عند الغروب', active: true, sortOrder: 5 },
        { url: '/header-bg-6.jpg', title: 'نيويورك مانهاتن المالية', active: true, sortOrder: 6 },
        { url: '/header-bg-7.jpg', title: 'اجتماع رواد الأعمال الحديث', active: true, sortOrder: 7 },
        { url: '/header-bg-8.jpg', title: 'طوكيو الحيوية ليلاً', active: true, sortOrder: 8 },
        { url: '/header-bg-9.jpg', title: 'لندن المالية الأنيقة', active: true, sortOrder: 9 },
        { url: '/header-bg-10.jpg', title: 'مركز الأعمال الناشئ', active: true, sortOrder: 10 },
        { url: '/header-bg-11.jpg', title: 'سنغافورة العصرية', active: true, sortOrder: 11 },
        { url: '/header-bg-12.jpg', title: 'الرياض مركز المملكة', active: true, sortOrder: 12 },
        { url: '/header-bg-13.jpg', title: 'نجاح ريادة الأعمال', active: true, sortOrder: 13 },
        { url: '/header-bg-14.jpg', title: 'مساحة عمل مشتركة مبتكرة', active: true, sortOrder: 14 },
      ],
    });
    console.log('تم إضافة خلفيات افتراضية.');
  }

  // سجلات نظام نموذجية
  const systemLogCount = await prisma.systemLog.count();
  if (systemLogCount === 0) {
    await prisma.systemLog.createMany({
      data: [
        { action: 'تسجيل دخول المدير', user: 'admin@ciar.com', ip: '192.168.1.100', status: 'success', details: 'تم تسجيل الدخول بنجاح' },
        { action: 'إنشاء مستخدم جديد', user: 'admin@ciar.com', ip: '192.168.1.100', status: 'success', details: 'تم إنشاء المستخدم: أحمد محمد' },
        { action: 'محاولة تسجيل دخول فاشلة', user: 'unknown@example.com', ip: '192.168.1.200', status: 'error', details: 'كلمة المرور غير صحيحة' },
      ],
    });
    console.log('تم إضافة سجلات نظام افتراضية.');
  }

  // رسائل تواصل نموذجية (اختياري)
  const contactCount = await prisma.contactMessage.count();
  if (contactCount === 0) {
    await prisma.contactMessage.createMany({
      data: [
        { name: 'سالم أحمد', email: 'salem@example.com', subject: 'استفسار عن تطوير موقع', message: 'أرغب في تطوير موقع تجارة إلكترونية...', status: ContactStatus.NEW },
        { name: 'نورة محمد', email: 'noura@example.com', subject: 'طلب تصميم هوية بصرية', message: 'أحتاج إلى تصميم هوية بصرية كاملة...', status: ContactStatus.READ },
      ],
    });
    console.log('تم إضافة رسائل تواصل نموذجية.');
  }

  // فئة افتراضية (للمواقع والخدمات إن احتجتها)
  const categoryCount = await prisma.category.count();
  if (categoryCount === 0) {
    await prisma.category.createMany({
      data: [
        { name: 'التجارة الإلكترونية', slug: 'ecommerce', sortOrder: 1 },
        { name: 'الموضة', slug: 'fashion', sortOrder: 2 },
        { name: 'السياحة', slug: 'travel', sortOrder: 3 },
        { name: 'العقارات', slug: 'realestate', sortOrder: 4 },
        { name: 'الخدمات', slug: 'services', sortOrder: 5 },
      ],
    });
    console.log('تم إضافة فئات افتراضية.');
  }

  console.log('تمت تهيئة قاعدة البيانات بنجاح.');
}

main()
  .catch((e) => {
    console.error('خطأ في التهيئة:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
