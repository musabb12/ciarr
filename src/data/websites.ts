import { Website } from '@/types'

export interface AdminWebsite extends Website {
  badges?: string[]
  featured?: boolean
  tags?: string[]
  status?: 'active' | 'draft'
  client?: string
  hidden?: boolean
  displayOrder: number
}

const initialWebsites: AdminWebsite[] = [
  {
    id: 'ciar-fashion',
    title: 'CIAR موضة نسائية و رجالية',
    description: 'منصة أزياء متكاملة تعرض أحدث الماركات العالمية مع تجربة تسوق فاخرة وخيارات دفع وشحن دولية.',
    url: 'https://fashion.ciar.com',
    category: 'الموضة',
    technologies: ['Next.js', 'Tailwind CSS', 'Shopify Headless', 'Stripe'],
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80'
    ],
    badges: ['مميز', 'ترند'],
    featured: true,
    tags: ['أزياء', 'متجر إلكتروني', 'موضة'],
    status: 'active',
    client: 'متاجر CIAR',
    hidden: false,
    displayOrder: 1
  },
  {
    id: 'ciar-vip-fashion',
    title: 'CIAR VIP للأزياء الفاخرة',
    description: 'تجربة حصرية لكبار الشخصيات مع تشكيلة مختارة من الألبسة الرجالية والنسائية وخدمات التوصيل المميز.',
    url: 'https://vip-fashion.ciar.com',
    category: 'الموضة الفاخرة',
    technologies: ['Next.js', 'GraphQL', 'Sanity CMS', 'Cloudinary'],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1200&q=80'
    ],
    badges: ['حصري', 'خدمة شخصية'],
    featured: true,
    tags: ['VIP', 'خدمات مميزة', 'أزياء فاخرة'],
    status: 'active',
    client: 'CIAR VIP',
    hidden: false,
    displayOrder: 2
  },
  {
    id: 'ciar-china-b2b',
    title: 'CIAR للمنتجات الصينية والدولية',
    description: 'دليل تجارة بين الشركات يربط المصنعين الصينيين والدوليين مع الشركات العربية في مختلف القطاعات.',
    url: 'https://b2b.ciar.com',
    category: 'تجارة بين الشركات',
    technologies: ['Next.js', 'Node.js', 'MongoDB', 'ElasticSearch'],
    images: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505590465154-4e1262860aee?auto=format&fit=crop&w=1200&q=80'
    ],
    badges: ['B2B', 'دولي'],
    featured: true,
    tags: ['مصانع', 'استيراد', 'تصدير'],
    status: 'active',
    client: 'CIAR Global Trade',
    hidden: false,
    displayOrder: 3
  },
  {
    id: 'ciar-global-mall',
    title: 'CIAR مول إلكتروني عالمي',
    description: 'مول رقمي يضم آلاف العروض اليومية مع أقسام متعددة وتجربة شراء موحدة للشحن الدولي.',
    url: 'https://mall.ciar.com',
    category: 'التجارة الإلكترونية',
    technologies: ['Next.js', 'Redis', 'Stripe', 'Algolia'],
    images: [
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80'
    ],
    badges: ['عروض يومية', 'متعدد الأقسام'],
    featured: true,
    tags: ['تخفيضات', 'مول', 'صفقات'],
    status: 'active',
    client: 'CIAR Commerce',
    hidden: false,
    displayOrder: 4
  },
  {
    id: 'ciar-travel-guide',
    title: 'CIAR الدليل الوسيط السياحي',
    description: 'مرجع سياحي عالمي يعرض الشركات والبرامج السياحية مع إمكانية الحجز المباشر والعروض الموسمية.',
    url: 'https://travel.ciar.com',
    category: 'السياحة',
    technologies: ['Next.js', 'Supabase', 'Mapbox', 'Stripe'],
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1499696786230-29e1058f13c2?auto=format&fit=crop&w=1200&q=80'
    ],
    badges: ['حجوزات', 'عوائق مميزة'],
    tags: ['دول', 'شركات سياحة', 'رحلات'],
    status: 'active',
    client: 'CIAR Travel',
    hidden: false,
    displayOrder: 5
  },
  {
    id: 'ciar-real-estate',
    title: 'CIAR للتسويق العقاري',
    description: 'منصة عقارية متخصصة بالعروض الحصرية، تضم محرك بحث تفاعلي ومخططات ثلاثية الأبعاد وخيارات تمويل.',
    url: 'https://realestate.ciar.com',
    category: 'العقارات',
    technologies: ['Next.js', 'Three.js', 'PostgreSQL', 'Mapbox'],
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'
    ],
    badges: ['360°', 'عروض حصرية'],
    tags: ['شراء', 'تأجير', 'استثمار'],
    status: 'active',
    client: 'CIAR Realty',
    hidden: false,
    displayOrder: 6
  },
  {
    id: 'ciar-auto-market',
    title: 'CIAR دليل تجارة واستئجار السيارات',
    description: 'دليل متكامل لتجارة واستئجار السيارات مع مقارنة الأسعار وتتبع الحالة الفنية وخيارات التأمين.',
    url: 'https://auto.ciar.com',
    category: 'السيارات',
    technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'Stripe'],
    images: [
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80'
    ],
    badges: ['مقارنات', 'اشتراك شهري'],
    tags: ['تأجير', 'بيع', 'تقييم'],
    status: 'active',
    client: 'CIAR Mobility',
    hidden: false,
    displayOrder: 7
  },
  {
    id: 'ciar-home-services',
    title: 'CIAR دليل صيانة المنازل والمكاتب',
    description: 'بوابة خدمات منزلية ومكتبية مع عقود صيانة دورية، تقييمات موثقة، وجدولة زيارات ذكية.',
    url: 'https://services.ciar.com',
    category: 'الخدمات المنزلية',
    technologies: ['Next.js', 'Firebase', 'Twilio', 'Stripe'],
    images: [
      'https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1456613820599-bfe244172af5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1483930412997-1cbc94f7c9c5?auto=format&fit=crop&w=1200&q=80'
    ],
    badges: ['اشتراكات', 'متخصصون'],
    tags: ['تنظيف', 'صيانة', 'مكاتب'],
    status: 'active',
    client: 'CIAR Services',
    hidden: false,
    displayOrder: 8
  },
  {
    id: 'ciar-global-shipping',
    title: 'CIAR دليل شحن عالمي للبضائع',
    description: 'منصة شحن دولي تعرض مزودي الخدمات، تتبع مباشر للحاويات، وحاسبة تكاليف لحظية.',
    url: 'https://shipping.ciar.com',
    category: 'الخدمات اللوجستية',
    technologies: ['Next.js', 'WebSockets', 'Redis', 'OpenAPI'],
    images: [
      'https://images.unsplash.com/photo-1505839673365-e3971f8d9184?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&w=1200&q=80'
    ],
    badges: ['تتبع لحظي', 'دولي'],
    tags: ['بحري', 'جوي', 'بري'],
    status: 'active',
    client: 'CIAR Logistics',
    hidden: false,
    displayOrder: 9
  },
  {
    id: 'ciar-jobs',
    title: 'CIAR دليل الشواغر وفرص العمل',
    description: 'شبكة توظيف للوظائف والسكن المخصص للموظفين مع لوحات تحكم للشركات وبرامج إحالة مبتكرة.',
    url: 'https://jobs.ciar.com',
    category: 'التوظيف',
    technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'Supabase Auth'],
    images: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
    ],
    badges: ['لوحة وظائف', 'إحالات'],
    tags: ['وظائف', 'سكن', 'موارد بشرية'],
    status: 'active',
    client: 'CIAR Talent',
    hidden: false,
    displayOrder: 10
  },
  {
    id: 'ciar-ads',
    title: 'CIAR للحملات الإعلانية',
    description: 'استوديو رقمي لتصميم واستضافة وإدارة الحملات الإعلانية مع تقارير أداء لحظية ولوحات تفاعلية.',
    url: 'https://ads.ciar.com',
    category: 'التسويق',
    technologies: ['Next.js', 'Supabase', 'Segment', 'BigQuery'],
    images: [
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1450101215322-bf5cd27642fc?auto=format&fit=crop&w=1200&q=80'
    ],
    badges: ['تحليلات', 'أتمتة'],
    tags: ['إعلانات', 'حملات', 'تحليل'],
    status: 'active',
    client: 'CIAR Marketing Lab',
    hidden: false,
    displayOrder: 11
  },
  {
    id: 'ciar-equity',
    title: 'CIAR أسهم المنصة الخاصة',
    description: 'منصة استثمارية للأعضاء تعرض فرص شراء أسهم خاصة وتقارير أداء ومحافظ مخصصة.',
    url: 'https://equity.ciar.com',
    category: 'الاستثمار',
    technologies: ['Next.js', 'd3.js', 'PostgreSQL', 'NextAuth'],
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80'
    ],
    badges: ['أعضاء فقط', 'استثمار'],
    tags: ['أسهم', 'تداول', 'تقارير'],
    status: 'active',
    client: 'CIAR Capital',
    hidden: false,
    displayOrder: 12
  },
  {
    id: 'ciar-delivery',
    title: 'CIAR دليفري',
    description: 'شبكة توصيل سريعة مع تتبع مباشر وتجزئة حسب المدن، مخصصة لإطلاق قريب.',
    url: 'https://delivery.ciar.com',
    category: 'التوصيل',
    technologies: ['Next.js', 'React Native', 'Firebase', 'Stripe'],
    images: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80'
    ],
    badges: ['قريباً'],
    tags: ['توصيل', 'مطاعم', 'متاجر'],
    status: 'draft',
    client: 'CIAR Express',
    hidden: true,
    displayOrder: 13
  },
  {
    id: 'ciar-auto-exclusive',
    title: 'CIAR السيارات الخاصة',
    description: 'حلول أساطيل وسيارات خاصة للشركات مع إدارة حجوزات متقدمة ومراقبة فورية.',
    url: 'https://fleet.ciar.com',
    category: 'السيارات الحصرية',
    technologies: ['Next.js', 'IoT APIs', 'Supabase', 'Stripe'],
    images: [
      'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1441148345475-03a2e82f9719?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549921296-3ec93abae044?auto=format&fit=crop&w=1200&q=80'
    ],
    badges: ['خاص', 'إطلاق قريب'],
    tags: ['أساطيل', 'شركات', 'VIP'],
    status: 'draft',
    client: 'CIAR Mobility Pro',
    hidden: true,
    displayOrder: 14
  },
  {
    id: 'ciar-taxi',
    title: 'CIAR التكسي الذكي',
    description: 'منصة نقل حضري ذكية مع تتبع في الوقت الحقيقي ونظام ولاء للسائقين والركاب.',
    url: 'https://taxi.ciar.com',
    category: 'النقل الحضري',
    technologies: ['Next.js', 'React Native', 'Supabase', 'Mapbox'],
    images: [
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1473181488821-2d23949a045a?auto=format&fit=crop&w=1200&q=80'
    ],
    badges: ['تطوير', 'نظام ولاء'],
    tags: ['نقل', 'تكسي', 'ذكي'],
    status: 'draft',
    client: 'CIAR Transit',
    hidden: true,
    displayOrder: 15
  }
]

let websitesStore: AdminWebsite[] = initialWebsites.map(site => ({ ...site }))

export function listWebsites(options?: { includeHidden?: boolean }) {
  const sorted = [...websitesStore].sort((a, b) => a.displayOrder - b.displayOrder)
  if (options?.includeHidden) {
    return sorted
  }
  return sorted.filter(site => !site.hidden)
}

export function addWebsite(site: AdminWebsite) {
  websitesStore = [...websitesStore, site]
  return site
}

export function updateWebsite(id: string, updates: Partial<AdminWebsite>) {
  const index = websitesStore.findIndex(site => site.id === id)
  if (index === -1) {
    return null
  }
  websitesStore[index] = { ...websitesStore[index], ...updates }
  return websitesStore[index]
}

export function removeWebsite(id: string) {
  const exists = websitesStore.some(site => site.id === id)
  websitesStore = websitesStore.filter(site => site.id !== id)
  return exists
}

