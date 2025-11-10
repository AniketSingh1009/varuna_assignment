import { useState, useEffect } from 'react';
import { PoolMember, PoolResult } from '../../../core/domain/Pooling';
import { ApiPoolingAdapter } from '../../infrastructure/ApiPoolingAdapter';
import { ValidatePoolUseCase } from '../../../core/application/ValidatePool';

const poolingAdapter = new ApiPoolingAdapter();
const validatePool = new ValidatePoolUseCase();

export function PoolingTab() {
  const [year, setYear] = useState(2025);
  const [availableShips, setAvailableShips] = useState<PoolMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<PoolMember[]>([]);
  const [result, setResult] = useState<PoolResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAvailableShips();
  }, [year]);

  const loadAvailableShips = async () => {
    try {
      setLoading(true);
      const ships = await poolingAdapter.getAdjustedCB(year);
      setAvailableShips(ships);
      setError(null);
    } catch (err) {
      setError('Failed to load ship data');
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (ship: PoolMember) => {
    const exists = selectedMembers.find(m => m.shipId === ship.shipId);
    if (exists) {
      setSelectedMembers(selectedMembers.filter(m => m.shipId !== ship.shipId));
    } else {
      setSelectedMembers([...selectedMembers, ship]);
    }
  };

  const handleCreatePool = async () => {
    const validation = validatePool.execute(selectedMembers);
    
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const poolResult = await poolingAdapter.createPool(year, selectedMembers);
      setResult(poolResult);
      setSelectedMembers([]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create pool');
    } finally {
      setLoading(false);
    }
  };

  const validation = validatePool.execute(selectedMembers);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Pooling Operations</h2>
        <p className="text-gray-600 mb-6">
          Article 21 - FuelEU Maritime: Create pools to share compliance balance
        </p>

        {/* Year Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Available Ships */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Available Ships</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableShips.map((ship) => {
              const isSelected = selectedMembers.some(m => m.shipId === ship.shipId);
              const isSurplus = ship.adjustedCB > 0;
              
              return (
                <button
                  key={ship.shipId}
                  onClick={() => toggleMember(ship)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{ship.shipId}</span>
                    {isSelected && <span className="text-blue-600">✓</span>}
                  </div>
                  <div className={`text-lg font-bold ${isSurplus ? 'text-green-600' : 'text-red-600'}`}>
                    {ship.adjustedCB.toLocaleString()} gCO₂e
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {isSurplus ? 'Surplus' : 'Deficit'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pool Summary */}
        {selectedMembers.length > 0 && (
          <div className={`p-4 rounded-lg mb-6 ${
            validation.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Pool Summary</h4>
              <span className="text-sm text-gray-600">{selectedMembers.length} members</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total CB</p>
                <p className={`text-2xl font-bold ${validation.totalCB >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {validation.totalCB.toLocaleString()} gCO₂e
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`text-lg font-semibold ${validation.isValid ? 'text-green-700' : 'text-red-700'}`}>
                  {validation.isValid ? '✅ Valid' : '❌ Invalid'}
                </p>
              </div>
            </div>
            {!validation.isValid && (
              <div className="mt-3 text-sm text-red-700">
                {validation.errors.map((err, i) => (
                  <div key={i}>• {err}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Pool Button */}
        <button
          onClick={handleCreatePool}
          disabled={loading || !validation.isValid || selectedMembers.length < 2}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
        >
          {loading ? 'Creating Pool...' : 'Create Pool'}
        </button>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>
        )}

        {/* Result Display */}
        {result && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold text-lg mb-3">Pool Created Successfully!</h3>
            <p className="text-sm text-gray-600 mb-4">Pool ID: {result.poolId} | Year: {result.year}</p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ship ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">CB Before</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">CB After</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.members.map((member) => {
                    const change = member.cbAfter - member.cbBefore;
                    return (
                      <tr key={member.shipId}>
                        <td className="px-4 py-2 font-medium">{member.shipId}</td>
                        <td className={`px-4 py-2 ${member.cbBefore >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {member.cbBefore.toLocaleString()}
                        </td>
                        <td className={`px-4 py-2 ${member.cbAfter >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {member.cbAfter.toLocaleString()}
                        </td>
                        <td className={`px-4 py-2 font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {change >= 0 ? '+' : ''}{change.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Pooling Rules (Article 21)</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Total pool CB must be non-negative (≥ 0)</li>
          <li>• Deficit ships cannot exit worse than they entered</li>
          <li>• Surplus ships cannot exit with negative CB</li>
          <li>• Greedy allocation: surplus transfers to deficits</li>
        </ul>
      </div>
    </div>
  );
}
