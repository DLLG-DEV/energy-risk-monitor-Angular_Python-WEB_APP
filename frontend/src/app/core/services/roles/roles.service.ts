import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RolService {
  private url_back= environment.apiUrl

  constructor(
    private http: HttpClient
  ){}

  get_rol(): Observable<any> {
      return this.http.get<any>(
          `${this.url_back}/rol/modules`
  );
  }

}