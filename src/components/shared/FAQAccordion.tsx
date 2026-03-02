'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQAccordionProps {
  items: FAQItem[];
  type?: 'single' | 'multiple';
  className?: string;
}

export function FAQAccordion({ items, type = 'single', className }: FAQAccordionProps) {
  return (
    <Accordion type={type} className={cn('w-full', className)} dir="rtl">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger className="text-right">{item.question}</AccordionTrigger>
          <AccordionContent className="text-right text-muted-foreground">{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
