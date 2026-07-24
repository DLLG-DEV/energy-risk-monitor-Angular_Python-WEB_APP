import { Component } from '@angular/core';
import { ListAlerts } from './list/list';
import { NewAlert } from './new/new';
import { Enviados } from './enviados/enviados';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-alerts',
  imports: [NewAlert, ListAlerts, Enviados, DividerModule],
  templateUrl: './alerts.html',
  styleUrl: './alerts.css',
})
export class AlertsComponetn {}
