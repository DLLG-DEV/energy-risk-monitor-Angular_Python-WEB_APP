import { ChangeDetectorRef, Component } from '@angular/core';
import { User_AdmService } from '../../../core/services/admin/user_admin.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

export interface UserAdmin {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

@Component({
  selector: 'app-users-by-admin',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class UsersByAdminComponent  {

  users: UserAdmin[] = [];
  loading = true;


  constructor(
    private usrServices: User_AdmService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ){}
  
  ngOnInit(){
    this.loadUsers();
  }

  loadUsers(){

    this.usrServices.getUsers()
    .subscribe({
      next:(data: UserAdmin[])=>{
        this.users = data;
        this.loading = false;
        this.cdr.detectChanges();

        this.messageService.add({
            severity:'success',
            summary:'Error obteniendo usuarios',
        });

      },
      error:(error)=>{
        console.error(
          "Error obteniendo usuarios",
          error
        );

        this.messageService.add({
            severity:'error',
            summary:'Error obteniendo usuarios',
        });

        this.loading = false;
      }
    });
  }


}

