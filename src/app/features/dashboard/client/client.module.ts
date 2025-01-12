import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { DashboardClientComponent } from './views/dashboard-client/dashboard-client.component';
import { PrimeNgModule } from 'src/app/shared/prime-ng/prime-ng.module';


@NgModule({
  declarations: [
    DashboardClientComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    PrimeNgModule
  ]
})
export class ClientModule { }
