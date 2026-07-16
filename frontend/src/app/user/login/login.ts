import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth/auth.service';

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

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private messageService: MessageService
  ){

    this.loginForm = this.fb.group({

      email: [''],

      password: ['']

    });
  }

login(){

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;


    this.auth.login(email, password)
    .subscribe({

        next: (response) => {

            this.messageService.add({

                severity:'success',

                summary:'Login correcto',

                detail:'Bienvenido a Energy Risk Monitor'

            });

            console.log(response);

        },


        error: (error) => {

            this.messageService.add({

                severity:'error',

                summary:'Login incorrecto',

                detail:'Correo o contraseña inválidos'

            });

            console.log(error);

        }

    });

}
}
