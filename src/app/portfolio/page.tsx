'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Filter, Search, Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function PortfolioPage() {
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const projects = [
    {
      id: 1,
      title: "منصة تجارة إلكترونية",
      category: "web-development",
      description: "تجربة تسوق إلكتروني حديثة مع ميزات متقدمة تشمل المخزون الفوري، معالجة الدفع، ولوحة تحكم للإدارة.",
      image: "/project-ecommerce.jpg",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      client: "علامة موضة",
      date: "2024",
      featured: true,
      link: "#"
    },
    {
      id: 2,
      title: "تطبيق مصرفي للجوال",
      category: "mobile-development",
      description: "تطبيق مصرفي آمن وبديهي مع مصادقة بيومترية، معاملات فورية، وتتبع الميزانية.",
      image: "/project-banking.jpg",
      technologies: ["React Native", "TypeScript", "Firebase", "JWT"],
      client: "شركة تقنية مالية",
      date: "2024",
      featured: true,
      link: "#"
    },
    {
      id: 3,
      title: "لوحة تحليلات SaaS",
      category: "web-development",
      description: "لوحة تحليلات شاملة لذكاء الأعمال مع تصور بيانات فوري وميزات التقارير.",
      image: "/project-dashboard.jpg",
      technologies: ["Next.js", "D3.js", "PostgreSQL", "AWS"],
      client: "شركة تقنية",
      date: "2023",
      featured: false,
      link: "#"
    },
    {
      id: 4,
      title: "موقع مطعم",
      category: "web-design",
      description: "موقع أنيق لمطعم راقٍ مع حجوزات أونلاين، عرض القائمة، وإدارة الفعاليات.",
      image: "/project-restaurant.jpg",
      technologies: ["WordPress", "PHP", "MySQL", "Bootstrap"],
      client: "مطعم فاخر",
      date: "2023",
      featured: false,
      link: "#"
    },
    {
      id: 5,
      title: "تطبيق تتبع اللياقة",
      category: "mobile-development",
      description: "تطبيق شامل لتتبع الصحة واللياقة مع خطط التمارين، تتبع التغذية، وميزات اجتماعية.",
      image: "/project-fitness.jpg",
      technologies: ["Flutter", "Dart", "Firebase", "HealthKit"],
      client: "شركة لياقة",
      date: "2023",
      featured: true,
      link: "#"
    },
    {
      id: 6,
      title: "معرض أعمال إبداعي",
      category: "web-design",
      description: "موقع معرض أعمال مذهل لوكالة رقمية مع رسوم تفاعلية وإدارة محتوى ديناميكية.",
      image: "/project-portfolio.jpg",
      technologies: ["Next.js", "Framer Motion", "Sanity CMS", "Vercel"],
      client: "وكالة رقمية",
      date: "2023",
      featured: false,
      link: "#"
    },
    {
      id: 7,
      title: "منصة عقارية",
      category: "web-development",
      description: "منصة إدراج عقارات مع فلاتر بحث متقدمة، جولات افتراضية، ونظام إدارة الوكلاء.",
      image: "/project-ecommerce.jpg",
      technologies: ["Vue.js", "Laravel", "MySQL", "Mapbox"],
      client: "وكالة عقارية",
      date: "2022",
      featured: false,
      link: "#"
    },
    {
      id: 8,
      title: "تطبيق تعليمي",
      category: "mobile-development",
      description: "منصة تعليم تفاعلية للطلاب مع دروس فيديو، اختبارات، وتتبع التقدم.",
      image: "/project-fitness.jpg",
      technologies: ["React Native", "Redux", "Node.js", "AWS"],
      client: "شركة تقنية تعليمية",
      date: "2022",
      featured: false,
      link: "#"
    }
  ];

  const categories = [
    { value: 'all', label: 'جميع المشاريع' },
    { value: 'web-development', label: 'تطوير الويب' },
    { value: 'mobile-development', label: 'تطوير التطبيقات' },
    { value: 'web-design', label: 'تصميم الويب' }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.category === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const featuredProjects = projects.filter(project => project.featured);

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
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <img 
          src="/hero-bg.jpg" 
          alt="معرض الأعمال" 
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            معرض <span className="text-yellow-400">الأعمال</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-8 max-w-3xl mx-auto">
            نعرض أفضل أعمالنا وقصص النجاح التي أنشأناها مع عملائنا
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#featured">
              <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                المشاريع المميزة
              </Button>
            </Link>
            <Link href="#all-projects">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                جميع المشاريع
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="featured" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              المشاريع المميزة
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              أكثر أعمالنا نجاحاً وابتكاراً
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                      <ExternalLink className="w-4 h-4 ml-2" />
                      معاينة المشروع
                    </Button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-yellow-500 text-white">
                      مميز
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 ml-1" />
                      {project.client}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 ml-1" />
                      {project.date}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Projects with Filters */}
      <section id="all-projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              جميع المشاريع
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              تصفح معرض أعمالنا الكامل
            </p>
          </div>

          {/* Filters and Search */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={filter === category.value ? "default" : "outline"}
                    className={filter === category.value ? "bg-yellow-500 text-white hover:bg-yellow-600" : ""}
                    onClick={() => setFilter(category.value)}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="البحث في المشاريع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                      <ExternalLink className="w-4 h-4 ml-2" />
                      معاينة المشروع
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 ml-1" />
                      {project.client}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 ml-1" />
                      {project.date}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                لم يتم العثور على مشاريع تطابق معاييرك.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            هل تريد أن يظهر مشروعك هنا؟
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            لنعمل معاً لإنشاء شيء مذهل. تواصل معنا ونناقش مشروعك.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                ابدأ مشروعك
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 space-x-reverse mb-4">
              <img src="/logo.png" alt="CIAR" className="w-8 h-8" />
              <h3 className="text-2xl font-bold">CIAR</h3>
            </div>
            <p className="text-gray-400 mb-6">
              نصنع تجارب رقمية مؤثرة
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
                © 2024 CIAR. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}