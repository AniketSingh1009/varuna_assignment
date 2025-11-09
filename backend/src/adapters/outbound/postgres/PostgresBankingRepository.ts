import { BankingRepository } from '../../../core/ports/BankingRepository';
import { BankEntry } from '../../../core/domain/Banking';
import { query } from '../../../infrastructure/db/connection';

export class PostgresBankingRepository implements BankingRepository {
  async findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]> {
    const result = await query(
      'SELECT * FROM bank_entries WHERE ship_id = $1 AND year = $2 ORDER BY created_at',
      [shipId, year]
    );
    return result.rows.map(this.mapRow);
  }

  async getTotalBanked(shipId: string): Promise<number> {
    const result = await query(
      'SELECT COALESCE(SUM(amount_gco2eq), 0) as total FROM bank_entries WHERE ship_id = $1',
      [shipId]
    );
    return parseFloat(result.rows[0].total);
  }

  async save(entry: Omit<BankEntry, 'id' | 'createdAt'>): Promise<BankEntry> {
    const result = await query(
      'INSERT INTO bank_entries (ship_id, year, amount_gco2eq) VALUES ($1, $2, $3) RETURNING *',
      [entry.shipId, entry.year, entry.amountGco2eq]
    );
    return this.mapRow(result.rows[0]);
  }

  async deduct(shipId: string, amount: number): Promise<void> {
    let remaining = amount;
    const entries = await query(
      'SELECT * FROM bank_entries WHERE ship_id = $1 AND amount_gco2eq > 0 ORDER BY created_at FOR UPDATE',
      [shipId]
    );

    for (const entry of entries.rows) {
      if (remaining <= 0) break;

      const entryAmount = parseFloat(entry.amount_gco2eq);
      const deduction = Math.min(remaining, entryAmount);
      
      await query(
        'UPDATE bank_entries SET amount_gco2eq = amount_gco2eq - $1 WHERE id = $2',
        [deduction, entry.id]
      );

      remaining -= deduction;
    }
  }

  private mapRow(row: any): BankEntry {
    return {
      id: row.id,
      shipId: row.ship_id,
      year: row.year,
      amountGco2eq: parseFloat(row.amount_gco2eq),
      createdAt: row.created_at
    };
  }
}
