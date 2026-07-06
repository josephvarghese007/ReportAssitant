'use client';
import { motion } from 'framer-motion';

interface StatsGridProps {
  total: number;
  passed: number;
  failed: number;
  pending: number;
}

export function StatsGrid({ total, passed, failed, pending }: StatsGridProps) {
  const stats = [
    { label: 'Total', value: total, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Passed', value: passed, color: 'text-green-600 dark:text-green-400' },
    { label: 'Failed', value: failed, color: 'text-red-600 dark:text-red-400' },
    { label: 'Pending', value: pending, color: 'text-amber-600 dark:text-amber-400' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
      {stats.map(({ label, value, color }) => (
        <div key={label} className="flex flex-col items-center">
          <motion.span
            key={value}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-xl font-bold tabular-nums ${color}`}
          >
            {value}
          </motion.span>
          <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
        </div>
      ))}
    </div>
  );
}
