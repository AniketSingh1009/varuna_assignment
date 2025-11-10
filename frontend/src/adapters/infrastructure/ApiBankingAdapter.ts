import axios from 'axios';
import { BankingPort } from '../../core/ports/BankingPort';
import { ComplianceBalance, BankingOperation, BankingResult } from '../../core/domain/Banking';

export class ApiBankingAdapter implements BankingPort {
  private baseUrl = '/api';

  async getComplianceBalance(year: number, shipId: string): Promise<ComplianceBalance> {
    const response = await axios.get(`${this.baseUrl}/compliance/cb`, {
      params: { year, shipId }
    });
    return {
      year,
      cbBefore: response.data.cbGco2eq || 0,
      shipId
    };
  }

  async bankSurplus(operation: BankingOperation): Promise<void> {
    await axios.post(`${this.baseUrl}/banking/bank`, {
      shipId: operation.shipId,
      year: operation.year,
      amount: operation.amount
    });
  }

  async applyBanked(operation: BankingOperation): Promise<BankingResult> {
    const response = await axios.post(`${this.baseUrl}/banking/apply`, {
      shipId: operation.shipId,
      year: operation.year,
      amount: operation.amount
    });
    
    return {
      cbBefore: response.data.cbBefore || 0,
      applied: operation.amount,
      cbAfter: response.data.cbAfter || 0
    };
  }
}
