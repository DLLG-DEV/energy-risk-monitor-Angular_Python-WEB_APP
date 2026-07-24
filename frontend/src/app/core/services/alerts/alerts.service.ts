import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Alarm, AlarmCreate, AlarmUpdate } from '../../interfaces/alerts';

@Injectable({
  providedIn:'root'
})
export class AlertService{

    private api=environment.apiUrl+"/alarms";

    constructor(
        private http:HttpClient
    ){}

    getAlarms():Observable<Alarm[]>{
        return this.http.get<Alarm[]>(
            this.api
        );
    }

    getAlarm(id:number):Observable<Alarm>{
        return this.http.get<Alarm>(
            `${this.api}/${id}`
        );
    }

    createAlarm(data:AlarmCreate):Observable<Alarm>{
        return this.http.post<Alarm>(
            this.api,
            data
        );
    }

    updateAlarm(id:number,data:AlarmUpdate):Observable<Alarm>{
        return this.http.put<Alarm>(
            `${this.api}/${id}`,
            data
        );
    }

    deleteAlarm(id:number):Observable<any>{
        return this.http.delete(
            `${this.api}/${id}`
        );
    }

    searchCountries(text:string):Observable<string[]>{
        return this.http.get<string[]>(
            `${this.api}/countries/search?q=${text}`
        );
    }

    getcat_categories():Observable<string[]>{
        return this.http.get<string[]>(
            `${this.api}/cat/categories`
        );
    }


}