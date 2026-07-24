import { ChangeDetectorRef, Component } from '@angular/core';
import { Roles_AdmService } from '../../../core/services/admin/roles/roles_admin.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { RoleAdmin } from '../../../core/interfaces/role-admin';
import { ModulePermission } from '../../../core/interfaces/module-permission';
import { LogRefreshService } from '../../../core/services/admin/logs/refresh.service';

@Component({
  selector: 'app-roles-by-admin',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    CommonModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    CheckboxModule,
  ],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class Roles_by_admin {
  role: RoleAdmin[] = [];
  showRoleDialog = false;
  modulesPermission: ModulePermission[] = [];
  selectedRole: RoleAdmin = {
    id: 0,
    name: '',
    modules: [],
  };
  modeRole: 'N' | 'E' = 'N';
  loading: boolean = false;

  allModules: ModulePermission[] = [];

  constructor(
    private Rol_SerAdm: Roles_AdmService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private logRefresh: LogRefreshService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.Rol_SerAdm.getRoles().subscribe({
      next: (data: RoleAdmin[]) => {
        this.role = data;

        const allModules = data.flatMap((role) => role.modules);

        this.allModules = allModules
          .filter((module, index, self) => index === self.findIndex((m) => m.id === module.id))
          .map((module) => ({
            ...module,
            active: false,
          }));

        this.modulesPermission = [...this.allModules];

        this.cdr.detectChanges();

        this.logRefresh.refresh();
      },
      error: (err) => {
        console.error('Error cargando roles:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los roles del sistema',
        });
      },
    });
  }
  openRole(mode: 'N' | 'E', role?: RoleAdmin) {
    this.modeRole = mode;
    // Siempre parto del catálogo completo
    this.modulesPermission = this.allModules.map((module) => ({
      ...module,
      active: false,
    }));

    if (mode === 'E' && role) {
      this.selectedRole = {
        id: role.id,
        name: role.name,
        modules: role.modules,
      };

      // Marco los que tiene acceso
      this.modulesPermission = this.modulesPermission.map((module) => ({
        ...module,

        active: role.modules.some((m) => m.id === module.id),
      }));
    } else {
      this.selectedRole = {
        id: 0,
        name: '',
        modules: [],
      };
    }

    this.showRoleDialog = true;
  }

  saveRole() {
    const modulesSelected = this.modulesPermission
      .filter((module) => module.active)
      .map((module) => module.id);

    const request = {
      name: this.selectedRole.name,
      modules: modulesSelected,
    };

    if (this.modeRole === 'N') {
      this.Rol_SerAdm.createRole(request).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Correcto',
            detail: 'Rol creado correctamente',
          });

          this.showRoleDialog = false;
          this.loadData();
        },

        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.detail ?? 'No se pudo crear el rol',
          });
        },
      });
    } else {
      this.Rol_SerAdm.updateRole(this.selectedRole.id, request).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Correcto',
            detail: 'Rol actualizado correctamente',
          });

          this.showRoleDialog = false;

          this.loadData();
        },

        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.detail ?? 'No se pudo actualizar el rol',
          });
        },
      });
    }
  }
}
