import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  CategoriResponse,
  EventDetail,
  EventList,
  EventSearchResponse,
  EventStatistics,
} from '../../interfaces/events';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private url_back = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get_events_all(): Observable<EventList[]> {
    return this.http.get<EventList[]>(`${this.url_back}/events/list`);
  }

  get_event_detail(id: number): Observable<EventDetail> {
    return this.http.get<EventDetail>(`${this.url_back}/events/${id}`);
  }

  get_categoria(): Observable<CategoriResponse[]> {
    return this.http.get<CategoriResponse[]>(`${this.url_back}/categories`);
  }

  get_statistics(): Observable<EventStatistics> {
    return this.http.get<EventStatistics>(`${this.url_back}/events/statistics`);
  }

  get_events_searchs(filters: {
    category?: string;
    country?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
  }): Observable<EventSearchResponse> {
    let params = new HttpParams();

    if (filters.category) {
      params = params.set('category', filters.category);
    }

    if (filters.country) {
      params = params.set('country', filters.country);
    }

    if (filters.start_date) {
      params = params.set('start_date', filters.start_date);
    }

    if (filters.end_date) {
      params = params.set('end_date', filters.end_date);
    }

    if (filters.page) {
      params = params.set('page', filters.page);
    }

    if (filters.limit) {
      params = params.set('limit', filters.limit);
    }

    return this.http.get<EventSearchResponse>(`${this.url_back}/events/search`, {
      params,
    });
  }
}
