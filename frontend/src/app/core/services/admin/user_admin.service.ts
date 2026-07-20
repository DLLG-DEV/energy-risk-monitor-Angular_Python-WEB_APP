import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';


export interface UserAdmin {

  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;

}


@Injectable({
  providedIn: 'root'
})
export class User_AdmService {

  private url_back = environment.apiUrl;


  constructor(
    private http: HttpClient
  ){}


  getUsers(): Observable<UserAdmin[]> {

    return this.http.get<UserAdmin[]>(
      `${this.url_back}/admin/users`
    );

  }

}