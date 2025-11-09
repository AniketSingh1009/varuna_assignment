export interface Pool {
  id?: number;
  year: number;
  createdAt?: Date;
}

export interface PoolMember {
  poolId: number;
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface PoolCreationRequest {
  year: number;
  members: {
    shipId: string;
    cbBefore: number;
  }[];
}

export interface PoolCreationResult {
  poolId: number;
  year: number;
  members: PoolMember[];
}
