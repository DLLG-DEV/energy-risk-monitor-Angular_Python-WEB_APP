import { ChangeDetectorRef, Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EventsService } from '../../../core/services/events/events.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { EventDetail, EventList } from '../../../core/interfaces/events';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { EventDetails } from '../event-details/event-details';

@Component({
  selector: 'app-search-events',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    TagModule,
    EventDetails,
  ],
  templateUrl: './search-events.html',
  styleUrl: './search-events.css',
})
export class SearchEvents {
  events: EventList[] = [];
  loading = false;
  selectedEvent: EventDetail = {
    id: 0,
    external_id: '',
    title: '',
    category: '',
    country: '',
    latitude: 0,
    longitude: 0,
    event_date: '',
  };
  showDetailDialog = false;
  filters = {
    category: '',
    country: '',
    start_date: null as Date | null,
    end_date: null as Date | null,
    page: 1,
    limit: 20,
  };

  categories = [
    {
      name: 'Todos',
      value: '',
    },
    {
      name: 'Incendios',
      value: 'Fire',
    },
    {
      name: 'Volcanes',
      value: 'Volcano',
    },
    {
      name: 'Tormentas',
      value: 'Storm',
    },
    {
      name: 'Inundaciones',
      value: 'Flood',
    },
  ];

  constructor(
    private Events_Serv: EventsService,
    private Msg_Service: MessageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.searchEvents();
  }

  searchEvents() {
    this.loading = true;
    this.Events_Serv.get_events_searchs({
      category: this.filters.category,

      country: this.filters.country,

      start_date: this.filters.start_date ? this.formatDate(this.filters.start_date) : undefined,

      end_date: this.filters.end_date ? this.formatDate(this.filters.end_date) : undefined,

      page: this.filters.page,

      limit: this.filters.limit,
    }).subscribe({
      next: (response) => {
        this.events = response.results;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.error(err);

        this.Msg_Service.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los eventos',
        });
      },
    });
  }

  clearFilters() {
    this.filters = {
      category: '',
      country: '',
      start_date: null,
      end_date: null,
      page: 1,
      limit: 20,
    };

    this.searchEvents();
  }

  private formatDate(date: Date) {
    return date.toISOString().split('T')[0];
  }

  viewDetail(event: EventList): void {
    this.loading = true;
    this.Events_Serv.get_event_detail(event.id).subscribe({
      next: (resp) => {
        this.selectedEvent = resp;
        this.showDetailDialog = true;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.Msg_Service.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible obtener la información del evento.',
        });
      },
    });
  }
}
