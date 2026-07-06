'use client';
import { CheckCircle, XCircle, InfoIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Toast } from '@/hooks/useToast';

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  const icons = {
    success: <CheckCircle className="w-4 h-4 shrink-0" />,
    error: <XCircle className="w-4 h-4 shrink-0" />,
    info: <InfoIcon className="w-4 h-4 shrink-0" />,
  };
  const colors = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-slate-700 text-white',
  };

  return (
    <div className="fixed top-20 right-3 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2.5 shadow-lg text-sm pointer-events-auto',
            colors[t.type]
          )}
        >
          {icons[t.type]}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onDismiss(t.id)} className="shrink-0 hover:opacity-70">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
