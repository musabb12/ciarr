'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  MessageSquare,
  Search,
  Eye,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  Archive,
  Reply,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

function mapApiContact(api: { id: string; name: string; email: string; subject?: string; message?: string; status?: string; createdAt?: string }): Contact {
  const statusMap: Record<string, Contact['status']> = { unread: 'new', read: 'read', replied: 'replied' };
  return {
    id: api.id,
    name: api.name,
    email: api.email,
    subject: api.subject || 'بدون موضوع',
    message: api.message || '',
    status: statusMap[api.status || 'unread'] || 'new',
    createdAt: api.createdAt || '',
  };
}

export function ContactsManagement() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [detailContact, setDetailContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetch('/api/admin/contact-messages')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setContacts((Array.isArray(data) ? data : []).map(mapApiContact)))
      .catch(() => setContacts([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'new': { label: 'جديد', color: 'bg-blue-100 text-blue-800', icon: <Clock className="w-3 h-3" /> },
      'read': { label: 'مقروء', color: 'bg-yellow-100 text-yellow-800', icon: <Eye className="w-3 h-3" /> },
      'replied': { label: 'تم الرد', color: 'bg-green-100 text-green-800', icon: <Reply className="w-3 h-3" /> },
      'closed': { label: 'مغلق', color: 'bg-gray-100 text-gray-800', icon: <Archive className="w-3 h-3" /> }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.color}>
        {config.icon}
        <span className="mr-1">{config.label}</span>
      </Badge>
    );
  };

  const updateContactStatus = (id: string, newStatus: string) => {
    setContacts(contacts.map(contact => 
      contact.id === id 
        ? { ...contact, status: newStatus as Contact['status'], updatedAt: new Date().toISOString().split('T')[0] }
        : contact
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة الرسائل</h2>
          <p className="text-gray-600">إدارة جميع رسائل التواصل والاستفسارات</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الرسائل</p>
                <p className="text-2xl font-bold">{contacts.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">رسائل جديدة</p>
                <p className="text-2xl font-bold">{contacts.filter(c => c.status === 'new').length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">تم الرد</p>
                <p className="text-2xl font-bold">{contacts.filter(c => c.status === 'replied').length}</p>
              </div>
              <Reply className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مغلقة</p>
                <p className="text-2xl font-bold">{contacts.filter(c => c.status === 'closed').length}</p>
              </div>
              <Archive className="w-8 h-8 text-gray-500" />
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
                  placeholder="البحث بالاسم أو البريد أو الموضوع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">جميع الحالات</option>
              <option value="new">جديد</option>
              <option value="read">مقروء</option>
              <option value="replied">تم الرد</option>
              <option value="closed">مغلق</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <div className="space-y-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className={contact.status === 'new' ? 'border-blue-200 bg-blue-50' : ''}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-lg">{contact.subject}</h3>
                    {getStatusBadge(contact.status)}
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 ml-2" />
                      {contact.name} ({contact.email})
                    </div>
                    {contact.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 ml-2" />
                        {contact.phone}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 ml-2" />
                      {contact.createdAt}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3 bg-white p-3 rounded border">
                    {contact.message}
                  </p>
                  
                  {contact.notes && (
                    <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        <strong>ملاحظات:</strong> {contact.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2 space-x-reverse">
                <Button variant="outline" size="sm" onClick={() => setDetailContact(contact)}>
                  <Eye className="w-4 h-4 ml-1" />
                  تفاصيل
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.info(`يمكنك الرد عبر: ${contact.email}`)}>
                  <Reply className="w-4 h-4 ml-1" />
                  رد
                </Button>
                {contact.status === 'new' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => updateContactStatus(contact.id, 'read')}
                  >
                    <CheckCircle className="w-4 h-4 ml-1" />
                    تحديد كمقروء
                  </Button>
                )}
                {contact.status === 'read' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => updateContactStatus(contact.id, 'replied')}
                  >
                    <Reply className="w-4 h-4 ml-1" />
                    تحديد كتم الرد
                  </Button>
                )}
                {['read', 'replied'].includes(contact.status) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => updateContactStatus(contact.id, 'closed')}
                  >
                    <Archive className="w-4 h-4 ml-1" />
                    إغلاق
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      <Dialog open={!!detailContact} onOpenChange={(open) => !open && setDetailContact(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100 max-w-lg">
          <DialogHeader>
            <DialogTitle>تفاصيل الرسالة</DialogTitle>
          </DialogHeader>
          {detailContact && (
            <div className="space-y-2 py-2">
              <p><span className="text-slate-400">الموضوع:</span> {detailContact.subject}</p>
              <p><span className="text-slate-400">الاسم:</span> {detailContact.name}</p>
              <p><span className="text-slate-400">البريد:</span> {detailContact.email}</p>
              {detailContact.phone && <p><span className="text-slate-400">الهاتف:</span> {detailContact.phone}</p>}
              <p><span className="text-slate-400">التاريخ:</span> {detailContact.createdAt}</p>
              <p className="mt-2 text-slate-300">{detailContact.message}</p>
              {detailContact.notes && <p className="text-amber-400/90 mt-2">ملاحظات: {detailContact.notes}</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}