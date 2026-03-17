'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuickReplyTemplate {
  id: string;
  title: string;
  body: string;
}

export interface AdminQuickReplyProps {
  templates?: QuickReplyTemplate[];
  onSend?: (body: string) => void;
  className?: string;
}

const defaultTemplates: QuickReplyTemplate[] = [
  { id: '1', title: 'شكراً على تواصلكم', body: 'شكراً على تواصلكم. سنرد في أقرب وقت.' },
  { id: '2', title: 'طلب استلام', body: 'تم استلام طلبك وسيتم المعالجة خلال 24 ساعة.' },
  { id: '3', title: 'معلومات إضافية', body: 'هل يمكنكم تزويدنا بمزيد من التفاصيل؟' },
];

export function AdminQuickReply({ templates = defaultTemplates, onSend, className }: AdminQuickReplyProps) {
  const [body, setBody] = useState('');
  const [custom, setCustom] = useState('');

  const apply = (text: string) => {
    setBody(text);
    setCustom(text);
  };

  const send = () => {
    const toSend = body || custom;
    if (toSend.trim()) {
      onSend?.(toSend.trim());
      setBody('');
      setCustom('');
    }
  };

  return (
    <Card className={cn('admin-card-luxury rounded-2xl overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="admin-card-title text-sm font-semibold">رد سريع</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {templates.map((t) => (
            <Button
              key={t.id}
              variant="outline"
              size="sm"
              onClick={() => apply(t.body)}
              className="text-xs border-slate-200 dark:border-slate-700"
            >
              {t.title}
            </Button>
          ))}
        </div>
        <Textarea
          placeholder="نص الرد أو اختر قالباً أعلاه..."
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          rows={4}
          className="text-sm bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
        />
        <Button size="sm" onClick={send} className="w-full">
          <Send className="w-4 h-4 ml-2" />
          إرسال الرد
        </Button>
      </CardContent>
    </Card>
  );
}
