import { ComparisonData } from '../domain/Comparison';

export interface ComparisonPort {
  getComparison(): Promise<ComparisonData>;
}
