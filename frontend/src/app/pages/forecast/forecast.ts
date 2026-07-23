import {ChangeDetectorRef,Component,OnInit} from '@angular/core';
import { forkJoin } from 'rxjs';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ForecastTimelineComponent } from './timeline/timeline';
import { RiskMap } from './risk-map/risk-map';
import { KpiCards } from './kpi-cards/kpi-cards';
import { Chards } from './chards/chards';
import { ForecastService } from '../../core/services/forecast/forecast.service';
import { ForecastDashboard, ForecastTimeline, ForecastCategory, ForecastMapItem } from '../../core/interfaces/forecast';

@Component({
  selector: 'app-forecast',
  imports: [
    DividerModule,
    ForecastTimelineComponent,
    RiskMap,
    KpiCards,
    Chards
  ],
  templateUrl: './forecast.html',
  styleUrl: './forecast.css'
})
export class Forecast implements OnInit {

  dashboard!: ForecastDashboard;
  timeline: ForecastTimeline[] = [];
  categories: ForecastCategory[] = [];
  mapData: ForecastMapItem[] = [];
  loading = false;

  constructor(
    private forecastService: ForecastService,
    private Msg_Service: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadForecast();
  }

  loadForecast(): void {
    this.loading = true;
    forkJoin({
      dashboard: this.forecastService.getDashboard(),
      timeline: this.forecastService.getTimeline(),
      categories: this.forecastService.getCategories(),
      map: this.forecastService.getMap()
    }).subscribe({
      next: (response) => {
        this.dashboard = response.dashboard;
        console.log("DASHBOADS")
        console.log(this.dashboard)

        this.timeline = response.timeline;

        this.categories = response.categories;

        this.mapData = response.map;

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        this.Msg_Service.add({
          severity: 'error',
          summary: 'Forecast',
          detail: 'No fue posible cargar la información del pronóstico.'
        });
        this.cdr.detectChanges();
      }
    });
  }
}