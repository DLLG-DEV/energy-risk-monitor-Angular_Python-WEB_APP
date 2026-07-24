export interface Alarm {
  id: number;

  user_id: number;

  country: string | null;

  category: string | null;

  periodicity: string;

  active: boolean;

  created_at: string;
}

export interface AlarmCreate {
  country: string | null;

  category: string | null;

  periodicity: string;
}

export interface AlarmUpdate {
  country?: string | null;

  category?: string | null;

  periodicity?: string;

  active?: boolean;
}

export interface CountryResponse {
  country: string;
}
