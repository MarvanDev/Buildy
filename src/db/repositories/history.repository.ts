

import { dbConnection } from '../db.service';
import type { WizardState } from '../../types/wizard.types';

export interface HistoryRecord {
  id: string;
  userId: string;
  date: string;
  state: WizardState;
}

export interface IHistoryRepository {
  saveWizardState(userId: string, state: WizardState): Promise<void>;
  getHistory(userId: string): Promise<HistoryRecord[]>;
}

class LocalHistoryRepository implements IHistoryRepository {
  constructor() {
    dbConnection.log(); 
  }

  async saveWizardState(userId: string, state: WizardState): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const record: HistoryRecord = {
      id: crypto.randomUUID(),
      userId,
      date: new Date().toISOString(),
      state,
    };
    console.log('✅ Estado guardado en DB simulada:', record);
    
  }

  async getHistory(userId: string): Promise<HistoryRecord[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return []; 
  }
}

export const historyRepository: IHistoryRepository = new LocalHistoryRepository();