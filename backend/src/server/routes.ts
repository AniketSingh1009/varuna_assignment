import { Router } from 'express';
import { RouteController } from '../adapters/inbound/http/RouteController';
import { ComplianceController } from '../adapters/inbound/http/ComplianceController';
import { BankingController } from '../adapters/inbound/http/BankingController';
import { PoolController } from '../adapters/inbound/http/PoolController';

export function createRoutes(
  routeController: RouteController,
  complianceController: ComplianceController,
  bankingController: BankingController,
  poolController: PoolController
) {
  const router = Router();

  // Routes endpoints
  router.get('/routes', routeController.getAllRoutes);
  router.post('/routes/:id/baseline', routeController.setBaseline);
  router.get('/routes/comparison', routeController.getComparison);

  // Compliance endpoints
  router.get('/compliance/cb', complianceController.getComplianceBalance);
  router.get('/compliance/adjusted-cb', complianceController.getAdjustedCB);

  // Banking endpoints
  router.get('/banking/records', bankingController.getBankingRecords);
  router.post('/banking/bank', bankingController.bankSurplus);
  router.post('/banking/apply', bankingController.applyBanked);

  // Pool endpoints
  router.post('/pools', poolController.createPool);
  router.get('/pools/:id', poolController.getPool);

  return router;
}
