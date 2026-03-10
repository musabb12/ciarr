'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Star,
  TrendingUp,
  Image,
  DollarSign,
  Tag,
  X,
  Save,
  Upload,
  Settings,
  BarChart3,
  FileText,
  Globe,
  Smartphone,
  ShoppingCart,
  Palette,
  Code,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';

interface Website {
  id: string;
  title: string;
  titleEn?: string;
  category: string;
  price: number;
  isFree: boolean;
  isFeatured: boolean;
  downloads: number;
  views: number;
  rating: number;
  reviewCount: number;
  provider: string;
  image: string;
  images?: string[]; // 多图片支持
  createdAt: string;
  description?: string;
  descriptionEn?: string;
  features?: string[];
  technologies?: string[];
  demoUrl?: string;
  supportEmail?: string;
  documentation?: string;
  lastUpdated?: string;
  status?: 'active' | 'inactive' | 'pending';
  tags?: string[];
}

function mapApiToWebsite(api: { id: string; title: string; titleEn?: string; url?: string; category: string; description?: string; descriptionEn?: string; technologies?: string[]; images?: string[]; featured?: boolean; tags?: string[]; status?: string }): Website {
  const images = api.images && api.images.length ? api.images : ['/template-portfolio.jpg'];
  return {
    id: api.id,
    title: api.title,
    titleEn: api.titleEn || '',
    category: api.category,
    price: 0,
    isFree: true,
    isFeatured: !!api.featured,
    downloads: 0,
    views: 0,
    rating: 0,
    reviewCount: 0,
    provider: '',
    image: images[0],
    images,
    createdAt: '',
    description: api.description || '',
    descriptionEn: api.descriptionEn || '',
    features: [],
    technologies: api.technologies || [],
    demoUrl: api.url || '',
    supportEmail: '',
    documentation: '',
    lastUpdated: '',
    status: (api.status as 'active') || 'active',
    tags: api.tags || [],
  };
}

