'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  TrendingUp,
  MessageSquare,
  Tag,
  Clock,
  CheckCircle,
  Archive
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  views: number;
  author: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export function PostsManagement() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'أفضل 10 ممارسات لتطوير المتاجر الإلكترونية',
      slug: 'best-ecommerce-practices',
      excerpt: 'دليل شامل لأفضل الممارسات في تطوير المتاجر الإلكترونية الناجحة',
      content: 'محتوى المقال...',
      category: 'تطوير',
      tags: ['تطوير', 'تجارة إلكترونية', 'أفضل الممارسات'],
      status: 'published',
      isFeatured: true,
      views: 1234,
      author: 'أحمد محمد',
      publishedAt: '2024-01-15',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'كيفية اختيار منصة التجارة الإلكترونية المناسبة',
      slug: 'choose-ecommerce-platform',
      excerpt: 'دليل لمساعدتك في اختيار أفضل منصة لمتجرك الإلكتروني',
      content: 'محتوى المقال...',
      category: 'استشارات',
      tags: ['تجارة إلكترونية', 'منصات', 'اختيار'],
      status: 'draft',
      isFeatured: false,
      views: 0,
      author: 'فاطمة علي',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-18'
    },
    {
      id: '3',
      title: 'اتجاهات التصميم لعام 2024',
      slug: 'design-trends-2024',
      excerpt: 'أحدث اتجاهات التصميم التي ستظهر في عام 2024',
      content: 'محتوى المقال...',
      category: 'تصميم',
      tags: ['تصميم', 'اتجاهات', '2024'],
      status: 'published',
      isFeatured: false,
      views: 567,
      author: 'محمد سعيد',
      publishedAt: '2024-01-12',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-12'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': { label: 'مسودة', color: 'bg-gray-100 text-gray-800', icon: <Edit className="w-3 h-3" /> },
      'published': { label: 'منشور', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
      'archived': { label: 'أرشيف', color: 'bg-yellow-100 text-yellow-800', icon: <Archive className="w-3 h-3" /> }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.color}>
        {config.icon}
        <span className="mr-1">{config.label}</span>
      </Badge>
    );
  };

  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة المقالات</h2>
          <p className="text-gray-600">إدارة جميع مقالات المدونة والمحتوى</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 ml-2" />
          إضافة مقال
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المقالات</p>
                <p className="text-2xl font-bold">{posts.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المنشورة</p>
                <p className="text-2xl font-bold">{posts.filter(p => p.status === 'published').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المسودات</p>
                <p className="text-2xl font-bold">{posts.filter(p => p.status === 'draft').length}</p>
              </div>
              <Edit className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المشاهدات</p>
                <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
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
                  placeholder="البحث عن مقال..."
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
              <option value="تطوير">تطوير</option>
              <option value="تصميم">تصميم</option>
              <option value="استشارات">استشارات</option>
              <option value="تسويق">تسويق</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">جميع الحالات</option>
              <option value="published">منشور</option>
              <option value="draft">مسودة</option>
              <option value="archived">أرشيف</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                    {post.isFeatured && (
                      <Badge className="bg-yellow-500">
                        <TrendingUp className="w-3 h-3 ml-1" />
                        مميز
                      </Badge>
                    )}
                    {getStatusBadge(post.status)}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{post.excerpt}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 ml-2" />
                      الكاتب: {post.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 ml-2" />
                      {post.publishedAt || post.createdAt}
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 ml-2" />
                      {post.views} مشاهدة
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{post.category}</Badge>
                    <div className="flex gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 ml-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 space-x-reverse">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 ml-1" />
                  معاينة
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 ml-1" />
                  تعديل
                </Button>
                {post.status === 'draft' && (
                  <Button variant="outline" size="sm" className="text-green-600">
                    <CheckCircle className="w-4 h-4 ml-1" />
                    نشر
                  </Button>
                )}
                {post.status === 'published' && (
                  <Button variant="outline" size="sm" className="text-yellow-600">
                    <Archive className="w-4 h-4 ml-1" />
                    أرشفة
                  </Button>
                )}
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 ml-1" />
                  حذف
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}