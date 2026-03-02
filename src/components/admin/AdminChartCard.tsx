'use client';

import { ReactNode } from 'react';
import { Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AdminChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  onExport?: () => void;
  exportLabel?: string;
  className?: string;
}

export function AdminChartCard({
  title,
  description,
  children,
  onExport,
  exportLabel = 'تصدير',
  className,
}: AdminChartCardProps) {
  return (
    <Card className={cn(
      'admin-card-luxury overflow-hidden rounded-2xl transition-all duration-300',
      className
    )}>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-slate-100 font-arabic-heading text-lg">{title}</CardTitle>
          {description && <p className="text-sm text-amber-200/70 mt-0.5">{description}</p>}
        </div>
        {onExport && (
          <Button
            variant="outline"
            size="sm"
            className="border-amber-900/30 text-amber-200 hover:bg-amber-600/20 hover:border-amber-600/40 shrink-0 transition-all"
            onClick={onExport}
          >
            <Download className="w-4 h-4 ml-2" />
            {exportLabel}
          </Button>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
