import { Request, Response } from 'express';
import { ComplianceRepository } from '../../../core/ports/ComplianceRepository';
import { BankingRepository } from '../../../core/ports/BankingRepository';
import { ComputeCB } from '../../../core/application/ComputeCB';

export class ComplianceController {
  constructor(
    private complianceRepo: ComplianceRepository,
    private bankingRepo: BankingRepository,
    private computeCB: ComputeCB
  ) {}

  getComplianceBalance = async (req: Request, res: Response) => {
    try {
      const { shipId, year, actualIntensity, fuelConsumption } = req.query;

      if (!shipId || !year || !actualIntensity || !fuelConsumption) {
        return res.status(400).json({ 
          error: 'Missing required parameters: shipId, year, actualIntensity, fuelConsumption' 
        });
      }

      const cb = this.computeCB.execute({
        shipId: shipId as string,
        year: parseInt(year as string),
        actualIntensity: parseFloat(actualIntensity as string),
        fuelConsumption: parseFloat(fuelConsumption as string)
      });

      await this.complianceRepo.save(cb);

      res.json(cb);
    } catch (error) {
      res.status(500).json({ error: 'Failed to compute compliance balance' });
    }
  };

  getAdjustedCB = async (req: Request, res: Response) => {
    try {
      const { shipId, year } = req.query;

      if (!shipId || !year) {
        return res.status(400).json({ error: 'Missing required parameters: shipId, year' });
      }

      const compliance = await this.complianceRepo.findByShipAndYear(
        shipId as string,
        parseInt(year as string)
      );

      if (!compliance) {
        return res.status(404).json({ error: 'Compliance record not found' });
      }

      const totalBanked = await this.bankingRepo.getTotalBanked(shipId as string);
      const adjustedCB = compliance.cbGco2eq + totalBanked;

      res.json({
        shipId: compliance.shipId,
        year: compliance.year,
        originalCB: compliance.cbGco2eq,
        totalBanked,
        adjustedCB: Math.round(adjustedCB * 100) / 100
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get adjusted CB' });
    }
  };
}
