export interface ComparisonData {
  baseline: {
    routeId: string;
    ghgIntensity: number;
  };
  comparisons: ComparisonRoute[];
}

export interface ComparisonRoute {
  routeId: string;
  ghgIntensity: number;
  percentDiff: number;
  compliant: boolean;
}

export const TARGET_INTENSITY_2025 = 89.3368; // 2% below 91.16
