export const languages = {
  ar: { name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  en: { name: 'English', flag: '🇺🇸', dir: 'ltr' },
  fr: { name: 'Français', flag: '🇫🇷', dir: 'ltr' }
};

export type Language = keyof typeof languages;

export const translations = {
  ar: {
    // Navigation
    nav: {
      home: 'الرئيسية',
      websites: 'المواقع',
      services: 'الخدمات',
      about: 'من نحن',
      contact: 'اتصل بنا',
      admin: 'لوحة التحكم'
    },
    // Hero Section
    hero: {
      title: 'منصتك العالمية',
      subtitle: 'كل ما تحتاجه في العالم تجده هنا',
      searchPlaceholder: 'ابحث عن مواقع أو خدمات...',
      contactUs: 'اتصل بنا'
    },
    // Categories (business domains of our 14 websites)
    categories: {
      all: 'جميع الفئات',
      ecommerce: 'التجارة الإلكترونية',
      portfolio: 'العقارات',
      blog: 'السياحة',
      saas: 'الموضة والأزياء',
      restaurant: 'السيارات والتنقل'
    },
    // Services (what our 14 sites offer — business services, not dev)
    services: {
      development: 'عقاري',
      developmentDesc: 'منصة عقارية للعروض الحصرية والبحث والتمويل',
      design: 'سياحي',
      designDesc: 'دليل سياحي عالمي مع حجز ورحلات وعروض موسمية',
      mobile: 'موضة وتجارة',
      mobileDesc: 'أزياء ومول إلكتروني وتجارة B2B ومنتجات دولية',
      marketing: 'توظيف واستثمار وتسويق',
      marketingDesc: 'وظائف وسكن، استثمار وأسهم، وحملات إعلانية'
    },
    // Stats
    stats: {
      websites: 'موقع إلكتروني',
      providers: 'قطاع نخدمه',
      customers: 'عميل راضٍ',
      rating: 'متوسط التقييم'
    },
    // Section headings & CTAs
    sections: {
      featuredWebsitesTitle: 'مواقعنا الـ 14',
      featuredWebsitesSubtitle: 'مواقع شركة CIAR في قطاعات متعددة: عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار، وتسويق',
      featuredWebsitesViewAll: 'عرض جميع مواقعنا الـ 14',
      featuredWebsitesVisitSite: 'زيارة الموقع',
      browseBySectorTitle: 'تصفح مواقعنا حسب القطاع',
      browseBySectorSubtitle: 'عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار، وأكثر',
      servicesTitle: 'قطاعاتنا وخدماتنا',
      servicesSubtitle: 'عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار، تسويق، لوجستيات، وأكثر',
      servicesLearnMore: 'اعرف المزيد',
      testimonialsTitle: 'آراء العملاء',
      testimonialsSubtitle: 'ماذا يقول عملاؤنا عن تجربتهم معنا',
      whyUsTitle: 'لماذا تختارنا؟',
      whyUsSubtitle: 'نقدم أفضل الحلول الرقمية لتنمية أعمالك',
      processTitle: 'كيف نعمل',
      processSubtitle: 'عملية عمل بسيطة وفعالة لتحقيق أهدافك',
      pricingTitle: 'خطط مرنة',
      pricingSubtitle: 'اختر الخطة التي تناسب احتياجاتك',
      pricingPopularBadge: 'الأكثر شعبية',
      pricingChoosePlan: 'اختر الخطة',
    },
    // News Bar
    news: {
      offer1: 'اكتشف مواقعنا: عقاري، سياحي، موضة، تجارة إلكترونية، وأكثر',
      offer2: 'منصات جديدة قيد الإطلاق: توصيل، نقل حضري، أساطيل',
      offer3: 'خدمات السيارات والتوظيف والاستثمار متوفرة الآن'
    },
    // Common
    common: {
      viewDetails: 'معاينة',
      featured: 'مميز',
      bestSeller: 'الأكثر مبيعاً',
      trending: 'رائج',
      provider: 'المزود',
      rating: 'التقييم',
      reviews: 'تقييمات',
      search: 'بحث',
      filter: 'فلتر',
      all: 'الكل',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ ما',
      retry: 'إعادة المحاولة'
    }
  },
  en: {
    // Navigation
    nav: {
      home: 'Home',
      websites: 'Websites',
      services: 'Services',
      about: 'About',
      contact: 'Contact',
      admin: 'Admin'
    },
    // Hero Section
    hero: {
      title: 'CIAR — <span>14 Websites</span> at Your Service',
      subtitle: 'Real estate, travel, fashion, e-commerce, cars, jobs, investment, and more — all under one roof',
      searchPlaceholder: 'Search our websites and services...',
      contactUs: 'Contact Us'
    },
    // Categories
    categories: {
      all: 'All Categories',
      ecommerce: 'E-commerce',
      portfolio: 'Real Estate',
      blog: 'Travel & Tourism',
      saas: 'Fashion & Style',
      restaurant: 'Cars & Mobility'
    },
    // Services (business domains, not dev)
    services: {
      development: 'Real Estate',
      developmentDesc: 'Property listings, search, financing, and exclusive offers',
      design: 'Travel & Tourism',
      designDesc: 'Global travel guide with booking, trips, and seasonal offers',
      mobile: 'Fashion & Commerce',
      mobileDesc: 'Fashion, mall, B2B trade, and international products',
      marketing: 'Jobs, Investment & Marketing',
      marketingDesc: 'Jobs and housing, investment and equity, ad campaigns'
    },
    // Stats
    stats: {
      websites: 'Websites',
      providers: 'Sectors We Serve',
      customers: 'Happy Customers',
      rating: 'Average Rating'
    },
    // Section headings & CTAs
    sections: {
      featuredWebsitesTitle: 'Our 14 Websites',
      featuredWebsitesSubtitle: 'CIAR platforms across real estate, travel, fashion, e‑commerce, cars, jobs, investment, and marketing',
      featuredWebsitesViewAll: 'View All 14 Websites',
      featuredWebsitesVisitSite: 'Visit Website',
      browseBySectorTitle: 'Browse Our Websites by Sector',
      browseBySectorSubtitle: 'Real estate, travel, fashion, e‑commerce, cars, jobs, investment, and more',
      servicesTitle: 'Our Sectors & Services',
      servicesSubtitle: 'Real estate, tourism, fashion, e‑commerce, cars, jobs, investment, marketing, logistics, and more',
      servicesLearnMore: 'Learn More',
      testimonialsTitle: 'What Our Clients Say',
      testimonialsSubtitle: 'Testimonials about working with CIAR platforms',
      whyUsTitle: 'Why Choose CIAR?',
      whyUsSubtitle: 'We deliver premium digital experiences to grow your business',
      processTitle: 'How We Work',
      processSubtitle: 'A simple, effective process to achieve your goals',
      pricingTitle: 'Flexible Plans',
      pricingSubtitle: 'Choose the plan that fits your needs',
      pricingPopularBadge: 'Most Popular',
      pricingChoosePlan: 'Choose Plan',
      newsletterTitle: 'Join Our Newsletter',
      newsletterSubtitle: 'Get the latest offers, news, and tips directly in your inbox',
      newsletterEmailPlaceholder: 'Your email address',
      newsletterCta: 'Subscribe now',
      blogTitle: 'Latest Articles',
      blogSubtitle: 'Tips and news from the digital world',
      blogReadMore: 'Read more',
      partnersTitle: 'Our Partners',
      partnersSubtitle: 'We are proud to work with leading companies',
      partnerLabel: 'Partner',
      faqTitle: 'Frequently Asked Questions',
      faqSubtitle: 'Answers to the most common questions',
      statsBlockWebsites: 'Websites',
      statsBlockSectors: 'Sectors we serve',
      statsBlockCustomers: 'Happy customers',
      statsBlockSupport: 'Customer support',
    },
    // News Bar
    news: {
      offer1: 'Explore our sites: real estate, travel, fashion, e-commerce, and more',
      offer2: 'New platforms coming: delivery, urban transport, fleets',
      offer3: 'Cars, jobs, and investment services available now'
    },
    // Common
    common: {
      viewDetails: 'Preview',
      featured: 'Featured',
      bestSeller: 'Best Seller',
      trending: 'Trending',
      provider: 'Provider',
      rating: 'Rating',
      reviews: 'Reviews',
      search: 'Search',
      filter: 'Filter',
      all: 'All',
      loading: 'Loading...',
      error: 'Something went wrong',
      retry: 'Retry'
    }
  },
  fr: {
    // Navigation
    nav: {
      home: 'Accueil',
      websites: 'Sites Web',
      services: 'Services',
      about: 'À Propos',
      contact: 'Contact',
      admin: 'Admin'
    },
    // Hero Section
    hero: {
      title: 'CIAR — <span>14 Sites Web</span> à Votre Service',
      subtitle: 'Immobilier, voyage, mode, e-commerce, auto, emploi, investissement et plus — tout sous un même toit',
      searchPlaceholder: 'Rechercher nos sites et services...',
      contactUs: 'Contactez-nous'
    },
    // Categories
    categories: {
      all: 'Toutes les Catégories',
      ecommerce: 'E-commerce',
      portfolio: 'Immobilier',
      blog: 'Voyage & Tourisme',
      saas: 'Mode & Style',
      restaurant: 'Auto & Mobilité'
    },
    // Services
    services: {
      development: 'Immobilier',
      developmentDesc: 'Annonces, recherche, financement et offres exclusives',
      design: 'Voyage & Tourisme',
      designDesc: 'Guide voyage avec réservation, circuits et offres saisonnières',
      mobile: 'Mode & Commerce',
      mobileDesc: 'Mode, galerie marchande, B2B et produits internationaux',
      marketing: 'Emploi, Investissement & Marketing',
      marketingDesc: 'Emploi et logement, investissement, campagnes publicitaires'
    },
    // Stats
    stats: {
      websites: 'Sites Web',
      providers: 'Secteurs Desservis',
      customers: 'Clients Satisfaits',
      rating: 'Note Moyenne'
    },
    // Section headings & CTAs
    sections: {
      featuredWebsitesTitle: 'Nos 14 Sites Web',
      featuredWebsitesSubtitle: 'Les plateformes CIAR: immobilier, voyage, mode, e‑commerce, auto, emploi, investissement et marketing',
      featuredWebsitesViewAll: 'Voir Nos 14 Sites',
      featuredWebsitesVisitSite: 'Visiter le Site',
      browseBySectorTitle: 'Parcourir Nos Sites par Secteur',
      browseBySectorSubtitle: 'Immobilier, voyage, mode, e‑commerce, auto, emploi, investissement et plus',
      servicesTitle: 'Nos Secteurs & Services',
      servicesSubtitle: 'Immobilier, tourisme, mode, e‑commerce, auto, emploi, investissement, marketing, logistique et plus',
      servicesLearnMore: 'En savoir plus',
      testimonialsTitle: 'Avis Clients',
      testimonialsSubtitle: 'Ce que disent nos clients de leur expérience',
      whyUsTitle: 'Pourquoi Choisir CIAR ?',
      whyUsSubtitle: 'Nous offrons des solutions numériques premium pour développer votre activité',
      processTitle: 'Notre Méthode',
      processSubtitle: 'Un processus simple et efficace pour atteindre vos objectifs',
      pricingTitle: 'Offres Flexibles',
      pricingSubtitle: 'Choisissez la formule adaptée à vos besoins',
      pricingPopularBadge: 'La Plus Populaire',
      pricingChoosePlan: 'Choisir l\'offre',
      newsletterTitle: 'Rejoignez Notre Newsletter',
      newsletterSubtitle: 'Recevez nos offres, actualités et conseils dans votre boîte mail',
      newsletterEmailPlaceholder: 'Votre adresse e-mail',
      newsletterCta: 'S\'abonner',
      blogTitle: 'Derniers Articles',
      blogSubtitle: 'Conseils et actualités du monde numérique',
      blogReadMore: 'Lire la suite',
      partnersTitle: 'Nos Partenaires',
      partnersSubtitle: 'Nous sommes fiers de collaborer avec les meilleures entreprises',
      partnerLabel: 'Partenaire',
      faqTitle: 'Questions Fréquentes',
      faqSubtitle: 'Réponses aux questions les plus courantes',
      statsBlockWebsites: 'Sites web',
      statsBlockSectors: 'Secteurs desservis',
      statsBlockCustomers: 'Clients satisfaits',
      statsBlockSupport: 'Support client',
    },
    // News Bar
    news: {
      offer1: 'Découvrez nos sites: immobilier, voyage, mode, e-commerce et plus',
      offer2: 'Nouvelles plateformes à venir: livraison, transport, flottes',
      offer3: 'Auto, emploi et investissement disponibles maintenant'
    },
    // Common
    common: {
      viewDetails: 'Aperçu',
      featured: 'En Vedette',
      bestSeller: 'Meilleure Vente',
      trending: 'Tendance',
      provider: 'Prestataire',
      rating: 'Note',
      reviews: 'Avis',
      search: 'Rechercher',
      filter: 'Filtrer',
      all: 'Tout',
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
      retry: 'Réessayer'
    }
  }
};

export function useTranslation(language: Language) {
  return translations[language];
}

export function getDirection(language: Language): 'rtl' | 'ltr' {
  return languages[language].dir;
}