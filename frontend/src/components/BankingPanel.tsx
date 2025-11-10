import { useState } from 'react';
import { api } from '../api/client';

export function BankingPanel() {
  const [shipId, setShipId] = useState('');
  const [year, setYear] = useState(2025);
  const [amount, setAmount] = useState('');
  const [totalBanked, setTotalBanked] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBank = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      await api.bankSurplus({
        shipId,
        year,
        amount: parseFloat(amount)
      });
      setMessage('Surplus banked successfully!');
      setAmount('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to bank surplus');
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      await api.applyBanked({
        shipId,
        year,
        amount: parseFloat(amount)
      });
      setMessage('Banked surplus applied successfully!');
      setAmount('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to apply banked surplus');
    }
  };

  const checkBanked = async () => {
    setError(null);
    try {
      const response = await api.getBankingRecords(shipId);
      setTotalBanked(response.data.totalBanked);
    } catch (err) {
      setError('Failed to fetch banking records');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Banking Operations</h2>

      <div className="space-y-4 mb-6">
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
          />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleBank}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          Bank Surplus
        </button>
        <button
          onClick={handleApply}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Apply Banked
        </button>
      </div>

      <button
        onClick={checkBanked}
        className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 mb-4"
      >
        Check Total Banked
      </button>

      {message && (
        <div className="p-3 bg-green-50 text-green-700 rounded mb-4">{message}</div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded mb-4">{error}</div>
      )}

      {totalBanked !== null && (
        <div className="p-4 bg-blue-50 rounded">
          <p className="text-sm text-gray-600">Total Banked for {shipId}</p>
          <p className="text-2xl font-bold text-blue-700">{totalBanked.toLocaleString()} gCO₂e</p>
        </div>
      )}
    </div>
  );
}
