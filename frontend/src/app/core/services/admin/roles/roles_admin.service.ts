import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { RoleList, UserAdmin } from '../../../interfaces/user-admin';
import { RoleAdmin } from '../../../interfaces/role-admin';

@Injectable({
  providedIn: 'root'
})
export class Roles_AdmService {

  private url_back = environment.apiUrl;

  constructor(
    private http: HttpClient
  ){}

  getUsers(): Observable<UserAdmin[]> {
    return this.http.get<UserAdmin[]>(
      `${this.url_back}/admin/users`
    );
  }

  getRolesList(): Observable<RoleList[]> {
    return this.http.get<RoleList[]>(
      `${this.url_back}/admin/roles/list`
    );
  }

  getRoles(){
    return this.http.get<RoleAdmin[]>(
      `${this.url_back}/admin/roles`
    );
  }

  createRole(data:any){
    return this.http.post(
      `${this.url_back}/admin/roles`,
      data
    );
  }

  updateRole(id:number,data:any){
    return this.http.put(
      `${this.url_back}/admin/roles/${id}`,
      data
    );
  }
  
}