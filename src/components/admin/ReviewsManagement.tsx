'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Search, 
  Filter, 
  Eye,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag,
  CheckCircle,
  XCircle,
  Trash2
} from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  itemType: 'website' | 'service';
  itemName: string;
  userName: string;
  userEmail: string;
  isActive: boolean;
  isReported: boolean;
  createdAt: string;
}

export function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      rating: 5,
      comment: 'ممتاز! خدمة رائعة وتنفيذ احترافي. أنصح بالتعامل معهم.',
      itemType: 'website',
      itemName: 'متجر إلكتروني احترافي',
      userName: 'أحمد محمد',
      userEmail: 'ahmed@example.com',
      isActive: true,
      isReported: false,
      createdAt: '2024-01-20'
    },
    {
      id: '2',
      rating: 4,
      comment: 'جيد جداً ولكن هناك بعض التأخير في التسليم.',
      itemType: 'service',
      itemName: 'تطوير متجر إلكتروني متكامل',
      userName: 'فاطمة علي',
      userEmail: 'fatima@example.com',
      isActive: true,
      isReported: false,
      createdAt: '2024-01-19'
    },
    {
      id: '3',
      rating: 2,
      comment: 'سيء جداً لا أنصح بالتعامل',
      itemType: 'website',
      itemName: 'مطعم أنيق',
      userName: 'محمد سعيد',
      userEmail: 'mohammed@example.com',
      isActive: false,
      isReported: true,
      createdAt: '2024-01-18'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating;
    const matchesType = filterType === 'all' || review.itemType === filterType;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && review.isActive) ||
      (filterStatus === 'inactive' && !review.isActive) ||
      (filterStatus === 'reported' && review.isReported);
    return matchesSearch && matchesRating && matchesType && matchesStatus;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة التقييمات</h2>
          <p className="text-gray-600">إدارة جميع تقييمات المواقع والخدمات</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي التقييمات</p>
                <p className="text-2xl font-bold">{reviews.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">متوسط التقييم</p>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">النشطة</p>
                <p className="text-2xl font-bold">{reviews.filter(r => r.isActive).length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المبلغ عنها</p>
                <p className="text-2xl font-bold">{reviews.filter(r => r.isReported).length}</p>
              </div>
              <Flag className="w-8 h-8 text-red-500" />
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
                  placeholder="البحث بالاسم أو المنتج أو التعليق..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">جميع الأنواع</option>
              <option value="website">مواقع</option>
              <option value="service">خدمات</option>
            </select>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">جميع التقييمات</option>
              <option value="5">5 نجوم</option>
              <option value="4">4 نجوم</option>
              <option value="3">3 نجوم</option>
              <option value="2">نجمتان</option>
              <option value="1">نجمة</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="reported">مبلغ عنه</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      {renderStars(review.rating)}
                    </div>
                    <Badge variant={review.itemType === 'website' ? 'default' : 'secondary'}>
                      {review.itemType === 'website' ? 'موقع' : 'خدمة'}
                    </Badge>
                    {review.isReported && (
                      <Badge className="bg-red-100 text-red-800">
                        <Flag className="w-3 h-3 ml-1" />
                        مبلغ عنه
                      </Badge>
                    )}
                    <Badge className={review.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {review.isActive ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-1">{review.itemName}</h3>
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">{review.userName}</span>
                      <span className="mr-2">({review.userEmail})</span>
                    </div>
                    <div>{review.createdAt}</div>
                  </div>
                </div>
                
                <div className="flex space-x-2 space-x-reverse mr-4">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  {review.isActive ? (
                    <Button variant="outline" size="sm" className="text-red-600">
                      <XCircle className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="text-green-600">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}