import { ChangeDetectorRef, Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HeatmapService } from '../../../core/services/heatmap/heatmap.service';

import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { CategoryEvents, HeatmapCountries, HeatmapFilters } from '../../../core/interfaces/heatmap';

import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-graficas',
  standalone: true,
  imports: [CommonModule, ChartModule, ButtonModule, DatePickerModule, FormsModule],
  templateUrl: './graficas.html',
  styleUrl: './graficas.css',
})
export class Graficas {
  categories: CategoryEvents[] = [];
  countries!: HeatmapCountries;
  categoryChartData: any;
  categoryChartOptions: any;
  countryChartData: any;
  countryChartOptions: any;
  bottomCountryChartData: any;
  bottomCountryChartOptions: any;

  startDate!: Date;
  endDate!: Date;

  filters: HeatmapFilters = {};

  constructor(
    private Events_Serv: HeatmapService,
    private Msg_Service: MessageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.setDefaultDates();
    this.updateFilters();
  }

  loadCharts() {
    this.loadCategories();
    this.loadCountries();
  }

  loadCategories() {
    this.Events_Serv.getCategories(this.filters).subscribe({
      next: (data) => {
        this.categories = data;

        this.categoryChartData = {
          labels: data.map((x) => x.category),

          datasets: [
            {
              data: data.map((x) => x.events),
              label: 'Eventos',
            },
          ],
        };

        this.categoryChartOptions = {
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        };

        this.cdr.detectChanges();
      },
      error: () => {
        this.Msg_Service.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar categorías',
        });
      },
    });
  }

  loadCountries() {
    this.Events_Serv.getCountries(this.filters).subscribe({
      next: (data) => {
        this.countries = data;

        this.countryChartData = {
          labels: data.top.map((x) => x.country),
          datasets: [
            {
              label: 'Eventos',
              data: data.top.map((x) => x.events),
            },
          ],
        };

        this.countryChartOptions = {
          indexAxis: 'y',
          plugins: {
            legend: {
              display: false,
            },
          },
        };

        this.bottomCountryChartData = {
          labels: data.bottom.map((x) => x.country),
          datasets: [
            {
              label: 'Eventos',
              data: data.bottom.map((x) => x.events),
            },
          ],
        };

        this.bottomCountryChartOptions = {
          indexAxis: 'y',
          plugins: {
            legend: {
              display: false,
            },
          },
        };

        this.cdr.detectChanges();
      },
    });
  }

  updateFilters() {
    this.filters = {
      start_date: this.formatDate(this.startDate),
      end_date: this.formatDate(this.endDate),
    };
    this.loadCharts();
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  setDefaultDates() {
    const today = new Date();
    this.endDate = today;
    this.startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  }
}
