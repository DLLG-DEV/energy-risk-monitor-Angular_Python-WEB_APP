import { Component } from '@angular/core';
import { UsersByAdminComponent } from './users/users';
import { Roles_by_admin } from './roles/roles';
import { Logs_by_admin } from './logs/logs';
import { DividerModule } from 'primeng/divider';
import { UpdateSistemData } from './update-sistem-data/update-sistem-data';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [UsersByAdminComponent, Roles_by_admin, Logs_by_admin, DividerModule, UpdateSistemData],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admincmp {}
