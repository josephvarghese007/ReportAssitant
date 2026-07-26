'use client';
import { useInspectionStore } from '@/stores/inspectionStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/layout/ToastContainer';

export default function SettingsPage() {
  const { busVIN, setBusVIN, inspectorName, setInspectorName } = useInspectionStore();
  const { theme, setTheme } = useSettingsStore();
  const { toasts, showToast, dismissToast } = useToast();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-slate-800 dark:text-white">Settings</h1>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
        <div className="p-4 space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Bus VIN / Chassis ID</label>
          <input
            type="text"
            value={busVIN}
            onChange={(e) => setBusVIN(e.target.value)}
            placeholder="Enter VIN number..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="p-4 space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Inspector Name</label>
          <input
            type="text"
            value={inspectorName}
            onChange={(e) => setInspectorName(e.target.value)}
            placeholder="Enter inspector name..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="p-4 space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</label>
          <div className="flex gap-2">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTheme(t);
                  showToast(`Theme set to ${t}`, 'info');
                }}
                className={`flex-1 py-2 rounded-xl text-sm capitalize border transition-colors ${
                  theme === t ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 space-y-2">
        <h2 className="font-semibold text-sm text-slate-700 dark:text-slate-300">App Info</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">BusTech Engineering PDI Road Test v2.0</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">442 inspection checkpoints across 15 assemblies</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Offline-capable PWA · Built with Next.js 14</p>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
