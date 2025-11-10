import { useState } from 'react';
import { ApiBankingAdapter } from '../../infrastructure/ApiBankingAdapter';
import { BankingResult } from '../../../core/domain/Banking';

const bankingAdapter = new ApiBankingAdapter();

export function BankingTab() {
  const [shipId, setShipId] = useState('SHIP-001');
  const [year, setYear] = useState(2025);
  const [amount, setAmount] = useState('');
  const [cbBefore, setCbBefore] = useState<number | null>(null);
  const [result, setResult] = useState<BankingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadCB = async () => {
    try {
      setLoading(true);
      setError(null);
      const cb = await bankingAdapter.getComplianceBalance(year, shipId);
      setCbBefore(cb.cbBefore);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load compliance balance');
    } finally {
      setLoading(false);
    }
  };

  const handleBank = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Amount must be positive');
      return;
    }

    if (cbBefore === null) {
      setError('Please load CB first');
      return;
    }

    if (cbBefore <= 0) {
      setError('Cannot bank negative or zero CB');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await bankingAdapter.bankSurplus({
        shipId,
        year,
        amount: parseFloat(amount)
      });
      setResult({
        cbBefore,
        applied: parseFloat(amount),
        cbAfter: cbBefore - parseFloat(amount)
      });
      setAmount('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to bank surplus');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Amount must be positive');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const applyResult = await bankingAdapter.applyBanked({
        shipId,
        year,
        amount: parseFloat(amount)
      });
      setResult(applyResult);
      setAmount('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to apply banked surplus');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Banking Operations</h2>
        <p className="text-gray-600 mb-6">
          Article 20 - FuelEU Maritime: Bank positive compliance balance for future use
        </p>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ship ID</label>
            <input
              type="text"
              value={shipId}
              onChange={(e) => setShipId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (gCO₂e)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
            />
          </div>
        </div>

        {/* Load CB Button */}
        <button
          onClick={loadCB}
          disabled={loading}
          className="w-full mb-4 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:bg-gray-400"
        >
          {loading ? 'Loading...' : 'Load Current CB'}
        </button>

        {/* CB Display */}
        {cbBefore !== null && (
          <div className={`p-4 rounded mb-4 ${cbBefore > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className="text-sm text-gray-600">Current Compliance Balance</p>
            <p className={`text-2xl font-bold ${cbBefore > 0 ? 'text-green-700' : 'text-red-700'}`}>
              {cbBefore.toLocaleString()} gCO₂e
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {cbBefore > 0 ? 'Surplus - Can bank' : 'Deficit - Cannot bank'}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleBank}
            disabled={loading || cbBefore === null || cbBefore <= 0}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            Bank Surplus
          </button>
          <button
            onClick={handleApply}
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            Apply Banked
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>
        )}

        {/* Result Display */}
        {result && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold text-lg mb-3">Operation Result</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">CB Before</p>
                <p className="text-lg font-semibold">{result.cbBefore.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-sm text-gray-600">Applied/Banked</p>
                <p className="text-lg font-semibold text-blue-700">{result.applied.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <p className="text-sm text-gray-600">CB After</p>
                <p className="text-lg font-semibold text-green-700">{result.cbAfter.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Banking Rules (Article 20)</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Only positive CB can be banked</li>
          <li>• Banked surplus can be applied to future deficits</li>
          <li>• FIFO (First In, First Out) deduction applies</li>
          <li>• Cannot apply more than available banked amount</li>
        </ul>
      </div>
    </div>
  );
}
