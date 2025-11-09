import { ComputeComparison } from '../ComputeComparison';
import { Route } from '../../domain/Route';

describe('ComputeComparison', () => {
  let computeComparison: ComputeComparison;
  let baseline: Route;

  beforeEach(() => {
    computeComparison = new ComputeComparison();
    baseline = {
      id: 1,
      routeId: 'ROUTE-001',
      year: 2025,
      ghgIntensity: 85.5,
      fuelConsumption: 1200,
      isBaseline: true
    };
  });

  it('should compute comparisons correctly', () => {
    const routes: Route[] = [
      { id: 2, routeId: 'ROUTE-002', year: 2025, ghgIntensity: 92.3, fuelConsumption: 1150, isBaseline: false },
      { id: 3, routeId: 'ROUTE-003', year: 2025, ghgIntensity: 79.8, fuelConsumption: 1100, isBaseline: false }
    ];

    const result = computeComparison.execute(baseline, routes);

    expect(result).toHaveLength(2);
    expect(result[0].routeId).toBe('ROUTE-002');
    expect(result[0].percentDiff).toBeGreaterThan(0);
    expect(result[0].compliant).toBe(false);

    expect(result[1].routeId).toBe('ROUTE-003');
    expect(result[1].percentDiff).toBeLessThan(0);
    expect(result[1].compliant).toBe(true);
  });
});
