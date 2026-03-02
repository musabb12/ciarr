'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Search, Star, MapPin, Globe, Mail, Phone, CheckCircle, TrendingUp, Users, Award, Filter } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ProvidersPage() {
  const [scrolled, setScrolled] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRating, setSelectedRating] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const categories = [
    { id: 'all', name: 'جميع الفئات' },
    { id: 'web-development', name: 'تطوير الويب' },
    { id: 'ui-ux-design', name: 'تصميم واجهة المستخدم' },
    { id: 'mobile-development', name: 'تطوير الجوال' },
    { id: 'digital-marketing', name: 'التسويق الرقمي' },
    { id: 'content-creation', name: 'إنشاء المحتوى' },
    { id: 'consulting', name: 'الاستشارات' }
  ]

  const providers = [
    {
      id: 1,
      name: 'حلول التقنية المتقدمة',
      category: 'web-development',
      description: 'وكالة تطوير ويب رائدة متخصصة في المواقع المخصصة وحلول التجارة الإلكترونية وتطبيقات الويب',
      avatar: '/profile.jpg',
      rating: 4.9,
      reviews: 342,
      projects: 156,
      experience: '8 سنوات',
      location: 'الرياض، السعودية',
      website: 'techprosolutions.com',
      email: 'hello@techprosolutions.com',
      phone: '+966 50 123 4567',
      badge: 'الأعلى تقييماً',
      services: ['تطوير الويب', 'التجارة الإلكترونية', 'تطبيقات مخصصة'],
      skills: ['React', 'Node.js', 'Python', 'AWS'],
      hourlyRate: 500,
      totalEarnings: '937,500+ ريال',
      responseTime: 'ساعتان',
      languages: ['العربية', 'الإنجليزية'],
      portfolio: [
        { title: 'منصة تجارة إلكترونية', image: '/template-ecommerce.jpg' },
        { title: 'لوحة تحكم SaaS', image: '/template-saas.jpg' },
        { title: 'موقع أعمال', image: '/template-portfolio.jpg' }
      ]
    },
    {
      id: 2,
      name: 'استوديو التصميم الاحترافي',
      category: 'ui-ux-design',
      description: 'وكالة تصميم إبداعية تركز على التصميم الذي يركز على المستخدم والعلامة التجارية والتجارب الرقمية',
      avatar: '/profile.jpg',
      rating: 4.8,
      reviews: 289,
      projects: 203,
      experience: '6 سنوات',
      location: 'جدة، السعودية',
      website: 'designstudiopro.com',
      email: 'info@designstudiopro.com',
      phone: '+966 50 987 6543',
      badge: 'مميز',
      services: ['تصميم واجهة المستخدم', 'بحث تجربة المستخدم', 'العلامة التجارية', 'النماذج الأولية'],
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Principle'],
      hourlyRate: 400,
      totalEarnings: '675,000+ ريال',
      responseTime: 'ساعة واحدة',
      languages: ['العربية', 'الإنجليزية', 'الفرنسية'],
      portfolio: [
        { title: 'موقع معرض أعمال', image: '/template-portfolio.jpg' },
        { title: 'تصميم تطبيق جوال', image: '/template-portfolio.jpg' },
        { title: 'هوية العلامة التجارية', image: '/template-portfolio.jpg' }
      ]
    },
    {
      id: 3,
      name: 'خبراء التطوير',
      category: 'mobile-development',
      description: 'فريق تطوير تطبيقات جوال محترف يخلق تطبيقات أصلية ومتعددة المنصات لنظامي iOS و Android',
      avatar: '/profile.jpg',
      rating: 4.9,
      reviews: 198,
      projects: 87,
      experience: '7 سنوات',
      location: 'الدمام، السعودية',
      website: 'devmasters.io',
      email: 'contact@devmasters.io',
      phone: '+966 50 456 7890',
      badge: 'خبير',
      services: ['تطوير iOS', 'تطوير Android', 'React Native', 'Flutter'],
      skills: ['Swift', 'Kotlin', 'React Native', 'Flutter'],
      hourlyRate: 450,
      totalEarnings: '731,250+ ريال',
      responseTime: '3 ساعات',
      languages: ['العربية', 'الإنجليزية', 'الألمانية'],
      portfolio: [
        { title: 'تطبيق بنكي', image: '/template-portfolio.jpg' },
        { title: 'متتبع اللياقة', image: '/template-portfolio.jpg' },
        { title: 'تطبيق وسائل التواصل الاجتماعي', image: '/template-portfolio.jpg' }
      ]
    },
    {
      id: 4,
      name: 'وكالة الويب الحرفية',
      category: 'web-development',
      description: 'وكالة ويب متكاملة تقدم مواقع جميلة ووظيفية تحقق النتائج',
      avatar: '/profile.jpg',
      rating: 4.7,
      reviews: 156,
      projects: 124,
      experience: '5 سنوات',
      location: 'مكة المكرمة، السعودية',
      website: 'webcraft.agency',
      email: 'team@webcraft.agency',
      phone: '+966 50 234 5678',
      services: ['تصميم المواقع', 'التطوير', 'SEO', 'الصيانة'],
      skills: ['WordPress', 'Shopify', 'PHP', 'JavaScript'],
      hourlyRate: 350,
      totalEarnings: '450,000+ ريال',
      responseTime: '4 ساعات',
      languages: ['العربية', 'الإنجليزية'],
      portfolio: [
        { title: 'موقع مطعم', image: '/template-restaurant.jpg' },
        { title: 'منصة مدونة', image: '/template-blog.jpg' },
        { title: 'موقع شركة', image: '/template-portfolio.jpg' }
      ]
    },
    {
      id: 5,
      name: 'مركز منشئي المحتوى',
      category: 'content-creation',
      description: 'فريق احترافي لإنشاء المحتوى متخصص في المقالات والمقالات والمحتوى الرقمي',
      avatar: '/profile.jpg',
      rating: 4.6,
      reviews: 234,
      projects: 412,
      experience: '4 سنوات',
      location: 'المدينة المنورة، السعودية',
      website: 'contentcreators.hub',
      email: 'write@contentcreators.hub',
      phone: '+966 50 345 6789',
      services: ['كتابة المدونات', 'الكتابة الإعلانية', 'استراتيجية المحتوى', 'محتوى SEO'],
      skills: ['SEO', 'الكتابة الإعلانية', 'استراتيجية المحتوى', 'التحرير'],
      hourlyRate: 200,
      totalEarnings: '318,750+ ريال',
      responseTime: 'ساعتان',
      languages: ['العربية', 'الإنجليزية', 'الإسبانية'],
      portfolio: [
        { title: 'مقالات المدونة', image: '/template-blog.jpg' },
        { title: 'نسخة الموقع', image: '/template-portfolio.jpg' },
        { title: 'المحتوى التسويقي', image: '/template-portfolio.jpg' }
      ]
    },
    {
      id: 6,
      name: 'محترفو التسويق الرقمي',
      category: 'digital-marketing',
      description: 'وكالة تسويق رقمي مدفوعة بالنتائج تساعد الشركات على نمو وجودها عبر الإنترنت',
      avatar: '/profile.jpg',
      rating: 4.8,
      reviews: 178,
      projects: 95,
      experience: '6 سنوات',
      location: 'الخبر، السعودية',
      website: 'digitalmarketing.pro',
      email: 'grow@digitalmarketing.pro',
      phone: '+966 50 567 8901',
      badge: 'نجم صاعد',
      services: ['SEO', 'إعلانات PPC', 'وسائل التواصل الاجتماعي', 'التسويق عبر البريد الإلكتروني'],
      skills: ['Google Ads', 'Facebook Ads', 'SEO', 'Analytics'],
      hourlyRate: 250,
      totalEarnings: '412,500+ ريال',
      responseTime: 'ساعة واحدة',
      languages: ['العربية', 'الإنجليزية', 'البرتغالية'],
      portfolio: [
        { title: 'حملة SEO', image: '/template-portfolio.jpg' },
        { title: 'وسائل التواصل الاجتماعي', image: '/template-portfolio.jpg' },
        { title: 'التسويق عبر البريد الإلكتروني', image: '/template-portfolio.jpg' }
      ]
    }
  ]

  const filteredProviders = providers.filter(provider => {
    const matchesCategory = selectedCategory === 'all' || provider.category === selectedCategory
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesRating = selectedRating === 'all' || provider.rating >= parseFloat(selectedRating)
    
    return matchesCategory && matchesSearch && matchesRating
  })

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.projects - a.projects
      case 'rating':
        return b.rating - a.rating
      case 'experience':
        return parseInt(b.experience) - parseInt(a.experience)
      case 'price-low':
        return a.hourlyRate - b.hourlyRate
      case 'price-high':
        return b.hourlyRate - a.hourlyRate
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 space-x-reverse">
              <img src="/logo.png" alt="منصة عرض المواقع" className="w-8 h-8" />
              <span className={`text-2xl font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                منصة عرض المواقع
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" className={scrolled ? 'text-gray-700' : 'text-white'}>
                  لوحة التحكم
                </Button>
              </Link>
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
      <section className="relative pt-24 pb-12 bg-gradient-to-br from-gray-900 to-gray-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            مقدمو الخدمات <span className="text-yellow-400">المتميزون</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            تواصل مع المحترفين والوكالات الموثوقة لمشروعك القادم
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="ابحث عن المزودين بالاسم أو المهارات أو الخدمات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-12 pl-4 py-3 text-lg bg-white/90 backdrop-blur-sm border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-500 mb-2">
                {providers.length}+
              </div>
              <div className="text-gray-600">مزود موثوق</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-500 mb-2">
                1,500+
              </div>
              <div className="text-gray-600">مشاريع مكتملة</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-500 mb-2">
                4.8/5
              </div>
              <div className="text-gray-600">متوسط التقييم</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-500 mb-2">
                24 ساعة
              </div>
              <div className="text-gray-600">متوسط وقت الرد</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="الفئة" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="الحد الأدنى للتقييم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التقييمات</SelectItem>
                  <SelectItem value="4.5">4.5+ نجوم</SelectItem>
                  <SelectItem value="4.0">4.0+ نجوم</SelectItem>
                  <SelectItem value="3.5">3.5+ نجوم</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">أكثر المشاريع</SelectItem>
                  <SelectItem value="rating">الأعلى تقييماً</SelectItem>
                  <SelectItem value="experience">أكثر الخبرة</SelectItem>
                  <SelectItem value="price-low">السعر: من الأقل للأعلى</SelectItem>
                  <SelectItem value="price-high">السعر: من الأعلى للأقل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-600">
              عرض {sortedProviders.length} مزود
            </div>
          </div>
        </div>
      </section>

      {/* Providers List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sortedProviders.map((provider) => (
              <Card key={provider.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Provider Info */}
                    <div className="lg:w-1/3">
                      <div className="flex items-start space-x-4 space-x-reverse">
                        <img 
                          src={provider.avatar} 
                          alt={provider.name} 
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 space-x-reverse mb-1">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {provider.name}
                            </h3>
                            {provider.badge && (
                              <Badge className="bg-yellow-500 text-white text-xs">
                                {provider.badge}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600 mb-2">
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="font-medium">{provider.rating}</span>
                              <span>({provider.reviews} تقييم)</span>
                            </div>
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <MapPin className="w-4 h-4" />
                              <span>{provider.location}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            {provider.description}
                          </p>
                          <div className="flex items-center space-x-4 space-x-reverse text-sm">
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span>{provider.projects} مشروع</span>
                            </div>
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Award className="w-4 h-4 text-gray-400" />
                              <span>{provider.experience}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Services & Skills */}
                    <div className="lg:w-2/3">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Services */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">الخدمات</h4>
                          <div className="flex flex-wrap gap-2">
                            {provider.services.map((service, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Skills */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">المهارات</h4>
                          <div className="flex flex-wrap gap-2">
                            {provider.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Portfolio */}
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-3">معرض الأعمال</h4>
                        <div className="grid grid-cols-3 gap-4">
                          {provider.portfolio.map((item, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs text-center px-2">{item.title}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Contact & Actions */}
                      <div className="mt-6 pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600">
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <Phone className="w-4 h-4" />
                            <span>{provider.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <Mail className="w-4 h-4" />
                            <span>{provider.email}</span>
                          </div>
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <Globe className="w-4 h-4" />
                            <span>{provider.website}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <div className="text-left">
                            <div className="text-lg font-bold text-green-600">
                              {provider.hourlyRate} ريال/ساعة
                            </div>
                            <div className="text-xs text-gray-500">
                              وقت الرد: {provider.responseTime}
                            </div>
                          </div>
                          <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                            تواصل الآن
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}