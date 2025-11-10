export interface PoolMember {
  shipId: string;
  adjustedCB: number;
  cbBefore?: number;
  cbAfter?: number;
}

export interface Pool {
  year: number;
  members: PoolMember[];
}

export interface PoolValidation {
  isValid: boolean;
  totalCB: number;
  errors: string[];
}

export interface PoolResult {
  poolId: number;
  year: number;
  members: {
    shipId: string;
    cbBefore: number;
    cbAfter: number;
  }[];
}
