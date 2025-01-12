import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { CategoryComponent } from './admin/views/category/category.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateUpdateComponent } from './admin/components/create-update/create-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientModule } from './client/client.module';
import { AdminModule } from './admin/admin.module';


@NgModule({
  declarations: [
    CategoryComponent,
    CreateUpdateComponent
  ],
  imports: [
    CommonModule,    
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ClientModule,
    AdminModule
  ]
})
export class CategoryModule { }
