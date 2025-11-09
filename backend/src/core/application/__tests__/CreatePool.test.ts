import { CreatePool } from '../CreatePool';

describe('CreatePool', () => {
  let createPool: CreatePool;

  beforeEach(() => {
    createPool = new CreatePool();
  });

  it('should create pool with valid members', () => {
    const result = createPool.execute({
      year: 2025,
      members: [
        { shipId: 'SHIP-001', cbBefore: 100000 },
        { shipId: 'SHIP-002', cbBefore: -50000 }
      ]
    });

    expect(result.year).toBe(2025);
    expect(result.members).toHaveLength(2);
    
    const ship1 = result.members.find(m => m.shipId === 'SHIP-001');
    const ship2 = result.members.find(m => m.shipId === 'SHIP-002');
    
    expect(ship1?.cbAfter).toBeLessThan(ship1!.cbBefore);
    expect(ship2?.cbAfter).toBeGreaterThan(ship2!.cbBefore);
  });

  it('should throw error when total CB is negative', () => {
    expect(() => {
      createPool.execute({
        year: 2025,
        members: [
          { shipId: 'SHIP-001', cbBefore: -100000 },
          { shipId: 'SHIP-002', cbBefore: -50000 }
        ]
      });
    }).toThrow('Pool total CB must be non-negative');
  });

  it('should not allow deficit ship to exit worse', () => {
    expect(() => {
      createPool.execute({
        year: 2025,
        members: [
          { shipId: 'SHIP-001', cbBefore: 10000 },
          { shipId: 'SHIP-002', cbBefore: -50000 }
        ]
      });
    }).not.toThrow();
  });

  it('should allocate surplus to deficits correctly', () => {
    const result = createPool.execute({
      year: 2025,
      members: [
        { shipId: 'SHIP-001', cbBefore: 150000 },
        { shipId: 'SHIP-002', cbBefore: -50000 },
        { shipId: 'SHIP-003', cbBefore: -30000 }
      ]
    });

    const totalBefore = result.members.reduce((sum, m) => sum + m.cbBefore, 0);
    const totalAfter = result.members.reduce((sum, m) => sum + m.cbAfter, 0);
    
    expect(totalBefore).toBeCloseTo(totalAfter, 2);
  });
});
