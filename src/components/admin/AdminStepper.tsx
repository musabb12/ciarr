'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepperStep {
  label: string;
  description?: string;
  status?: 'completed' | 'current' | 'pending';
}

export interface AdminStepperProps {
  steps: StepperStep[];
  currentIndex?: number;
  className?: string;
}

export function AdminStepper({ steps, currentIndex = 0, className }: AdminStepperProps) {
  return (
    <div className={cn('space-y-0', className)} dir="rtl">
      {steps.map((step, i) => {
        const status = step.status ?? (i < currentIndex ? 'completed' : i === currentIndex ? 'current' : 'pending');
        const isCompleted = status === 'completed';
        const isCurrent = status === 'current';
        return (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center shrink-0">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-medium text-sm transition-all border',
                  isCompleted && 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                  isCurrent && 'bg-amber-500/20 text-amber-400 border-2 border-amber-500/50',
                  !isCompleted && !isCurrent && 'bg-slate-700/50 text-slate-500 border-slate-600'
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className="w-0.5 flex-1 min-h-[24px] bg-slate-700/50 my-2" />
              )}
            </div>
            <div className="pb-6 flex-1 min-w-0">
              <p
                className={cn(
                  'font-medium text-sm',
                  isCurrent ? 'text-amber-200' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
