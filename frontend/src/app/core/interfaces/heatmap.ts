export interface HeatmapFilters {
  category?: string;
  start_date?: string;
  end_date?: string;
}

export interface HeatmapKpis {
  total_events: number;
  affected_countries: number;
  top_category: string | null;
  top_country: string | null;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  weight: number;
}

export interface CountryEvents {
  country: string;
  events: number;
}

export interface HeatmapCountries {
  top: CountryEvents[];
  bottom: CountryEvents[];
}

export interface CategoryEvents {
  category: string;
  events: number;
}