export function WebsitesManagement() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [websitesLoading, setWebsitesLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [addWebsiteOpen, setAddWebsiteOpen] = useState(false);
  const [addTitle, setAddTitle] = useState('');
  const [addTitleEn, setAddTitleEn] = useState('');
  const [addUrl, setAddUrl] = useState('');
  const [addCategory, setAddCategory] = useState('الموضة');
  const [addDescription, setAddDescription] = useState('');
  const [addDescriptionEn, setAddDescriptionEn] = useState('');
  const [savingWebsite, setSavingWebsite] = useState(false);

  useEffect(() => {
    setWebsitesLoading(true);
    fetch('/api/admin/websites')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setWebsites((Array.isArray(data) ? data : []).map(mapApiToWebsite)))
      .catch(() => setWebsites([]))
      .finally(() => setWebsitesLoading(false));
  }, []);

  const filteredWebsites = websites.filter(website => {
    const matchesSearch = website.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || website.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'free' && website.isFree) ||
      (filterStatus === 'paid' && !website.isFree) ||
      (filterStatus === 'featured' && website.isFeatured);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryBadge = (category: string) => {
    const categories = {
      'ecommerce': 'التجارة الإلكترونية',
      'restaurant': 'المطاعم',
      'portfolio': 'معارض الأعمال',
      'blog': 'المدونات',
      'saas': 'البرمجيات'
    };
    return (
      <Badge variant="outline">
        {categories[category as keyof typeof categories] || category}
      </Badge>
    );
  };

  const handleEditWebsite = (website: Website) => {
    setEditingWebsite({ ...website });
    setIsEditDialogOpen(true);
    setActiveTab('basic');
  };

  const handleSaveWebsite = async () => {
    if (!editingWebsite) return;
    setSavingWebsite(true);
    try {
      const res = await fetch('/api/admin/websites', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingWebsite.id,
          title: editingWebsite.title,
          titleEn: editingWebsite.titleEn,
          url: editingWebsite.demoUrl || '',
          category: editingWebsite.category,
          description: editingWebsite.description,
          descriptionEn: editingWebsite.descriptionEn,
          technologies: editingWebsite.technologies,
          images: editingWebsite.images,
          featured: editingWebsite.isFeatured,
          tags: editingWebsite.tags,
          status: editingWebsite.status || 'active',
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setWebsites(websites.map((w) => (w.id === editingWebsite.id ? mapApiToWebsite(updated) : w)));
        setIsEditDialogOpen(false);
        setEditingWebsite(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingWebsite(false);
    }
  };

  const handleDeleteWebsite = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الموقع؟')) return;
    setSavingWebsite(true);
    try {
      const res = await fetch(`/api/admin/websites?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) setWebsites(websites.filter((w) => w.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setSavingWebsite(false);
    }
  };

  const handleAddWebsite = async () => {
    if (!addTitle.trim() || !addUrl.trim() || !addCategory.trim()) {
      alert('العنوان والرابط والفئة مطلوبة');
      return;
    }
    setSavingWebsite(true);
    try {
      const res = await fetch('/api/admin/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: addTitle.trim(),
          titleEn: addTitleEn.trim() || undefined,
          url: addUrl.trim(),
          category: addCategory.trim(),
          description: addDescription.trim(),
          descriptionEn: addDescriptionEn.trim() || undefined,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setWebsites((prev) => [...prev, mapApiToWebsite(created)]);
        setAddWebsiteOpen(false);
        setAddTitle('');
        setAddTitleEn('');
        setAddUrl('');
        setAddCategory('الموضة');
        setAddDescription('');
        setAddDescriptionEn('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingWebsite(false);
    }
  };

  const updateEditingWebsite = (field: keyof Website, value: any) => {
    if (editingWebsite) {
      setEditingWebsite({ ...editingWebsite, [field]: value });
    }
  };

  const addFeature = () => {
    if (editingWebsite) {
      const newFeature = prompt('أدخل ميزة جديدة:');
      if (newFeature) {
        updateEditingWebsite('features', [...(editingWebsite.features || []), newFeature]);
      }
    }
  };

  const removeFeature = (index: number) => {
    if (editingWebsite && editingWebsite.features) {
      updateEditingWebsite('features', editingWebsite.features.filter((_, i) => i !== index));
    }
  };

  const addTechnology = () => {
    if (editingWebsite) {
      const newTechnology = prompt('أدخل تقنية جديدة:');
      if (newTechnology) {
        updateEditingWebsite('technologies', [...(editingWebsite.technologies || []), newTechnology]);
      }
    }
  };

  const removeTechnology = (index: number) => {
    if (editingWebsite && editingWebsite.technologies) {
      updateEditingWebsite('technologies', editingWebsite.technologies.filter((_, i) => i !== index));
    }
  };

  const addTag = () => {
    if (editingWebsite) {
      const newTag = prompt('أدخل وسم جديد:');
      if (newTag) {
        updateEditingWebsite('tags', [...(editingWebsite.tags || []), newTag]);
      }
    }
  };

  const removeTag = (index: number) => {
    if (editingWebsite && editingWebsite.tags) {
      updateEditingWebsite('tags', editingWebsite.tags.filter((_, i) => i !== index));
    }
  };

  const addImage = () => {
    if (editingWebsite) {
      const newImage = prompt('أدخل رابط الصورة الجديدة:');
      if (newImage) {
        updateEditingWebsite('images', [...(editingWebsite.images || []), newImage]);
      }
    }
  };

  const removeImage = (index: number) => {
    if (editingWebsite && editingWebsite.images) {
      const newImages = editingWebsite.images.filter((_, i) => i !== index);
      updateEditingWebsite('images', newImages);
      // 如果删除的是主图片，设置第一张图片为主图片
      if (editingWebsite.image === editingWebsite.images[index] && newImages.length > 0) {
        updateEditingWebsite('image', newImages[0]);
      }
    }
  };

  const setMainImage = (imageUrl: string) => {
    if (editingWebsite) {
      updateEditingWebsite('image', imageUrl);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة المواقع</h2>
          <p className="text-gray-600">إدارة جميع المواقع والقوالب</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setAddWebsiteOpen(true)}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة موقع
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المواقع</p>
                <p className="text-2xl font-bold">{websites.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المواقع المدفوعة</p>
                <p className="text-2xl font-bold">{websites.filter(w => !w.isFree).length}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">التحميلات</p>
                <p className="text-2xl font-bold">{websites.reduce((sum, w) => sum + w.downloads, 0)}</p>
              </div>
              <Download className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">متوسط التقييم</p>
                <p className="text-2xl font-bold">
                  {(websites.reduce((sum, w) => sum + w.rating, 0) / websites.length).toFixed(1)}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="البحث عن موقع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">جميع الفئات</option>
              <option value="ecommerce">التجارة الإلكترونية</option>
              <option value="restaurant">المطاعم</option>
              <option value="portfolio">معارض الأعمال</option>
              <option value="blog">المدونات</option>
              <option value="saas">البرمجيات</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">جميع الحالات</option>
              <option value="free">مجاني</option>
              <option value="paid">مدفوع</option>
              <option value="featured">مميز</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Websites Grid */}
      {websitesLoading ? (
        <p className="text-slate-400 py-8">جاري تحميل المواقع...</p>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWebsites.map((website) => (
          <Card key={website.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              {website.images && website.images.length > 1 ? (
                <div className="relative w-full h-full">
                  <img 
                    src={website.image} 
                    alt={website.title}
                    className="w-full h-full object-cover"
                  />
                  {/* 图片指示器 */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 space-x-reverse">
                    {website.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const updatedWebsite = { ...website, image: img };
                          setWebsites(websites.map(w => w.id === website.id ? updatedWebsite : w));
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          website.image === img ? 'bg-white w-6' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                  {/* 图片数量标签 */}
                  <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {website.images.length} صور
                  </div>
                </div>
              ) : (
                <img 
                  src={website.image} 
                  alt={website.title}
                  className="w-full h-full object-cover"
                />
              )}
              {website.isFeatured && (
                <Badge className="absolute top-2 right-2 bg-yellow-500">
                  <Star className="w-3 h-3 ml-1" />
                  مميز
                </Badge>
              )}
              {website.isFree && (
                <Badge className="absolute top-12 right-2 bg-green-500">
                  مجاني
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{website.title}</h3>
                  <p className="text-sm text-gray-600">بواسطة {website.provider}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  {getCategoryBadge(website.category)}
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{website.rating}</span>
                    <span className="text-sm text-gray-500">({website.reviewCount})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <Download className="w-4 h-4" />
                    <span>{website.downloads}</span>
                  </div>
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <Eye className="w-4 h-4" />
                    <span>{website.views}</span>
                  </div>
                  <div className="font-semibold text-blue-600">
                    {website.isFree ? 'مجاني' : `${website.price} ريال`}
                  </div>
                </div>

                <div className="flex space-x-2 space-x-reverse">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 ml-1" />
                    معاينة
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditWebsite(website)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteWebsite(website.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              تعديل الموقع: {editingWebsite?.title}
            </DialogTitle>
          </DialogHeader>
          
          {editingWebsite && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
                <TabsTrigger value="content">المحتوى</TabsTrigger>
                <TabsTrigger value="technical">المعلومات التقنية</TabsTrigger>
                <TabsTrigger value="advanced">إعدادات متقدمة</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">عنوان الموقع</Label>
                    <Input
                      id="title"
                      value={editingWebsite.title}
                      onChange={(e) => updateEditingWebsite('title', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                <div>
                  <Label htmlFor="titleEn">عنوان الموقع (English)</Label>
                  <Input
                    id="titleEn"
                    value={editingWebsite.titleEn || ''}
                    onChange={(e) => updateEditingWebsite('titleEn', e.target.value)}
                    className="mt-1"
                    placeholder="Website title in English"
                  />
                </div>
                  <div>
                    <Label htmlFor="provider">المزود</Label>
                    <Input
                      id="provider"
                      value={editingWebsite.provider}
                      onChange={(e) => updateEditingWebsite('provider', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">الفئة</Label>
                    <Select value={editingWebsite.category} onValueChange={(value) => updateEditingWebsite('category', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ecommerce">التجارة الإلكترونية</SelectItem>
                        <SelectItem value="restaurant">المطاعم</SelectItem>
                        <SelectItem value="portfolio">معارض الأعمال</SelectItem>
                        <SelectItem value="blog">المدونات</SelectItem>
                        <SelectItem value="saas">البرمجيات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price">السعر (ريال)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={editingWebsite.price}
                      onChange={(e) => updateEditingWebsite('price', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">الحالة</Label>
                    <Select value={editingWebsite.status} onValueChange={(value: 'active' | 'inactive' | 'pending') => updateEditingWebsite('status', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">نشط</SelectItem>
                        <SelectItem value="inactive">غير نشط</SelectItem>
                        <SelectItem value="pending">قيد الانتظار</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 图片管理 */}
                <div>
                  <Label>إدارة الصور</Label>
                  <div className="mt-2 space-y-4">
                    {/* 主图片 */}
                    <div>
                      <Label className="text-sm text-gray-600">الصورة الرئيسية</Label>
                      <div className="mt-1 flex items-center space-x-2 space-x-reverse">
                        <Input
                          value={editingWebsite.image}
                          onChange={(e) => updateEditingWebsite('image', e.target.value)}
                          placeholder="رابط الصورة الرئيسية"
                          className="flex-1"
                        />
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={editingWebsite.image} 
                            alt="Main" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-image.jpg';
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 所有图片 */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm text-gray-600">جميع الصور ({editingWebsite.images?.length || 0})</Label>
                        <Button variant="outline" size="sm" onClick={addImage}>
                          <Plus className="w-4 h-4 ml-1" />
                          إضافة صورة
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {editingWebsite.images?.map((img, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                              <img 
                                src={img} 
                                alt={`Image ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder-image.jpg';
                                }}
                              />
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2 space-x-reverse">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setMainImage(img)}
                                className="bg-white/90 hover:bg-white"
                                title="تعيين كصورة رئيسية"
                              >
                                <Star className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeImage(index)}
                                className="bg-red-500/90 hover:bg-red-600 text-white"
                                title="حذف الصورة"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            {editingWebsite.image === img && (
                              <div className="absolute top-1 right-1">
                                <Badge className="bg-yellow-500 text-xs">
                                  <Star className="w-3 h-3 ml-1" />
                                  رئيسية
                                </Badge>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      checked={editingWebsite.isFree}
                      onCheckedChange={(checked) => updateEditingWebsite('isFree', checked)}
                    />
                    <Label>مجاني</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      checked={editingWebsite.isFeatured}
                      onCheckedChange={(checked) => updateEditingWebsite('isFeatured', checked)}
                    />
                    <Label>مميز</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div>
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={editingWebsite.description || ''}
                    onChange={(e) => updateEditingWebsite('description', e.target.value)}
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div>
                  <Label>الميزات</Label>
                  <div className="mt-2 space-y-2">
                    {editingWebsite.features?.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 space-x-reverse">
                        <Input value={feature} readOnly className="flex-1" />
                        <Button variant="outline" size="sm" onClick={() => removeFeature(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addFeature} className="w-full">
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة ميزة
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>الوسوم (Tags)</Label>
                  <div className="mt-2 space-y-2">
                    {editingWebsite.tags?.map((tag, index) => (
                      <div key={index} className="flex items-center space-x-2 space-x-reverse">
                        <Input value={tag} readOnly className="flex-1" />
                        <Button variant="outline" size="sm" onClick={() => removeTag(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addTag} className="w-full">
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة وسم
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="demoUrl">رابط المعاينة</Label>
                    <Input
                      id="demoUrl"
                      value={editingWebsite.demoUrl || ''}
                      onChange={(e) => updateEditingWebsite('demoUrl', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supportEmail">البريد الإلكتروني للدعم</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={editingWebsite.supportEmail || ''}
                      onChange={(e) => updateEditingWebsite('supportEmail', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="documentation">رابط الوثائق</Label>
                    <Input
                      id="documentation"
                      value={editingWebsite.documentation || ''}
                      onChange={(e) => updateEditingWebsite('documentation', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastUpdated">آخر تحديث</Label>
                    <Input
                      id="lastUpdated"
                      type="date"
                      value={editingWebsite.lastUpdated || ''}
                      onChange={(e) => updateEditingWebsite('lastUpdated', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>التقنيات المستخدمة</Label>
                  <div className="mt-2 space-y-2">
                    {editingWebsite.technologies?.map((tech, index) => (
                      <div key={index} className="flex items-center space-x-2 space-x-reverse">
                        <Input value={tech} readOnly className="flex-1" />
                        <Button variant="outline" size="sm" onClick={() => removeTechnology(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addTechnology} className="w-full">
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة تقنية
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">التحميلات</p>
                          <p className="text-2xl font-bold">{editingWebsite.downloads}</p>
                        </div>
                        <Download className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">المشاهدات</p>
                          <p className="text-2xl font-bold">{editingWebsite.views}</p>
                        </div>
                        <Eye className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">التقييم</p>
                          <p className="text-2xl font-bold">{editingWebsite.rating}</p>
                        </div>
                        <Star className="w-8 h-8 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="downloads">عدد التحميلات</Label>
                    <Input
                      id="downloads"
                      type="number"
                      value={editingWebsite.downloads}
                      onChange={(e) => updateEditingWebsite('downloads', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="views">عدد المشاهدات</Label>
                    <Input
                      id="views"
                      type="number"
                      value={editingWebsite.views}
                      onChange={(e) => updateEditingWebsite('views', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rating">التقييم</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={editingWebsite.rating}
                      onChange={(e) => updateEditingWebsite('rating', parseFloat(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reviewCount">عدد التقييمات</Label>
                    <Input
                      id="reviewCount"
                      type="number"
                      value={editingWebsite.reviewCount}
                      onChange={(e) => updateEditingWebsite('reviewCount', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              <X className="w-4 h-4 ml-2" />
              إلغاء
            </Button>
            <Button onClick={handleSaveWebsite} disabled={savingWebsite} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 ml-2" />
              {savingWebsite ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Website Dialog */}
      <Dialog open={addWebsiteOpen} onOpenChange={setAddWebsiteOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة موقع</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>العنوان</Label>
              <Input className="mt-1" value={addTitle} onChange={(e) => setAddTitle(e.target.value)} placeholder="عنوان الموقع" />
            </div>
                <div>
                  <Label>العنوان (English)</Label>
                  <Input className="mt-1" value={addTitleEn} onChange={(e) => setAddTitleEn(e.target.value)} placeholder="Website title in English" />
                </div>
            <div>
              <Label>الرابط</Label>
              <Input className="mt-1" value={addUrl} onChange={(e) => setAddUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <Label>الفئة</Label>
              <Input className="mt-1" value={addCategory} onChange={(e) => setAddCategory(e.target.value)} placeholder="مثال: الموضة" />
            </div>
            <div>
              <Label>الوصف (اختياري)</Label>
              <Input className="mt-1" value={addDescription} onChange={(e) => setAddDescription(e.target.value)} placeholder="وصف قصير" />
            </div>
                <div>
                  <Label>الوصف (English, اختياري)</Label>
                  <Input className="mt-1" value={addDescriptionEn} onChange={(e) => setAddDescriptionEn(e.target.value)} placeholder="Short description in English" />
                </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddWebsiteOpen(false)}>إلغاء</Button>
            <Button onClick={handleAddWebsite} disabled={savingWebsite} className="bg-blue-600 hover:bg-blue-700">
              {savingWebsite ? 'جاري الإضافة...' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}