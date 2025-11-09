import { BankSurplus } from '../BankSurplus';

describe('BankSurplus', () => {
  let bankSurplus: BankSurplus;

  beforeEach(() => {
    bankSurplus = new BankSurplus();
  });

  it('should create bank entry for valid surplus', () => {
    const result = bankSurplus.execute({
      shipId: 'SHIP-001',
      year: 2025,
      amount: 50000,
      availableCB: 100000
    });

    expect(result.shipId).toBe('SHIP-001');
    expect(result.year).toBe(2025);
    expect(result.amountGco2eq).toBe(50000);
  });

  it('should throw error for negative amount', () => {
    expect(() => {
      bankSurplus.execute({
        shipId: 'SHIP-001',
        year: 2025,
        amount: -1000,
        availableCB: 100000
      });
    }).toThrow('Bank amount must be positive');
  });

  it('should throw error when amount exceeds available CB', () => {
    expect(() => {
      bankSurplus.execute({
        shipId: 'SHIP-001',
        year: 2025,
        amount: 150000,
        availableCB: 100000
      });
    }).toThrow('Cannot bank more than available surplus');
  });
});
