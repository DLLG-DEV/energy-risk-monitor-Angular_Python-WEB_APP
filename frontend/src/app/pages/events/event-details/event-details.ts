import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

import { EventDetail } from '../../../core/interfaces/events';

import * as L from 'leaflet';

@Component({
  selector: 'app-event-detail-dialog',

  standalone: true,

  imports: [CommonModule, DialogModule, ButtonModule, InputTextModule],

  templateUrl: './event-details.html',
  styleUrl: './event-details.css',
})
export class EventDetails {
  @Input()
  visible: boolean = false;

  @Input()
  selectedEvent!: EventDetail;

  @Output()
  visibleChange = new EventEmitter<boolean>();

  map!: L.Map;
  marker!: L.Marker;
  mapId = 'event-map-' + Math.random().toString(36).substring(2);

  onDialogShow() {
    setTimeout(() => {
      this.initMap();
    }, 200);
  }

  initMap() {
    if (this.map) {
      this.map.remove();
    }

    this.createMap();

    this.createMarker();

    setTimeout(() => {
      this.map.invalidateSize();
    }, 300);
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(false);

    if (this.map) {
      this.map.remove();
      this.map = undefined!;
    }
  }

  createMap() {
    if (this.map) {
      this.map.remove();
    }
    this.map = L.map(this.mapId, {
      center: [this.selectedEvent.latitude, this.selectedEvent.longitude],
      zoom: 5,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);
  }

  createMarker() {
    this.marker = L.marker([this.selectedEvent.latitude, this.selectedEvent.longitude])
      .addTo(this.map)
      .bindPopup(this.selectedEvent.title)
      .openPopup();
  }
}
