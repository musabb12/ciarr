'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

interface SearchFilters {
  query: string
  category: string
  priceRange: string
  rating: string
  sortBy: string
  tags: string[]
  features: string[]
}

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void
  categories: { id: string; name: string }[]
  availableTags: string[]
  availableFeatures: string[]
}

export function AdvancedSearch({
  onFiltersChange,
  categories,
  availableTags,
  availableFeatures
}: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    priceRange: 'all',
    rating: 'all',
    sortBy: 'popular',
    tags: [],
    features: []
  })

  useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      updateFilter('tags', [...filters.tags, tag])
    }
  }

  const removeTag = (tag: string) => {
    updateFilter('tags', filters.tags.filter(t => t !== tag))
  }

  const addFeature = (feature: string) => {
    if (!filters.features.includes(feature)) {
      updateFilter('features', [...filters.features, feature])
    }
  }

  const removeFeature = (feature: string) => {
    updateFilter('features', filters.features.filter(f => f !== feature))
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      category: 'all',
      priceRange: 'all',
      rating: 'all',
      sortBy: 'popular',
      tags: [],
      features: []
    })
  }

  const hasActiveFilters = filters.category !== 'all' || 
                          filters.priceRange !== 'all' || 
                          filters.rating !== 'all' || 
                          filters.tags.length > 0 || 
                          filters.features.length > 0

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="ابحث عن المواقع أو الخدمات..."
          value={filters.query}
          onChange={(e) => updateFilter('query', e.target.value)}
          className="pr-12 pl-4 py-3 text-lg"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute left-2 top-1/2 transform -translate-y-1/2"
        >
          <Filter className="w-4 h-4 ml-2" />
          فلاتر متقدمة
          <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">الفلاتر النشطة:</span>
          
          {filters.category !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              الفئة: {categories.find(c => c.id === filters.category)?.name}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('category', 'all')} />
            </Badge>
          )}
          
          {filters.priceRange !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              السعر: {filters.priceRange}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('priceRange', 'all')} />
            </Badge>
          )}
          
          {filters.rating !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              التقييم: {filters.rating}+
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('rating', 'all')} />
            </Badge>
          )}
          
          {filters.tags.map(tag => (
            <Badge key={tag} variant="outline" className="gap-1">
              #{tag}
              <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
            </Badge>
          ))}
          
          {filters.features.map(feature => (
            <Badge key={feature} variant="outline" className="gap-1">
              {feature}
              <X className="w-3 h-3 cursor-pointer" onClick={() => removeFeature(feature)} />
            </Badge>
          ))}
          
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            مسح الكل
          </Button>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {isOpen && (
        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفئة
                </label>
                <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفئات</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نطاق السعر
                </label>
                <Select value={filters.priceRange} onValueChange={(value) => updateFilter('priceRange', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر السعر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأسعار</SelectItem>
                    <SelectItem value="0-2000">أقل من 2,000 ريال</SelectItem>
                    <SelectItem value="2000-5000">2,000 - 5,000 ريال</SelectItem>
                    <SelectItem value="5000-10000">5,000 - 10,000 ريال</SelectItem>
                    <SelectItem value="10000+">أكثر من 10,000 ريال</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحد الأدنى للتقييم
                </label>
                <Select value={filters.rating} onValueChange={(value) => updateFilter('rating', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر التقييم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع التقييمات</SelectItem>
                    <SelectItem value="4.5">4.5+ نجوم</SelectItem>
                    <SelectItem value="4.0">4.0+ نجوم</SelectItem>
                    <SelectItem value="3.5">3.5+ نجوم</SelectItem>
                    <SelectItem value="3.0">3.0+ نجوم</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ترتيب حسب
                </label>
                <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الترتيب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">الأكثر شعبية</SelectItem>
                    <SelectItem value="rating">الأعلى تقييماً</SelectItem>
                    <SelectItem value="price-low">السعر: من الأقل للأعلى</SelectItem>
                    <SelectItem value="price-high">السعر: من الأعلى للأقل</SelectItem>
                    <SelectItem value="newest">الأحدث أولاً</SelectItem>
                    <SelectItem value="name">الاسم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags and Features */}
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوسوم
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.slice(0, 8).map(tag => (
                    <Badge
                      key={tag}
                      variant={filters.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (filters.tags.includes(tag)) {
                          removeTag(tag)
                        } else {
                          addTag(tag)
                        }
                      }}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الميزات
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableFeatures.slice(0, 6).map(feature => (
                    <Badge
                      key={feature}
                      variant={filters.features.includes(feature) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (filters.features.includes(feature)) {
                          removeFeature(feature)
                        } else {
                          addFeature(feature)
                        }
                      }}
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}