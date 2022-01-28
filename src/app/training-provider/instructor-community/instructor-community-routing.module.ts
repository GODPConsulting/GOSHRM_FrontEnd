import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructorCommunityComponent } from './components/instructor-community/instructor-community.component';

const routes: Routes = [
  {
      path: '',
      component: InstructorCommunityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstructorCommunityRoutingModule {}
