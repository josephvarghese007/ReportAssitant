'use client';
import { memo } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { InspectionItemRow } from './InspectionItemRow';
import type { InspectionGroup, InspectionItem, Status } from '@/types/inspection';

interface GroupCardProps {
  group: InspectionGroup;
  isOpen: boolean;
  onToggle: () => void;
  onStatusChange: (id: number, status: Status) => void;
  onPhotoChange: (id: number, photo: string | null) => void;
  onRemarksChange: (id: number, remarks: string) => void;
  onFailClick: (item: InspectionItem) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const GroupCard = memo(function GroupCard({
  group,
  isOpen,
  onToggle,
  onStatusChange,
  onPhotoChange,
  onRemarksChange,
  onFailClick,
  showToast,
}: GroupCardProps) {
  const total = group.items.length;
  const pct = total > 0 ? Math.round((group.passCount / total) * 100) : 0;
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (pct / 100) * circumference;

  const progressColor = group.failCount > 0 ? '#dc2626' : pct < 100 ? '#f59e0b' : '#16a34a';

  return (
    <div className="mx-3 mb-2 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <button type="button" className="w-full flex items-center gap-3 p-4 text-left" onClick={onToggle} aria-expanded={isOpen}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-slate-800 dark:text-white leading-snug">{group.adc}</span>
            <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full">
              {total}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-green-600 dark:text-green-400">✓ {group.passCount}</span>
            <span className="text-xs text-red-600 dark:text-red-400">✗ {group.failCount}</span>
            <span className="text-xs text-amber-600 dark:text-amber-400">○ {group.pendCount}</span>
          </div>
        </div>
        <div className="relative shrink-0 w-11 h-11">
          <svg viewBox="0 0 44 44" className="w-11 h-11 -rotate-90">
            <circle cx="22" cy="22" r="18" fill="none" strokeWidth="4" className="stroke-slate-100 dark:stroke-slate-700" />
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              strokeWidth="4"
              stroke={progressColor}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.4s ease' }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-200">
            {pct}%
          </span>
        </div>
        <ChevronDown className={cn('w-4 h-4 text-slate-400 shrink-0 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t border-slate-100 dark:border-slate-700"
          >
            {group.items.map((item) => (
              <InspectionItemRow
                key={item.id}
                item={item}
                onStatusChange={onStatusChange}
                onPhotoChange={onPhotoChange}
                onRemarksChange={onRemarksChange}
                onFailClick={onFailClick}
                showToast={showToast}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
