'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  RefreshCw
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  type: 'website' | 'service';
  itemName: string;
  customerName: string;
  customerEmail: string;
  quantity: number;
  price: number;
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  createdAt: string;
  notes?: string;
}

export function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      type: 'website',
      itemName: 'متجر إلكتروني احترافي',
      customerName: 'أحمد محمد',
      customerEmail: 'ahmed@example.com',
      quantity: 1,
      price: 299,
      status: 'completed',
      createdAt: '2024-01-20',
      notes: 'تم التسليم بنجاح'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      type: 'service',
      itemName: 'تطوير متجر إلكتروني متكامل',
      customerName: 'فاطمة علي',
      customerEmail: 'fatima@example.com',
      quantity: 1,
      price: 5000,
      status: 'processing',
      createdAt: '2024-01-19',
      notes: 'قيد التنفيذ'
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      type: 'website',
      itemName: 'مطعم أنيق',
      customerName: 'محمد سعيد',
      customerEmail: 'mohammed@example.com',
      quantity: 1,
      price: 0,
      status: 'pending',
      createdAt: '2024-01-18'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesType = filterType === 'all' || order.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { label: 'في الانتظار', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-3 h-3" /> },
      'paid': { label: 'مدفوع', color: 'bg-blue-100 text-blue-800', icon: <DollarSign className="w-3 h-3" /> },
      'processing': { label: 'قيد المعالجة', color: 'bg-purple-100 text-purple-800', icon: <RefreshCw className="w-3 h-3" /> },
      'completed': { label: 'مكتمل', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
      'cancelled': { label: 'ملغي', color: 'bg-red-100 text-red-800', icon: <XCircle className="w-3 h-3" /> },
      'refunded': { label: 'مسترد', color: 'bg-gray-100 text-gray-800', icon: <RefreshCw className="w-3 h-3" /> }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.color}>
        {config.icon}
        <span className="mr-1">{config.label}</span>
      </Badge>
    );
  };

  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + (order.price * order.quantity), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة الطلبات</h2>
          <p className="text-gray-600">إدارة جميع طلبات المواقع والخدمات</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الطلبات النشطة</p>
                <p className="text-2xl font-bold">
                  {orders.filter(o => ['pending', 'paid', 'processing'].includes(o.status)).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الإيرادات</p>
                <p className="text-2xl font-bold">{totalRevenue} ريال</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المكتملة</p>
                <p className="text-2xl font-bold">
                  {orders.filter(o => o.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
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
                  placeholder="البحث بالرقم أو العميل أو المنتج..."
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">في الانتظار</option>
              <option value="paid">مدفوع</option>
              <option value="processing">قيد المعالجة</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
              <option value="refunded">مسترد</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">قائمة الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3">رقم الطلب</th>
                  <th className="text-right p-3">النوع</th>
                  <th className="text-right p-3">المنتج</th>
                  <th className="text-right p-3">العميل</th>
                  <th className="text-right p-3">السعر</th>
                  <th className="text-right p-3">الحالة</th>
                  <th className="text-right p-3">التاريخ</th>
                  <th className="text-right p-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-mono text-sm">{order.orderNumber}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant={order.type === 'website' ? 'default' : 'secondary'}>
                        {order.type === 'website' ? 'موقع' : 'خدمة'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{order.itemName}</div>
                        <div className="text-sm text-gray-500">الكمية: {order.quantity}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold">
                        {order.price === 0 ? 'مجاني' : `${order.price} ريال`}
                      </div>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="p-3 text-sm">{order.createdAt}</td>
                    <td className="p-3">
                      <div className="flex space-x-2 space-x-reverse">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {order.status === 'pending' && (
                          <Button variant="outline" size="sm" className="text-green-600">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        {['pending', 'paid'].includes(order.status) && (
                          <Button variant="outline" size="sm" className="text-red-600">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}