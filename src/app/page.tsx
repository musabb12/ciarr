'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, ChevronDown, Search, Star, ShoppingCart, Globe, Code, Palette, Smartphone, TrendingUp, Users, Clock, CheckCircle, ArrowRight, ChevronLeft, ChevronRight, Play, Pause, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LanguageSelector } from '@/components/LanguageSelector';
import { CurrencySelector } from '@/components/CurrencySelector';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserNav } from '@/components/UserNav';
import { PaymentMethods } from '@/components/PaymentMethods';
import { useLanguage } from '@/hooks/useLanguage';
import GlobalSearch from '@/components/ui/global-search';
import { AnimatePresence, motion } from 'framer-motion';

// Image Carousel Component for Home Page
function ImageCarousel({ images, title }: { images: string[], title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <ImageIcon className="h-12 w-12 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="relative group" dir="ltr">
      <div className="aspect-video overflow-hidden rounded-lg">
        <img
          src={images[currentIndex]}
          alt={`${title} - صورة ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
      </div>
      
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="الصورة السابقة"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="الصورة التالية"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-2 left-2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={isPlaying ? "إيقاف" : "تشغيل"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                type="button"
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
                }`}
                aria-label={`الانتقال إلى الصورة ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());
  const defaultNewsItems = [
    { id: 'default-1', text: 'خصم 20% على جميع قوالب المواقع هذا الأسبوع', icon: '🏷️', active: true },
    { id: 'default-2', text: 'إطلاق ميزات جديدة في لوحة التحكم', icon: '🚀', active: true },
    { id: 'default-3', text: 'نصائح جديدة لتحسين أداء موقعك', icon: '📍', active: true },
  ];
  const [newsItems, setNewsItems] = useState<any[]>(defaultNewsItems);
  const [featuredWebsites, setFeaturedWebsites] = useState<any[]>([]);
  const [siteContent, setSiteContent] = useState<Record<string, any> | null>(null);
  const [siteSettings, setSiteSettings] = useState<Record<string, any> | null>(null);
  const { language, t, dir } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut for global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Trigger global search - this would need to be wired up to the GlobalSearch component
        const searchEvent = new CustomEvent('openGlobalSearch');
        window.dispatchEvent(searchEvent);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /** إعادة جلب كل بيانات الموقع من الخادم لتطبيق أي تغيير تم في لوحة التحكم فوراً */
  const refreshSiteData = () => {
    const opts = { cache: 'no-store' as RequestCache, headers: { 'Cache-Control': 'no-cache' } };
    const ts = `?_=${Date.now()}`;
    fetchBackgroundImages();
    fetchNewsItems();
    fetchFeaturedWebsites();
    fetch(`/api/site-content${ts}`, opts)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setSiteContent(data))
      .catch(() => {});
    fetch(`/api/settings${ts}`, opts)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setSiteSettings(data))
      .catch(() => {});
  };

  useEffect(() => {
    refreshSiteData();
  }, []);

  /** عند العودة لتبويب الموقع: إعادة جلب البيانات لرؤية آخر التعديلات من لوحة التحكم */
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') refreshSiteData();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  /** تحديث دوري كل 5 ثوان لظهور التغييرات فوراً دون الحاجة لتحديث الصفحة */
  useEffect(() => {
    const interval = setInterval(refreshSiteData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (backgroundImages.length > 0 && !isPaused) {
      const interval = setInterval(() => {
        setCurrentBgIndex((prev) => {
          let nextIndex = (prev + 1) % backgroundImages.length;
          // 跳过加载失败的图片
          while (imageLoadErrors.has(nextIndex) && nextIndex !== prev) {
            nextIndex = (nextIndex + 1) % backgroundImages.length;
            if (nextIndex === prev) break; // 避免无限循环
          }
          return nextIndex;
        });
      }, 5000); // 每5秒切换一次
      return () => clearInterval(interval);
    }
  }, [backgroundImages, isPaused, imageLoadErrors]);

  // 键盘控制
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentBgIndex((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [backgroundImages.length]);

  const fetchBackgroundImages = async () => {
    const fallbackImages = [
      'https://images.pexels.com/photos/260689/pexels-photo-260689.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1181400/pexels-photo-1181400.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/5668835/pexels-photo-5668835.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/37347/office-freelancer-computer-business-37347.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/1181351/pexels-photo-1181351.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/5668870/pexels-photo-5668870.jpeg?auto=compress&cs=tinysrgb&w=1920',
      'https://images.pexels.com/photos/811198/pexels-photo-811198.jpeg?auto=compress&cs=tinysrgb&w=1920',
    ];
    try {
      const response = await fetch('/api/admin/background-images');
      if (!response.ok) throw new Error('API failed');
      const data = await response.json();
      const imageUrls = Array.isArray(data) ? data.map((img: any) => img?.url).filter(Boolean) : [];
      setBackgroundImages(imageUrls.length > 0 ? imageUrls : fallbackImages);
      setImageLoadErrors(new Set());
    } catch (error) {
      setBackgroundImages(fallbackImages);
      setImageLoadErrors(new Set());
    }
  };

  const fetchNewsItems = async () => {
    try {
      const response = await fetch('/api/news');
      if (!response.ok) {
        setNewsItems((prev) => (prev.length > 0 ? prev : defaultNewsItems));
        return;
      }
      const items = await response.json();
      const active = Array.isArray(items) ? items.filter((item: any) => item?.active !== false) : [];
      setNewsItems(active.length > 0 ? active : defaultNewsItems);
    } catch (error) {
      setNewsItems((prev) => (prev.length > 0 ? prev : defaultNewsItems));
    }
  };

  const fetchFeaturedWebsites = async () => {
    try {
      const response = await fetch('/api/websites');
      if (!response.ok) return;
      const websites = await response.json();
      if (!Array.isArray(websites)) return;
      const ordered = [...websites].sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
      setFeaturedWebsites(ordered.slice(0, 6));
    } catch (error) {
      setFeaturedWebsites([]);
    }
  };

  const handleImageError = (index: number) => {
    setImageLoadErrors((prev) => new Set(prev).add(index));
    // 如果当前图片加载失败，自动切换到下一张
    if (index === currentBgIndex) {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }
  };

  const handleImageLoad = (index: number) => {
    setImageLoadErrors((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const goToPrevious = () => {
    setCurrentBgIndex((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length);
  };

  const goToNext = () => {
    setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
  };

  const navItems = [
    { name: t.nav.home, href: '/' },
    { name: t.nav.websites, href: '/websites' },
    { name: t.nav.services, href: '/services' },
    { name: t.nav.about, href: '/about' },
    // { name: t.nav.contact, href: '/contact' },
    // { name: 'الإدارة', href: '/admin' } 
  ];

  const categories = [
    { id: 'all', name: t.categories.all, icon: <Globe className="w-5 h-5" /> },
    { id: 'التجارة الإلكترونية', name: t.categories.ecommerce, icon: <ShoppingCart className="w-5 h-5" /> },
    { id: 'العقارات', name: t.categories.portfolio, icon: <Palette className="w-5 h-5" /> },
    { id: 'السياحة', name: t.categories.blog, icon: <Code className="w-5 h-5" /> },
    { id: 'الموضة', name: t.categories.saas, icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'السيارات', name: t.categories.restaurant, icon: <Users className="w-5 h-5" /> }
  ];

  const services = [
    {
      icon: <Code className="w-8 h-8 text-green-600" />,
      title: t.services.development,
      description: t.services.developmentDesc
    },
    {
      icon: <Palette className="w-8 h-8 text-green-600" />,
      title: t.services.design,
      description: t.services.designDesc
    },
    {
      icon: <Smartphone className="w-8 h-8 text-green-600" />,
      title: t.services.mobile,
      description: t.services.mobileDesc
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: t.services.marketing,
      description: t.services.marketingDesc
    }
  ];

  const stats = siteContent?.stats ?? [
    { number: '14', label: t.stats.websites },
    { number: '14+', label: t.stats.providers },
    { number: '15,000+', label: t.stats.customers },
    { number: '4.8/5', label: t.stats.rating }
  ];

  const logoSrc =
    siteSettings?.siteLogo && siteSettings.siteLogo !== ''
      ? siteSettings.siteLogo.startsWith('/')
        ? siteSettings.siteLogo
        : `/${siteSettings.siteLogo}`
      : '/logo.png';

  const filteredWebsites = featuredWebsites.filter(website => {
    const matchesCategory = selectedCategory === 'all' || website.category === selectedCategory;
    const matchesSearch = website.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (website.description && website.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  /** عرض صفحة الصيانة عند تفعيل وضع الصيانة من لوحة الأدمن */
  if (siteSettings?.maintenanceMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 font-arabic-modern p-4" dir="rtl">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-500/20 flex items-center justify-center">
            <span className="text-4xl">🔧</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mb-2">الموقع قيد الصيانة</h1>
          <p className="text-amber-200/80">{siteSettings.maintenanceMessage || 'سنعود قريباً.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/50" dir={dir}>
      {/* Announcement Banner - من تحكم الموقع */}
      {siteSettings?.announcementVisible && siteSettings?.announcementText && (
        <div className="bg-amber-500 text-slate-900 text-center py-2 px-4 text-sm font-arabic-modern">
          {siteSettings.announcementText}
        </div>
      )}
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'nav-scrolled' : 'bg-gradient-to-b from-black/70 via-black/40 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center rounded-xl p-2 transition-colors hover:bg-black/5 shrink-0">
              <img
                src={logoSrc}
                alt={siteSettings?.siteName || 'CIAR'}
                className="w-20 h-20 rounded-xl"
                onError={(e) => {
                  if (e.currentTarget.src.indexOf('/logo.png') === -1) e.currentTarget.src = '/logo.png';
                }}
              />
            </Link>
            
            {/* Desktop: Nav Links + Search */}
            <div className="hidden md:flex flex-1 justify-center items-center gap-1 min-w-0 max-w-2xl">
              {navItems.map((item) => (
                <Link
                  prefetch
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 shrink-0 ${
                    scrolled
                      ? 'text-gray-700 hover:text-gray-900 hover:bg-amber-50'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  } ${
                    pathname === item.href && scrolled
                      ? 'bg-amber-50 text-gray-900 shadow-sm'
                      : pathname === item.href
                      ? 'border border-white/40 bg-white/10'
                      : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className={`w-px h-6 mx-2 shrink-0 ${scrolled ? 'bg-gray-200' : 'bg-white/30'}`} aria-hidden />
              <GlobalSearch
                className={`shrink-0 ${
                  scrolled
                    ? 'border-gray-200 bg-white/80 text-gray-700 hover:bg-gray-50'
                    : 'border-white/40 bg-white/10 text-white hover:bg-white/20'
                }`}
              />
            </div>

            {/* Desktop: Actions */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1">
                <ThemeToggle scrolled={scrolled} className="rounded-xl" />
                <LanguageSelector className={scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white/90 hover:bg-white/10'} />
                <CurrencySelector className={scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white/90 hover:bg-white/10'} />
              </div>
              <div className={`w-px h-6 mx-1 shrink-0 ${scrolled ? 'bg-gray-200' : 'bg-white/30'}`} aria-hidden />
              <div className="flex items-center gap-2">
                <UserNav scrolled={scrolled} />
                <Button asChild size="sm" className="shrink-0">
                  <Link href="/contact" className="btn-brand rounded-xl px-4 py-2 text-sm font-arabic-modern inline-flex items-center justify-center">
                    {t.nav.contact}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
<Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={scrolled ? 'text-gray-700' : 'text-white'}
            >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-40"
            >
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, x: '-90%', scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: '-85%', scale: 0.95 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute top-0 bottom-0 left-0 w-[85vw] max-w-sm rounded-r-[32px] bg-white/95 dark:bg-gray-900/95 shadow-2xl border border-white/30 dark:border-gray-800 overflow-hidden"
              >
                <div className="px-5 pt-8 pb-10 space-y-3 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm uppercase tracking-[0.2em] text-gray-500">قائمة التنقل</p>
                    <span className="text-xs text-gray-400">Swipe down to close</span>
                  </div>
                  <div className="space-y-1 flex-1 overflow-y-auto pr-1">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-3 rounded-2xl bg-gradient-to-r from-white/60 to-white/30 dark:from-gray-900/60 dark:to-gray-900/20 border border-white/40 dark:border-gray-800 text-base font-medium text-gray-800 dark:text-gray-100 hover:shadow-lg transition"
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-white/40 dark:border-gray-800 space-y-4">
                    <div className="flex items-center gap-2">
                      <ThemeToggle variant="icon-only" className="rounded-2xl bg-white/60 dark:bg-gray-900/60 border border-white/40 dark:border-gray-800 p-3 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-800/80" />
                      <div className="flex-1 rounded-2xl bg-white/60 dark:bg-gray-900/60 border border-white/40 dark:border-gray-800 p-3">
                        <LanguageSelector />
                      </div>
                      <div className="flex-1 rounded-2xl bg-white/60 dark:bg-gray-900/60 border border-white/40 dark:border-gray-800 p-3">
                        <CurrencySelector />
                      </div>
                    </div>
                    <UserNav scrolled={scrolled} variant="mobile" onLinkClick={() => setIsMenuOpen(false)} />
                    <Button asChild>
                      <Link prefetch href="/contact" onClick={() => setIsMenuOpen(false)} className="w-full h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white text-base font-semibold shadow-lg shadow-orange-500/30 inline-flex items-center justify-center">
                        {t.nav.contact}
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* الشريط الإخباري - يظهر دائماً بمحتوى افتراضي أو من API */}
        <div className="bg-stone-800 text-stone-100 py-2.5 px-4 overflow-hidden border-b border-stone-700/50 min-h-[44px] flex items-center" aria-label="شريط الأخبار">
          <div className="relative w-full overflow-hidden">
            <div className="flex animate-scroll-rtl w-max">
              <div className="flex items-center space-x-2 space-x-reverse px-4">
                {(newsItems.length > 0 ? newsItems : defaultNewsItems).map((item, index, arr) => (
                  <div key={item.id} className="flex items-center shrink-0">
                    <span className="text-sm font-semibold">{item.icon}</span>
                    <span className="text-sm font-semibold mr-2">{item.text}</span>
                    {index < arr.length - 1 && (
                      <span className="text-sm font-semibold mx-2">|</span>
                    )}
                  </div>
                ))}
              </div>
              {/* نسخة للتمرير المتصل */}
              <div className="flex items-center space-x-2 space-x-reverse px-4">
                {(newsItems.length > 0 ? newsItems : defaultNewsItems).map((item, index, arr) => (
                  <div key={`dup-${item.id}`} className="flex items-center shrink-0">
                    <span className="text-sm font-semibold">{item.icon}</span>
                    <span className="text-sm font-semibold mr-2">{item.text}</span>
                    {index < arr.length - 1 && (
                      <span className="text-sm font-semibold mx-2">|</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - فخامة */}
      <section className="relative min-h-screen flex items-center justify-center bg-luxury pt-24 overflow-hidden">
        <div className="absolute inset-0 bg-luxury-radial pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/20 to-transparent pointer-events-none"></div>
        {backgroundImages.length > 0 && (
          <>
            {backgroundImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-3000 ease-in-out ${
                  index === currentBgIndex && !imageLoadErrors.has(index) 
                    ? 'opacity-50 scale-100 animate-fade-in' 
                    : 'opacity-0 scale-110'
                }`}
                style={{ display: imageLoadErrors.has(index) ? 'none' : 'block' }}
              >
                <img
                  src={image}
                  alt={`خلفية ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(index)}
                  onLoad={() => handleImageLoad(index)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-stone-900/20"></div>
              </div>
            ))}
            
            {/* توهج خفيف */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none"></div>
            
            {/* لوحة التحكم */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-20 animate-slide-up">
              <button
                type="button"
                onClick={goToPrevious}
                className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
                aria-label="الصورة السابقة"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex gap-2 bg-white/10 backdrop-blur-sm p-2 rounded-full">
                {backgroundImages.map((_, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setCurrentBgIndex(index)}
                    className={`h-2 rounded-full transition-all duration-500 hover:scale-125 ${
                      index === currentBgIndex 
                        ? 'bg-white w-8 opacity-100 shadow-lg' 
                        : 'bg-white/50 hover:bg-white/70 w-2'
                    }`}
                    aria-label={`الانتقال إلى الصورة ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                type="button"
                onClick={goToNext}
                className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
                aria-label="الصورة التالية"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* زر التشغيل/الإيقاف */}
            <div className="absolute top-32 left-8 z-20 animate-slide-up">
<button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
              aria-label={isPaused ? "تشغيل العرض" : "إيقاف العرض"}
            >
                {isPaused ? (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* عداد الصور */}
            <div className="absolute top-32 right-8 z-20 animate-slide-up">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white text-sm font-medium">
                  {currentBgIndex + 1} / {backgroundImages.length}
                </span>
              </div>
            </div>
            
            {/* مؤشر الحالة */}
            {isPaused && (
              <div className="absolute top-48 left-8 z-20 animate-slide-up">
                <div className="bg-yellow-500/80 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-white text-sm font-medium">
                    متوقف
                  </span>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 animate-slide-up">
          <div className="inline-block w-16 h-1 rounded-full bg-gradient-to-l from-amber-400 via-amber-500 to-amber-400 mb-6 opacity-90" aria-hidden />
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-5 font-arabic-heading text-shadow-hero leading-tight tracking-tight">
            {siteContent?.hero?.title ?? t.hero.title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto font-arabic-modern text-stone-300 text-shadow-hero reading-optimized">
            {siteContent?.hero?.subtitle ?? t.hero.subtitle}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/20">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder={siteContent?.hero?.searchPlaceholder ?? t.hero.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-12 pl-4 py-4 text-lg bg-white/95 backdrop-blur-sm border-0 font-arabic-modern text-right rounded-2xl focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link prefetch href="/websites" className="btn-luxury rounded-xl px-8 py-6 text-base font-arabic-modern inline-flex items-center justify-center shadow-[var(--luxury-glow)]">
                استعرض المواقع
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link prefetch href="/services" className="rounded-xl px-8 py-6 border-2 border-white/60 text-white hover:bg-white/10 hover:border-white/80 font-arabic-modern font-semibold backdrop-blur-sm inline-flex items-center justify-center transition-all duration-300">
                خدماتنا وقطاعاتنا
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Ciar Websites - moved to appear immediately after header/hero */}
      <section className="section-padding bg-section-alt">
        <div className="container-narrow">
          <div className="text-center mb-14">
            <h2 className="section-heading font-arabic-heading mb-2">
              مواقعنا الـ 14
            </h2>
            <span className="section-heading-accent" aria-hidden />
            <p className="section-subheading font-arabic-modern mt-4">
              مواقع شركة CIAR في قطاعات متعددة: عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار، وتسويق
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWebsites.map((website) => (
              <Card key={website.id} className="card-interactive overflow-hidden group">
                <div className="relative rounded-t-2xl overflow-hidden">
                  <ImageCarousel 
                    images={website.images || [website.image || '/template-portfolio.jpg']} 
                    title={website.title} 
                  />
                  {website.featured && (
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-amber-500 text-gray-900 font-medium shadow-md">
                        مميز
                      </Badge>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-700">موقع CIAR</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      {website.category}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <ImageIcon className="w-3 h-3 ml-1" />
                      <span>{website.images?.length || 1} صور</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 font-arabic-heading">
                    {website.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 font-arabic-modern reading-optimized">
                    {website.description}
                  </p>
                  
                  {website.technologies && website.technologies.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {website.technologies.slice(0, 3).map((tech, index) => (
                          <span 
                            key={index}
                            className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                        {website.technologies.length > 3 && (
                          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            +{website.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1 btn-brand rounded-xl font-arabic-modern"
                      onClick={() => window.open(website.url, '_blank')}
                    >
                      زيارة الموقع
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/websites" className="btn-brand-outline rounded-xl font-arabic-modern inline-flex items-center justify-center gap-2">
                عرض جميع مواقعنا الـ 14
                <ArrowRight className="w-4 h-4 mr-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-section-soft">
        <div className="container-narrow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="card-elevated p-5 md:p-6 text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-amber-500 mb-1 font-arabic-heading">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-arabic-modern text-xs sm:text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Visitor statistics */}
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {(siteContent?.statsVisitor ?? [
              { number: '24K', title: 'زوار شهرياً', description: 'متوسط عدد الزوار في جميع مواقع CIAR خلال آخر 30 يوماً' },
              { number: '18', title: 'دولة', description: 'زوار من أكثر من 18 دولة مختلفة يستخدمون مواقعنا يومياً' },
              { number: '3.2', title: 'دقائق في الجلسة', description: 'متوسط مدة الجلسة الواحدة للزائر في أحد مواقع CIAR' },
            ]).map((v: { number: string; title: string; description: string }, i: number) => (
              <div key={i} className="card-elevated p-4 md:p-5 flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-right">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold font-arabic-heading">
                  {v.number}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 font-arabic-heading">{v.title}</p>
                  <p className="text-xs text-gray-600 font-arabic-modern">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="text-center mb-14">
            <h2 className="section-heading font-arabic-heading mb-2">
              تصفح مواقعنا حسب القطاع
            </h2>
            <span className="section-heading-accent" aria-hidden />
            <p className="section-subheading font-arabic-modern mt-4">
              عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار، وأكثر
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-arabic-modern text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "bg-amber-500 text-gray-900 shadow-md shadow-amber-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="text-center mb-14">
            <h2 className="section-heading font-arabic-heading mb-2">
              قطاعاتنا وخدماتنا
            </h2>
            <span className="section-heading-accent" aria-hidden />
            <p className="section-subheading font-arabic-modern mt-4">
              عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار، تسويق، لوجستيات، وأكثر
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="card-elevated text-center p-6 md:p-8">
                <CardContent className="pt-0">
                  <div className="flex justify-center mb-6 w-14 h-14 mx-auto rounded-2xl bg-amber-50 [&_svg]:text-amber-600 flex items-center justify-center">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 font-arabic-heading">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 font-arabic-modern reading-optimized text-sm">
                    {service.description}
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/services" className="rounded-xl font-arabic-modern font-semibold border-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300 inline-flex items-center justify-center">
                      اعرف المزيد
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 1. Testimonials Section */}
      <section className="section-padding bg-section-soft">
        <div className="container-narrow">
          <div className="text-center mb-14">
            <h2 className="section-heading font-arabic-heading mb-2">
              آراء العملاء
            </h2>
            <span className="section-heading-accent" aria-hidden />
            <p className="section-subheading font-arabic-modern mt-4">
              ماذا يقول عملاؤنا عن تجربتهم معنا
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {(siteContent?.testimonials ?? [
              { name: "أحمد محمد", role: "عميل موقع العقارات", content: "منصة عقارية ممتازة. وجدت العرض المناسب وحصلت على تمويل بسهولة.", rating: 5 },
              { name: "فاطمة العلي", role: "عميلة موقع السياحة", content: "حجزت رحلتي من موقعكم السياحي. تجربة سلسة وعروض متنوعة.", rating: 5 },
              { name: "خالد السعيد", role: "عميل المول الإلكتروني", content: "أطلب من مول CIAR بانتظام. تشكيلة واسعة وشحن موثوق.", rating: 5 },
            ]).map((testimonial: { name: string; role: string; content: string; rating: number }, index: number) => (
              <Card key={index} className="card-elevated p-6 md:p-8">
                <CardContent className="pt-0">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 font-arabic-modern reading-optimized">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full ml-4"></div>
                    <div>
                      <h4 className="font-semibold font-arabic-modern">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 font-arabic-modern">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Features Grid */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="text-center mb-14">
            <h2 className="section-heading font-arabic-heading mb-2">
              لماذا تختارنا؟
            </h2>
            <span className="section-heading-accent" aria-hidden />
            <p className="section-subheading font-arabic-modern mt-4">
              نقدم أفضل الحلول الرقمية لتنمية أعمالك
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {(siteContent?.features ?? [
              { title: "جودة عالية", desc: "معايير جودة صارمة في كل مشروع", iconKey: "CheckCircle" },
              { title: "تسليم سريع", desc: "التزام بالمواعيد النهائية المحددة", iconKey: "Clock" },
              { title: "دعم 24/7", desc: "فريق دعم متخصص على مدار الساعة", iconKey: "Users" },
              { title: "نتائج مضمونة", desc: "تحقيق أهداف عملائنا بنجاح", iconKey: "TrendingUp" },
            ]).map((feature: { title: string; desc: string; iconKey?: string }, index: number) => {
              const iconMap: Record<string, React.ReactNode> = {
                CheckCircle: <CheckCircle className="w-8 h-8 text-emerald-500" />,
                Clock: <Clock className="w-8 h-8 text-amber-500" />,
                Users: <Users className="w-8 h-8 text-blue-500" />,
                TrendingUp: <TrendingUp className="w-8 h-8 text-amber-600" />,
              };
              const icon = iconMap[feature.iconKey ?? ''] ?? iconMap.CheckCircle;
              return (
              <Card key={index} className="card-elevated text-center p-6 md:p-8">
                <CardContent className="pt-0">
                  <div className="flex justify-center mb-4 w-14 h-14 mx-auto rounded-2xl bg-amber-50 items-center justify-center [&_svg]:shrink-0">{icon}</div>
                  <h3 className="text-xl font-semibold mb-2 font-arabic-heading text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 font-arabic-modern reading-optimized text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            ); })}
          </div>
        </div>
      </section>

      {/* 3. Process Timeline */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-narrow">
          <div className="text-center mb-14">
            <h2 className="section-heading font-arabic-heading mb-2">
              كيف نعمل
            </h2>
            <span className="section-heading-accent" aria-hidden />
            <p className="section-subheading font-arabic-modern mt-4">
              عملية عمل بسيطة وفعالة لتحقيق أهدافك
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {(siteContent?.process ?? [
              { step: "1", title: "استشارة", desc: "فهم متطلباتك وأهدافك" },
              { step: "2", title: "تخطيط", desc: "وضع خطة عمل مفصلة" },
              { step: "3", title: "تنفيذ", desc: "تقديم الخدمة وتشغيل المنصة" },
              { step: "4", title: "تسليم", desc: "تسليم المشروع ودعم مستمر" },
            ]).map((process: { step: string; title: string; desc: string }, index: number) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-amber-500 text-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold font-arabic-heading shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
                  {process.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 font-arabic-heading text-gray-900">{process.title}</h3>
                <p className="text-gray-600 font-arabic-modern reading-optimized text-sm">{process.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Technology Stack */}
      {/* <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="text-center mb-14">
            <h2 className="section-heading font-arabic-heading mb-2">
              منصاتنا التقنية
            </h2>
            <span className="section-heading-accent" aria-hidden />
            <p className="section-subheading font-arabic-modern mt-4">
              نستخدم تقنيات حديثة لضمان أداء واستقرار مواقعنا
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {[
              "React", "Next.js", "TypeScript", "Node.js", 
              "MongoDB", "PostgreSQL", "Docker", "AWS",
              "Flutter", "Swift", "Kotlin", "Vue.js"
            ].map((tech, index) => (
              <div key={index} className="card-elevated rounded-xl p-4 md:p-5 text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-50 rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <span className="text-lg font-bold text-amber-600 font-arabic-heading">{tech.charAt(0)}</span>
                </div>
                <span className="text-sm font-medium font-arabic-modern text-gray-700">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* 5. Pricing Cards */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-narrow">
          <div className="text-center mb-14">
            <h2 className="section-heading font-arabic-heading mb-2">
              خطط مرنة
            </h2>
            <span className="section-heading-accent" aria-hidden />
            <p className="section-subheading font-arabic-modern mt-4">
              اختر الخطة التي تناسب احتياجاتك
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {(siteContent?.plans ?? [
              { name: "أساسي", price: "مجاني", features: ["عرض موقع واحد", "دعم أساسي", "تحليلات محدودة"] },
              { name: "احترافي", price: "99 ريال/شهرياً", features: ["عرض 10 مواقع", "دعم متميز", "تحليلات كاملة", "SEO متقدم"], popular: true },
              { name: "مؤسسي", price: "299 ريال/شهرياً", features: ["مواقع غير محدودة", "دعم أولوية", "تحليلات متقدمة", "SEO احترافي", "API مخصص"] },
            ]).map((plan: { name: string; price: string; features: string[]; popular?: boolean }, index: number) => (
              <Card key={index} className={`relative card-elevated overflow-hidden ${plan.popular ? 'ring-2 ring-amber-500 shadow-xl shadow-amber-500/10' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-amber-500 text-gray-900 py-2 text-center">
                    <span className="text-sm font-bold font-arabic-modern">الأكثر شعبية</span>
                  </div>
                )}
                <CardContent className={`p-6 md:p-8 text-center ${plan.popular ? 'pt-12' : ''}`}>
                  <h3 className="text-2xl font-bold mb-2 font-arabic-heading text-gray-900">{plan.name}</h3>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 font-arabic-modern">{plan.price}</p>
                  <ul className="space-y-3 mb-8 text-right">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center justify-end gap-2 font-arabic-modern reading-optimized text-gray-600">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.popular ? 'btn-brand' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
                    اختر الخطة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <PaymentMethods />

      {/* 6. Newsletter Signup */}
      <section className="section-padding bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-gray-900">
        <div className="container-narrow text-center">
          <h2 className="section-heading text-gray-900 mb-4 font-arabic-heading">
            {siteContent?.newsletterTitle ?? 'انضم إلى نشرتنا البريدية'}
          </h2>
          <p className="section-subheading text-gray-800/90 mb-8 font-arabic-modern max-w-xl mx-auto">
            {siteContent?.newsletterSubtitle ?? 'احصل على آخر العروض والأخبار والنصائح مباشرة في بريدك'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="flex-1 text-right bg-white/95 border-0 shadow-md rounded-xl h-12"
            />
            <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl h-12 font-arabic-modern font-semibold">
              اشترك الآن
            </Button>
          </div>
        </div>
      </section>

      {/* 7. Recent Blog Posts */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="text-center mb-14">
            <h2 className="section-heading font-arabic-heading mb-2">
              أحدث المقالات
            </h2>
            <span className="section-heading-accent" aria-hidden />
            <p className="section-subheading font-arabic-modern mt-4">
              نصائح وأخبار من عالم التكنولوجيا
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "كيف تختار العرض المناسب من موقعنا العقاري",
                excerpt: "نصائح للبحث عن عقار والتمويل عبر منصة CIAR العقارية",
                date: "15 يناير 2024",
                image: "/project-portfolio.jpg"
              },
              {
                title: "أفضل الوجهات والحجوزات من موقعنا السياحي",
                excerpt: "اكتشف العروض والبرامج السياحية وحجز رحلاتك بسهولة",
                date: "12 يناير 2024",
                image: "/project-restaurant.jpg"
              },
              {
                title: "تسوق الأزياء والتجارة الإلكترونية من مواقعنا",
                excerpt: "موضة، مول إلكتروني، وتجارة B2B — كل ما تحتاجه في مكان واحد",
                date: "8 يناير 2024",
                image: "/project-ecommerce.jpg"
              }
            ].map((post, index) => (
              <Card key={index} className="card-interactive overflow-hidden group">
                <div className="h-44 md:h-48 bg-gray-100 overflow-hidden rounded-t-2xl">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <CardContent className="p-6">
                  <p className="text-sm text-amber-600 font-medium mb-2 font-arabic-modern">{post.date}</p>
                  <h3 className="text-lg font-semibold mb-2 font-arabic-heading text-gray-900 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 font-arabic-modern reading-optimized text-sm line-clamp-2">{post.excerpt}</p>
                  <Button variant="outline" className="w-full rounded-xl btn-brand-outline border-amber-500/50">
                    اقرأ المزيد
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Partners Section */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-narrow">
          <div className="text-center mb-14">
            <h2 className="section-heading font-arabic-heading mb-2">
              شركاء النجاح
            </h2>
            <span className="section-heading-accent" aria-hidden />
            <p className="section-subheading font-arabic-modern mt-4">
              نفتخر بالعمل مع أفضل الشركات
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card-elevated rounded-xl p-6 md:p-8 flex items-center justify-center min-h-[100px]">
                <div className="w-20 h-10 bg-gray-200/80 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-400 font-arabic-modern">شريك {i}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-arabic-heading">
              الأسئلة الشائعة
            </h2>
            <p className="text-xl text-gray-600 font-arabic-modern reading-optimized">
              إجابات على أكثر الأسئلة شيوعاً
            </p>
          </div>
          <div className="space-y-4">
            {(siteContent?.faq ?? [
              { q: "كم عدد مواقع شركة CIAR؟", a: "لدينا 14 موقعاً إلكترونياً تغطي عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار، تسويق، لوجستيات، وتوصيل." },
              { q: "هل تقدمون دعماً للعملاء؟", a: "نعم، نقدم دعماً للعملاء على مدار الساعة لجميع مواقعنا وخدماتنا." },
              { q: "كيف أصل إلى الموقع المناسب لاحتياجي؟", a: "يمكنك تصفح قائمة مواقعنا الـ 14 من صفحة «المواقع» أو البحث حسب القطاع (عقاري، سياحي، موضة، وغيرها)." },
            ]).map((faq: { q: string; a: string }, index: number) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2 font-arabic-modern">{faq.q}</h3>
                  <p className="text-gray-600 font-arabic-modern reading-optimized">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Stats Counter */}
      <section className="section-padding bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-gray-900">
        <div className="container-narrow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            {[
              { number: "14", label: "موقع إلكتروني" },
              { number: "14+", label: "قطاع نخدمه" },
              { number: "200+", label: "عميل سعيد" },
              { number: "24/7", label: "دعم العملاء" }
            ].map((stat, index) => (
              <div key={index} className="py-4">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 font-arabic-heading drop-shadow-sm">{stat.number}</div>
                <div className="text-sm md:text-base font-arabic-modern text-gray-800 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - فخامة */}
      <section className="section-padding bg-luxury text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-luxury-radial pointer-events-none" />
        <div className="container-narrow text-center relative z-10">
          <div className="inline-block w-14 h-1 rounded-full bg-gradient-to-l from-amber-400 via-amber-500 to-amber-400 mb-6 opacity-80" aria-hidden />
          <h2 className="section-heading text-white mb-4 font-arabic-heading text-shadow-hero">
            {siteContent?.ctaTitle ?? 'اكتشف مواقعنا الـ 14'}
          </h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto font-arabic-modern text-stone-300 reading-optimized">
            {siteContent?.ctaSubtitle ?? 'عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار، وتسويق — كل ما تحتاجه تحت سقف واحد'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/websites" className="btn-luxury rounded-xl px-8 py-6 font-arabic-modern inline-flex items-center justify-center">
                استعرض المواقع
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact" className="rounded-xl px-8 py-6 border-2 border-amber-400/60 text-amber-200 hover:bg-amber-500/20 hover:border-amber-400 font-arabic-modern font-semibold inline-flex items-center justify-center transition-all duration-300">
                تواصل معنا
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - فخامة */}
      <footer className="bg-stone-950 text-stone-100 py-14 md:py-16 mt-0 border-t border-amber-500/10">
        <div className="container-narrow">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center justify-center mb-6 hover:opacity-90 transition-opacity group">
              <img
                src={logoSrc}
                alt={siteSettings?.siteName || 'CIAR'}
                className="w-24 h-24 rounded-2xl ring-2 ring-stone-700/50 group-hover:ring-amber-500/30 transition-all duration-300"
                onError={(e) => {
                  if (e.currentTarget.src.indexOf('/logo.png') === -1) e.currentTarget.src = '/logo.png';
                }}
              />
            </Link>
            <p className="text-stone-400 mb-8 font-arabic-modern reading-optimized max-w-xl mx-auto text-sm md:text-base">
              {(siteSettings?.footerText || siteContent?.footerDescription) ?? 'شركة CIAR — 14 موقعاً يخدمونك: عقاري، سياحي، موضة، تجارة إلكترونية، وأكثر'}
            </p>
            <div className="flex justify-center gap-6 md:gap-8 mb-10">
              {(siteSettings?.linkedinUrl || siteSettings?.facebookUrl || siteSettings?.twitterUrl || siteSettings?.instagramUrl) ? (
                <>
                  {siteSettings?.linkedinUrl && <a href={siteSettings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-amber-400 transition-colors font-arabic-modern text-sm">LinkedIn</a>}
                  {siteSettings?.twitterUrl && <a href={siteSettings.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-amber-400 transition-colors font-arabic-modern text-sm">Twitter</a>}
                  {siteSettings?.instagramUrl && <a href={siteSettings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-amber-400 transition-colors font-arabic-modern text-sm">Instagram</a>}
                  {siteSettings?.facebookUrl && <a href={siteSettings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-amber-400 transition-colors font-arabic-modern text-sm">Facebook</a>}
                </>
              ) : (
                <>
                  <a href="#" className="text-stone-400 hover:text-amber-400 transition-colors font-arabic-modern text-sm">LinkedIn</a>
                  <a href="#" className="text-stone-400 hover:text-amber-400 transition-colors font-arabic-modern text-sm">Twitter</a>
                  <a href="#" className="text-stone-400 hover:text-amber-400 transition-colors font-arabic-modern text-sm">Instagram</a>
                </>
              )}
            </div>
            <div className="border-t border-stone-800 pt-8">
              <p className="text-stone-500 font-arabic-modern text-sm">
                © {new Date().getFullYear()} شركة CIAR. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}