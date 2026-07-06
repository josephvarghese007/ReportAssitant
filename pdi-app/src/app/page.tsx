'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Header } from '@/components/layout/Header';
import { StatsGrid } from '@/components/inspection/StatsGrid';
import { FilterToolbar } from '@/components/inspection/FilterToolbar';
import { GroupCard } from '@/components/inspection/GroupCard';
import { BottomActionBar } from '@/components/inspection/BottomActionBar';
import { FailConfirmModal } from '@/components/inspection/FailConfirmModal';
import { ToastContainer } from '@/components/layout/ToastContainer';
import { useInspection } from '@/hooks/useInspection';
import { useToast } from '@/hooks/useToast';
import type { InspectionItem } from '@/types/inspection';

export default function InspectionPage() {
  const { filteredGroups, stats, store } = useInspection();
  const { toasts, showToast, dismissToast } = useToast();
  const [failTarget, setFailTarget] = useState<InspectionItem | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  // Initialize on first load
  useEffect(() => {
    if (store.items.length === 0) {
      store.initFreshSession();
    } else {
      setShowResumeModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm('Reset all inspection data? This cannot be undone.')) {
      store.initFreshSession();
      showToast('↩️ Inspection reset', 'info');
    }
  }, [store, showToast]);

  const handleScanQR = useCallback(() => {
    showToast('📷 QR scanner coming soon', 'info');
  }, [showToast]);

  const handleFailConfirm = useCallback(
    (id: number, photo: string, remarks: string) => {
      store.setStatus(id, 'FAIL');
      store.setPhoto(id, photo);
      if (remarks) store.setRemarks(id, remarks);
      setFailTarget(null);
      showToast('❌ Marked FAIL', 'error');
      navigator.vibrate?.([100, 50, 100]);
    },
    [store, showToast]
  );

  const virtualizer = useVirtualizer({
    count: filteredGroups.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 5,
  });

  return (
    <>
      <Header onReset={handleReset} onScanQR={handleScanQR} />
      <StatsGrid {...stats} />
      <FilterToolbar filter={store.filter} onFilter={store.setFilter} searchQuery={store.searchQuery} onSearch={store.setSearchQuery} />

      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Resume Session?</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Found an in-progress inspection. Resume or start fresh?</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  store.initFreshSession();
                  setShowResumeModal(false);
                  showToast('🆕 Fresh session started', 'info');
                }}
                className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-600 text-sm text-slate-600 dark:text-slate-300"
              >
                Start Fresh
              </button>
              <button
                onClick={() => {
                  setShowResumeModal(false);
                  showToast('📂 Session restored', 'success');
                }}
                className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium"
              >
                Resume
              </button>
            </div>
          </div>
        </div>
      )}

      <div ref={parentRef} className="overflow-y-auto" style={{ height: 'calc(100vh - 280px)' }}>
        {filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-4xl mb-3">🔍</span>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">No assemblies found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div style={{ height: `${virtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const group = filteredGroups[virtualItem.index];
              return (
                <div
                  key={group.adc}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${virtualItem.start}px)` }}
                  ref={virtualizer.measureElement}
                  data-index={virtualItem.index}
                >
                  <GroupCard
                    group={group}
                    isOpen={store.openGroupAdc === group.adc}
                    onToggle={() => store.setOpenGroup(store.openGroupAdc === group.adc ? null : group.adc)}
                    onStatusChange={store.setStatus}
                    onPhotoChange={store.setPhoto}
                    onRemarksChange={store.setRemarks}
                    onFailClick={setFailTarget}
                    showToast={showToast}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomActionBar
        items={store.items}
        onImport={store.loadSession}
        showToast={showToast}
        busVIN={store.busVIN}
        inspectorName={store.inspectorName}
      />

      <FailConfirmModal item={failTarget} onConfirm={handleFailConfirm} onCancel={() => setFailTarget(null)} />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
