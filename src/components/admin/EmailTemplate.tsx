'use client';

import { useState, useEffect } from 'react';
import { 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  Copy,
  Send,
  Save,
  FileText,
  Image,
  Code,
  Preview,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Star,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: 'welcome' | 'notification' | 'marketing' | 'password' | 'verification' | 'custom';
  type: 'html' | 'text';
  content: string;
  variables: string[];
  status: 'active' | 'inactive' | 'draft';
  usageCount: number;
  lastUsed?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface EmailVariable {
  name: string;
  description: string;
  example: string;
}

const defaultVariables: EmailVariable[] = [
  { name: '{{user_name}}', description: 'اسم المستخدم', example: 'أحمد محمد' },
  { name: '{{user_email}}', description: 'البريد الإلكتروني للمستخدم', example: 'user@example.com' },
  { name: '{{company_name}}', description: 'اسم الشركة', example: 'شركتك' },
  { name: '{{current_date}}', description: 'التاريخ الحالي', example: '2024-01-01' },
  { name: '{{reset_link}}', description: 'رابط إعادة تعيين كلمة المرور', example: 'https://example.com/reset' },
  { name: '{{verification_code}}', description: 'رمز التحقق', example: '123456' }
];

export function EmailTemplate() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    category: 'custom' as EmailTemplate['category'],
    type: 'html' as EmailTemplate['type'],
    content: '',
    status: 'draft' as EmailTemplate['status']
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/email-templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Failed to fetch email templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      const response = await fetch('/api/admin/email-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchTemplates();
        setIsCreateDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  const handleUpdateTemplate = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/email-templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchTemplates();
        setIsCreateDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to update template:', error);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/email-templates/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTemplates(prev => prev.filter(template => template.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const handleDuplicateTemplate = async (template: EmailTemplate) => {
    try {
      const response = await fetch('/api/admin/email-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...template,
          name: `${template.name} (نسخة)`,
          status: 'draft'
        }),
      });

      if (response.ok) {
        await fetchTemplates();
      }
    } catch (error) {
      console.error('Failed to duplicate template:', error);
    }
  };

  const handleSendTestEmail = async (templateId: string) => {
    try {
      const response = await fetch(`/api/admin/email-templates/${templateId}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'admin@example.com',
        }),
      });

      if (response.ok) {
        // Show success message
      }
    } catch (error) {
      console.error('Failed to send test email:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      category: 'custom',
      type: 'html',
      content: '',
      status: 'draft'
    });
    setSelectedTemplate(null);
  };

  const openEditDialog = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      category: template.category,
      type: template.type,
      content: template.content,
      status: template.status
    });
    setIsCreateDialogOpen(true);
  };

  const openPreviewDialog = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewDialogOpen(true);
  };

  const getCategoryBadge = (category: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; text: string }> = {
      welcome: { variant: "default", text: "ترحيب" },
      notification: { variant: "secondary", text: "إشعار" },
      marketing: { variant: "outline", text: "تسويق" },
      password: { variant: "destructive", text: "كلمة المرور" },
      verification: { variant: "secondary", text: "تحقق" },
      custom: { variant: "outline", text: "مخصص" }
    };
    const config = variants[category] || variants.custom;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || template.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const renderPreview = () => {
    if (!selectedTemplate) return null;

    let content = selectedTemplate.content;
    
    // Replace variables with example values
    defaultVariables.forEach(variable => {
      content = content.replace(new RegExp(variable.name, 'g'), variable.example);
    });

    if (selectedTemplate.type === 'html') {
      return (
        <div 
          className={previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    return (
      <div className={`whitespace-pre-wrap ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'}`}>
        {content}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">قوالب البريد الإلكتروني</h3>
          <p className="text-sm text-muted-foreground">إدارة قوالب الرسائل البريدية</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 ml-2" />
              قالب جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedTemplate ? 'تعديل القالب' : 'إنشاء قالب جديد'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">اسم القالب</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="أدخل اسم القالب"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">الموضوع</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="أدخل موضوع البريد"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">الفئة</Label>
                  <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">ترحيب</SelectItem>
                      <SelectItem value="notification">إشعار</SelectItem>
                      <SelectItem value="marketing">تسويق</SelectItem>
                      <SelectItem value="password">كلمة المرور</SelectItem>
                      <SelectItem value="verification">تحقق</SelectItem>
                      <SelectItem value="custom">مخصص</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">النوع</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="text">نص عادي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">الحالة</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                      <SelectItem value="draft">مسودة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="content">المحتوى</Label>
                <Tabs defaultValue="edit" className="w-full">
                  <TabsList>
                    <TabsTrigger value="edit">تحرير</TabsTrigger>
                    <TabsTrigger value="variables">المتغيرات</TabsTrigger>
                    <TabsTrigger value="preview">معاينة</TabsTrigger>
                  </TabsList>
                  <TabsContent value="edit">
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="أدخل محتوى البريد"
                      className="min-h-[300px]"
                    />
                  </TabsContent>
                  <TabsContent value="variables">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">المتغيرات المتاحة:</p>
                      {defaultVariables.map((variable, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{variable.name}</code>
                          <span className="text-sm text-muted-foreground">{variable.description}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFormData(prev => ({ ...prev, content: prev.content + variable.name }))}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="preview">
                    <div className="border rounded p-4 min-h-[300px]">
                      {formData.type === 'html' ? (
                        <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                      ) : (
                        <div className="whitespace-pre-wrap">{formData.content}</div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={() => selectedTemplate ? handleUpdateTemplate(selectedTemplate.id) : handleCreateTemplate()}>
                  <Save className="w-4 h-4 ml-2" />
                  {selectedTemplate ? 'تحديث' : 'حفظ'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="بحث عن قوالب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="الفئة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفئات</SelectItem>
            <SelectItem value="welcome">ترحيب</SelectItem>
            <SelectItem value="notification">إشعار</SelectItem>
            <SelectItem value="marketing">تسويق</SelectItem>
            <SelectItem value="password">كلمة المرور</SelectItem>
            <SelectItem value="verification">تحقق</SelectItem>
            <SelectItem value="custom">مخصص</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="inactive">غير نشط</SelectItem>
            <SelectItem value="draft">مسودة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Templates Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>الموضوع</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الاستخدام</TableHead>
                <TableHead>آخر استخدام</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{template.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{template.subject}</TableCell>
                  <TableCell>{getCategoryBadge(template.category)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {template.type === 'html' ? 'HTML' : 'نص'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {template.status === 'active' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {template.status === 'inactive' && <XCircle className="w-4 h-4 text-red-500" />}
                    {template.status === 'draft' && <FileText className="w-4 h-4 text-gray-500" />}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {template.usageCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    {template.lastUsed ? (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(template.lastUsed).toLocaleDateString('ar-SA')}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">لم يستخدم</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => openPreviewDialog(template)}>
                          <Eye className="w-4 h-4 ml-2" />
                          معاينة
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(template)}>
                          <Edit className="w-4 h-4 ml-2" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                          <Copy className="w-4 h-4 ml-2" />
                          نسخ
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendTestEmail(template.id)}>
                          <Send className="w-4 h-4 ml-2" />
                          إرسال تجريبي
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>معاينة القالب</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{selectedTemplate?.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedTemplate?.subject}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(previewMode === 'desktop' ? 'mobile' : 'desktop')}
                >
                  {previewMode === 'desktop' ? <FileText className="w-4 h-4" /> : <Image className="w-4 h-4" />}
                  {previewMode === 'desktop' ? 'موبايل' : 'كمبيوتر'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedTemplate && handleSendTestEmail(selectedTemplate.id)}
                >
                  <Send className="w-4 h-4 ml-2" />
                  إرسال تجريبي
                </Button>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              {renderPreview()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}