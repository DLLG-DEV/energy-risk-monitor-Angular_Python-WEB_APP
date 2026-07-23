import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AuditLog, ImportEventsResponse, SystemUpdateResponse } from '../../../interfaces/audit-log';

@Injectable({
  providedIn: 'root'
})
export class Logs_AdmService {
    private url_back = environment.apiUrl;

    constructor(
        private http: HttpClient
    ){}

    getLogs(): Observable<AuditLog[]> {
        return this.http.get<AuditLog[]>(
          `${this.url_back}/admin/logs`
        );
    }

    getSystemUpdates():Observable<SystemUpdateResponse>{
      return this.http.get<SystemUpdateResponse>(
        `${this.url_back}/admin/system-updates`
      );
    }

    importEvents(amount:number,unit:string){
        return this.http.post<ImportEventsResponse>(
            `${this.url_back}/events/import/${amount}/${unit}`,
            {}
        );
    }



}