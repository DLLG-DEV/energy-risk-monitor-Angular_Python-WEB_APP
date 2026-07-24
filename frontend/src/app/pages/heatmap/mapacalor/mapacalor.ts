import { ChangeDetectorRef, Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import * as L from 'leaflet';
import 'leaflet.heat';
import { HeatmapService } from '../../../core/services/heatmap/heatmap.service';

@Component({
  selector: 'app-mapacalor',
  imports: [],
  templateUrl: './mapacalor.html',
  styleUrl: './mapacalor.css',
})
export class Mapacalor {
  private map!: L.Map;
  private heatLayer: any;

  constructor(
    private Events_Serv: HeatmapService,
    private Msg_Service: MessageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.createMap();
    this.loadHeatmap();
  }

  private createMap(): void {
    this.map = L.map('heatmap', {
      worldCopyJump: true,
      minZoom: 2,
      maxZoom: 8,
    }).setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);
  }

  private loadHeatmap(): void {
    this.Events_Serv.getMap().subscribe({
      next: (points) => {
        this.drawHeatmap(points);

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);

        this.Msg_Service.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No fue posible cargar el mapa de calor.',
        });
        this.cdr.detectChanges();
      },
    });
  }
  private drawHeatmap(points: any[]): void {
    if (this.heatLayer) {
      this.map.removeLayer(this.heatLayer);
    }
    const heatData = points.map((p) => [p.lat, p.lng, p.weight]);

    this.heatLayer = (L as any).heatLayer(heatData, {
      radius: 25,
      blur: 18,
      maxZoom: 6,
      minOpacity: 0.25,
    });
    this.heatLayer.addTo(this.map);
  }
}
