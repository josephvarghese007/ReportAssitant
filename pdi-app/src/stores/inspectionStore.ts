'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INSPECTION_DATA } from '@/data/inspectionData';
import type { InspectionItem, FilterType, Status } from '@/types/inspection';
import { generateId } from '@/lib/utils';

interface InspectionStore {
  items: InspectionItem[];
  filter: FilterType;
  searchQuery: string;
  openGroupAdc: string | null;
  sessionId: string;
  busVIN: string;
  inspectorName: string;
  sessionStartedAt: number;

  // Actions
  initFreshSession: () => void;
  loadSession: (items: InspectionItem[]) => void;
  setStatus: (id: number, status: Status) => void;
  setPhoto: (id: number, photo: string | null) => void;
  setRemarks: (id: number, remarks: string) => void;
  setFilter: (filter: FilterType) => void;
  setSearchQuery: (query: string) => void;
  setOpenGroup: (adc: string | null) => void;
  setBusVIN: (vin: string) => void;
  setInspectorName: (name: string) => void;

  // Computed helpers (use selectors outside)
  getStats: () => { total: number; passed: number; failed: number; pending: number };
}

export const useInspectionStore = create<InspectionStore>()(
  persist(
    (set, get) => ({
      items: [],
      filter: 'all',
      searchQuery: '',
      openGroupAdc: null,
      sessionId: generateId(),
      busVIN: '',
      inspectorName: '',
      sessionStartedAt: Date.now(),

      initFreshSession: () => {
        const items = INSPECTION_DATA.map((item, index) => ({
          ...item,
          id: index,
          status: '' as Status,
          photo: null,
          remarks: '',
        }));
        set({
          items,
          sessionId: generateId(),
          sessionStartedAt: Date.now(),
          openGroupAdc: null,
          filter: 'all',
          searchQuery: '',
        });
      },

      loadSession: (items) => set({ items }),

      setStatus: (id, status) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, status, ...(status === 'PASS' ? { photo: null } : {}), timestamp: Date.now() }
              : item
          ),
        }));
      },

      setPhoto: (id, photo) => {
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, photo } : item)),
        }));
      },

      setRemarks: (id, remarks) => {
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, remarks } : item)),
        }));
      },

      setFilter: (filter) => set({ filter }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setOpenGroup: (openGroupAdc) => set({ openGroupAdc }),
      setBusVIN: (busVIN) => set({ busVIN }),
      setInspectorName: (inspectorName) => set({ inspectorName }),

      getStats: () => {
        const { items } = get();
        const total = items.length;
        const passed = items.filter((i) => i.status === 'PASS').length;
        const failed = items.filter((i) => i.status === 'FAIL').length;
        return { total, passed, failed, pending: total - passed - failed };
      },
    }),
    {
      name: 'pdi-inspection-store',
      partialize: (state) => ({
        items: state.items,
        busVIN: state.busVIN,
        inspectorName: state.inspectorName,
        sessionId: state.sessionId,
        sessionStartedAt: state.sessionStartedAt,
      }),
    }
  )
);
