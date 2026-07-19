import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';


export interface LoginResponse {
  access_token: string,
  status: string,
  token_type: string,
}


@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    DividerModule,
    ReactiveFormsModule,
    ToastModule
  ],
  providers:[
    MessageService
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private messageService: MessageService,
    private router: Router
  ){

    this.loginForm = this.fb.group({
      email: ['', Validators.required, Validators.email],
      password: ['',Validators.required]
    });
  }

  login(){
    this.loading = true;
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.auth.login(email, password).subscribe({
      next: (response: LoginResponse) => {
        this.messageService.add({
            severity:'success',
            summary:'Login correcto',
            detail:'Bienvenido a Energy Risk Monitor'
        });

        const data = this.auth.decodeToken(response.access_token)

        localStorage.setItem(
          "modulos",
          data.modulos
        )
        localStorage.setItem(
          "username",
          data.userName
        )
        localStorage.setItem(
          'token',
          response.access_token
        );


        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);

      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
            severity:'error',
            summary:'Login incorrecto',
            detail:'Correo o contraseña inválidos'
        });
      }
    });
  }
}
