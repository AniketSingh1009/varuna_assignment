import { Request, Response } from 'express';
import { PoolRepository } from '../../../core/ports/PoolRepository';
import { CreatePool } from '../../../core/application/CreatePool';

export class PoolController {
  constructor(
    private poolRepo: PoolRepository,
    private createPool: CreatePool
  ) {}

  createPool = async (req: Request, res: Response) => {
    try {
      const { year, members } = req.body;

      if (!year || !members || !Array.isArray(members)) {
        return res.status(400).json({ 
          error: 'Missing required fields: year, members (array)' 
        });
      }

      const poolData = this.createPool.execute({ year, members });

      const pool = await this.poolRepo.createPool(year);
      await this.poolRepo.addMembers(
        pool.id!,
        poolData.members.map(m => ({
          shipId: m.shipId,
          cbBefore: m.cbBefore,
          cbAfter: m.cbAfter
        }))
      );

      res.status(201).json({
        poolId: pool.id,
        year: pool.year,
        members: poolData.members
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create pool' });
    }
  };

  getPool = async (req: Request, res: Response) => {
    try {
      const poolId = parseInt(req.params.id);
      
      const pool = await this.poolRepo.findById(poolId);
      if (!pool) {
        return res.status(404).json({ error: 'Pool not found' });
      }

      const members = await this.poolRepo.findMembersByPoolId(poolId);

      res.json({
        poolId: pool.id,
        year: pool.year,
        createdAt: pool.createdAt,
        members
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch pool' });
    }
  };
}
