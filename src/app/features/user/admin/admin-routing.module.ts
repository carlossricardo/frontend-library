import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './views/user/user.component';
import { isAdminGuard } from 'src/app/core/guards/is-admin.guard';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    canActivate: [ isAdminGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
