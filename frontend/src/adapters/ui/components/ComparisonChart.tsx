import { ComparisonRoute } from '../../../core/domain/Comparison';

interface Props {
  baseline: { routeId: string; ghgIntensity: number };
  comparisons: ComparisonRoute[];
  target: number;
}

export function ComparisonChart({ baseline, comparisons, target }: Props) {
  const allRoutes = [
    { routeId: baseline.routeId, ghgIntensity: baseline.ghgIntensity, isBaseline: true },
    ...comparisons.map(c => ({ ...c, isBaseline: false }))
  ];

  const maxIntensity = Math.max(...allRoutes.map(r => r.ghgIntensity), target) * 1.1;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">GHG Intensity Comparison</h3>
      
      <div className="space-y-3">
        {/* Target line reference */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <div className="w-4 h-0.5 bg-green-500"></div>
          <span>Target: {target} gCO₂e/MJ</span>
        </div>

        {allRoutes.map((route) => {
          const percentage = (route.ghgIntensity / maxIntensity) * 100;
          const targetPercentage = (target / maxIntensity) * 100;
          const isAboveTarget = route.ghgIntensity > target;

          return (
            <div key={route.routeId} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  {route.routeId}
                  {route.isBaseline && <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded">BASELINE</span>}
                </span>
                <span className={isAboveTarget ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                  {route.ghgIntensity} gCO₂e/MJ
                </span>
              </div>
              <div className="relative h-8 bg-gray-100 rounded overflow-hidden">
                {/* Target line */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-green-500 z-10"
                  style={{ left: `${targetPercentage}%` }}
                ></div>
                
                {/* Bar */}
                <div
                  className={`h-full transition-all ${
                    route.isBaseline 
                      ? 'bg-blue-500' 
                      : isAboveTarget 
                        ? 'bg-red-500' 
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Baseline</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Below Target</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Above Target</span>
        </div>
      </div>
    </div>
  );
}
