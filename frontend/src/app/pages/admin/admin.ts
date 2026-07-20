import { Component } from '@angular/core';
import { UsersByAdminComponent } from './users/users';
import { Roles_by_admin } from './roles/roles';
import { Logs_by_admin } from './logs/logs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    UsersByAdminComponent,
    Roles_by_admin,
    Logs_by_admin
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admincmp {

  constructor(
  ){}
}
