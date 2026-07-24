import { MessageService } from 'primeng/api';
import { EventsService } from '../../../core/services/events/events.service';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventList, EventStatistics } from '../../../core/interfaces/events';
import * as L from 'leaflet';

@Component({
  selector: 'app-interactive-map',
  standalone: true,
  imports: [],
  providers: [MessageService],
  templateUrl: './interactive-map.html',
  styleUrl: './interactive-map.css',
})
export class InteractiveMap {
  events: EventList[] = [];
  countryPoints: any[] = [];
  totalEvents = 0;
  eventMarkers: L.Marker[] = [];
  map!: L.Map;
  statistics!: EventStatistics;

  constructor(
    private readonly Events_Serv: EventsService,
    private Msg_Service: MessageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadStatistics();
  }

  loadEvents() {
    this.Events_Serv.get_events_all().subscribe({
      next: (data) => {
        this.events = data;
        this.totalEvents = data.length;
        this.generateCountryPoints();
        this.loadMap();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando eventos', err);
      },
    });
  }

  loadStatistics() {
    this.Events_Serv.get_statistics().subscribe({
      next: (data) => {
        this.statistics = data;

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Error estadísticas', err);
      },
    });
  }

  drawCountryEvents(events: EventList[]) {
    this.eventMarkers.forEach((marker) => {
      marker.remove();
    });

    this.eventMarkers = [];
    events.forEach((event) => {
      if (event.latitude !== null && event.longitude !== null) {
        const marker = L.marker([event.latitude, event.longitude]).addTo(this.map);
        marker.bindPopup(`
        <h3>
        ${event.title}
        </h3>
        <p>
        ${event.category}
        </p>
      `);

        this.eventMarkers.push(marker);
      }
    });
  }

  generateCountryPoints() {
    const countries: any = {};
    this.events.forEach((event) => {
      if (event.country && event.latitude && event.longitude) {
        if (!countries[event.country]) {
          countries[event.country] = {
            country: event.country,
            lat: event.latitude,
            lng: event.longitude,
            total: 1,
          };
        } else {
          countries[event.country].total++;
        }
      }
    });
    this.countryPoints = Object.values(countries);
  }

  loadMap() {
    this.map = L.map('world-map').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.countryPoints.forEach((country) => {
      const marker = L.marker([country.lat, country.lng]).addTo(this.map);

      marker.bindPopup(`
        <h3>
        ${country.country}
        </h3>
        <p>
        Eventos:
        ${country.total}
        </p>
        <button id="btn-country">
          Ver eventos
        </button>
      `);

      marker.on('click', () => {
        this.loadCountryEvents(country.country);
      });
    });
  }

  loadCountryEvents(country: string) {
    this.Events_Serv.get_events_searchs({
      country: country,
      limit: 500,
    }).subscribe({
      next: (response) => {
        this.drawCountryEvents(response.results);
      },
      error: (err) => {
        this.Msg_Service.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible obtener los eventos.',
        });
      },
    });
  }
}
