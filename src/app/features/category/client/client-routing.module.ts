import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryClientComponent } from './views/category-client/category-client.component';
import { BookCategoryClientComponent } from './views/book-category-client/book-category-client.component';

const routes: Routes = [
  {
    path: 'client',
    component: CategoryClientComponent,
    
    // children: [
    //   {
    //     path: 'books',
    //     component: BookCategoryClientComponent
    //   }
    // ]
  },

  {
    path: 'client/books',
    component: BookCategoryClientComponent,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
