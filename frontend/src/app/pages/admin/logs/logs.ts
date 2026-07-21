import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AuditLog } from '../../../core/interfaces/audit-log';
import { Logs_AdmService } from '../../../core/services/admin/logs/logs_admin.service';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  standalone: true,
  selector: 'app-logs-by-admin',
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    DialogModule,
    ButtonModule
  ],
  providers:[MessageService],
  templateUrl: './logs.html',
  styleUrl: './logs.css',
})
export class Logs_by_admin {
  
  logs:AuditLog[]=[];
  showDetail=false;
  selectedLog!:AuditLog;
  loading: boolean = false;

  constructor(
    private logsService:Logs_AdmService,
    private cdr: ChangeDetectorRef, 
    private messageService: MessageService
  ){}

  ngOnInit():void{
    this.loadLogs();
  }

  loadLogs(){
    this.loading=true;

    this.logsService.getLogs()
    .subscribe({
      next:(data)=>{
        this.logs=data;
        this.loading=false;
        this.cdr.detectChanges();
      },
      error:(err)=>{
        this.loading=false;
        this.messageService.add({
          severity:'error',
          summary:'Error',
          detail:'No se pudieron cargar los logs'
        });
        console.error(err);
      }
    });
  }

  openDetail(log:AuditLog){
    this.selectedLog=log;
    this.showDetail=true;
  }

  getActionSeverity(action:string){
    switch(action){
      case 'CREATE':  return 'success';
      case 'UPDATE':  return 'info';
      case 'DELETE':  return 'danger';
      default:  return 'secondary';
    }
  }

}
