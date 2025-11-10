import { Route, RouteFilters } from '../domain/Route';

export interface RoutePort {
  getAllRoutes(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  filterRoutes(routes: Route[], filters: RouteFilters): Route[];
}
