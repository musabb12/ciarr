'use client';

import { useState } from 'react';
import { Filter, X, Plus, Calendar, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface FilterOption {
  id: string;
  field: string;
  operator: string;
  value: any;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  label: string;
}

interface AdvancedFiltersProps {
  availableFilters: {
    field: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'boolean';
    options?: { value: string; label: string }[];
  }[];
  onFiltersChange: (filters: FilterOption[]) => void;
  onSearch: (query: string) => void;
}

export function AdvancedFilters({ availableFilters, onFiltersChange, onSearch }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [newFilter, setNewFilter] = useState<Partial<FilterOption>>({});

  const addFilter = () => {
    if (newFilter.field && newFilter.operator && newFilter.value !== undefined) {
      const filterConfig = availableFilters.find(f => f.field === newFilter.field);
      const filter: FilterOption = {
        id: Date.now().toString(),
        field: newFilter.field!,
        operator: newFilter.operator!,
        value: newFilter.value,
        type: filterConfig!.type,
        label: filterConfig!.label
      };
      
      const updatedFilters = [...filters, filter];
      setFilters(updatedFilters);
      onFiltersChange(updatedFilters);
      setNewFilter({});
    }
  };

  const removeFilter = (id: string) => {
    const updatedFilters = filters.filter(f => f.id !== id);
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearAllFilters = () => {
    setFilters([]);
    onFiltersChange([]);
    setSearchQuery('');
    onSearch('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const getOperatorOptions = (type: string) => {
    switch (type) {
      case 'text':
        return [
          { value: 'contains', label: 'يحتوي' },
          { value: 'equals', label: 'يساوي' },
          { value: 'startsWith', label: 'يبدأ بـ' },
          { value: 'endsWith', label: 'ينتهي بـ' },
          { value: 'notContains', label: 'لا يحتوي' }
        ];
      case 'number':
        return [
          { value: 'equals', label: 'يساوي' },
          { value: 'greaterThan', label: 'أكبر من' },
          { value: 'lessThan', label: 'أصغر من' },
          { value: 'greaterThanOrEqual', label: 'أكبر من أو يساوي' },
          { value: 'lessThanOrEqual', label: 'أصغر من أو يساوي' }
        ];
      case 'date':
        return [
          { value: 'equals', label: 'يساوي' },
          { value: 'after', label: 'بعد' },
          { value: 'before', label: 'قبل' },
          { value: 'between', label: 'بين' }
        ];
      case 'boolean':
        return [
          { value: 'equals', label: 'يساوي' }
        ];
      default:
        return [
          { value: 'equals', label: 'يساوي' },
          { value: 'contains', label: 'يحتوي' }
        ];
    }
  };

  const renderFilterValue = (filter: Partial<FilterOption>) => {
    if (!filter.field) return null;

    const filterConfig = availableFilters.find(f => f.field === filter.field);
    if (!filterConfig) return null;

    switch (filterConfig.type) {
      case 'text':
        return (
          <Input
            placeholder="أدخل القيمة"
            value={filter.value || ''}
            onChange={(e) => setNewFilter(prev => ({ ...prev, value: e.target.value }))}
            className="text-right"
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            placeholder="أدخل الرقم"
            value={filter.value || ''}
            onChange={(e) => setNewFilter(prev => ({ ...prev, value: Number(e.target.value) }))}
            className="text-right"
          />
        );
      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-right font-normal",
                  !filter.value && "text-muted-foreground"
                )}
              >
                <Calendar className="ml-2 h-4 w-4" />
                {filter.value ? format(new Date(filter.value), "PPP", { locale: ar }) : "اختر التاريخ"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={filter.value ? new Date(filter.value) : undefined}
                onSelect={(date) => setNewFilter(prev => ({ ...prev, value: date?.toISOString() }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      case 'select':
        return (
          <Select
            value={filter.value || ''}
            onValueChange={(value) => setNewFilter(prev => ({ ...prev, value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر القيمة" />
            </SelectTrigger>
            <SelectContent>
              {filterConfig.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'boolean':
        return (
          <Select
            value={filter.value?.toString() || ''}
            onValueChange={(value) => setNewFilter(prev => ({ ...prev, value: value === 'true' }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر القيمة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">نعم</SelectItem>
              <SelectItem value="false">لا</SelectItem>
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="بحث في البيانات..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pr-10"
          />
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              فلاتر متقدمة
              {filters.length > 0 && (
                <Badge variant="secondary">{filters.length}</Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                الفلاتر المتقدمة
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Add New Filter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">إضافة فلتر جديد</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">الحقل</Label>
                      <Select
                        value={newFilter.field || ''}
                        onValueChange={(value) => {
                          const filterConfig = availableFilters.find(f => f.field === value);
                          setNewFilter({
                            field: value,
                            type: filterConfig?.type,
                            operator: '',
                            value: ''
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الحقل" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableFilters.map(filter => (
                            <SelectItem key={filter.field} value={filter.field}>
                              {filter.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">العملية</Label>
                      <Select
                        value={newFilter.operator || ''}
                        onValueChange={(value) => setNewFilter(prev => ({ ...prev, operator: value }))}
                        disabled={!newFilter.field}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر العملية" />
                        </SelectTrigger>
                        <SelectContent>
                          {newFilter.field && getOperatorOptions(newFilter.type || 'text').map(op => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">القيمة</Label>
                      {renderFilterValue(newFilter)}
                    </div>
                  </div>

                  <Button
                    onClick={addFilter}
                    disabled={!newFilter.field || !newFilter.operator || newFilter.value === undefined}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة الفلتر
                  </Button>
                </CardContent>
              </Card>

              {/* Active Filters */}
              {filters.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">الفلاتر النشطة</CardTitle>
                      <Button variant="outline" size="sm" onClick={clearAllFilters}>
                        مسح الكل
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {filters.map((filter) => (
                        <div key={filter.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{filter.label}</Badge>
                            <span className="text-sm text-gray-600">
                              {getOperatorOptions(filter.type).find(op => op.value === filter.operator)?.label}
                            </span>
                            <span className="text-sm font-medium">
                              {filter.type === 'date' && filter.value
                                ? format(new Date(filter.value), "PPP", { locale: ar })
                                : filter.value?.toString()
                              }
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFilter(filter.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  إغلاق
                </Button>
                <Button onClick={() => setIsOpen(false)}>
                  تطبيق الفلاتر
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Filters Summary */}
      {filters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">الفلاتر النشطة:</span>
          {filters.map((filter) => (
            <Badge key={filter.id} variant="secondary" className="flex items-center gap-1">
              {filter.label}
              <button
                onClick={() => removeFilter(filter.id)}
                className="hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            مسح الكل
          </Button>
        </div>
      )}
    </div>
  );
}