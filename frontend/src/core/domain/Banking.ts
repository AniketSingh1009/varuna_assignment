export interface ComplianceBalance {
  year: number;
  cbBefore: number;
  shipId?: string;
}

export interface BankingOperation {
  year: number;
  amount: number;
  shipId: string;
}

export interface BankingResult {
  cbBefore: number;
  applied: number;
  cbAfter: number;
}
