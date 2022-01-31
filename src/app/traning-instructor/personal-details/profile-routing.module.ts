import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalDetailsComponent } from './components/persoanl-details/personal-details.component';
import { InstructorResolver } from './resolver/instructor.resolver';

const routes: Routes = [
  { 
    path: '', 
    component: PersonalDetailsComponent,
    resolve: {resolveData: InstructorResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalDetailsRoutingModule {}
