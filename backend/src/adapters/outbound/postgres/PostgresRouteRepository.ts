import { RouteRepository } from '../../../core/ports/RouteRepository';
import { Route } from '../../../core/domain/Route';
import { query } from '../../../infrastructure/db/connection';

export class PostgresRouteRepository implements RouteRepository {
  async findAll(): Promise<Route[]> {
    const result = await query('SELECT * FROM routes ORDER BY id');
    return result.rows.map(this.mapRow);
  }

  async findById(id: number): Promise<Route | null> {
    const result = await query('SELECT * FROM routes WHERE id = $1', [id]);
    return result.rows.length > 0 ? this.mapRow(result.rows[0]) : null;
  }

  async findBaseline(): Promise<Route | null> {
    const result = await query('SELECT * FROM routes WHERE is_baseline = true LIMIT 1');
    return result.rows.length > 0 ? this.mapRow(result.rows[0]) : null;
  }

  async setBaseline(id: number): Promise<void> {
    await query('BEGIN');
    try {
      await query('UPDATE routes SET is_baseline = false WHERE is_baseline = true');
      await query('UPDATE routes SET is_baseline = true WHERE id = $1', [id]);
      await query('COMMIT');
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  }

  async create(route: Omit<Route, 'id' | 'createdAt'>): Promise<Route> {
    const result = await query(
      `INSERT INTO routes (route_id, vessel_type, fuel_type, year, ghg_intensity, fuel_consumption, distance, total_emissions, is_baseline)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [route.routeId, route.vesselType, route.fuelType, route.year, route.ghgIntensity, route.fuelConsumption, route.distance, route.totalEmissions, route.isBaseline]
    );
    return this.mapRow(result.rows[0]);
  }

  private mapRow(row: any): Route {
    return {
      id: row.id,
      routeId: row.route_id,
      vesselType: row.vessel_type,
      fuelType: row.fuel_type,
      year: row.year,
      ghgIntensity: parseFloat(row.ghg_intensity),
      fuelConsumption: parseFloat(row.fuel_consumption),
      distance: parseFloat(row.distance),
      totalEmissions: parseFloat(row.total_emissions),
      isBaseline: row.is_baseline,
      createdAt: row.created_at
    };
  }
}
