import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserClientComponent } from './views/user-client/user-client.component';

const routes: Routes = [

  {
    path: 'client',
    component: UserClientComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
