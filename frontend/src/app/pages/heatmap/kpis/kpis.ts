import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HeatmapService } from '../../../core/services/heatmap/heatmap.service';
import { CommonModule } from '@angular/common';
import { HeatmapKpis } from '../../../core/interfaces/heatmap';

@Component({
  selector: 'app-kpis',
  imports: [
    CommonModule
  ],
  templateUrl: './kpis.html',
  styleUrl: './kpis.css',
})
export class Kpis implements OnInit {

  kpis: HeatmapKpis = {
    total_events:0,
    affected_countries:0,
    top_category:null,
    top_country:null
  };

  constructor(
    private Heatmap_Serv: HeatmapService,
    private Msg_Service: MessageService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.loadKpis();
  }

  loadKpis():void{
    this.Heatmap_Serv.getKpis()
    .subscribe({
      next:(response)=>{

        this.kpis=response;

        this.cdr.detectChanges();

      },
      error:(error)=>{
        console.error(error);
        this.Msg_Service.add({
          severity:'error',
          summary:'Error',
          detail:'No se pudieron cargar los indicadores'
        });
      }
    });
  }

}