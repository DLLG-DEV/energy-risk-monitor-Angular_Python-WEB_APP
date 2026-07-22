import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HeatmapFilters, HeatmapKpis, HeatmapPoint, HeatmapCountries, CategoryEvents } from '../../interfaces/heatmap';


@Injectable({
  providedIn: 'root'
})
export class HeatmapService {

  private api = `${environment.apiUrl}/heatmap`;

  constructor(
    private http: HttpClient
  ) {}

  private buildParams(filters?: HeatmapFilters): HttpParams {

    let params = new HttpParams();

    if (!filters) {
      return params;
    }

    if (filters.category) {
      params = params.set('category', filters.category);
    }

    if (filters.start_date) {
      params = params.set('start_date', filters.start_date);
    }

    if (filters.end_date) {
      params = params.set('end_date', filters.end_date);
    }

    return params;
  }

  getKpis(
    filters?: HeatmapFilters
  ): Observable<HeatmapKpis> {
    return this.http.get<HeatmapKpis>(
      `${this.api}/kpis`,
      {
        params: this.buildParams(filters)
      }
    );
  }

  getMap(
    filters?: HeatmapFilters
  ): Observable<HeatmapPoint[]> {
    return this.http.get<HeatmapPoint[]>(
      `${this.api}/map`,
      {
        params: this.buildParams(filters)
      }
    );
  }

  getCountries(
    filters?: HeatmapFilters
  ): Observable<HeatmapCountries> {
    return this.http.get<HeatmapCountries>(
      `${this.api}/countries`,
      {
        params: this.buildParams(filters)
      }
    );
  }

  getCategories(
    filters?: HeatmapFilters
  ): Observable<CategoryEvents[]> {
    return this.http.get<CategoryEvents[]>(
      `${this.api}/categories`,
      {
        params: this.buildParams(filters)
      }
    );
  }

}