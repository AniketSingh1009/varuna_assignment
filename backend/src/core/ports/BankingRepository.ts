import { BankEntry } from '../domain/Banking';

export interface BankingRepository {
  findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;
  getTotalBanked(shipId: string): Promise<number>;
  save(entry: Omit<BankEntry, 'id' | 'createdAt'>): Promise<BankEntry>;
  deduct(shipId: string, amount: number): Promise<void>;
}
