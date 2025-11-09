import { ApplyBanked } from '../ApplyBanked';

describe('ApplyBanked', () => {
  let applyBanked: ApplyBanked;

  beforeEach(() => {
    applyBanked = new ApplyBanked();
  });

  it('should apply banked surplus correctly', () => {
    const result = applyBanked.execute({
      shipId: 'SHIP-001',
      year: 2025,
      amount: 30000,
      totalBanked: 50000
    });

    expect(result.shipId).toBe('SHIP-001');
    expect(result.appliedAmount).toBe(30000);
    expect(result.remainingBanked).toBe(20000);
  });

  it('should throw error for negative amount', () => {
    expect(() => {
      applyBanked.execute({
        shipId: 'SHIP-001',
        year: 2025,
        amount: -1000,
        totalBanked: 50000
      });
    }).toThrow('Apply amount must be positive');
  });

  it('should throw error when amount exceeds total banked', () => {
    expect(() => {
      applyBanked.execute({
        shipId: 'SHIP-001',
        year: 2025,
        amount: 60000,
        totalBanked: 50000
      });
    }).toThrow('Cannot apply more than available banked surplus');
  });
});
