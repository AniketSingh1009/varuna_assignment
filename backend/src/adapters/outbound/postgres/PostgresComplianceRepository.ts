import { ComplianceRepository } from '../../../core/ports/ComplianceRepository';
import { ShipCompliance } from '../../../core/domain/Compliance';
import { query } from '../../../infrastructure/db/connection';

export class PostgresComplianceRepository implements ComplianceRepository {
  async findByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null> {
    const result = await query(
      'SELECT * FROM ship_compliance WHERE ship_id = $1 AND year = $2',
      [shipId, year]
    );
    return result.rows.length > 0 ? this.mapRow(result.rows[0]) : null;
  }

  async save(compliance: Omit<ShipCompliance, 'id' | 'createdAt'>): Promise<ShipCompliance> {
    const result = await query(
      `INSERT INTO ship_compliance (ship_id, year, cb_gco2eq, target_intensity, actual_intensity, energy_in_scope)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (ship_id, year) 
       DO UPDATE SET cb_gco2eq = $3, target_intensity = $4, actual_intensity = $5, energy_in_scope = $6
       RETURNING *`,
      [
        compliance.shipId,
        compliance.year,
        compliance.cbGco2eq,
        compliance.targetIntensity,
        compliance.actualIntensity,
        compliance.energyInScope
      ]
    );
    return this.mapRow(result.rows[0]);
  }

  private mapRow(row: any): ShipCompliance {
    return {
      id: row.id,
      shipId: row.ship_id,
      year: row.year,
      cbGco2eq: parseFloat(row.cb_gco2eq),
      targetIntensity: parseFloat(row.target_intensity),
      actualIntensity: parseFloat(row.actual_intensity),
      energyInScope: parseFloat(row.energy_in_scope),
      createdAt: row.created_at
    };
  }
}
