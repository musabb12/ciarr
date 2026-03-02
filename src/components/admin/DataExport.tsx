'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ExportOptions {
  format: 'csv' | 'excel' | 'json' | 'pdf';
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  includeHeaders: boolean;
  filters: string[];
}

interface DataExportProps {
  data: any[];
  title: string;
  columns: { key: string; label: string }[];
  onExport?: (options: ExportOptions) => Promise<void>;
}

export function DataExport({ data, title, columns, onExport }: DataExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: 'all',
    includeHeaders: true,
    filters: []
  });

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(0);

    try {
      // Simulate export progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      if (onExport) {
        await onExport(options);
      } else {
        // Default export logic
        await performExport(options);
      }

      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setIsExporting(false);
        setProgress(0);
        setIsOpen(false);
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      setProgress(0);
    }
  };

  const performExport = async (exportOptions: ExportOptions) => {
    let exportData = [...data];
    
    // Apply date filter
    if (exportOptions.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (exportOptions.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      exportData = exportData.filter(item => {
        const itemDate = new Date(item.createdAt || item.date);
        return itemDate >= filterDate;
      });
    }

    // Generate file based on format
    let content = '';
    let filename = `${title}_${new Date().toISOString().split('T')[0]}`;
    let mimeType = '';

    switch (exportOptions.format) {
      case 'csv':
        content = generateCSV(exportData, exportOptions.includeHeaders);
        filename += '.csv';
        mimeType = 'text/csv';
        break;
      case 'json':
        content = JSON.stringify(exportData, null, 2);
        filename += '.json';
        mimeType = 'application/json';
        break;
      case 'excel':
        // For Excel, we'll create a CSV that can be opened in Excel
        content = generateCSV(exportData, exportOptions.includeHeaders);
        filename += '.xlsx';
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'pdf':
        // PDF generation would require a library like jsPDF
        content = generatePDF(exportData);
        filename += '.pdf';
        mimeType = 'application/pdf';
        break;
    }

    // Download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateCSV = (data: any[], includeHeaders: boolean) => {
    if (data.length === 0) return '';

    let csv = '';
    
    if (includeHeaders) {
      csv += columns.map(col => col.label).join(',') + '\n';
    }

    data.forEach(row => {
      const values = columns.map(col => {
        const value = row[col.key];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      });
      csv += values.join(',') + '\n';
    });

    return csv;
  };

  const generatePDF = (data: any[]) => {
    // Simple PDF-like text format
    let pdf = `${title}\n${'='.repeat(50)}\n\n`;
    
    data.forEach((item, index) => {
      pdf += `Record ${index + 1}\n`;
      pdf += '-'.repeat(30) + '\n';
      columns.forEach(col => {
        pdf += `${col.label}: ${item[col.key] || 'N/A'}\n`;
      });
      pdf += '\n';
    });

    return pdf;
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv':
      case 'excel':
        return <FileSpreadsheet className="w-4 h-4" />;
      case 'json':
        return <Database className="w-4 h-4" />;
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      default:
        return <Download className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        تصدير
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-80 bg-white rounded-lg shadow-lg border">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">تصدير البيانات</CardTitle>
              <p className="text-sm text-gray-600">
                تصدير {data.length} سجل من {title}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">تنسيق الملف</Label>
                <Select
                  value={options.format}
                  onValueChange={(value: any) => 
                    setOptions(prev => ({ ...prev, format: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4" />
                        CSV
                      </div>
                    </SelectItem>
                    <SelectItem value="excel">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4" />
                        Excel
                      </div>
                    </SelectItem>
                    <SelectItem value="json">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        JSON
                      </div>
                    </SelectItem>
                    <SelectItem value="pdf">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        PDF
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">نطاق التاريخ</Label>
                <Select
                  value={options.dateRange}
                  onValueChange={(value: any) => 
                    setOptions(prev => ({ ...prev, dateRange: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل البيانات</SelectItem>
                    <SelectItem value="today">اليوم فقط</SelectItem>
                    <SelectItem value="week">آخر أسبوع</SelectItem>
                    <SelectItem value="month">آخر شهر</SelectItem>
                    <SelectItem value="year">آخر سنة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="includeHeaders"
                  checked={options.includeHeaders}
                  onCheckedChange={(checked) =>
                    setOptions(prev => ({ ...prev, includeHeaders: checked as boolean }))
                  }
                />
                <Label htmlFor="includeHeaders" className="text-sm">
                  تضمين العناوين
                </Label>
              </div>

              {isExporting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>جاري التصدير...</span>
                    <Badge variant="outline">{progress}%</Badge>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex-1"
                >
                  {isExporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                      جاري التصدير...
                    </>
                  ) : (
                    <>
                      {getFormatIcon(options.format)}
                      تصدير {options.format.toUpperCase()}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isExporting}
                >
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}