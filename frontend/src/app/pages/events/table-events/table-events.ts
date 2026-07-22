import { ChangeDetectorRef, Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EventsService } from '../../../core/services/events/events.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { EventDetail, EventList } from '../../../core/interfaces/events';
import { EventDetails } from '../event-details/event-details';

@Component({
  selector: 'app-table-events',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    ProgressSpinnerModule,
    EventDetails
  ],
  providers:[
    MessageService
  ],
  templateUrl: './table-events.html',
  styleUrl: './table-events.css',
})
export class TableEvents {
  events: EventList[] = [];
  selectedEvent: EventDetail = {
    id: 0,
    external_id: '',
    title: '',
    category: '',
    country: '',
    latitude: 0,
    longitude: 0,
    event_date: ''
  };
  showDetailDialog = false;
  loading = true;

  constructor(
    private Events_Serv: EventsService,
    private Msg_Service: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.Events_Serv.get_events_all().subscribe({
      next: (resp) => {
        this.events = resp;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.Msg_Service.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible obtener los eventos.'
        });
      }
    });
  }

  viewDetail(event: EventList): void {
    this.loading = true;
    this.Events_Serv.get_event_detail(event.id)
    .subscribe({
      next:(resp)=>{
        this.selectedEvent = resp;
        this.showDetailDialog = true;
        this.loading=false;
        this.cdr.detectChanges();
      },
      error:()=>{
        this.loading=false;
        this.Msg_Service.add({
          severity:'error',
          summary:'Error',
          detail:'No fue posible obtener la información del evento.'
        });
      }
    });


  }

  getCategorySeverity(category: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch(category){

      case 'FIRE':  return 'danger';

      case 'STORM': return 'warn';

      case 'VOLCANO': return 'secondary';

      case 'OTHER': return 'info';

      default:  return 'secondary';
    }
  }


}
