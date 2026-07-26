export type Status = 'PASS' | 'FAIL' | '';

export interface RawInspectionItem {
  pdc: string;
  adc: string;
  sadc: string;
  pldc: string;
  picp: string;
  method: string;
  spec: string;
}

export interface InspectionItem extends RawInspectionItem {
  id: number;
  status: Status;
  photo: string | null;
  remarks: string;
  timestamp?: number;
}

export interface InspectionGroup {
  adc: string;
  items: InspectionItem[];
  passCount: number;
  failCount: number;
  pendCount: number;
}

export interface InspectionSession {
  id: string;
  busVIN?: string;
  inspectorName?: string;
  startedAt: number;
  updatedAt: number;
  items: InspectionItem[];
}

export type FilterType = 'all' | 'pass' | 'fail' | 'pending';
export type Theme = 'light' | 'dark' | 'system';
