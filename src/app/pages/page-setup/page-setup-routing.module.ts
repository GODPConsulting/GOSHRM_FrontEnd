import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { FacilitatedCoursesComponent } from './components/facilitated-courses/facilitated-courses.component';
import { InstructorInformationComponent } from './components/instructor-information/instructor-information.component';

const routes: Routes = [
    {
        path: '',
        component:  LayoutComponent,
        children: [
          { path: '', redirectTo: 'banner', pathMatch: 'full', },
          {
            path:'banner',
            component: FacilitatedCoursesComponent
          },
          {
            path:'content',
            component: InstructorInformationComponent
          },
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageSetupModuleRoutingModule {}
