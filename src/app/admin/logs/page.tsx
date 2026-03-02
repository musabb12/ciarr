'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileStack, Search, RefreshCw } from 'lucide-react';

interface LogEntry {
  id: string;
  level: string;
  message: string;
  timestamp: string;
  source?: string;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/system-logs')
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setLogs(
          list.map((item: { id: string; status?: string; timestamp?: string; details?: string; action?: string }) => ({
            id: item.id,
            level: item.status || 'info',
            message: item.details || item.action || '',
            timestamp: item.timestamp || '',
          }))
        );
      })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.message?.toLowerCase().includes(search.toLowerCase()) ||
      l.level?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">سجلات النظام</h1>
        <p className="text-slate-400 mt-0.5">عرض أحدث أحداث النظام والأخطاء</p>
      </div>
      <Card className="bg-slate-800/80 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <FileStack className="w-5 h-5" />
            السجلات
          </CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="بحث..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-9 bg-slate-900/50 border-slate-600 text-slate-100 w-48"
              />
            </div>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 ml-2" />
              تحديث
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-400 text-sm">جاري التحميل...</p>
          ) : filtered.length === 0 ? (
            <p className="text-slate-400 text-sm">لا توجد سجلات أو لم يتم العثور على نتائج.</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto font-mono text-xs">
              {filtered.map((log) => (
                <div key={log.id} className="flex gap-2 py-1.5 border-b border-slate-700/50 last:border-0">
                  <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                  <span className={log.level === 'error' ? 'text-red-400' : log.level === 'warn' ? 'text-amber-400' : 'text-slate-400'}>
                    [{log.level}]
                  </span>
                  <span className="text-slate-300 break-all">{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
