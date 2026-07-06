import type { InspectionItem } from '@/types/inspection';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportCSV(items: InspectionItem[], filename?: string): void {
  const rows = [['PDC', 'ADC', 'SADC', 'PLDC', 'Checkpoint', 'Method', 'Spec', 'Status', 'Remarks']];
  items.forEach((item) => {
    rows.push([
      item.pdc, item.adc, item.sadc, item.pldc,
      item.picp, item.method, item.spec,
      item.status || 'PENDING', item.remarks,
    ]);
  });
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename || `PDI_Report_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function exportJSON(items: InspectionItem[], filename?: string): void {
  const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename || `PDI_Save_${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function exportPDF(
  items: InspectionItem[],
  meta: { busVIN?: string; inspectorName?: string } = {}
): void {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('BusTech Engineering — Bus PDI Road Test Report', 14, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 22);
  if (meta.busVIN) doc.text(`Bus VIN: ${meta.busVIN}`, 14, 28);
  if (meta.inspectorName) doc.text(`Inspector: ${meta.inspectorName}`, 14, 34);

  const total = items.length;
  const passed = items.filter((i) => i.status === 'PASS').length;
  const failed = items.filter((i) => i.status === 'FAIL').length;
  const pending = total - passed - failed;

  doc.text(`Total: ${total} | Passed: ${passed} | Failed: ${failed} | Pending: ${pending}`, 14, 40);

  const tableData = items.map((item) => [
    item.pdc,
    item.adc.split('-').slice(1, -1).join('-') || item.adc,
    item.picp,
    item.method,
    item.spec,
    item.status || 'PENDING',
    item.remarks || '',
  ]);

  autoTable(doc, {
    startY: 45,
    head: [['PDC', 'Assembly', 'Checkpoint', 'Method', 'Spec', 'Status', 'Remarks']],
    body: tableData,
    styles: { fontSize: 7, cellPadding: 1.5 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    didParseCell: (data) => {
      if (data.column.index === 5) {
        const status = data.cell.raw as string;
        if (status === 'PASS') data.cell.styles.textColor = [22, 163, 74];
        else if (status === 'FAIL') data.cell.styles.textColor = [220, 38, 38];
      }
    },
  });

  doc.save(`PDI_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function parseImportedJSON(jsonText: string): InspectionItem[] | null {
  try {
    const data = JSON.parse(jsonText);
    if (Array.isArray(data) && data.length > 0 && data[0].id !== undefined) {
      return data as InspectionItem[];
    }
  } catch {
    // ignore
  }
  return null;
}
