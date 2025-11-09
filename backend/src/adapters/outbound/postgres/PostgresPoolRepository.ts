import { PoolRepository } from '../../../core/ports/PoolRepository';
import { Pool, PoolMember } from '../../../core/domain/Pool';
import { query } from '../../../infrastructure/db/connection';

export class PostgresPoolRepository implements PoolRepository {
  async createPool(year: number): Promise<Pool> {
    const result = await query(
      'INSERT INTO pools (year) VALUES ($1) RETURNING *',
      [year]
    );
    return this.mapPoolRow(result.rows[0]);
  }

  async addMembers(poolId: number, members: Omit<PoolMember, 'poolId'>[]): Promise<void> {
    for (const member of members) {
      await query(
        'INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after) VALUES ($1, $2, $3, $4)',
        [poolId, member.shipId, member.cbBefore, member.cbAfter]
      );
    }
  }

  async findById(poolId: number): Promise<Pool | null> {
    const result = await query('SELECT * FROM pools WHERE id = $1', [poolId]);
    return result.rows.length > 0 ? this.mapPoolRow(result.rows[0]) : null;
  }

  async findMembersByPoolId(poolId: number): Promise<PoolMember[]> {
    const result = await query(
      'SELECT * FROM pool_members WHERE pool_id = $1',
      [poolId]
    );
    return result.rows.map(this.mapMemberRow);
  }

  private mapPoolRow(row: any): Pool {
    return {
      id: row.id,
      year: row.year,
      createdAt: row.created_at
    };
  }

  private mapMemberRow(row: any): PoolMember {
    return {
      poolId: row.pool_id,
      shipId: row.ship_id,
      cbBefore: parseFloat(row.cb_before),
      cbAfter: parseFloat(row.cb_after)
    };
  }
}
