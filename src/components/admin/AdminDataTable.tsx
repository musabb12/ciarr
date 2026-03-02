'use client';

import { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface AdminDataTableColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

export interface AdminDataTableProps<T> {
  title?: string;
  description?: string;
  columns: AdminDataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  className?: string;
  headerActions?: ReactNode;
}

export function AdminDataTable<T>({
  title,
  description,
  columns,
  data,
  keyExtractor,
  emptyMessage = 'لا توجد بيانات',
  className,
  headerActions,
}: AdminDataTableProps<T>) {
  return (
    <Card className={cn(
      'admin-card-luxury overflow-hidden rounded-2xl transition-all duration-300',
      className
    )}>
      {(title || headerActions) && (
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            {title && <CardTitle className="text-slate-100 font-arabic-heading text-lg">{title}</CardTitle>}
            {description && <p className="text-sm text-slate-400 mt-0.5">{description}</p>}
          </div>
          {headerActions}
        </CardHeader>
      )}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-amber-900/20 bg-slate-800/50 hover:bg-transparent">
              {columns.map((col) => (
                <TableHead key={col.key} className={cn('text-amber-200/80 font-medium', col.className)}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow className="border-amber-900/20 hover:bg-transparent">
                <TableCell colSpan={columns.length} className="text-center text-slate-500 py-8">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={keyExtractor(row)} className="border-amber-900/10 hover:bg-amber-900/10 transition-colors">
                  {columns.map((col) => (
                    <TableCell key={col.key} className={cn('text-slate-200', col.className)}>
                      {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as ReactNode}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
