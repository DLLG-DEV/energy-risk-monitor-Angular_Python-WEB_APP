import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alarm } from '../../../core/interfaces/alerts';
import { AlertService } from '../../../core/services/alerts/alerts.service';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-new',
  imports: [
      CommonModule,
      FormsModule,
      DialogModule,
      ButtonModule,
      TagModule
  ],
  providers: [MessageService ],
  templateUrl: './new.html',
  styleUrl: './new.css',
})
export class NewAlert implements OnInit{

  constructor(
    private alarmService: AlertService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
  ){}


  alarms:Alarm[]=[];


  loading=true;



  showModal=false;


  editMode=false;



  selectedId:number|null=null;



  form={

    country:null as string|null,

    category:null as string|null,

    periodicity:'DIARIA',

    active:true

  };

  countries:string[]=[];


  countrySearch='';


  searchingCountry=false;


  categories:string[] =[];

periodicities = [

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


  ngOnInit(){

      this.loadAlarms();
      this.loadCatCategories()

  }


isFormValid(): boolean {

    return !!(
        this.form.country &&
        this.form.category &&
        this.form.periodicity
    );

}

  loadAlarms(){


      this.loading=true;


      this.alarmService
      .getAlarms()
      .subscribe({

          next:data=>{

              this.alarms=data;

              this.loading=false;

          },

          error:()=>{

              this.loading=false;

          }

      });
  }

  loadCatCategories(){


      this.loading=true;


      this.alarmService
      .getcat_categories()
      .subscribe({

          next:data=>{

            this.categories = [
                'Todas',
                ...data
            ];

              this.loading=false;

          },

          error:()=>{

              this.loading=false;

          }

      });
  }

  openCreate(){


      this.editMode=false;

      this.selectedId=null;


      this.form={

          country:null,

          category:null,

          periodicity:"DIARIA",

          active:true

      };


      this.showModal=true;


  }




save(){


    const data={

        country:this.form.country,

        category:this.form.category,

        periodicity:this.form.periodicity,

        active:this.form.active

    };


    const request = this.selectedId

        ? this.alarmService.updateAlarm(
            this.selectedId,
            data
        )

        : this.alarmService.createAlarm(
            data
        );



    request.subscribe({

        next:(response)=>{


            this.messageService.add({

                severity:'success',

                summary:'Alarma guardada correctamente'

            });


            this.loadAlarms();


            this.showModal=false;

            this.cdr.detectChanges()


        },


        error:(error)=>{


            console.error(
                "Error guardando alarma",
                error
            );


            this.messageService.add({

                severity:'error',

                summary:'Error guardando alarma'

            });


        }


    });


}
searchCountry(){


    const value =
    this.countrySearch.trim();



    if(value.length < 1){

        this.countries=[];

        return;

    }



    this.searchingCountry=true;



    this.alarmService
    .searchCountries(value)
    .subscribe({

        next:data=>{


            this.countries=data;


            this.searchingCountry=false;


        },

        error:()=>{


            this.countries=[];

            this.searchingCountry=false;


        }


    });


}

selectCountry(
    country:string
){


    this.form.country=country;


    this.countrySearch=country;


    this.countries=[];


}

}
