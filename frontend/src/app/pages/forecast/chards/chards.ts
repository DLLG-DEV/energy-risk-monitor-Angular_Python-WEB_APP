import { Component, Input, OnChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import {
  ForecastDashboard,
  ForecastCategory,
  ForecastMapItem,
} from '../../../core/interfaces/forecast';

@Component({
  selector: 'app-chards',
  imports: [ChartModule],
  templateUrl: './chards.html',
  styleUrl: './chards.css',
})
export class Chards implements OnChanges {
  @Input()
  dashboard!: ForecastDashboard;

  @Input()
  categories: ForecastCategory[] = [];

  @Input()
  mapData: ForecastMapItem[] = [];

  timelineChart: any;

  riskChart: any;

  categoryChart: any;

  countryChart: any;

  ngOnChanges(): void {
    if (!this.dashboard) return;

    this.createTimelineChart();

    this.createRiskChart();

    this.createCategoryChart();

    this.createCountryChart();
  }

  /*
    ==================================
    EVENTOS POR SEMANA
    ==================================
    */

  createTimelineChart() {
    const timeline = this.dashboard.timeline;

    this.timelineChart = {
      labels: timeline.map((x) => this.formatDate(x.date)),

      datasets: [
        {
          label: 'Eventos esperados',

          data: timeline.map((x) => x.total_events),

          fill: true,

          tension: 0.4,
        },
      ],
    };
  }

  /*
    ==================================
    RIESGO SEMANAL
    ==================================
    */

  createRiskChart() {
    const timeline = this.dashboard.timeline;

    const riskValue: any = {
      LOW: 1,

      MEDIUM: 2,

      HIGH: 3,

      CRITICAL: 4,
    };

    this.riskChart = {
      labels: timeline.map((x) => this.formatDate(x.date)),

      datasets: [
        {
          label: 'Nivel de riesgo',

          data: timeline.map((item) => {
            let max = 0;

            item.risk_levels.forEach((risk) => {
              if (riskValue[risk] > max) {
                max = riskValue[risk];
              }
            });

            return max;
          }),
        },
      ],
    };
  }

  /*
    ==================================
    DISTRIBUCION CATEGORIAS
    ==================================
    */

  createCategoryChart() {
    this.categoryChart = {
      labels: this.categories.map((x) => x.category),

      datasets: [
        {
          data: this.categories.map((x) => x.expected_events),
        },
      ],
    };
  }

  /*
    ==================================
    TOP PAISES DE RIESGO
    ==================================
    */

  createCountryChart() {
    const topCountries = [...this.mapData]

      .sort((a, b) => b.expected_events - a.expected_events)

      .slice(0, 10);

    this.countryChart = {
      labels: topCountries.map((x) => x.country),

      datasets: [
        {
          label: 'Eventos esperados',

          data: topCountries.map((x) => x.expected_events),
        },
      ],
    };
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
    });
  }
}
