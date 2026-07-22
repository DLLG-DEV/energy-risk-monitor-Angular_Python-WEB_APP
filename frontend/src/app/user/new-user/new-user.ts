import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { environment } from '../../../environments/environment';
export interface RegisterResponse {
    status_code: string;
    detail: string;
}

@Component({
  selector: 'app-new-user',
  imports: [
    RouterLink,
    InputTextModule,
    ButtonModule,
    ToastModule,
    PasswordModule,
    DividerModule,
    SelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './new-user.html',
  styleUrl: './new-user.css',
  providers:[
    MessageService
  ]
})
export class NewUser {
  registerForm: FormGroup;
  loading: boolean = false;
  roles: MenuItem[] = [];

  private USER_ROLE_ID = environment.USER_ROLE_ID;
  

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private messageService: MessageService,
    private router: Router,
  ){
    this.registerForm = this.fb.group({

        first_name: ['', Validators.required],

        last_name: ['', Validators.required],

        email: ['', [
            Validators.required,
            Validators.email
        ]],

        password: ['', [
            Validators.required,
            Validators.minLength(8)
        ]],

        confirmPassword: ['', Validators.required],

        role_id: [this.USER_ROLE_ID]

    });
  }

  register() {
    this.loading = true;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    if (
      this.registerForm.value.password !==
      this.registerForm.value.confirmPassword
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Contraseñas',
        detail: 'Las contraseñas no coinciden'
      });
      this.loading = false;
      return;
    }

    this.auth.new_user({
      first_name: this.registerForm.value.first_name,
      last_name: this.registerForm.value.last_name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role_id: this.registerForm.value.role_id
    }).subscribe({
      next: (response: RegisterResponse) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: response.detail
        });

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },

      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.detail
        });
      }
    });

  }
}
