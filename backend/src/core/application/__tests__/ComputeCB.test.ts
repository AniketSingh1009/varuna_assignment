import { ComputeCB } from '../ComputeCB';

describe('ComputeCB', () => {
  let computeCB: ComputeCB;

  beforeEach(() => {
    computeCB = new ComputeCB();
  });

  it('should compute positive CB for compliant ship', () => {
    const result = computeCB.execute({
      shipId: 'SHIP-001',
      year: 2025,
      actualIntensity: 85.0,
      fuelConsumption: 1000
    });

    expect(result.shipId).toBe('SHIP-001');
    expect(result.year).toBe(2025);
    expect(result.targetIntensity).toBe(89.3368);
    expect(result.actualIntensity).toBe(85.0);
    expect(result.energyInScope).toBe(41000000);
    expect(result.cbGco2eq).toBeGreaterThan(0);
  });

  it('should compute negative CB for non-compliant ship', () => {
    const result = computeCB.execute({
      shipId: 'SHIP-002',
      year: 2025,
      actualIntensity: 95.0,
      fuelConsumption: 1000
    });

    expect(result.cbGco2eq).toBeLessThan(0);
  });

  it('should compute zero CB when actual equals target', () => {
    const result = computeCB.execute({
      shipId: 'SHIP-003',
      year: 2025,
      actualIntensity: 89.3368,
      fuelConsumption: 1000
    });

    expect(result.cbGco2eq).toBeCloseTo(0, 0);
  });
});
