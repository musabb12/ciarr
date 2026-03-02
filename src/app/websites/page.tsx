'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ExternalLink, Search, Filter, Image as ImageIcon, ChevronLeft, ChevronRight, Play, Pause, ArrowRight } from 'lucide-react'
import { Website } from '@/types'

interface ImageCarouselProps {
  images: string[]
  title: string
}

function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    if (!isPlaying || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isPlaying, images.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <ImageIcon className="h-12 w-12 text-gray-400" />
      </div>
    )
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
                onClick={() => goToSlide(index)}
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
  )
}

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<Website[]>([])
  const [filteredWebsites, setFilteredWebsites] = useState<Website[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchWebsites()
  }, [])

  useEffect(() => {
    filterWebsites()
  }, [websites, searchTerm, selectedCategory])

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

  const filterWebsites = () => {
    let filtered = websites

    if (searchTerm) {
      filtered = filtered.filter(website =>
        website.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        website.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        website.technologies?.some(tech => 
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(website => website.category === selectedCategory)
    }

    setFilteredWebsites(filtered)
  }

  const categories = ['all', ...Array.from(new Set(websites.map(w => w.category)))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-amber-200 border-t-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-lg border-b border-gray-100/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-amber-50/80">
              <img src="/logo.png" alt="CIAR" className="w-8 h-8 rounded-lg" />
              <span className="text-xl font-bold text-gray-900 font-arabic-heading">CIAR</span>
            </Link>
            <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-amber-50/80 gap-2 rounded-xl">
              <Link href="/">
                <ArrowRight className="h-4 w-4" />
                الرئيسية
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="text-center mb-10 md:mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight font-arabic-heading">
            مواقعنا الـ 14
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-arabic-modern">
            شركة CIAR تقدم خدماتها عبر 14 موقعاً: عقاري، سياحي، موضة، تجارة إلكترونية، سيارات، توظيف، استثمار، تسويق، لوجستيات، وتوصيل
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-8 md:mb-10">
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="ابحث عن موقع أو قطاع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-12 py-5 md:py-6 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-base font-arabic-modern"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500 shrink-0" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-52 h-11 md:h-12 rounded-xl border-2 border-gray-200 focus:border-amber-400 font-arabic-modern">
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {categories.slice(1).map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredWebsites.length === 0 ? (
          <div className="text-center py-16 md:py-20 rounded-2xl bg-white border border-gray-100/80 shadow-sm">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-5 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Search className="h-8 w-8 md:h-10 md:w-10 text-amber-500" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2 font-arabic-heading">
              لا توجد نتائج
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto text-sm md:text-base font-arabic-modern">
              {searchTerm || selectedCategory !== 'all' 
                ? 'جرب تعديل البحث أو الفلتر' 
                : 'لم تتم إضافة أي مواقع بعد'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredWebsites.map((website) => (
              <Card key={website.id} className="card-interactive overflow-hidden rounded-2xl">
                <CardHeader className="p-0">
                  <div className="rounded-t-2xl overflow-hidden">
                    <ImageCarousel 
                      images={website.images?.length ? website.images : ['/template-portfolio.jpg']} 
                      title={website.title} 
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <CardTitle className="text-xl text-gray-900 font-semibold leading-tight">
                      {website.title}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 font-medium shrink-0">
                      {website.category}
                    </Badge>
                  </div>
                  
                  {website.description && (
                    <CardDescription className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {website.description}
                    </CardDescription>
                  )}
                  
                  {website.technologies && website.technologies.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {website.technologies.slice(0, 4).map((tech, index) => (
                          <span 
                            key={index}
                            className="inline-block bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-lg font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <ImageIcon className="h-4 w-4" />
                      <span>{website.images?.length || 0} صور</span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => window.open(website.url, '_blank')}
                      className="btn-brand rounded-xl gap-1.5 font-arabic-modern"
                    >
                      <ExternalLink className="h-4 w-4" />
                      زيارة الموقع
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            هل أنت مستعد لبدء مشروعك؟
          </h2>
          <p className="text-gray-600 mb-8">
            انضم إلى عملائنا السعداء واطلب مشروعك اليوم
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            اطلب مشروعك الآن
          </Button>
        </div> */}
      </div>
    </div>
  )
}