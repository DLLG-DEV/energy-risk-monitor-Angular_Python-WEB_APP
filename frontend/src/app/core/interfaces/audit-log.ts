export interface AuditLog {
  id: number;
  user_id: number | null;
  username: string;
  user_role: string;
  action: string;
  entity: string;
  entity_id: number | null;
  description: string;
  old_data: any | null;
  new_data: any | null;
  ip_address: string | null;
  created_at: string;
}

export interface SystemUpdateResponse {
  events_update: {
    username: string;
    date: string;
    description: string;
    imported: number;
    skipped: number;
  };

  forecast_update: {
    username: string;
    date: string;
    description: string;
    model: string;
    records_generated: number;
  };
}

export interface ImportEventsRequest {
  amount: number;

  unit: 'day' | 'days' | 'month' | 'months' | 'year' | 'years';
}

export interface ImportEventsResponse {
  message: string;

  period: {
    amount: number;

    unit: string;

    days: number;
  };

  categories: number;

  events_received: number;

  imported: number;

  skipped: number;
}
