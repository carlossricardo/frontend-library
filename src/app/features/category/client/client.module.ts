import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { CategoryClientComponent } from './views/category-client/category-client.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/shared/prime-ng/prime-ng.module';
import { BookCategoryClientComponent } from './views/book-category-client/book-category-client.component';



@NgModule({
  declarations: [
    CategoryClientComponent,
    BookCategoryClientComponent
    
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule
  ]
})
export class ClientModule { }
