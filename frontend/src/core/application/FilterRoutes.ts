import { Route, RouteFilters } from '../domain/Route';

export class FilterRoutesUseCase {
  execute(routes: Route[], filters: RouteFilters): Route[] {
    return routes.filter(route => {
      if (filters.vesselType && route.vesselType !== filters.vesselType) {
        return false;
      }
      if (filters.fuelType && route.fuelType !== filters.fuelType) {
        return false;
      }
      if (filters.year && route.year !== filters.year) {
        return false;
      }
      return true;
    });
  }
}
