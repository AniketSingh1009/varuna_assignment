import { Route, RouteComparison } from '../domain/Route';

export class ComputeComparison {
  execute(baseline: Route, routes: Route[]): RouteComparison[] {
    return routes.map(route => {
      const percentDiff = ((route.ghgIntensity - baseline.ghgIntensity) / baseline.ghgIntensity) * 100;
      const compliant = route.ghgIntensity <= baseline.ghgIntensity;

      return {
        routeId: route.routeId,
        year: route.year,
        ghgIntensity: route.ghgIntensity,
        percentDiff: Math.round(percentDiff * 100) / 100,
        compliant
      };
    });
  }
}
