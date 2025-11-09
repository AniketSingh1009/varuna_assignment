import { Request, Response } from 'express';
import { BankingRepository } from '../../../core/ports/BankingRepository';
import { ComplianceRepository } from '../../../core/ports/ComplianceRepository';
import { BankSurplus } from '../../../core/application/BankSurplus';
import { ApplyBanked } from '../../../core/application/ApplyBanked';

export class BankingController {
  constructor(
    private bankingRepo: BankingRepository,
    private complianceRepo: ComplianceRepository,
    private bankSurplus: BankSurplus,
    private applyBanked: ApplyBanked
  ) {}

  getBankingRecords = async (req: Request, res: Response) => {
    try {
      const { shipId, year } = req.query;

      if (!shipId) {
        return res.status(400).json({ error: 'Missing required parameter: shipId' });
      }

      let entries;
      if (year) {
        entries = await this.bankingRepo.findByShipAndYear(
          shipId as string,
          parseInt(year as string)
        );
      } else {
        const totalBanked = await this.bankingRepo.getTotalBanked(shipId as string);
        return res.json({
          shipId,
          totalBanked,
          message: 'Specify year parameter to see detailed entries'
        });
      }

      const totalBanked = entries.reduce((sum, e) => sum + e.amountGco2eq, 0);

      res.json({
        shipId,
        year: parseInt(year as string),
        totalBanked,
        entries
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch banking records' });
    }
  };

  bankSurplus = async (req: Request, res: Response) => {
    try {
      const { shipId, year, amount } = req.body;

      if (!shipId || !year || amount === undefined) {
        return res.status(400).json({ 
          error: 'Missing required fields: shipId, year, amount' 
        });
      }

      const compliance = await this.complianceRepo.findByShipAndYear(shipId, year);
      if (!compliance) {
        return res.status(404).json({ error: 'Compliance record not found' });
      }

      const entry = this.bankSurplus.execute({
        shipId,
        year,
        amount: parseFloat(amount),
        availableCB: compliance.cbGco2eq
      });

      const saved = await this.bankingRepo.save(entry);

      res.status(201).json(saved);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to bank surplus' });
    }
  };

  applyBanked = async (req: Request, res: Response) => {
    try {
      const { shipId, year, amount } = req.body;

      if (!shipId || !year || amount === undefined) {
        return res.status(400).json({ 
          error: 'Missing required fields: shipId, year, amount' 
        });
      }

      const totalBanked = await this.bankingRepo.getTotalBanked(shipId);

      const result = this.applyBanked.execute({
        shipId,
        year,
        amount: parseFloat(amount),
        totalBanked
      });

      await this.bankingRepo.deduct(shipId, result.appliedAmount);

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to apply banked surplus' });
    }
  };
}
