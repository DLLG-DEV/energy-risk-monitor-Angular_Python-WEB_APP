import { Component } from '@angular/core';
import { Mapacalor } from './mapacalor/mapacalor';
import { Kpis } from './kpis/kpis';
import { Graficas } from './graficas/graficas';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-heatmap',
  imports: [
    Mapacalor,
    Kpis,
    Graficas,
    DividerModule
  ],
  templateUrl: './heatmap.html',
  styleUrl: './heatmap.css',
})
export class Heatmap {}
