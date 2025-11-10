import { useState, useEffect } from 'react';
import { Route, RouteFilters } from '../../../core/domain/Route';
import { ApiRouteAdapter } from '../../infrastructure/ApiRouteAdapter';

const routeAdapter = new ApiRouteAdapter();

export function RoutesTab() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RouteFilters>({});

  useEffect(() => {
    loadRoutes();
  }, []);

  useEffect(() => {
    const filtered = routeAdapter.filterRoutes(routes, filters);
    setFilteredRoutes(filtered);
  }, [routes, filters]);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const data = await routeAdapter.getAllRoutes();
      setRoutes(data);
      setFilteredRoutes(data);
      setError(null);
    } catch (err) {
      setError('Failed to load routes');
    } finally {
      setLoading(false);
    }
  };

  const handleSetBaseline = async (routeId: string) => {
    try {
      await routeAdapter.setBaseline(routeId);
      await loadRoutes();
    } catch (err) {
      setError('Failed to set baseline');
    }
  };

  const vesselTypes = [...new Set(routes.map(r => r.vesselType))];
  const fuelTypes = [...new Set(routes.map(r => r.fuelType))];
  const years = [...new Set(routes.map(r => r.year))];

  if (loading) return <div className="text-center py-8">Loading routes...</div>;
  if (error) return <div className="text-red-600 py-4">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vessel Type</label>
            <select
              value={filters.vesselType || ''}
              onChange={(e) => setFilters({ ...filters, vesselType: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All</option>
              {vesselTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
            <select
              value={filters.fuelType || ''}
              onChange={(e) => setFilters({ ...filters, fuelType: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All</option>
              {fuelTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              value={filters.year || ''}
              onChange={(e) => setFilters({ ...filters, year: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Routes Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vessel Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fuel Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GHG Intensity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fuel (t)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance (km)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emissions (t)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoutes.map((route) => (
                <tr key={route.routeId} className={route.isBaseline ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {route.routeId}
                    {route.isBaseline && <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">BASELINE</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{route.vesselType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{route.fuelType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{route.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{route.ghgIntensity} gCO₂e/MJ</td>
                  <td className="px-6 py-4 whitespace-nowrap">{route.fuelConsumption.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{route.distance.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{route.totalEmissions.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {!route.isBaseline && (
                      <button
                        onClick={() => handleSetBaseline(route.routeId)}
                        className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Set Baseline
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600">
          Showing {filteredRoutes.length} of {routes.length} routes
        </div>
      </div>
    </div>
  );
}
