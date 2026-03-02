'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Send, Clock, MessageSquare, CheckCircle, Globe, Headphones } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    project: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "تم إرسال الرسالة بنجاح!",
        description: "سنتواصل معك خلال 24 ساعة.",
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        project: '',
        message: ''
      });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-yellow-500" />,
      title: "البريد الإلكتروني",
      content: "info@ciar.com",
      description: "أرسل لنا بريداً إلكترونياً في أي وقت"
    },
    {
      icon: <Phone className="w-6 h-6 text-yellow-500" />,
      title: "الهاتف",
      content: "+966 50 123 4567",
      description: "الأحد - الخميس من 9 صباحاً إلى 6 مساءً"
    },
    {
      icon: <MapPin className="w-6 h-6 text-yellow-500" />,
      title: "المكتب الرئيسي",
      content: "الرياض، المملكة العربية السعودية",
      description: "زيارة مقرنا الرئيسي"
    },
    {
      icon: <Globe className="w-6 h-6 text-yellow-500" />,
      title: "الدعم الفني",
      content: "support@ciar.com",
      description: "دعم فني على مدار الساعة"
    }
  ];

  const officeLocations = [
    {
      city: "الرياض",
      address: "شارع الملك فهد، مركز الأعمال، الدور 10",
      phone: "+966 50 123 4567",
      email: "riyadh@ciar.com"
    },
    {
      city: "جدة",
      address: "شارع التحلية، مركز جدة التجاري، الدور 5",
      phone: "+966 50 987 6543",
      email: "jeddah@ciar.com"
    },
    {
      city: "الدمام",
      address: "شارع الملك عبدالله، المركز التجاري، الدور 8",
      phone: "+966 50 456 7890",
      email: "dammam@ciar.com"
    }
  ];

  const faqs = [
    {
      question: "كم عدد مواقع شركة CIAR؟",
      answer: "لدينا 14 موقعاً إلكترونياً تغطي عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار، تسويق، لوجستيات، وتوصيل."
    },
    {
      question: "هل تقدمون دعماً للعملاء؟",
      answer: "نعم، نقدم دعماً للعملاء على مدار الساعة لجميع مواقعنا وخدماتنا."
    },
    {
      question: "كيف أصل إلى الموقع المناسب لاحتياجي؟",
      answer: "يمكنك تصفح قائمة مواقعنا الـ 14 من صفحة «المواقع» أو البحث حسب القطاع (عقاري، سياحي، موضة، وغيرها)."
    },
    {
      question: "هل يمكنني الاستفسار عن أكثر من موقع؟",
      answer: "نعم، يمكنك اختيار الموقع أو الخدمة المعنية في نموذج التواصل أو ذكرها في الرسالة."
    }
  ];

  return (
    <div className="min-h-screen bg-white" dir="rtl">
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
            
            <div className="flex items-center gap-2">
              <ThemeToggle scrolled={scrolled} className="rounded-xl" />
              <Link href="/">
                <Button variant="ghost" className={scrolled ? 'text-gray-700' : 'text-white'}>
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  العودة للرئيسية
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <img 
          src="/hero-bg.jpg" 
          alt="اتصل بنا" 
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            تواصل <span className="text-yellow-400">معنا</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-8 max-w-3xl mx-auto">
            نسعد بمساعدتك في أي من مواقعنا الـ 14 أو خدماتنا — عقاري، سياحي، موضة، تجارة إلكترونية، وأكثر
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/websites">
              <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                استعرض مواقعنا
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              أرسل رسالة
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              طرق التواصل
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نحن هنا لمساعدتك والإجابة على جميع استفساراتك
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {info.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-lg text-gray-700 mb-2">
                    {info.content}
                  </p>
                  <p className="text-sm text-gray-500">
                    {info.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                أرسل لنا رسالة
              </h2>
              <p className="text-gray-600 mb-8">
                املأ النموذج أدناه وسنتواصل معك خلال 24 ساعة. 
                نسعد بمساعدتك في أي من مواقعنا الـ 14 أو خدماتنا.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم الكامل *
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني *
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف
                    </label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="+966 50 123 4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      الشركة
                    </label>
                    <Input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="اسم شركتك"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
                    الموقع أو الخدمة المعنية
                  </label>
                  <select
                    id="project"
                    name="project"
                    value={formData.project}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">اختر الموقع أو الخدمة المعنية</option>
                    <option value="real-estate">عقاري</option>
                    <option value="travel">سياحي</option>
                    <option value="fashion">موضة وأزياء</option>
                    <option value="ecommerce">تجارة إلكترونية</option>
                    <option value="cars">سيارات وتنقل</option>
                    <option value="jobs">توظيف</option>
                    <option value="investment">استثمار</option>
                    <option value="marketing">تسويق وإعلانات</option>
                    <option value="logistics">لوجستيات وتوصيل</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    الرسالة *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="أخبرنا عن استفسارك أو طلبك..."
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-300 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 ml-2"></div>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 ml-2" />
                      إرسال الرسالة
                    </>
                  )}
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                مكاتبنا
              </h2>
              <div className="space-y-6">
                {officeLocations.map((office, index) => (
                  <Card key={index} className="p-6">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl text-gray-900">
                        {office.city}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-yellow-500 ml-3 mt-0.5" />
                        <span className="text-gray-600">{office.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-yellow-500 ml-3" />
                        <span className="text-gray-600">{office.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-yellow-500 ml-3" />
                        <span className="text-gray-600">{office.email}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  ساعات العمل
                </h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="w-5 h-5 text-yellow-500 ml-3" />
                    <span className="text-gray-700">الأحد - الخميس: 9:00 ص - 6:00 م</span>
                  </div>
                  <div className="flex items-center">
                    <Headphones className="w-5 h-5 text-yellow-500 ml-3" />
                    <span className="text-gray-700">الدعم الفني: 24/7</span>
                  </div>
                </div>
              </div>
            </div>
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
              إجابات على الأسئلة الأكثر شيوعاً
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            تحتاج مساعدة في أحد مواقعنا؟
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            تواصل معنا للإجابة على استفساراتك حول أي موقع من مواقعنا الـ 14.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/websites">
              <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                استعرض مواقعنا
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                خدماتنا
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}