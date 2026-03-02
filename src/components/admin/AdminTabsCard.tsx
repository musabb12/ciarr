'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export interface AdminTab {
  value: string;
  label: string;
  content: ReactNode;
}

export interface AdminTabsCardProps {
  title?: string;
  description?: string;
  tabs: AdminTab[];
  defaultValue?: string;
  className?: string;
}

export function AdminTabsCard({
  title,
  description,
  tabs,
  defaultValue,
  className,
}: AdminTabsCardProps) {
  const defaultTab = defaultValue ?? tabs[0]?.value;

  return (
    <Card className={cn(
      'admin-card-luxury overflow-hidden rounded-2xl transition-all duration-300',
      className
    )}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-slate-100 font-arabic-heading text-lg">{title}</CardTitle>}
          {description && <p className="text-sm text-slate-400 mt-0.5">{description}</p>}
        </CardHeader>
      )}
      <CardContent>
        <Tabs defaultValue={defaultTab} className="w-full" dir="rtl">
          <TabsList className="bg-slate-800/50 border border-amber-900/20 w-full flex flex-wrap h-auto gap-1.5 p-1.5 rounded-xl">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-gradient-to-l data-[state=active]:from-amber-600/90 data-[state=active]:to-amber-700/80 data-[state=active]:text-white data-[state=active]:border-amber-500/30 text-slate-400 rounded-lg transition-all"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-4">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
