import { ShipCompliance } from '../domain/Compliance';

export interface ComplianceRepository {
  findByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null>;
  save(compliance: Omit<ShipCompliance, 'id' | 'createdAt'>): Promise<ShipCompliance>;
}
