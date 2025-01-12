import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { UserClientComponent } from './views/user-client/user-client.component';
import { PrimeNgModule } from 'src/app/shared/prime-ng/prime-ng.module';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserClientComponent,
    UserDetailComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    PrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ClientModule { }
