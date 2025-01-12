import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { UserComponent } from './views/user/user.component';
import { PrimeNgModule } from 'src/app/shared/prime-ng/prime-ng.module';
import { CreateUpdateComponent } from './components/create-update/create-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserComponent,
    CreateUpdateComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    PrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AdminModule { }
