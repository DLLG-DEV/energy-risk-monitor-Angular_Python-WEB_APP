import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SystemUpdateResponse } from '../../../core/interfaces/audit-log';
import { Logs_AdmService } from '../../../core/services/admin/logs/logs_admin.service';
import { TagModule } from 'primeng/tag';
import { LogRefreshService } from '../../../core/services/admin/logs/refresh.service';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { finalize } from 'rxjs/operators';
import { ForecastService } from '../../../core/services/forecast/forecast.service';

@Component({
  selector: 'app-update-sistem-data',
  standalone:true,
  imports:[
    CommonModule,

    FormsModule,

    ButtonModule,

    CardModule,

    TagModule,

    SelectModule,

    InputTextModule
  ],  
  providers:[MessageService],
  templateUrl: './update-sistem-data.html',
  styleUrl: './update-sistem-data.css',
})
export class UpdateSistemData implements OnInit{
  updates!:SystemUpdateResponse;
  importAmount:number | null = null;
  importUnit:string | null = null;
  loadingImport = false;
  loadingForecast = false;
  units = [
    {
      label:'Días',
      value:'days'
    },
    {
      label:'Meses',
      value:'months'
    },
    {
      label:'Años',
      value:'years'
    }
  ];

  constructor(
    private adminService:Logs_AdmService,
    private fore_service:ForecastService,
    private logRefresh: LogRefreshService,
    private messageService:MessageService,
    private cdr: ChangeDetectorRef,

  ){}

  ngOnInit(): void {
    this.loadUpdates();
  }

  loadUpdates(){
    this.adminService
    .getSystemUpdates()
    .subscribe({
    next:(data:SystemUpdateResponse)=>{
      this.updates=data;
      this.cdr.detectChanges();

    },error:(err: any)=>{
      console.error(
        "Error cargando actualizaciones",
        err
      );
    }});
  }

  formatDate(date:string){
    if(!date)
      return 'Sin registros';

    const cleanDate = date.split('.')[0];

    return new Date(cleanDate)
    .toLocaleString(
      'es-MX',
      {
        dateStyle:'medium',
        timeStyle:'short'
      }
    );
  }

  refresh_logs(){
    this.logRefresh.refresh$.subscribe(() => {
      this.loadUpdates();
    this.cdr.detectChanges();

    });
  }

importNASA(){


    if(
        !this.importAmount ||
        !this.importUnit
    ){

        this.messageService.add({

            severity:'warn',
            summary:'Datos incompletos',
            detail:'Seleccione cantidad y unidad de tiempo'

        });

        return;

    }



    if(this.loadingImport){

        return;

    }



    this.loadingImport = true;



    this.adminService
    .importEvents(
        this.importAmount,
        this.importUnit
    )
    .subscribe({
        next:(response)=>{
          this.messageService.add({
              severity:'success',
              summary:'Importación completada',
              detail:
              `NASA EONET actualizado correctamente`
          });
          this.refresh_logs();
          this.loadUpdates();
          this.loadingImport = false;
          this.cdr.detectChanges();
        },

        error:(err)=>{
            this.messageService.add({
                severity:'error',
                summary:'Error de importación',
                detail:
                err.error?.detail ||
                'No fue posible actualizar los datos NASA'
            });
            this.loadingImport = false;
        }
    });
}


generateForecast(){
    if(this.loadingForecast){

      return;

    }

    this.loadingForecast = true;

    this.fore_service
    .generateForecast()
    .subscribe({
        next:(response)=>{
          this.refresh_logs();
          this.loadUpdates();
          this.loadingForecast = false;
          this.cdr.detectChanges();

        },

        error:(err)=>{
            console.error(
              "Error generando forecast",
              err
            );

            this.messageService.add({

              severity:'error',

              summary:'Error de forecast',

              detail:
              err.error?.detail ||
              'No fue posible generar el modelo predictivo'
            });

            this.loadingForecast = false;
        }
    });



}
}
