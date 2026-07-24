import { Component } from '@angular/core';
import { TableEvents } from './table-events/table-events';
import { SearchEvents } from './search-events/search-events';
import { InteractiveMap } from './interactive-map/interactive-map';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [TableEvents, SearchEvents, InteractiveMap, DividerModule],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events {}
