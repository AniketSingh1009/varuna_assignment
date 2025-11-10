import { useState, useEffect } from 'react';
import { ComparisonData } from '../../../core/domain/Comparison';
import { ApiComparisonAdapter } from '../../infrastructure/ApiComparisonAdapter';
import { ComparisonChart } from './ComparisonChart';

const comparisonAdapter = new ApiComparisonAdapter();

export function CompareTab() {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComparison();
  }, []);

  const loadComparison = async () => {
    try {
      setLoading(true);
      const result = await comparisonAdapter.getComparison();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Failed to load comparison data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading comparison...</div>;
  if (error) return <div className="text-red-600 py-4">{error}</div>;
  if (!data) return null;

  const TARGET = 89.3368;

  return (
    <div className="space-y-6">
      {/* Baseline Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Baseline Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded">
            <p className="text-sm text-gray-600">Baseline Route</p>
            <p className="text-xl font-bold text-blue-700">{data.baseline.routeId}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded">
            <p className="text-sm text-gray-600">Baseline GHG Intensity</p>
            <p className="text-xl font-bold text-blue-700">{data.baseline.ghgIntensity} gCO₂e/MJ</p>
          </div>
          <div className="p-4 bg-green-50 rounded">
            <p className="text-sm text-gray-600">Target Intensity (2025)</p>
            <p className="text-xl font-bold text-green-700">{TARGET} gCO₂e/MJ</p>
            <p className="text-xs text-gray-500 mt-1">2% below 91.16</p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GHG Intensity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">vs Baseline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">vs Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.comparisons.map((comp) => {
                const vsTarget = ((comp.ghgIntensity - TARGET) / TARGET * 100).toFixed(2);
                const targetCompliant = comp.ghgIntensity <= TARGET;
                
                return (
                  <tr key={comp.routeId}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{comp.routeId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{comp.ghgIntensity} gCO₂e/MJ</td>
                    <td className={`px-6 py-4 whitespace-nowrap font-medium ${
                      comp.percentDiff > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {comp.percentDiff > 0 ? '+' : ''}{comp.percentDiff}%
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap font-medium ${
                      parseFloat(vsTarget) > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {parseFloat(vsTarget) > 0 ? '+' : ''}{vsTarget}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          comp.compliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {comp.compliant ? '✅ vs Baseline' : '❌ vs Baseline'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          targetCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {targetCompliant ? '✅ vs Target' : '❌ vs Target'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart */}
      <ComparisonChart baseline={data.baseline} comparisons={data.comparisons} target={TARGET} />
    </div>
  );
}
