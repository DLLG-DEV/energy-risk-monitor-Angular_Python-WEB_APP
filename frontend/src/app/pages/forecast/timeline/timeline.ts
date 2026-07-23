import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ForecastTimeline,MonthForecast} from '../../../core/interfaces/forecast';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
    selector:'app-timeline',
    imports:[
      CommonModule,
      ButtonModule,
      DialogModule,
      DividerModule
    ],
    templateUrl:'./timeline.html',
    styleUrl:'./timeline.css',
})
export class ForecastTimelineComponent {

  @Input()
  timeline:ForecastTimeline[]=[];

  view: 'weekly'|'monthly' = 'monthly';

  selectedWeek?:ForecastTimeline;

  selectedMonth?:MonthForecast;

  showModal=false;

  setView(mode:'weekly'|'monthly'){this.view=mode;}

  openWeek(
    item:ForecastTimeline
  ){
    this.selectedWeek=item;

    this.selectedMonth=undefined;

    this.showModal=true;
  }

  openMonth(
    item:MonthForecast
  ){
    this.selectedMonth=item;

    this.selectedWeek=undefined;

    this.showModal=true;
  }

  closeModal(){
      this.showModal=false;

      this.selectedWeek=undefined;

      selectedMonth:undefined;
  }

  get weeklyGroups():ForecastTimeline[][]{
      const groups:
      ForecastTimeline[][] =[];

      for(
          let i=0;
          i<this.timeline.length;
          i+=4
      ){
          groups.push(
              this.timeline.slice(
                  i,
                  i+4
              )
          );
      }
      return groups;
  }

  getMonthLabel(
      date:string
  ){
    return new Date(date)
      .toLocaleDateString(
        'es-MX',
        {
          month:'long',
          year:'numeric'
        }
      );
  }

  get monthlyData():MonthForecast[]{
    const months:
    Record<string,MonthForecast>={};

    this.timeline.forEach(item=>{

      const date =
      new Date(item.date);

      const key =
      date.toLocaleDateString(
        'es-MX',
        {
          month:'long',
          year:'numeric'
        }
      );
      if(!months[key]){
        months[key]={
          month:key,
          events:0,
          weeks:0,
          items:[]
        };
      }

      months[key].events += item.total_events;

      months[key].weeks++;

      months[key].items.push(item);
    });

    return Object.values(
      months
    );
  }
}