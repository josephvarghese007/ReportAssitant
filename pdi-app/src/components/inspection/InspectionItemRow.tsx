'use client';
import { useState } from 'react';
import { Check, X, Camera, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, compressImage } from '@/lib/utils';
import type { InspectionItem, Status } from '@/types/inspection';

interface InspectionItemRowProps {
  item: InspectionItem;
  onStatusChange: (id: number, status: Status) => void;
  onPhotoChange: (id: number, photo: string | null) => void;
  onRemarksChange: (id: number, remarks: string) => void;
  onFailClick: (item: InspectionItem) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export function InspectionItemRow({
  item,
  onStatusChange,
  onPhotoChange,
  onRemarksChange,
  onFailClick,
  showToast,
}: InspectionItemRowProps) {
  const [expanded, setExpanded] = useState(false);
  const isFail = item.status === 'FAIL';
  const isPass = item.status === 'PASS';
  const showEvidence = isFail || !!item.photo || !!item.remarks || expanded;

  const handlePassClick = () => {
    const next = isPass ? '' : 'PASS';
    onStatusChange(item.id, next as Status);
    if (next === 'PASS') {
      navigator.vibrate?.(50);
      showToast('✅ Marked PASS', 'success');
    } else {
      showToast('↩️ Status cleared', 'info');
    }
  };

  const handleFailClick = () => {
    if (isFail) {
      onStatusChange(item.id, '');
      showToast('↩️ Status cleared', 'info');
    } else {
      onFailClick(item);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      onPhotoChange(item.id, compressed);
      showToast('📸 Evidence photo saved', 'success');
    } catch {
      showToast('❌ Failed to process photo', 'error');
    }
    e.target.value = '';
  };

  return (
    <div
      className={cn(
        'border-b border-slate-100 dark:border-slate-700 last:border-0',
        isFail && 'bg-red-50/50 dark:bg-red-900/10',
        isPass && 'bg-green-50/30 dark:bg-green-900/10'
      )}
    >
      <div className="flex items-start gap-3 p-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{item.pdc}</p>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-snug">{item.picp}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{item.spec}</p>
          {(isFail || item.photo || item.remarks) && (
            <button
              className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-0.5 mt-1"
              onClick={() => setExpanded(!expanded)}
            >
              Evidence {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          <button
            onClick={handlePassClick}
            aria-pressed={isPass}
            aria-label={`Mark ${item.picp} as pass`}
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-all touch-manipulation',
              isPass
                ? 'bg-green-500 text-white shadow-md shadow-green-200 dark:shadow-green-900'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
            )}
          >
            <Check className="w-4 h-4" strokeWidth={isPass ? 3 : 2} />
          </button>
          <button
            onClick={handleFailClick}
            aria-pressed={isFail}
            aria-label={`Mark ${item.picp} as fail`}
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-all touch-manipulation',
              isFail
                ? 'bg-red-500 text-white shadow-md shadow-red-200 dark:shadow-red-900'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
            )}
          >
            <X className="w-4 h-4" strokeWidth={isFail ? 3 : 2} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showEvidence && (isFail || expanded) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2">
              <label
                className={cn(
                  'flex items-center gap-2 w-fit rounded-lg px-3 py-1.5 text-xs cursor-pointer',
                  'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                )}
              >
                <Camera className="w-3.5 h-3.5" />
                {item.photo ? 'Change Photo' : 'Add Photo'}
                {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
              </label>
              {item.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.photo}
                  alt="evidence"
                  className="rounded-lg max-h-32 object-cover border border-slate-200 dark:border-slate-600"
                />
              )}
              <textarea
                value={item.remarks}
                onChange={(e) => onRemarksChange(item.id, e.target.value)}
                placeholder="Add remarks, defect details..."
                rows={2}
                className="w-full text-xs rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2.5 py-2 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
