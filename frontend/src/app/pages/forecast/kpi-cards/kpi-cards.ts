import { Component, Input } from '@angular/core';
import { ForecastDashboard, ForecastCategory } from '../../../core/interfaces/forecast';

@Component({
  selector: 'app-kpi-cards',
  imports: [],
  templateUrl: './kpi-cards.html',
  styleUrl: './kpi-cards.css',
})
export class KpiCards {
  @Input({ required: true })
  dashboard!: ForecastDashboard;

  @Input()
  categories: ForecastCategory[] = [];

  get dominantCategory(): ForecastCategory | null {

    if (!this.categories.length) {

      return null;

    }

    return [...this.categories].sort(
      (a, b) => b.percentage - a.percentage
    )[0];

  }

}
