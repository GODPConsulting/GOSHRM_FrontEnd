import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorInformationComponent } from './components/instructor-information/instructor-information.component';
import { InstructorInformationRoutingModule } from './instructor-information-routing.module';
import { SharedModule } from '@shared/shared.module';
import { LayoutComponent } from './layout/layout.component';
import { FacilitatedCoursesComponent } from './components/facilitated-courses/facilitated-courses.component';



@NgModule({
  declarations: [
    InstructorInformationComponent,
    LayoutComponent,
    FacilitatedCoursesComponent
  ],
  imports: [
    CommonModule,
    InstructorInformationRoutingModule,
    SharedModule
  ]
})
export class InstructorInformationModule { }
