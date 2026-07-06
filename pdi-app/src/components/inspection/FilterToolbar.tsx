'use client';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FilterType } from '@/types/inspection';

interface FilterToolbarProps {
  filter: FilterType;
  onFilter: (f: FilterType) => void;
  searchQuery: string;
  onSearch: (q: string) => void;
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pass', label: 'Pass' },
  { key: 'fail', label: 'Fail' },
  { key: 'pending', label: 'Pending' },
];

export function FilterToolbar({ filter, onFilter, searchQuery, onSearch }: FilterToolbarProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-2 space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search assemblies..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder:text-slate-400"
        />
      </div>
      <div className="flex gap-1.5" role="tablist">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={filter === key}
            onClick={() => onFilter(key)}
            className={cn(
              'flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors',
              filter === key
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
