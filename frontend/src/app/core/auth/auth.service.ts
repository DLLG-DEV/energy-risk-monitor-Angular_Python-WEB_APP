import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

interface LoginResponse {
  access_token: string,
  status: string,
  token_type: string,
}

export interface RegisterResponse {
    status_code: string;
    detail: string;
}

export interface NewUser {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url_back= environment.apiUrl

  constructor(
    private http: HttpClient
  ){}

  login(email:string, password:string):Observable<LoginResponse>{
    return this.http.post<LoginResponse>(
      `${this.url_back}/auth/login`,
      {
        email,
        password
      }
    );
  }

  getToken(){
    return localStorage.getItem('token');
  }

  logout(){
    localStorage.clear();
  }

  isLogged(){
    return !!this.getToken();
  }

  isAuthenticated(): boolean {

    if (!this.getToken()) {
        return false;
    }

    const payload = this.decodeToken();

    if (!payload) {
        return false;
    }

    return payload.exp * 1000 > Date.now();
}

  new_user(user: NewUser): Observable<RegisterResponse>{
    return this.http.post<RegisterResponse>(
      `${this.url_back}/auth/register`,user
    );
  }

  decodeToken(): any | null {

      const token = this.getToken();

      if (!token) {
          return null;
      }

      try {
          const payload = token.split('.')[1];
          const base64 = payload
              .replace(/-/g, '+')
              .replace(/_/g, '/');
          return JSON.parse(atob(base64));
      } catch {
          return null;
      }
  }

}