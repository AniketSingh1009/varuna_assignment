import { Pool, PoolMember } from '../domain/Pool';

export interface PoolRepository {
  createPool(year: number): Promise<Pool>;
  addMembers(poolId: number, members: Omit<PoolMember, 'poolId'>[]): Promise<void>;
  findById(poolId: number): Promise<Pool | null>;
  findMembersByPoolId(poolId: number): Promise<PoolMember[]>;
}
