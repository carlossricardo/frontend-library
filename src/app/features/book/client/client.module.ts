import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { BookClientComponent } from './views/book-client/book-client.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BookDetailComponent } from './components/book-detail/book-detail.component';


@NgModule({
  declarations: [
    BookClientComponent,
    BookDetailComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    SharedModule
  ]
})
export class ClientModule { }
