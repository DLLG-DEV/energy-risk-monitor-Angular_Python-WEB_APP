import { Component, Input } from '@angular/core';
import { ForecastDashboard, ForecastCategory, EventCategory } from '../../../core/interfaces/forecast';
import { MessageService } from 'primeng/api';
import { ForecastService } from '../../../core/services/forecast/forecast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-cards',
  imports: [
    CommonModule
  ],
  providers:[MessageService],
  templateUrl: './kpi-cards.html',
  styleUrl: './kpi-cards.css',
})
export class KpiCards {
  @Input({ required: true })
  dashboard!: ForecastDashboard;

  @Input()
  categories: ForecastCategory[] = [];

  cat_categories:EventCategory[]=[];

 constructor(
    private categoryService:ForecastService,
    private messageService:MessageService
 ){}


  get dominantCategory(): ForecastCategory | null {

    if (!this.categories.length) {

      return null;

    }

    return [...this.categories].sort(
      (a, b) => b.percentage - a.percentage
    )[0];

  }

 ngOnInit():void{

    this.loadCategories();

 }



 loadCategories(){


    this.categoryService
    .getCatCategories()
    .subscribe({

        next:(data)=>{

            this.cat_categories=data;
            console.log(data)

        },


        error:()=>{


            this.messageService.add({

                severity:'error',

                summary:'Error',

                detail:'No se pudieron cargar las categorías'

            });


        }
    });
 }



}
