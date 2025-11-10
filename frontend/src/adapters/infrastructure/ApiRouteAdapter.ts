import axios from 'axios';
import { RoutePort } from '../../core/ports/RoutePort';
import { Route, RouteFilters } from '../../core/domain/Route';
import { FilterRoutesUseCase } from '../../core/application/FilterRoutes';

export class ApiRouteAdapter implements RoutePort {
  private baseUrl = '/api';
  private filterUseCase = new FilterRoutesUseCase();

  async getAllRoutes(): Promise<Route[]> {
    const response = await axios.get<Route[]>(`${this.baseUrl}/routes`);
    return response.data;
  }

  async setBaseline(routeId: string): Promise<void> {
    await axios.post(`${this.baseUrl}/routes/${routeId}/baseline`);
  }

  filterRoutes(routes: Route[], filters: RouteFilters): Route[] {
    return this.filterUseCase.execute(routes, filters);
  }
}
