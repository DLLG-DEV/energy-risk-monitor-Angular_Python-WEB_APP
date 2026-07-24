import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HeatmapFilters, HeatmapKpis, HeatmapPoint, HeatmapCountries, CategoryEvents } from '../../interfaces/heatmap';
import { ForecastDashboard, ForecastTimeline, ForecastCategory, ForecastMapItem, EventCategory } from '../../interfaces/forecast';


@Injectable({
  providedIn: 'root'
})
export class ForecastService {

  private api = `${environment.apiUrl}/forecast`;

  constructor(
    private http: HttpClient
  ) {}

    getDashboard():Observable<ForecastDashboard>{
        return this.http.get<ForecastDashboard>(
            `${this.api}/dashboard`
        );
    }

    getTimeline():Observable<ForecastTimeline[]>{
        return this.http.get<ForecastTimeline[]>(
            `${this.api}/timeline`
        );
    }

    getCategories():Observable<ForecastCategory[]>{
        return this.http.get<ForecastCategory[]>(
            `${this.api}/categories`
        );
    }

    getMap():Observable<ForecastMapItem[]>{
        return this.http.get<ForecastMapItem[]>(
            `${this.api}/map`
        );
    }

    generateForecast(){
        return this.http.post<any>(
            `${this.api}/generate`,
            {}
        );
    }

    getCatCategories():Observable<EventCategory[]>{
        return this.http.get<EventCategory[]>(
            `${this.api}/cat/caategoria`
        );
    }

}