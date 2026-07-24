export interface EventList {
  id: number;
  title: string;
  category: string;
  country: string | null;
  event_date: string | null;
  latitude: number;
  longitude: number;
}

export interface EventDetail {
  id: number;
  external_id: string;
  title: string;
  category: string;
  country: string | null;
  latitude: number;
  longitude: number;
  event_date: string | null;
}

export interface EventSearchResponse {
  total: number;
  page: number;
  limit: number;
  results: EventList[];
}
export interface CategoriResponse {
  code: string;
  name: string;
}

export interface CategoryStatistics {
  code: string;

  name: string;

  total: number;
}

export interface EventStatistics {
  total: number;

  categories: CategoryStatistics[];
}
