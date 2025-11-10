export interface Route {
  id: number;
  routeId: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  isBaseline: boolean;
}

export interface RouteComparison {
  routeId: string;
  year: number;
  ghgIntensity: number;
  percentDiff: number;
  compliant: boolean;
}

export interface ComparisonResponse {
  baseline: {
    routeId: string;
    ghgIntensity: number;
  };
  comparisons: RouteComparison[];
}

export interface ComplianceBalance {
  shipId: string;
  year: number;
  cbGco2eq: number;
  targetIntensity: number;
  actualIntensity: number;
  energyInScope: number;
}

export interface AdjustedCB {
  shipId: string;
  year: number;
  originalCB: number;
  totalBanked: number;
  adjustedCB: number;
}

export interface BankEntry {
  id: number;
  shipId: string;
  year: number;
  amountGco2eq: number;
  createdAt: string;
}

export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface Pool {
  poolId: number;
  year: number;
  members: PoolMember[];
}
