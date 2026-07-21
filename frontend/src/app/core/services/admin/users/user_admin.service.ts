import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { UserAdmin } from '../../../interfaces/user-admin';

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

  updateUser(user: UserAdmin): Observable<any>{
    return this.http.put(
      `${this.url_back}/admin/users/${user.id}`,
      {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role_id: user.role_id,
        is_active: user.is_active
      }
    );
  }

}