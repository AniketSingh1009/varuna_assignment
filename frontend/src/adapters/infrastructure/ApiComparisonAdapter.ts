import axios from 'axios';
import { ComparisonPort } from '../../core/ports/ComparisonPort';
import { ComparisonData } from '../../core/domain/Comparison';

export class ApiComparisonAdapter implements ComparisonPort {
  private baseUrl = '/api';

  async getComparison(): Promise<ComparisonData> {
    const response = await axios.get<ComparisonData>(`${this.baseUrl}/routes/comparison`);
    return response.data;
  }
}
