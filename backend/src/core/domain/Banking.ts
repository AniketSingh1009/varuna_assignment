export interface BankEntry {
  id?: number;
  shipId: string;
  year: number;
  amountGco2eq: number;
  createdAt?: Date;
}

export interface BankingRecord {
  shipId: string;
  year: number;
  totalBanked: number;
  entries: BankEntry[];
}
