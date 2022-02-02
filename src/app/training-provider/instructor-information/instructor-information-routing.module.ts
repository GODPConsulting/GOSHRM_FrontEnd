import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacilitatedCoursesComponent } from './components/facilitated-courses/facilitated-courses.component';
import { InstructorInformationComponent } from './components/instructor-information/instructor-information.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
    { 
        path: '', 
        component:  LayoutComponent,
        children: [
            {
                path: 'information/:instructorId',
                component: InstructorInformationComponent
            },
            {
                path: 'courses/:instructorId',
                component: FacilitatedCoursesComponent
            },
            // {
            //     path: '',
            //     redirectTo: 'information',
            //     pathMatch: 'full',
            // },
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstructorInformationRoutingModule {}
