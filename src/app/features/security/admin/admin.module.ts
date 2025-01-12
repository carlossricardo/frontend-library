import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';


import { PrimeNgModule } from 'src/app/shared/prime-ng/prime-ng.module';


@NgModule({
  declarations: [
    
    
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    PrimeNgModule
  ],
  exports: [
    
  ]
})
export class AdminModule { }
