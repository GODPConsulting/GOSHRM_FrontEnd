import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoleComponent } from './components/user-role/user-role.component';

const routes: Routes = [
  // { path: '', redirectTo: '', pathMatch: 'full', },
  { path: '', component:  UserRoleComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoleRoutingModule {}
