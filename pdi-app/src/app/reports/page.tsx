'use client';
import { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useInspectionStore } from '@/stores/inspectionStore';
import { ToastContainer } from '@/components/layout/ToastContainer';
import { useToast } from '@/hooks/useToast';
import { exportPDF, exportCSV } from '@/lib/export';
import { FileText, Table2 } from 'lucide-react';

const COLORS: Record<string, string> = { PASSED: '#16a34a', FAILED: '#dc2626', PENDING: '#f59e0b' };

export default function ReportsPage() {
  const { items, busVIN, inspectorName, sessionStartedAt } = useInspectionStore();
  const { toasts, showToast, dismissToast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const stats = useMemo(() => {
    const total = items.length;
    const passed = items.filter((i) => i.status === 'PASS').length;
    const failed = items.filter((i) => i.status === 'FAIL').length;
    const pending = total - passed - failed;
    const pct = total > 0 ? Math.round((passed / total) * 100) : 0;
    return { total, passed, failed, pending, pct };
  }, [items]);

  const pieData = [
    { name: 'Passed', value: stats.passed },
    { name: 'Failed', value: stats.failed },
    { name: 'Pending', value: stats.pending },
  ].filter((d) => d.value > 0);

  const groupData = useMemo(() => {
    const map = new Map<string, { name: string; pass: number; fail: number; pending: number }>();
    items.forEach((item) => {
      const short = item.adc.split('-').slice(0, 2).join('-');
      if (!map.has(item.adc)) map.set(item.adc, { name: short, pass: 0, fail: 0, pending: 0 });
      const g = map.get(item.adc)!;
      if (item.status === 'PASS') g.pass++;
      else if (item.status === 'FAIL') g.fail++;
      else g.pending++;
    });
    return Array.from(map.values()).slice(0, 15);
  }, [items]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-slate-800 dark:text-white">Inspection Report</h1>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 space-y-1">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Session started: {mounted ? new Date(sessionStartedAt).toLocaleString() : '—'}
        </p>
        {busVIN && (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Bus VIN: <strong>{busVIN}</strong>
          </p>
        )}
        {inspectorName && (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Inspector: <strong>{inspectorName}</strong>
          </p>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Pass Rate', value: `${stats.pct}%`, color: 'text-green-600' },
          { label: 'Failed Items', value: stats.failed, color: 'text-red-600' },
          { label: 'Completed', value: stats.passed + stats.failed, color: 'text-blue-600' },
          { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Pie Chart */}
      {pieData.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
          <h2 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3">Overall Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name.toUpperCase()] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} items`, String(name)]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[d.name.toUpperCase()] }} />
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  {d.name}: {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bar Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3">Per-Group Progress (Top 15)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={groupData} layout="vertical" margin={{ left: 8, right: 8 }}>
            <XAxis type="number" tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={80} />
            <Tooltip />
            <Bar dataKey="pass" stackId="a" fill="#16a34a" />
            <Bar dataKey="fail" stackId="a" fill="#dc2626" />
            <Bar dataKey="pending" stackId="a" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-3 pb-4">
        <button
          onClick={() => {
            exportPDF(items, { busVIN, inspectorName });
            showToast('📄 PDF generated', 'info');
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium"
        >
          <FileText className="w-4 h-4" /> Export PDF
        </button>
        <button
          onClick={() => {
            exportCSV(items);
            showToast('📊 CSV exported', 'success');
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium"
        >
          <Table2 className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
