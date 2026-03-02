'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Bell,
  Newspaper,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewsItem {
  id: string;
  text: string;
  icon: string;
  active: boolean;
}

export function NewsManagement() {
  const { toast } = useToast();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [newItem, setNewItem] = useState({ text: '', icon: '📢', active: true });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchNewsItems();
  }, []);

  const fetchNewsItems = async () => {
    try {
      const response = await fetch('/api/admin/news');
      const data = await response.json();
      setNewsItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch news items:', error);
      toast.error('فشل في جلب الأخبار');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newItem.text.trim()) return;

    try {
      const response = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });

      if (response.ok) {
        await fetchNewsItems();
        setNewItem({ text: '', icon: '📢', active: true });
        setIsAdding(false);
        toast.success('تم إضافة الخبر');
      } else {
        toast.error('فشل إضافة الخبر');
      }
    } catch (error) {
      console.error('Failed to add news item:', error);
      toast.error('فشل إضافة الخبر');
    }
  };

  const handleUpdate = async (item: NewsItem) => {
    try {
      const response = await fetch('/api/admin/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });

      if (response.ok) {
        await fetchNewsItems();
        setEditingItem(null);
        toast.success('تم حفظ التعديل');
      } else {
        toast.error('فشل حفظ التعديل');
      }
    } catch (error) {
      console.error('Failed to update news item:', error);
      toast.error('فشل حفظ التعديل');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الخبر؟')) return;

    try {
      const response = await fetch(`/api/admin/news?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchNewsItems();
        toast.success('تم حذف الخبر');
      } else {
        toast.error('فشل حذف الخبر');
      }
    } catch (error) {
      console.error('Failed to delete news item:', error);
      toast.error('فشل حذف الخبر');
    }
  };

  const toggleActive = async (item: NewsItem) => {
    const updatedItem = { ...item, active: !item.active };
    await handleUpdate(updatedItem);
  };

  const commonIcons = ['🎉', '🚀', '📱', '🎁', '⭐', '🔥', '📢', '📈', '💎', '🏆', '🎯', '🌟'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Newspaper className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">إدارة الأخبار</h2>
        </div>
        <Button 
          onClick={() => setIsAdding(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة خبر جديد
        </Button>
      </div>

      {/* Add New Item */}
      {isAdding && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-lg">إضافة خبر جديد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2 space-x-reverse">
              <Input
                placeholder="نص الخبر"
                value={newItem.text}
                onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
                className="flex-1"
              />
              <Input
                placeholder="الأيقونة"
                value={newItem.icon}
                onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
                className="w-20 text-center"
              />
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-sm text-gray-600">الأيقونات الشائعة:</span>
              <div className="flex space-x-1 space-x-reverse">
                {commonIcons.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNewItem({ ...newItem, icon })}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                checked={newItem.active}
                onCheckedChange={(checked) => setNewItem({ ...newItem, active: checked })}
              />
              <span className="text-sm">نشط</span>
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAdding(false);
                  setNewItem({ text: '', icon: '📢', active: true });
                }}
              >
                <X className="w-4 h-4 ml-2" />
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* News Items List */}
      <div className="grid gap-4">
        {newsItems.map((item) => (
          <Card key={item.id} className={!item.active ? 'opacity-60' : ''}>
            <CardContent className="p-4">
              {editingItem?.id === item.id ? (
                <div className="space-y-4">
                  <div className="flex space-x-2 space-x-reverse">
                    <Input
                      value={editingItem.text}
                      onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                      className="flex-1"
                    />
                    <Input
                      value={editingItem.icon}
                      onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                      className="w-20 text-center"
                    />
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-sm text-gray-600">الأيقونات الشائعة:</span>
                    <div className="flex space-x-1 space-x-reverse">
                      {commonIcons.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => setEditingItem({ ...editingItem, icon })}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      checked={editingItem.active}
                      onCheckedChange={(checked) => setEditingItem({ ...editingItem, active: checked })}
                    />
                    <span className="text-sm">نشط</span>
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button 
                      onClick={() => handleUpdate(editingItem)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 ml-2" />
                      حفظ
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingItem(null)}
                    >
                      <X className="w-4 h-4 ml-2" />
                      إلغاء
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-medium">{item.text}</p>
                      <div className="flex items-center space-x-2 space-x-reverse mt-1">
                        <Badge variant={item.active ? 'default' : 'secondary'}>
                          {item.active ? 'نشط' : 'غير نشط'}
                        </Badge>
                        <span className="text-xs text-gray-500">ID: {item.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(item)}
                    >
                      {item.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingItem(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {newsItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد أخبار حالياً</p>
            <Button 
              onClick={() => setIsAdding(true)}
              className="mt-4 bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة أول خبر
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}