import axios from 'axios';
import { PoolingPort } from '../../core/ports/PoolingPort';
import { PoolMember, PoolResult } from '../../core/domain/Pooling';

export class ApiPoolingAdapter implements PoolingPort {
  private baseUrl = '/api';

  async getAdjustedCB(year: number): Promise<PoolMember[]> {
    // Mock data for now - in real implementation, this would fetch from backend
    return [
      { shipId: 'SHIP-001', adjustedCB: 150000 },
      { shipId: 'SHIP-002', adjustedCB: -75000 },
      { shipId: 'SHIP-003', adjustedCB: 50000 }
    ];
  }

  async createPool(year: number, members: PoolMember[]): Promise<PoolResult> {
    const response = await axios.post<PoolResult>(`${this.baseUrl}/pools`, {
      year,
      members: members.map(m => ({
        shipId: m.shipId,
        cbBefore: m.adjustedCB
      }))
    });
    return response.data;
  }
}
