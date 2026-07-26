'use client';
import { useMemo } from 'react';
import { useInspectionStore } from '@/stores/inspectionStore';
import type { InspectionGroup } from '@/types/inspection';

export function useInspection() {
  const store = useInspectionStore();

  const groups = useMemo((): InspectionGroup[] => {
    const groupMap = new Map<string, InspectionGroup>();
    store.items.forEach((item) => {
      if (!groupMap.has(item.adc)) {
        groupMap.set(item.adc, { adc: item.adc, items: [], passCount: 0, failCount: 0, pendCount: 0 });
      }
      const g = groupMap.get(item.adc)!;
      g.items.push(item);
    });
    groupMap.forEach((g) => {
      g.passCount = g.items.filter((i) => i.status === 'PASS').length;
      g.failCount = g.items.filter((i) => i.status === 'FAIL').length;
      g.pendCount = g.items.filter((i) => i.status === '').length;
    });
    return Array.from(groupMap.values());
  }, [store.items]);

  const filteredGroups = useMemo(() => {
    let result = groups;
    const { filter, searchQuery } = store;

    if (filter === 'pass') result = result.filter((g) => g.passCount > 0 && g.failCount === 0 && g.pendCount === 0);
    else if (filter === 'fail') result = result.filter((g) => g.failCount > 0);
    else if (filter === 'pending') result = result.filter((g) => g.pendCount > 0 && g.failCount === 0 && g.passCount === 0);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.adc.toLowerCase().includes(q) ||
          g.items.some((i) =>
            [i.picp, i.pdc, i.sadc, i.pldc, i.method, i.spec].some((v) =>
              String(v).toLowerCase().includes(q)
            )
          )
      );
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, store.filter, store.searchQuery]);

  const stats = useMemo(
    () => store.getStats(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store.items]
  );

  return { groups, filteredGroups, stats, store };
}
