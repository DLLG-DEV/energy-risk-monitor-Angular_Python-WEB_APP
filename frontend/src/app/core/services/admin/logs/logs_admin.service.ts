import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AuditLog } from '../../../interfaces/audit-log';

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

}