import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseCreationComponent } from './components/course-creation/course-creation.component';

const routes: Routes = [
    {
        path:'',
        component: CourseCreationComponent,
    },
    {
        path: '',
        redirectTo: 'courses',
        pathMatch: 'full',
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RunningCoursesRoutingModule {}
