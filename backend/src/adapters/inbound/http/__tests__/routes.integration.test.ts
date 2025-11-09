import request from 'supertest';
import express from 'express';
import { createRoutes } from '../../../server/routes';
import { RouteController } from '../RouteController';
import { ComplianceController } from '../ComplianceController';
import { BankingController } from '../BankingController';
import { PoolController } from '../PoolController';
import { ComputeComparison } from '../../../core/application/ComputeComparison';
import { ComputeCB } from '../../../core/application/ComputeCB';
import { BankSurplus } from '../../../core/application/BankSurplus';
import { ApplyBanked } from '../../../core/application/ApplyBanked';
import { CreatePool } from '../../../core/application/CreatePool';

// Mock repositories
const mockRouteRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findBaseline: jest.fn(),
  setBaseline: jest.fn(),
  create: jest.fn()
};

const mockComplianceRepo = {
  findByShipAndYear: jest.fn(),
  save: jest.fn()
};

const mockBankingRepo = {
  findByShipAndYear: jest.fn(),
  getTotalBanked: jest.fn(),
  save: jest.fn(),
  deduct: jest.fn()
};

const mockPoolRepo = {
  createPool: jest.fn(),
  addMembers: jest.fn(),
  findById: jest.fn(),
  findMembersByPoolId: jest.fn()
};

describe('API Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    const routeController = new RouteController(mockRouteRepo as any, new ComputeComparison());
    const complianceController = new ComplianceController(
      mockComplianceRepo as any,
      mockBankingRepo as any,
      new ComputeCB()
    );
    const bankingController = new BankingController(
      mockBankingRepo as any,
      mockComplianceRepo as any,
      new BankSurplus(),
      new ApplyBanked()
    );
    const poolController = new PoolController(mockPoolRepo as any, new CreatePool());

    app.use('/api', createRoutes(routeController, complianceController, bankingController, poolController));

    jest.clearAllMocks();
  });

  describe('GET /api/routes', () => {
    it('should return all routes', async () => {
      const mockRoutes = [
        { id: 1, routeId: 'ROUTE-001', year: 2025, ghgIntensity: 85.5, fuelConsumption: 1200, isBaseline: true }
      ];
      mockRouteRepo.findAll.mockResolvedValue(mockRoutes);

      const response = await request(app).get('/api/routes');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRoutes);
    });
  });

  describe('GET /api/compliance/cb', () => {
    it('should compute and return compliance balance', async () => {
      mockComplianceRepo.save.mockResolvedValue({
        shipId: 'SHIP-001',
        year: 2025,
        cbGco2eq: 177808.8,
        targetIntensity: 89.3368,
        actualIntensity: 85.0,
        energyInScope: 41000000
      });

      const response = await request(app)
        .get('/api/compliance/cb')
        .query({
          shipId: 'SHIP-001',
          year: 2025,
          actualIntensity: 85.0,
          fuelConsumption: 1000
        });

      expect(response.status).toBe(200);
      expect(response.body.cbGco2eq).toBeGreaterThan(0);
    });

    it('should return 400 for missing parameters', async () => {
      const response = await request(app).get('/api/compliance/cb');

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/banking/bank', () => {
    it('should bank surplus successfully', async () => {
      mockComplianceRepo.findByShipAndYear.mockResolvedValue({
        cbGco2eq: 100000
      });
      mockBankingRepo.save.mockResolvedValue({
        id: 1,
        shipId: 'SHIP-001',
        year: 2025,
        amountGco2eq: 50000
      });

      const response = await request(app)
        .post('/api/banking/bank')
        .send({
          shipId: 'SHIP-001',
          year: 2025,
          amount: 50000
        });

      expect(response.status).toBe(201);
      expect(response.body.amountGco2eq).toBe(50000);
    });
  });

  describe('POST /api/pools', () => {
    it('should create pool successfully', async () => {
      mockPoolRepo.createPool.mockResolvedValue({ id: 1, year: 2025 });
      mockPoolRepo.addMembers.mockResolvedValue(undefined);

      const response = await request(app)
        .post('/api/pools')
        .send({
          year: 2025,
          members: [
            { shipId: 'SHIP-001', cbBefore: 100000 },
            { shipId: 'SHIP-002', cbBefore: -50000 }
          ]
        });

      expect(response.status).toBe(201);
      expect(response.body.poolId).toBe(1);
      expect(response.body.members).toHaveLength(2);
    });

    it('should return 400 for invalid pool (negative total CB)', async () => {
      const response = await request(app)
        .post('/api/pools')
        .send({
          year: 2025,
          members: [
            { shipId: 'SHIP-001', cbBefore: -100000 },
            { shipId: 'SHIP-002', cbBefore: -50000 }
          ]
        });

      expect(response.status).toBe(400);
    });
  });
});
