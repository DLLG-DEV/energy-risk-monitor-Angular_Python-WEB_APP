export interface ForecastDashboard {
    generated_at: string;
    summary: ForecastSummary;
    timeline: ForecastTimeline[];
}

export interface ForecastSummary {
    total_expected_events: number;
    critical_regions: number;
    categories: number;
}

export interface ForecastTimeline {
    date: string;
    total_events: number;
    risk_levels: string[];
    categories: ForecastTimelineCategory[];
}

export interface ForecastTimelineCategory {
    category: string;
    region: string;
    country: string | null;
    events: number;
    confidence: number;
    risk: string;
}


export interface ForecastCategory {
    category:string;
    expected_events:number;
    percentage:number;

}


export interface ForecastMapItem {
    country:string | null;
    region:string;
    expected_events:number;
    risk:string;
    intensity: string;
}


export interface ForecastTimeline {
    date:string;
    total_events:number;
    categories:ForecastTimelineCategory[];
}

export interface ForecastTimelineCategory {
    category:string;
    region:string;
    country:string | null;
    events:number;
    risk:string;
    confidence:number;
}

export interface MonthForecast {
    month:string;
    events:number;
    weeks:number;
    items:ForecastTimeline[];
}


export interface EventCategory {

  id:number;

  name:string;

  external_name:string;

  description:string;

  icon:string;

}
