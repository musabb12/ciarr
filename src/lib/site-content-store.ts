/**
 * مخزن محتوى الموقع (الصفحة الرئيسية وغيرها).
 * يُستخدم من واجهة الإدارة للتعديل ومن الواجهة العامة للقراءة.
 */

export interface HeroContent {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
}

export interface StatItem {
  number: string;
  label: string;
}

export interface VisitorStat {
  number: string;
  title: string;
  description: string;
}

export interface FeatureItem {
  title: string;
  desc: string;
  iconKey: string; // CheckCircle | Clock | Users | TrendingUp
}

export interface TestimonialItem {
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}

export interface PlanItem {
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface BlogPostItem {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  link?: string;
}

export interface PartnerItem {
  name: string;
  logo?: string;
}

/** إعدادات الخطوط: القيم amiri | cairo | tajawal (مطابقة للخطوط المحمّلة في الموقع) */
export interface FontSettings {
  /** خط العناوين (h1, h2, ...) */
  heading?: 'amiri' | 'cairo' | 'tajawal';
  /** خط النص الأساسي */
  body?: 'amiri' | 'cairo' | 'tajawal';
  /** خط النص العصري (فقرات، أزرار) */
  modern?: 'amiri' | 'cairo' | 'tajawal';
}

export interface SiteContent {
  fontSettings?: FontSettings;
  hero: HeroContent;
  stats: StatItem[];
  statsVisitor: VisitorStat[];
  features: FeatureItem[];
  testimonials: TestimonialItem[];
  process: ProcessStep[];
  plans: PlanItem[];
  faq: FaqItem[];
  blogPosts: BlogPostItem[];
  partners: PartnerItem[];
  newsletterTitle: string;
  newsletterSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  footerDescription: string;
  sectionTitles: {
    stats?: string;
    categories?: string;
    categoriesSub?: string;
    websites?: string;
    websitesSub?: string;
    services?: string;
    servicesSub?: string;
    testimonials?: string;
    testimonialsSub?: string;
    features?: string;
    featuresSub?: string;
    process?: string;
    processSub?: string;
    plans?: string;
    plansSub?: string;
    blog?: string;
    blogSub?: string;
    partners?: string;
    partnersSub?: string;
    faq?: string;
    faqSub?: string;
  };
}

const defaultContent: SiteContent = {
  fontSettings: {
    heading: 'amiri',
    body: 'cairo',
    modern: 'tajawal',
  },
  hero: {
    title: 'عرض جميع مواقعنا الـ 14',
    subtitle: 'قطاعاتنا وخدماتنا',
    searchPlaceholder: 'ابحث عن قطاع أو خدمة...',
  },
  stats: [
    { number: '14', label: 'موقع إلكتروني' },
    { number: '14+', label: 'مزود خدمة' },
    { number: '15,000+', label: 'عميل راضٍ' },
    { number: '4.8/5', label: 'تقييم' },
  ],
  statsVisitor: [
    { number: '24K', title: 'زوار شهرياً', description: 'متوسط عدد الزوار في جميع مواقع CIAR خلال آخر 30 يوماً' },
    { number: '18', title: 'دولة', description: 'زوار من أكثر من 18 دولة مختلفة يستخدمون مواقعنا يومياً' },
    { number: '3.2', title: 'دقائق في الجلسة', description: 'متوسط مدة الجلسة الواحدة للزائر في أحد مواقع CIAR' },
  ],
  features: [
    { title: 'جودة عالية', desc: 'معايير جودة صارمة في كل مشروع', iconKey: 'CheckCircle' },
    { title: 'تسليم سريع', desc: 'التزام بالمواعيد النهائية المحددة', iconKey: 'Clock' },
    { title: 'دعم 24/7', desc: 'فريق دعم متخصص على مدار الساعة', iconKey: 'Users' },
    { title: 'نتائج مضمونة', desc: 'تحقيق أهداف عملائنا بنجاح', iconKey: 'TrendingUp' },
  ],
  testimonials: [
    { name: 'أحمد محمد', role: 'عميل موقع العقارات', content: 'منصة عقارية ممتازة. وجدت العرض المناسب وحصلت على تمويل بسهولة.', rating: 5 },
    { name: 'فاطمة العلي', role: 'عميلة موقع السياحة', content: 'حجزت رحلتي من موقعكم السياحي. تجربة سلسة وعروض متنوعة.', rating: 5 },
    { name: 'خالد السعيد', role: 'عميل المول الإلكتروني', content: 'أطلب من مول CIAR بانتظام. تشكيلة واسعة وشحن موثوق.', rating: 5 },
  ],
  process: [
    { step: '1', title: 'استشارة', desc: 'فهم متطلباتك وأهدافك' },
    { step: '2', title: 'تخطيط', desc: 'وضع خطة عمل مفصلة' },
    { step: '3', title: 'تنفيذ', desc: 'تقديم الخدمة وتشغيل المنصة' },
    { step: '4', title: 'تسليم', desc: 'تسليم المشروع ودعم مستمر' },
  ],
  plans: [
    { name: 'أساسي', price: 'مجاني', features: ['عرض موقع واحد', 'دعم أساسي', 'تحليلات محدودة'] },
    { name: 'احترافي', price: '99 ريال/شهرياً', features: ['عرض 10 مواقع', 'دعم متميز', 'تحليلات كاملة', 'SEO متقدم'], popular: true },
    { name: 'مؤسسي', price: '299 ريال/شهرياً', features: ['مواقع غير محدودة', 'دعم أولوية', 'تحليلات متقدمة', 'SEO احترافي', 'API مخصص'] },
  ],
  faq: [
    { q: 'كم عدد مواقع شركة CIAR؟', a: 'لدينا 14 موقعاً إلكترونياً تغطي عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار، تسويق، لوجستيات، وتوصيل.' },
    { q: 'هل تقدمون دعماً للعملاء؟', a: 'نعم، نقدم دعماً للعملاء على مدار الساعة لجميع مواقعنا وخدماتنا.' },
    { q: 'كيف أصل إلى الموقع المناسب لاحتياجي؟', a: 'يمكنك تصفح قائمة مواقعنا الـ 14 من صفحة «المواقع» أو البحث حسب القطاع (عقاري، سياحي، موضة، وغيرها).' },
  ],
  blogPosts: [
    { title: 'كيف تختار العرض المناسب من موقعنا العقاري', excerpt: 'نصائح للبحث عن عقار والتمويل عبر منصة CIAR العقارية', date: '15 يناير 2024', image: '/project-portfolio.jpg' },
    { title: 'أفضل الوجهات والحجوزات من موقعنا السياحي', excerpt: 'اكتشف العروض والبرامج السياحية وحجز رحلاتك بسهولة', date: '12 يناير 2024', image: '/project-restaurant.jpg' },
    { title: 'تسوق الأزياء والتجارة الإلكترونية من مواقعنا', excerpt: 'موضة، مول إلكتروني، وتجارة B2B — كل ما تحتاجه في مكان واحد', date: '8 يناير 2024', image: '/project-ecommerce.jpg' },
  ],
  partners: [
    { name: 'شريك 1' },
    { name: 'شريك 2' },
    { name: 'شريك 3' },
    { name: 'شريك 4' },
    { name: 'شريك 5' },
    { name: 'شريك 6' },
  ],
  newsletterTitle: 'انضم إلى نشرتنا البريدية',
  newsletterSubtitle: 'احصل على آخر العروض والأخبار والنصائح مباشرة في بريدك',
  ctaTitle: 'اكتشف مواقعنا الـ 14',
  ctaSubtitle: 'عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار، وتسويق — كل ما تحتاجه تحت سقف واحد',
  footerDescription: 'شركة CIAR — 14 موقعاً يخدمونك: عقاري، سياحي، موضة، تجارة إلكترونية، وأكثر',
  sectionTitles: {
    categories: 'تصفح مواقعنا حسب القطاع',
    categoriesSub: 'عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار، وأكثر',
    websites: 'مواقعنا الـ 14',
    websitesSub: 'مواقع شركة CIAR في قطاعات متعددة: عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار، وتسويق',
    services: 'قطاعاتنا وخدماتنا',
    servicesSub: 'عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار، تسويق، لوجستيات، وأكثر',
    testimonials: 'آراء العملاء',
    testimonialsSub: 'ماذا يقول عملاؤنا عن تجربتهم معنا',
    features: 'لماذا تختارنا؟',
    featuresSub: 'نقدم أفضل الحلول الرقمية لتنمية أعمالك',
    process: 'كيف نعمل',
    processSub: 'عملية عمل بسيطة وفعالة لتحقيق أهدافك',
    plans: 'خطط مرنة',
    plansSub: 'اختر الخطة التي تناسب احتياجاتك',
    blog: 'أحدث المقالات',
    blogSub: 'نصائح وأخبار من عالم التكنولوجيا',
    partners: 'شركاء النجاح',
    partnersSub: 'نفتخر بالعمل مع أفضل الشركات',
    faq: 'الأسئلة الشائعة',
    faqSub: 'إجابات على أكثر الأسئلة شيوعاً',
  },
};

let store: SiteContent = { ...defaultContent };

export function getSiteContent(): SiteContent {
  return store;
}

export function setSiteContent(content: Partial<SiteContent>): SiteContent {
  store = { ...store, ...content };
  return store;
}

export function resetSiteContent(): SiteContent {
  store = { ...defaultContent };
  return store;
}

export function getDefaultSiteContent(): SiteContent {
  return { ...defaultContent };
}
