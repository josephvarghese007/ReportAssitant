import Dexie, { type Table } from 'dexie';
import type { InspectionSession } from '@/types/inspection';

export class PDIDatabase extends Dexie {
  sessions!: Table<InspectionSession>;

  constructor() {
    super('PDIDatabase');
    this.version(1).stores({
      sessions: 'id, updatedAt, busVIN',
    });
  }
}

export const db = new PDIDatabase();
