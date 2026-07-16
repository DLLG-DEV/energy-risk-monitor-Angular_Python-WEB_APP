import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';


interface LoginResponse {

  access_token: string;
  token_type: string;

}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url_back= environment.apiUrl

  constructor(
    private http: HttpClient
  ){}



  login(
    email:string,
    password:string
  ):Observable<LoginResponse>{


    return this.http.post<LoginResponse>(
      `${this.url_back}/auth/login`,
      {
        email,
        password
      }
    );


  }



  saveToken(token:string){

    localStorage.setItem(
      'token',
      token
    );

  }



  getToken(){

    return localStorage.getItem('token');

  }



  logout(){

    localStorage.removeItem('token');

  }



  isLogged(){

    return !!this.getToken();

  }


}