import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseDescriptionComponent } from './components/course-description/course-description.component';

const routes: Routes = [{ path: '', component:  CourseDescriptionComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminsRoutingModule {}
