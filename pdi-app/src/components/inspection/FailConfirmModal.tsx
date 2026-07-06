'use client';
import { useState } from 'react';
import { X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { compressImage } from '@/lib/utils';
import type { InspectionItem } from '@/types/inspection';

interface FailConfirmModalProps {
  item: InspectionItem | null;
  onConfirm: (id: number, photo: string, remarks: string) => void;
  onCancel: () => void;
}

export function FailConfirmModal({ item, onConfirm, onCancel }: FailConfirmModalProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  if (!item) return null;

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const compressed = await compressImage(file);
      setPhoto(compressed);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!photo) return;
    onConfirm(item.id, photo, remarks);
    setPhoto(null);
    setRemarks('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-semibold text-slate-800 dark:text-white">Confirm Fail</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Marking <strong className="text-slate-800 dark:text-white">{item.picp}</strong> as{' '}
            <span className="text-red-500 font-semibold">FAIL</span>.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Evidence photo is required.</p>

          <label
            className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${
              photo ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-600 hover:border-blue-400'
            }`}
          >
            <Camera className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {loading ? 'Processing...' : photo ? 'Photo captured ✓' : 'Capture evidence photo'}
            </span>
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} disabled={loading} />
          </label>

          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="evidence" className="w-full max-h-40 object-cover rounded-xl" />
          )}

          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add remarks (optional)"
            rows={3}
            className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
        <div className="flex gap-2 p-4 border-t border-slate-100 dark:border-slate-700">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" className="flex-1" onClick={handleConfirm} disabled={!photo || loading}>
            Confirm Fail
          </Button>
        </div>
      </div>
    </div>
  );
}
