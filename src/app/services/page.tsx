'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Code, Palette, Smartphone, TrendingUp, Globe, Database, Shield, Zap, ExternalLink, Image as ImageIcon, Users } from 'lucide-react'
import Link from 'next/link'

interface Website {
  id: string
  title: string
  description: string
  url: string
  category: string
  technologies: string[]
  images: string[]
}

export default function ServicesPage() {
  const [websites, setWebsites] = useState<Website[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWebsites()
  }, [])

  const fetchWebsites = async () => {
    try {
      const response = await fetch('/api/websites')
      if (!response.ok) throw new Error('فشل في جلب المواقع')
      const data = await response.json()
      setWebsites(data)
    } catch (error) {
      console.error('Error fetching websites:', error)
    } finally {
      setLoading(false)
    }
  }

  const services = [
    {
      icon: <Globe className="w-12 h-12 text-blue-600" />,
      title: 'عقاري',
      description: 'منصة عقارية للعروض الحصرية والبحث والتمويل ومخططات تفاعلية',
      features: ['عروض عقارية', 'محرك بحث', 'تمويل', 'عروض ثلاثية الأبعاد'],
      price: 'منصة CIAR العقارية',
      category: 'all'
    },
    {
      icon: <Globe className="w-12 h-12 text-cyan-600" />,
      title: 'سياحي',
      description: 'دليل سياحي عالمي مع حجز ورحلات وعروض موسمية',
      features: ['حجوزات', 'برامج سياحية', 'عروض موسمية', 'شركات وسياحة'],
      price: 'منصة CIAR السياحية',
      category: 'all'
    },
    {
      icon: <Palette className="w-12 h-12 text-purple-600" />,
      title: 'موضة وتجارة إلكترونية',
      description: 'أزياء، مول إلكتروني، وتجارة B2B ومنتجات دولية',
      features: ['موضة نسائية ورجالية', 'مول إلكتروني', 'B2B', 'شحن دولي'],
      price: 'مواقع CIAR للموضة والتجارة',
      category: 'all'
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-orange-600" />,
      title: 'سيارات وتنقل',
      description: 'دليل سيارات واستئجار، أساطيل، ونقل حضري',
      features: ['بيع واستئجار سيارات', 'أساطيل شركات', 'نقل حضري', 'تتبع'],
      price: 'منصات CIAR للسيارات والتنقل',
      category: 'all'
    },
    {
      icon: <Users className="w-12 h-12 text-green-600" />,
      title: 'توظيف واستثمار وتسويق',
      description: 'وظائف وسكن، استثمار وأسهم، وحملات إعلانية',
      features: ['وظائف وسكن', 'استثمار وأسهم', 'حملات إعلانية', 'تحليلات'],
      price: 'مواقع CIAR للتوظيف والاستثمار والتسويق',
      category: 'all'
    },
    {
      icon: <Database className="w-12 h-12 text-red-600" />,
      title: 'خدمات منزلية ولوجستيات',
      description: 'صيانة منازل ومكاتب، شحن عالمي، وتوصيل',
      features: ['صيانة منزلية ومكتبية', 'شحن دولي', 'توصيل', 'تتبع'],
      price: 'منصات CIAR للخدمات واللوجستيات',
      category: 'all'
    }
  ]

  const getWebsitesForService = (serviceTitle: string) => {
    const serviceCategoryMap: Record<string, string[]> = {
      'عقاري': ['العقارات'],
      'سياحي': ['السياحة'],
      'موضة وتجارة إلكترونية': ['الموضة', 'الموضة الفاخرة', 'تجارة بين الشركات', 'التجارة الإلكترونية'],
      'سيارات وتنقل': ['السيارات', 'النقل الحضري', 'السيارات الحصرية'],
      'توظيف واستثمار وتسويق': ['التوظيف', 'الاستثمار', 'التسويق'],
      'خدمات منزلية ولوجستيات': ['الخدمات المنزلية', 'الخدمات اللوجستية', 'التوصيل']
    }

    const relevantCategories = serviceCategoryMap[serviceTitle] || []
    if (relevantCategories.length === 0) {
      return websites.slice(0, 3)
    }
    return websites.filter(site => relevantCategories.includes(site.category)).slice(0, 3)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="text-center mb-12 md:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-arabic-heading tracking-tight">
            خدماتنا
          </h1>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto font-arabic-modern leading-relaxed">
            شركة CIAR تقدم خدماتها عبر 14 موقعاً: عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار، تسويق، لوجستيات، وأكثر
          </p>
        </div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const relevantWebsites = getWebsitesForService(service.title)
            
return (
    <Card key={index} className="card-interactive rounded-2xl overflow-hidden">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {relevantWebsites.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">مواقعنا في هذا القطاع:</h4>
                      <div className="space-y-2">
                        {relevantWebsites.map((website) => (
                          <div key={website.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <ImageIcon className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-700 truncate">
                                {website.title}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(website.url, '_blank')}
                              className="hover:bg-blue-50 p-1 h-6"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="text-base font-semibold text-amber-700 mb-4">
                      {service.price}
                    </div>
                    <Button asChild className="w-full btn-brand rounded-xl font-arabic-modern">
                      <Link href="/websites">استعرض المواقع</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 md:mt-20 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 rounded-2xl p-8 md:p-10 text-gray-900 text-center shadow-xl shadow-amber-500/20">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-arabic-heading">
            تحتاج مساعدة في أحد مواقعنا؟
          </h2>
          <p className="text-base md:text-lg mb-8 text-gray-800/90 max-w-xl mx-auto font-arabic-modern">
            فريقنا جاهز للإجابة على استفساراتك حول أي موقع من مواقعنا الـ 14
          </p>
          <Button asChild size="lg" className="bg-gray-900 text-white hover:bg-gray-800 font-arabic-modern font-semibold rounded-xl shadow-md">
            <Link href="/contact">تواصل معنا</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}