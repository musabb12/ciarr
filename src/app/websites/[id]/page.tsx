'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Share2, Heart, Star, Eye, Clock, Users, CheckCircle, Download, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Website } from '@/types'

interface WebsiteDetail extends Website {
  provider?: string
  rating?: number
  reviews?: number
  features: string[]
  lastUpdated?: string
  responsive?: boolean
  browserCompatible: string[]
}

export default function WebsiteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [website, setWebsite] = useState<WebsiteDetail | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const websiteId = Array.isArray(params.id) ? params.id[0] : (params.id as string | undefined)
    if (websiteId) {
      fetchWebsite(websiteId)
    }
  }, [params.id])

  const fetchWebsite = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/websites')
      const websites: WebsiteDetail[] = await response.json()
      const foundWebsite = websites.find((w) => w.id === id)
      
      if (foundWebsite) {
        // إضافة بيانات إضافية للعرض
        const enhancedWebsite: WebsiteDetail = {
          ...foundWebsite,
          images: (foundWebsite.images && foundWebsite.images.length > 0) ? foundWebsite.images : ['/template-portfolio.jpg'],
          provider: foundWebsite.client || 'حلول التقنية المتقدمة',
          rating: foundWebsite.rating || 4.8,
          reviews: foundWebsite.reviews || 156,
          badges: foundWebsite.badges || [],
          features: foundWebsite.features && foundWebsite.features.length > 0 ? foundWebsite.features : [
            'تصميم متجاوب بالكامل',
            'محسن لمحركات البحث',
            'متوافق مع جميع المتصفحات',
            'سرعة تحميل سريعة',
            'واجهة مستخدم حديثة',
            'دعم فني مجاني'
          ],
          technologies: foundWebsite.technologies || ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Vercel'],
          lastUpdated: foundWebsite.lastUpdated || '2024-11-01',
          responsive: foundWebsite.responsive ?? true,
          browserCompatible: foundWebsite.browserCompatible || ['Chrome', 'Firefox', 'Safari', 'Edge']
        }
        setWebsite(enhancedWebsite)
      } else {
        router.push('/websites')
      }
    } catch (error) {
      console.error('Failed to fetch website:', error)
      router.push('/websites')
    } finally {
      setLoading(false)
    }
  }

  const nextImage = () => {
    if (website && website.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % website.images.length)
    }
  }

  const prevImage = () => {
    if (website && website.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + website.images.length) % website.images.length)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!website) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">الموقع غير موجود</h1>
          <Link href="/websites">
            <Button>العودة للمواقع</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 space-x-reverse">
              <img src="/logo.png" alt="شركة CIAR - مواقعنا" className="w-8 h-8" />
              <span className="text-2xl font-bold text-gray-900">مواقعنا الـ 14</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline">لوحة التحكم</Button>
              </Link>
              <Link href="/websites">
                <Button variant="ghost">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  العودة للمواقع
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Image Gallery */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {website.images.length > 0 && (
                    <img
                      src={website.images[currentImageIndex]}
                      alt={website.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                {website.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {website.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {website.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-video bg-gray-100 rounded overflow-hidden border-2 transition-all ${
                        index === currentImageIndex ? 'border-yellow-500' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${website.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Website Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary">{website.category}</Badge>
                  {website.featured && (
                    <Badge className="bg-yellow-500 text-white">مميز</Badge>
                  )}
                  {website.badges.map((badge) => (
                    <Badge key={badge} variant="outline">{badge}</Badge>
                  ))}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{website.title}</h1>
                
                <p className="text-lg text-gray-600 mb-6">{website.description}</p>
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-semibold">{website.rating}</span>
                    <span className="text-gray-500">({website.reviews} تقييم)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Eye className="w-5 h-5" />
                    <span>1,234 معاينة</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Heart className="w-5 h-5" />
                    <span>89 إعجاب</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-sm text-gray-500">
                    <div>المزود: {website.provider}</div>
                    <div>آخر تحديث: {website.lastUpdated}</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 flex-1">
                    <Eye className="w-5 h-5 ml-2" />
                    معاينة مباشرة
                  </Button>
                  <Button size="lg" variant="outline">
                    <ExternalLink className="w-5 h-5 ml-2" />
                    زيارة الموقع
                  </Button>
                  <Button size="lg" variant="outline">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button size="lg" variant="outline">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="font-semibold">متجاوب بالكامل</div>
                    <div className="text-sm text-gray-500">يعمل على جميع الأجهزة</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="font-semibold">دعم فني</div>
                    <div className="text-sm text-gray-500">مجاني لمدة 6 أشهر</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details Tabs */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="features">الميزات</TabsTrigger>
              <TabsTrigger value="technologies">التقنيات</TabsTrigger>
              <TabsTrigger value="compatibility">التوافق</TabsTrigger>
              <TabsTrigger value="support">الدعم</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>الميزات الرئيسية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {website.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="technologies" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>التقنيات المستخدمة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {website.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-sm py-2 px-4">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="compatibility" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>التوافق والمتصفحات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">المتصفحات المدعومة:</h4>
                      <div className="flex flex-wrap gap-2">
                        {website.browserCompatible.map((browser, index) => (
                          <Badge key={index} variant="outline">{browser}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">الأجهزة المدعومة:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <span className="text-xl">📱</span>
                          </div>
                          <span className="text-sm">الهواتف</span>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <span className="text-xl">📱</span>
                          </div>
                          <span className="text-sm">التابلت</span>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <span className="text-xl">💻</span>
                          </div>
                          <span className="text-sm">الحاسوب</span>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <span className="text-xl">🖥️</span>
                          </div>
                          <span className="text-sm">شاشات كبيرة</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="support" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>الدعم الفني</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">ما يشمله الدعم:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>استفسارات فنية</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>تحديثات الأمان</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>حل المشكلات</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>تخصيص بسيط</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">طرق التواصل:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">البريد:</span>
                          <span>support@example.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">الهاتف:</span>
                          <span>+966 50 123 4567</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">وقت الرد:</span>
                          <span>خلال 24 ساعة</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}