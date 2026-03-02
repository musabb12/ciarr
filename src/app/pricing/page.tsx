'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Star, Users, Crown, Zap, Shield, HeadphonesIcon, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export default function PricingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const plans = [
    {
      name: 'المبتدئ',
      description: 'مثالي للأفراد والمشاريع الصغيرة',
      icon: <Users className="w-8 h-8 text-blue-500" />,
      monthlyPrice: 0,
      annualPrice: 0,
      badge: null,
      features: [
        'إدراج حتى 3 مواقع',
        'صفحة ملف شخصي أساسية',
        'دعم قياسي',
        'وصول للمجتمع',
        'تحليلات أساسية',
        'متجاوب مع الجوال'
      ],
      limitations: [
        'بدون إدراجات مميزة',
        'ظهور بحث أساسي',
        'عناصر محفظة محدودة'
      ],
      cta: 'ابدأ الآن',
      ctaLink: '/signup',
      popular: false
    },
    {
      name: 'المحترف',
      description: 'مثالي للشركات والوكالات النامية',
      icon: <TrendingUp className="w-8 h-8 text-green-500" />,
      monthlyPrice: 29,
      annualPrice: 290,
      badge: 'الأكثر شعبية',
      features: [
        'إدراج حتى 20 موقعاً',
        'صفحة ملف شخصي محسّنة',
        'دعم ذو أولوية',
        'تحليلات متقدمة',
        'إدراجات مميزة (2/شهر)',
        'تحسين محركات البحث',
        'نطاق مخصص',
        'أدوات جذب العملاء',
        'عرض المحفظة',
        'شهادات العملاء'
      ],
      limitations: [],
      cta: 'ابدأ التجربة المجانية',
      ctaLink: '/signup',
      popular: true
    },
    {
      name: 'الأعمال',
      description: 'حل متكامل للشركات الراسخة',
      icon: <Crown className="w-8 h-8 text-purple-500" />,
      monthlyPrice: 79,
      annualPrice: 790,
      badge: 'أفضل قيمة',
      features: [
        'إدراج مواقع غير محدود',
        'صفحة ملف شخصي مميزة',
        'دعم مخصص 24/7',
        'تحليلات فورية',
        'إدراجات مميزة غير محدودة',
        'أدوات SEO متقدمة',
        'نطاقات مخصصة متعددة',
        'إدارة عملاء متقدمة',
        'محفظة فيديو',
        'نظام إدارة العملاء',
        'أدوات التعاون الفريقي',
        'وصول API',
        'خيارات العلامة البيضاء'
      ],
      limitations: [],
      cta: 'ابدأ التجربة المجانية',
      ctaLink: '/signup',
      popular: false
    },
    {
      name: 'المؤسسات',
      description: 'حلول مخصصة للمنظمات الكبرى',
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      monthlyPrice: 199,
      annualPrice: 1990,
      badge: 'المؤسسات',
      features: [
        'كل ما في خطة الأعمال',
        'تكاملات مخصصة',
        'مدير حسابات مخصص',
        'هوية بصرية مخصصة',
        'ميزات أمان متقدمة',
        'ضمان SLA',
        'جلسات تدريبية',
        'تقارير مخصصة',
        'إبراز ذو أولوية',
        'شراكات حصرية',
        'وصول API متقدم',
        'سير عمل مخصص',
        'دعم لغات متعددة',
        'حماية متقدمة من الاحتيال'
      ],
      limitations: [],
      cta: 'تواصل مع المبيعات',
      ctaLink: '/contact',
      popular: false
    }
  ];

  const additionalServices = [
    {
      name: 'إدراج مميز',
      description: 'إبراز موقعك على الصفحة الرئيسية لمدة 7 أيام',
      price: 49,
      duration: 'أسبوعياً'
    },
    {
      name: 'ترويج مميز',
      description: 'حملة تسويقية شاملة عبر جميع القنوات',
      price: 199,
      duration: 'شهرياً'
    },
    {
      name: 'تحسين محركات البحث',
      description: 'خدمات SEO احترافية لتحسين الظهور',
      price: 299,
      duration: 'مرة واحدة'
    },
    {
      name: 'إنشاء المحتوى',
      description: 'كتابة محتوى احترافي لإدراجاتك',
      price: 99,
      duration: 'لكل مشروع'
    }
  ];

  const faqs = [
    {
      question: 'هل يمكنني تغيير خطتي في أي وقت؟',
      answer: 'نعم، يمكنك الترقية أو التخفيض في أي وقت. ستظهر التغييرات في دورة الفوترة التالية.'
    },
    {
      question: 'هل تتوفر تجربة مجانية؟',
      answer: 'نعم، نقدم تجربة مجانية 14 يوماً لخطط المحترف والأعمال. بدون الحاجة لبطاقة ائتمان.'
    },
    {
      question: 'ما طرق الدفع المقبولة؟',
      answer: 'نقبل جميع بطاقات الائتمان الرئيسية، PayPal، والتحويلات البنكية للخطط السنوية.'
    },
    {
      question: 'هل يمكنني إلغاء اشتراكي؟',
      answer: 'نعم، يمكنك الإلغاء في أي وقت. سيستمر وصولك حتى نهاية فترة الفوترة.'
    },
    {
      question: 'هل تقدمون خصومات للجمعيات غير الربحية؟',
      answer: 'نعم، نقدم خصم 50% للجمعيات المسجلة غير الربحية. تواصل معنا للمزيد.'
    },
    {
      question: 'هل بياناتي آمنة؟',
      answer: 'بالتأكيد. نستخدم التشفير ومعايير الأمان الصناعية لحماية بياناتك.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 space-x-reverse">
              <img src="/logo.png" alt="CIAR" className="w-8 h-8" />
              <span className={`text-2xl font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                CIAR
              </span>
            </Link>
            
            <Link href="/">
              <Button variant="ghost" className={scrolled ? 'text-gray-700' : 'text-white'}>
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-gray-900 to-gray-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            أسعار بسيطة وشفافة <span className="text-yellow-400">بدون مفاجآت</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            اختر الخطة المثالية لعملك. بدون رسوم خفية، بدون مفاجآت.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 space-x-reverse">
            <span className={`text-lg ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>
              شهري
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-yellow-500"
            />
            <span className={`text-lg ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
              سنوي
            </span>
            {isAnnual && (
              <Badge className="bg-yellow-500 text-white mr-2">
                وفر 20%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-yellow-500 scale-105' : ''} hover:shadow-xl transition-all duration-300`}>
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className={`${plan.popular ? 'bg-yellow-500 text-white' : 'bg-purple-500 text-white'} px-4 py-1`}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {plan.name}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">
                    {plan.description}
                  </p>
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        ${isAnnual ? plan.annualPrice / 12 : plan.monthlyPrice}
                      </span>
                      <span className="text-gray-500 mr-2">/شهر</span>
                    </div>
                    {isAnnual && plan.monthlyPrice > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        وفر ${(plan.monthlyPrice * 12 - plan.annualPrice)} سنوياً
                      </p>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-2 space-x-reverse">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, idx) => (
                      <div key={idx} className="flex items-start space-x-2 space-x-reverse opacity-60">
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0 mt-0.5"></div>
                        <span className="text-sm text-gray-500">{limitation}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link href={plan.ctaLink}>
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                          : plan.name === 'Enterprise'
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              خدمات إضافية
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              عزّز إدراجك بخدماتنا المميزة
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    ${service.price}
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    {service.duration}
                  </div>
                  <Button variant="outline" className="w-full">
                    اطلب الآن
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              مقارنة الميزات
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              تعرف بدقة على ما تحصل عليه مع كل خطة
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-4 font-semibold text-gray-900">الميزة</th>
                  <th className="text-center p-4 font-semibold text-gray-900">المبتدئ</th>
                  <th className="text-center p-4 font-semibold text-gray-900">المحترف</th>
                  <th className="text-center p-4 font-semibold text-gray-900">الأعمال</th>
                  <th className="text-center p-4 font-semibold text-gray-900">المؤسسات</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">إدراج المواقع</td>
                  <td className="text-center p-4">3</td>
                  <td className="text-center p-4">20</td>
                  <td className="text-center p-4">غير محدود</td>
                  <td className="text-center p-4">غير محدود</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">الإدراجات المميزة</td>
                  <td className="text-center p-4">-</td>
                  <td className="text-center p-4">2/شهر</td>
                  <td className="text-center p-4">غير محدود</td>
                  <td className="text-center p-4">غير محدود</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">التحليلات</td>
                  <td className="text-center p-4">أساسي</td>
                  <td className="text-center p-4">متقدم</td>
                  <td className="text-center p-4">فوري</td>
                  <td className="text-center p-4">مخصص</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">الدعم</td>
                  <td className="text-center p-4">قياسي</td>
                  <td className="text-center p-4">أولوية</td>
                  <td className="text-center p-4">24/7</td>
                  <td className="text-center p-4">مخصص</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">نطاق مخصص</td>
                  <td className="text-center p-4">-</td>
                  <td className="text-center p-4">✓</td>
                  <td className="text-center p-4">✓</td>
                  <td className="text-center p-4">✓</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">وصول API</td>
                  <td className="text-center p-4">-</td>
                  <td className="text-center p-4">-</td>
                  <td className="text-center p-4">✓</td>
                  <td className="text-center p-4">متقدم</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              الأسئلة الشائعة
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              لديك أسئلة؟ لدينا الإجابات
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            مستعد للبدء؟
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف الشركات التي تستخدم CIAR لتنمية حضورها الرقمي
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                ابدأ التجربة المجانية
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                تواصل مع المبيعات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 space-x-reverse mb-4">
              <img src="/logo.png" alt="CIAR" className="w-8 h-8" />
              <h3 className="text-2xl font-bold">CIAR</h3>
            </div>
            <p className="text-gray-400 mb-6">
              السوق الأمثل للمواقع والخدمات الرقمية
            </p>
            <div className="flex justify-center space-x-6 space-x-reverse mb-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                لينكدإن
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                جيت هب
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                تويتر
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                إنستغرام
              </a>
            </div>
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-400">
                © 2024 سوق CIAR. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}