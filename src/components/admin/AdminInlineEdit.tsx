'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AdminInlineEditProps {
  value: string;
  onSave: (value: string) => void | Promise<void>;
  placeholder?: string;
  className?: string;
}

export function AdminInlineEdit({ value, onSave, placeholder = 'أدخل النص...', className }: AdminInlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const handleSave = async () => {
    if (inputValue.trim() === value) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onSave(inputValue.trim());
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className={cn('flex items-center gap-2', className)} dir="rtl">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') {
              setInputValue(value);
              setEditing(false);
            }
          }}
          placeholder={placeholder}
          className="h-8 bg-slate-800/60 border-amber-900/30 text-amber-200 rounded-lg flex-1"
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-emerald-400 hover:bg-emerald-500/20 shrink-0"
          onClick={handleSave}
          disabled={saving}
        >
          <Check className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:bg-slate-800 shrink-0"
          onClick={() => {
            setInputValue(value);
            setEditing(false);
          }}
        >
          ✕
        </Button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={cn(
        'flex items-center gap-2 text-right w-full group py-1 px-2 rounded-lg',
        'hover:bg-slate-800/50 transition-colors',
        className
      )}
      dir="rtl"
    >
      <span className="text-slate-200 flex-1 truncate">{value || placeholder}</span>
      <Pencil className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 shrink-0" />
    </button>
  );
}
