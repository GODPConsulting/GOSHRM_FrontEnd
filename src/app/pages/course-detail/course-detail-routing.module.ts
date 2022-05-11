import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { CourseDetailResolver } from './resolvers/course-detail.resolver';

const routes: Routes = [
  { 
    path: '', 
    component:  CourseDetailComponent,
    resolve: {resolveData: CourseDetailResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseDetailRoutingModule {}
