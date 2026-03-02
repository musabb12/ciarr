'use client';

import { useState } from 'react';
import { CheckSquare, Square, Trash2, Edit, Download, Mail, Ban, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

interface BulkOperation {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  action: (selectedItems: any[]) => Promise<void>;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

interface BulkOperationsProps {
  items: any[];
  selectedItems: string[];
  onSelectionChange: (selectedItems: string[]) => void;
  onItemsChange?: () => void;
  itemType: 'users' | 'templates' | 'messages' | 'news' | 'services';
}

export function BulkOperations({ 
  items, 
  selectedItems, 
  onSelectionChange, 
  onItemsChange,
  itemType 
}: BulkOperationsProps) {
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<BulkOperation | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [operationData, setOperationData] = useState<any>({});

  const getOperations = (): BulkOperation[] => {
    const baseOperations: BulkOperation[] = [
      {
        id: 'delete',
        name: 'حذف',
        description: 'حذف العناصر المحددة',
        icon: <Trash2 className="w-4 h-4" />,
        action: handleBulkDelete,
        requiresConfirmation: true,
        confirmationMessage: 'هل أنت متأكد من حذف هذه العناصر؟ هذا الإجراء لا يمكن التراجع عنه.'
      },
      {
        id: 'export',
        name: 'تصدير',
        description: 'تصدير العناصر المحددة',
        icon: <Download className="w-4 h-4" />,
        action: handleBulkExport
      }
    ];

    const specificOperations: Record<string, BulkOperation[]> = {
      users: [
        ...baseOperations,
        {
          id: 'activate',
          name: 'تفعيل',
          description: 'تفعيل الحسابات المحددة',
          icon: <CheckCircle className="w-4 h-4" />,
          action: handleBulkActivate
        },
        {
          id: 'deactivate',
          name: 'تعطيل',
          description: 'تعطيل الحسابات المحددة',
          icon: <Ban className="w-4 h-4" />,
          action: handleBulkDeactivate,
          requiresConfirmation: true,
          confirmationMessage: 'هل أنت متأكد من تعطيل هذه الحسابات؟'
        },
        {
          id: 'sendEmail',
          name: 'إرسال بريد',
          description: 'إرسال بريد إلكتروني للمستخدمين المحددين',
          icon: <Mail className="w-4 h-4" />,
          action: handleBulkEmail
        }
      ],
      templates: [
        ...baseOperations,
        {
          id: 'publish',
          name: 'نشر',
          description: 'نشر القوالب المحددة',
          icon: <CheckCircle className="w-4 h-4" />,
          action: handleBulkPublish
        },
        {
          id: 'unpublish',
          name: 'إلغاء النشر',
          description: 'إلغاء نشر القوالب المحددة',
          icon: <Ban className="w-4 h-4" />,
          action: handleBulkUnpublish
        }
      ],
      messages: [
        ...baseOperations,
        {
          id: 'markAsRead',
          name: 'تحديد كمقروء',
          description: 'تحديد الرسائل المحددة كمقروءة',
          icon: <CheckCircle className="w-4 h-4" />,
          action: handleBulkMarkAsRead
        },
        {
          id: 'markAsUnread',
          name: 'تحديد كغير مقروء',
          description: 'تحديد الرسائل المحددة كغير مقروءة',
          icon: <Edit className="w-4 h-4" />,
          action: handleBulkMarkAsUnread
        }
      ],
      news: [
        ...baseOperations,
        {
          id: 'publish',
          name: 'نشر',
          description: 'نشر الأخبار المحددة',
          icon: <CheckCircle className="w-4 h-4" />,
          action: handleBulkPublish
        },
        {
          id: 'unpublish',
          name: 'إلغاء النشر',
          description: 'إلغاء نشر الأخبار المحددة',
          icon: <Ban className="w-4 h-4" />,
          action: handleBulkUnpublish
        }
      ],
      services: [
        ...baseOperations,
        {
          id: 'activate',
          name: 'تفعيل',
          description: 'تفعيل الخدمات المحددة',
          icon: <CheckCircle className="w-4 h-4" />,
          action: handleBulkActivate
        },
        {
          id: 'deactivate',
          name: 'تعطيل',
          description: 'تعطيل الخدمات المحددة',
          icon: <Ban className="w-4 h-4" />,
          action: handleBulkDeactivate
        }
      ]
    };

    return specificOperations[itemType] || baseOperations;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(items.map(item => item.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedItems, itemId]);
    } else {
      onSelectionChange(selectedItems.filter(id => id !== itemId));
    }
  };

  const executeOperation = async (operation: BulkOperation) => {
    if (operation.requiresConfirmation && operation.confirmationMessage) {
      if (!confirm(operation.confirmationMessage)) {
        return;
      }
    }

    setSelectedOperation(operation);
    setIsBulkDialogOpen(false);
    setIsProcessing(true);
    setProgress(0);

    try {
      const selectedItemsData = items.filter(item => selectedItems.includes(item.id));
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await operation.action(selectedItemsData);

      clearInterval(progressInterval);
      setProgress(100);
      
      toast({
        title: "نجاح",
        description: `تم تنفيذ عملية ${operation.name} بنجاح`,
      });

      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
        setSelectedOperation(null);
        onSelectionChange([]);
        if (onItemsChange) {
          onItemsChange();
        }
      }, 1000);

    } catch (error) {
      console.error('Bulk operation failed:', error);
      toast({
        title: "خطأ",
        description: `فشل تنفيذ عملية ${operation.name}`,
        variant: "destructive",
      });
      setIsProcessing(false);
      setProgress(0);
      setSelectedOperation(null);
    }
  };

  // Operation handlers
  async function handleBulkDelete(selectedItemsData: any[]) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Deleting items:', selectedItemsData);
  }

  async function handleBulkExport(selectedItemsData: any[]) {
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 1500));
    const dataStr = JSON.stringify(selectedItemsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${itemType}_bulk_export_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function handleBulkActivate(selectedItemsData: any[]) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Activating items:', selectedItemsData);
  }

  async function handleBulkDeactivate(selectedItemsData: any[]) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Deactivating items:', selectedItemsData);
  }

  async function handleBulkPublish(selectedItemsData: any[]) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Publishing items:', selectedItemsData);
  }

  async function handleBulkUnpublish(selectedItemsData: any[]) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Unpublishing items:', selectedItemsData);
  }

  async function handleBulkMarkAsRead(selectedItemsData: any[]) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Marking as read:', selectedItemsData);
  }

  async function handleBulkMarkAsUnread(selectedItemsData: any[]) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Marking as unread:', selectedItemsData);
  }

  async function handleBulkEmail(selectedItemsData: any[]) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Sending email to:', selectedItemsData);
  }

  const isAllSelected = items.length > 0 && selectedItems.length === items.length;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < items.length;

  if (selectedItems.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={false}
          onCheckedChange={handleSelectAll}
        />
        <span className="text-sm text-gray-500">حدد عناصر للعمليات المتقدمة</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selection Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">العمليات المتقدمة</CardTitle>
            <Badge variant="outline">
              {selectedItems.length} من {items.length} محدد
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm">تحديد الكل</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">العمليات:</span>
              <div className="flex gap-2">
                {getOperations().map((operation) => (
                  <Button
                    key={operation.id}
                    variant="outline"
                    size="sm"
                    onClick={() => executeOperation(operation)}
                    disabled={isProcessing}
                    className="flex items-center gap-1"
                  >
                    {operation.icon}
                    <span className="hidden sm:inline">{operation.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Progress */}
      {isProcessing && selectedOperation && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              جاري تنفيذ {selectedOperation.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>التقدم</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-gray-600">
                معالجة {selectedItems.length} عناصر...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Email Dialog (for bulk email operation) */}
      {selectedOperation?.id === 'sendEmail' && (
        <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إرسال بريد إلكتروني جماعي</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">الموضوع</Label>
                <Input
                  id="subject"
                  value={operationData.subject || ''}
                  onChange={(e) => setOperationData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="أدخل موضوع البريد"
                />
              </div>
              <div>
                <Label htmlFor="message">الرسالة</Label>
                <Textarea
                  id="message"
                  value={operationData.message || ''}
                  onChange={(e) => setOperationData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="أدخل نص الرسالة"
                  rows={6}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsBulkDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={() => executeOperation(selectedOperation)}>
                  إرسال
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}