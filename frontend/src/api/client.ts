import axios from 'axios';
import type { Route, ComparisonResponse, ComplianceBalance, AdjustedCB, BankEntry, Pool } from '../types';

const API_BASE = '/api';

export const api = {
  // Routes
  getRoutes: () => axios.get<Route[]>(`${API_BASE}/routes`),
  
  setBaseline: (id: number) => axios.post(`${API_BASE}/routes/${id}/baseline`),
  
  getComparison: () => axios.get<ComparisonResponse>(`${API_BASE}/routes/comparison`),

  // Compliance
  getComplianceBalance: (params: {
    shipId: string;
    year: number;
    actualIntensity: number;
    fuelConsumption: number;
  }) => axios.get<ComplianceBalance>(`${API_BASE}/compliance/cb`, { params }),

  getAdjustedCB: (shipId: string, year: number) =>
    axios.get<AdjustedCB>(`${API_BASE}/compliance/adjusted-cb`, { params: { shipId, year } }),

  // Banking
  getBankingRecords: (shipId: string, year?: number) =>
    axios.get<{ shipId: string; year?: number; totalBanked: number; entries?: BankEntry[] }>(
      `${API_BASE}/banking/records`,
      { params: { shipId, year } }
    ),

  bankSurplus: (data: { shipId: string; year: number; amount: number }) =>
    axios.post<BankEntry>(`${API_BASE}/banking/bank`, data),

  applyBanked: (data: { shipId: string; year: number; amount: number }) =>
    axios.post(`${API_BASE}/banking/apply`, data),

  // Pools
  createPool: (data: { year: number; members: { shipId: string; cbBefore: number }[] }) =>
    axios.post<Pool>(`${API_BASE}/pools`, data),

  getPool: (id: number) => axios.get<Pool>(`${API_BASE}/pools/${id}`)
};
