import { ChangeDetectorRef, Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Alarm } from '../../../core/interfaces/alerts';
import { AlertService } from '../../../core/services/alerts/alerts.service';
import { DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-list',
  imports: [
    DatePipe,
    TagModule,
    SelectModule,
    TableModule,
    ButtonModule,
    DialogModule,
    FormsModule
  ],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class ListAlerts {


  alarms:Alarm[]=[];


  loading=true;


  showModal=false;


  editMode=false;


  selectedId:number|null=null;

  selectedAlarm!:Alarm;


  showDeleteDialog=false;

  categories:string[]=[];


  states=[

      {
          label:'Activa',
          value:true
      },

      {
          label:'Inactiva',
          value:false
      }

  ];

  periodicities=[

    {
        label:'Diaria',
        value:'DIARIA'
    },

    {
        label:'Semanal',
        value:'SEMANAL'
    },

    {
        label:'Mensual',
        value:'MENSUAL'
    },

    {
        label:'Anual',
        value:'ANUAL'
    }

];


form={

    country:null as string|null,

    category:null as string|null,

    periodicity:'DIARIA',

    active:true

};


  constructor(

    private alarmService:AlertService,

    private messageService:MessageService,

    private cdr: ChangeDetectorRef,
  ){}



  ngOnInit(){

    this.loadAlarms();
    this.loadCategories();


  }



  loadAlarms(){


    this.alarmService
    .getAlarms()

    .subscribe({

      next:(data)=>{


        this.alarms=data;

        this.loading=false;

        this.cdr.detectChanges();


      },


      error:(error)=>{


        console.error(
          "Error obteniendo alarmas",
          error
        );


        this.messageService.add({

          severity:'error',

          summary:'Error obteniendo alarmas'

        });


        this.loading=false;


      }

    });


  }


loadCategories(){


    this.alarmService
    .getcat_categories()

    .subscribe({

        next:(data)=>{


            this.categories = [
                'Todas',
                ...data
            ];

        this.cdr.detectChanges();

        },


        error:(error)=>{


            console.error(
                "Error obteniendo categorías",
                error
            );


        }

    });


}

editAlarm(alarm:Alarm){


    this.editMode=true;


    this.selectedId=alarm.id;

this.form={

    country:alarm.country,

    category:alarm.category,

    periodicity:alarm.periodicity,

    active:alarm.active

};


    this.showModal=true;


}

confirmDelete(alarm:Alarm){


    this.selectedAlarm=alarm;


    this.showDeleteDialog=true;


}

deleteAlarm(){


    this.alarmService
    .deleteAlarm(
        this.selectedAlarm.id
    )

    .subscribe({

        next:(response)=>{


            this.messageService.add({

                severity:'success',

                summary:'Alarma eliminada correctamente'

            });


            this.showDeleteDialog=false;


            this.loadAlarms();


        },


        error:(error)=>{


            console.error(
                "Error eliminando alarma",
                error
            );


            this.messageService.add({

                severity:'error',

                summary:'Error eliminando alarma'

            });


        }

    });


}

  closeModal(){


    this.showModal=false;


    this.editMode=false;


    this.selectedId=null;


  }


save(){


    if(!this.selectedId){

        return;

    }



const data={

    country:this.form.country,

    category:this.form.category,

    periodicity:this.form.periodicity,

    active:this.form.active

};



    this.alarmService

    .updateAlarm(

        this.selectedId,

        data

    )

    .subscribe({


        next:(response)=>{



            this.messageService.add({

                severity:'success',

                summary:'Alarma actualizada correctamente'

            });



            this.showModal=false;


            this.loadAlarms();



        },


        error:(error)=>{


            console.error(

                "Error actualizando alarma",

                error

            );



            this.messageService.add({

                severity:'error',

                summary:'Error actualizando alarma'

            });



        }


    });


}


}
