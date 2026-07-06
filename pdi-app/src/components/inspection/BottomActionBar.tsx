'use client';
import { FileText, Table2, Save, Upload } from 'lucide-react';
import { exportCSV, exportJSON, exportPDF, parseImportedJSON } from '@/lib/export';
import type { InspectionItem } from '@/types/inspection';

interface BottomActionBarProps {
  items: InspectionItem[];
  onImport: (items: InspectionItem[]) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  busVIN?: string;
  inspectorName?: string;
}

export function BottomActionBar({ items, onImport, showToast, busVIN, inspectorName }: BottomActionBarProps) {
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const parsed = parseImportedJSON(ev.target?.result as string);
      if (parsed) {
        onImport(parsed);
        showToast('📂 Data loaded successfully', 'success');
      } else {
        showToast('❌ Invalid file format', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed bottom-14 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 px-4 py-2 flex gap-2">
      <button
        onClick={() => {
          exportPDF(items, { busVIN, inspectorName });
          showToast('📄 PDF generated', 'info');
        }}
        className="flex-1 flex flex-col items-center gap-0.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
      >
        <FileText className="w-5 h-5" />
        PDF
      </button>
      <button
        onClick={() => {
          exportCSV(items);
          showToast('📊 CSV exported', 'success');
        }}
        className="flex-1 flex flex-col items-center gap-0.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
      >
        <Table2 className="w-5 h-5" />
        CSV
      </button>
      <button
        onClick={() => {
          exportJSON(items);
          showToast('💾 JSON saved', 'success');
        }}
        className="flex-1 flex flex-col items-center gap-0.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <Save className="w-5 h-5" />
        Save
      </button>
      <label className="flex-1 flex flex-col items-center gap-0.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">
        <Upload className="w-5 h-5" />
        Load
        <input type="file" accept=".json" className="hidden" onChange={handleImport} />
      </label>
    </div>
  );
}
