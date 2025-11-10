import { useState } from 'react';
import { api } from '../api/client';
import type { ComplianceBalance } from '../types';

export function ComplianceCalculator() {
  const [formData, setFormData] = useState({
    shipId: '',
    year: 2025,
    actualIntensity: '',
    fuelConsumption: ''
  });
  const [result, setResult] = useState<ComplianceBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.getComplianceBalance({
        shipId: formData.shipId,
        year: formData.year,
        actualIntensity: parseFloat(formData.actualIntensity),
        fuelConsumption: parseFloat(formData.fuelConsumption)
      });
      setResult(response.data);
    } catch (err) {
      setError('Failed to calculate compliance balance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Compliance Balance Calculator</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ship ID</label>
          <input
            type="text"
            value={formData.shipId}
            onChange={(e) => setFormData({ ...formData, shipId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Actual GHG Intensity (gCO₂e/MJ)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.actualIntensity}
            onChange={(e) => setFormData({ ...formData, actualIntensity: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fuel Consumption (tonnes)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.fuelConsumption}
            onChange={(e) => setFormData({ ...formData, fuelConsumption: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Calculating...' : 'Calculate CB'}
        </button>
      </form>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {result && (
        <div className="border-t pt-4">
          <h3 className="font-semibold text-lg mb-3">Results</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Target Intensity</p>
              <p className="text-lg font-semibold">{result.targetIntensity} gCO₂e/MJ</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Actual Intensity</p>
              <p className="text-lg font-semibold">{result.actualIntensity} gCO₂e/MJ</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Energy in Scope</p>
              <p className="text-lg font-semibold">{result.energyInScope.toLocaleString()} MJ</p>
            </div>
            <div className={`p-3 rounded ${result.cbGco2eq >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="text-sm text-gray-600">Compliance Balance</p>
              <p className={`text-lg font-semibold ${result.cbGco2eq >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {result.cbGco2eq.toLocaleString()} gCO₂e
              </p>
              <p className="text-xs mt-1">
                {result.cbGco2eq >= 0 ? 'Surplus (Compliant)' : 'Deficit (Non-Compliant)'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
