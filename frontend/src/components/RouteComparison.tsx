import { useState, useEffect } from 'react';
import { api } from '../api/client';
import type { ComparisonResponse } from '../types';

export function RouteComparison() {
  const [data, setData] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComparison();
  }, []);

  const loadComparison = async () => {
    try {
      setLoading(true);
      const response = await api.getComparison();
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load route comparison');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-600 py-4">{error}</div>;
  if (!data) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Route Comparison</h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold text-lg mb-2">Baseline Route</h3>
        <p className="text-gray-700">
          <span className="font-medium">{data.baseline.routeId}</span> - 
          GHG Intensity: <span className="font-medium">{data.baseline.ghgIntensity}</span> gCO₂e/MJ
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GHG Intensity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Difference</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.comparisons.map((comp) => (
              <tr key={comp.routeId}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{comp.routeId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{comp.year}</td>
                <td className="px-6 py-4 whitespace-nowrap">{comp.ghgIntensity}</td>
                <td className={`px-6 py-4 whitespace-nowrap font-medium ${
                  comp.percentDiff > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {comp.percentDiff > 0 ? '+' : ''}{comp.percentDiff}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    comp.compliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {comp.compliant ? 'Compliant' : 'Non-Compliant'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
