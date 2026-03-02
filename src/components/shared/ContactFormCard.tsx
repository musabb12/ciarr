'use client';

import * as React from 'react';
import { Mail, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export interface ContactFormCardProps {
  title?: string;
  description?: string;
  onSubmit?: (data: { name: string; email: string; subject?: string; message: string }) => void;
  className?: string;
}

export function ContactFormCard({
  title = 'تواصل معنا',
  description,
  onSubmit,
  className,
}: ContactFormCardProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement | null)?.value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };
    onSubmit?.(data);
  };

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <h2 className="text-xl font-bold">{title}</h2>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact-name">الاسم</Label>
              <Input id="contact-name" name="name" required placeholder="اسمك" dir="rtl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">البريد الإلكتروني</Label>
              <Input id="contact-email" name="email" type="email" required placeholder="example@mail.com" dir="ltr" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-subject">الموضوع</Label>
            <Input id="contact-subject" name="subject" placeholder="موضوع الرسالة" dir="rtl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-message">الرسالة</Label>
            <Textarea id="contact-message" name="message" required rows={4} placeholder="اكتب رسالتك..." dir="rtl" />
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            <Mail className="ml-2 h-4 w-4" />
            إرسال
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
