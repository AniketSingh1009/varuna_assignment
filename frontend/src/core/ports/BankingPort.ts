import { ComplianceBalance, BankingOperation, BankingResult } from '../domain/Banking';

export interface BankingPort {
  getComplianceBalance(year: number, shipId: string): Promise<ComplianceBalance>;
  bankSurplus(operation: BankingOperation): Promise<void>;
  applyBanked(operation: BankingOperation): Promise<BankingResult>;
}
