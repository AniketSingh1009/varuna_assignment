import { Request, Response } from 'express';
import { RouteRepository } from '../../../core/ports/RouteRepository';
import { ComputeComparison } from '../../../core/application/ComputeComparison';

export class RouteController {
  constructor(
    private routeRepo: RouteRepository,
    private computeComparison: ComputeComparison
  ) {}

  getAllRoutes = async (_req: Request, res: Response) => {
    try {
      const routes = await this.routeRepo.findAll();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch routes' });
    }
  };

  setBaseline = async (req: Request, res: Response) => {
    try {
      const routeId = req.params.id;
      const routes = await this.routeRepo.findAll();
      const route = routes.find(r => r.routeId === routeId);
      
      if (!route) {
        return res.status(404).json({ error: 'Route not found' });
      }

      await this.routeRepo.setBaseline(route.id);
      res.json({ message: 'Baseline set successfully', routeId: route.routeId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to set baseline' });
    }
  };

  getComparison = async (_req: Request, res: Response) => {
    try {
      const baseline = await this.routeRepo.findBaseline();
      if (!baseline) {
        return res.status(404).json({ error: 'No baseline route found' });
      }

      const allRoutes = await this.routeRepo.findAll();
      const otherRoutes = allRoutes.filter(r => r.id !== baseline.id);
      
      const comparisons = this.computeComparison.execute(baseline, otherRoutes);
      
      res.json({
        baseline: {
          routeId: baseline.routeId,
          ghgIntensity: baseline.ghgIntensity
        },
        comparisons
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to compute comparison' });
    }
  };
}
