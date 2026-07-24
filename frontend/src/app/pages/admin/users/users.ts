import { ChangeDetectorRef, Component } from '@angular/core';
import { User_AdmService } from '../../../core/services/admin/users/user_admin.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Roles_AdmService } from '../../../core/services/admin/roles/roles_admin.service';
import { RoleList, UserAdmin } from '../../../core/interfaces/user-admin';
import { LogRefreshService } from '../../../core/services/admin/logs/refresh.service';

@Component({
  selector: 'app-users-by-admin',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    ToggleSwitchModule,
    RadioButtonModule,
  ],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class UsersByAdminComponent {
  users: UserAdmin[] = [];
  loading = true;
  showUserDialog = false;
  roles: RoleList[] = [];
  selectedUser: UserAdmin = {
    id: 0,
    role_id: 0,
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    is_active: false,
    created_at: '',
  };

  constructor(
    private Usr_ServAdm: User_AdmService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private Rol_ServAdm: Roles_AdmService,
    private logRefresh: LogRefreshService,
  ) {}

  ngOnInit() {
    this.loadRoles();
    this.loadUsers();
  }

  loadUsers() {
    this.Usr_ServAdm.getUsers().subscribe({
      next: (data: UserAdmin[]) => {
        this.users = data;
        this.loading = false;
        this.cdr.detectChanges();

        this.logRefresh.refresh();
      },
      error: (error) => {
        console.error('Error obteniendo usuarios', error);

        this.messageService.add({
          severity: 'error',
          summary: 'Error obteniendo usuarios',
        });

        this.loading = false;
      },
    });
  }

  loadRoles() {
    this.Rol_ServAdm.getRolesList().subscribe({
      next: (data: RoleList[]) => {
        this.roles = data;
      },
      error: (error) => {
        console.error('Error obteniendo roles', error);

        this.messageService.add({
          severity: 'error',
          summary: 'Error obteniendo roles',
        });

        this.loading = false;
      },
    });
  }

  openEditModal(user: UserAdmin) {
    this.selectedUser = {
      ...user,
    };
    this.showUserDialog = true;
  }

  saveUser() {
    this.loading = true;

    this.Usr_ServAdm.updateUser(this.selectedUser).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Usuario actualizado',
        });
        this.showUserDialog = false;
        this.loadUsers();
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'No fue posible actualizar el usuario',
        });
      },
    });
  }
}
