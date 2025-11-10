import { PoolMember, PoolResult } from '../domain/Pooling';

export interface PoolingPort {
  getAdjustedCB(year: number): Promise<PoolMember[]>;
  createPool(year: number, members: PoolMember[]): Promise<PoolResult>;
}
