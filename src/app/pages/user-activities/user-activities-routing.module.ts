import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserActivitiesComponent } from './components/user-activities/user-activities.component';

const routes: Routes = [
  // { path: '', redirectTo: '', pathMatch: 'full', },
  { path: '', component:  UserActivitiesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserActivitiesRoutingModule {}
