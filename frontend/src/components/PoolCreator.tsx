import { useState } from 'react';
import { api } from '../api/client';
import type { Pool } from '../types';

interface PoolMemberInput {
  shipId: string;
  cbBefore: string;
}

export function PoolCreator() {
  const [year, setYear] = useState(2025);
  const [members, setMembers] = useState<PoolMemberInput[]>([
    { shipId: '', cbBefore: '' },
    { shipId: '', cbBefore: '' }
  ]);
  const [result, setResult] = useState<Pool | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addMember = () => {
    setMembers([...members, { shipId: '', cbBefore: '' }]);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: keyof PoolMemberInput, value: string) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const response = await api.createPool({
        year,
        members: members.map(m => ({
          shipId: m.shipId,
          cbBefore: parseFloat(m.cbBefore)
        }))
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create pool');
    }
  };

  const totalCB = members.reduce((sum, m) => sum + (parseFloat(m.cbBefore) || 0), 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Pool Creator</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Pool Members</h3>
            <button
              type="button"
              onClick={addMember}
              className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              + Add Member
            </button>
          </div>

          {members.map((member, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Ship ID"
                value={member.shipId}
                onChange={(e) => updateMember(index, 'shipId', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="CB Before"
                value={member.cbBefore}
                onChange={(e) => updateMember(index, 'cbBefore', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {members.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeMember(index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          <div className={`mt-3 p-3 rounded ${totalCB >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className="text-sm text-gray-600">Total Pool CB</p>
            <p className={`text-lg font-semibold ${totalCB >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {totalCB.toLocaleString()} gCO₂e
            </p>
            {totalCB < 0 && (
              <p className="text-xs text-red-600 mt-1">Pool total must be non-negative</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={totalCB < 0}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          Create Pool
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>
      )}

      {result && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold text-lg mb-3">Pool Created Successfully!</h3>
          <p className="text-sm text-gray-600 mb-3">Pool ID: {result.poolId}</p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Ship ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">CB Before</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">CB After</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Change</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.members.map((member) => {
                  const change = member.cbAfter - member.cbBefore;
                  return (
                    <tr key={member.shipId}>
                      <td className="px-4 py-2 font-medium">{member.shipId}</td>
                      <td className="px-4 py-2">{member.cbBefore.toLocaleString()}</td>
                      <td className="px-4 py-2">{member.cbAfter.toLocaleString()}</td>
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
  );
}
