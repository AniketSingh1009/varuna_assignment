import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createRoutes } from './routes';

// Repositories
import { PostgresRouteRepository } from '../adapters/outbound/postgres/PostgresRouteRepository';
import { PostgresComplianceRepository } from '../adapters/outbound/postgres/PostgresComplianceRepository';
import { PostgresBankingRepository } from '../adapters/outbound/postgres/PostgresBankingRepository';
import { PostgresPoolRepository } from '../adapters/outbound/postgres/PostgresPoolRepository';

// Use Cases
import { ComputeComparison } from '../core/application/ComputeComparison';
import { ComputeCB } from '../core/application/ComputeCB';
import { BankSurplus } from '../core/application/BankSurplus';
import { ApplyBanked } from '../core/application/ApplyBanked';
import { CreatePool } from '../core/application/CreatePool';

// Controllers
import { RouteController } from '../adapters/inbound/http/RouteController';
import { ComplianceController } from '../adapters/inbound/http/ComplianceController';
import { BankingController } from '../adapters/inbound/http/BankingController';
import { PoolController } from '../adapters/inbound/http/PoolController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize repositories
const routeRepo = new PostgresRouteRepository();
const complianceRepo = new PostgresComplianceRepository();
const bankingRepo = new PostgresBankingRepository();
const poolRepo = new PostgresPoolRepository();

// Initialize use cases
const computeComparison = new ComputeComparison();
const computeCB = new ComputeCB();
const bankSurplus = new BankSurplus();
const applyBanked = new ApplyBanked();
const createPool = new CreatePool();

// Initialize controllers
const routeController = new RouteController(routeRepo, computeComparison);
const complianceController = new ComplianceController(complianceRepo, bankingRepo, computeCB);
const bankingController = new BankingController(bankingRepo, complianceRepo, bankSurplus, applyBanked);
const poolController = new PoolController(poolRepo, createPool);

// Routes
app.use('/api', createRoutes(routeController, complianceController, bankingController, poolController));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});

export default app;
