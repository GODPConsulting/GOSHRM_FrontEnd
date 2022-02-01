import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalDetailsComponent } from './components/persoanl-details/personal-details.component';
import { ProfileResolver } from './resolver/profile.resolver';

const routes: Routes = [
  { 
    path: '', 
    component: PersonalDetailsComponent,
    resolve: {resolveData: ProfileResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
