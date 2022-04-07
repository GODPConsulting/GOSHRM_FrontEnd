import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './components/courses/courses.component';
import { RunningCoursesRoutingModule } from './running-courses-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { NgRatingBarModule } from 'ng-rating-bar';


@NgModule({
  declarations: [
    CoursesComponent
  ],
  imports: [
    CommonModule,
    RunningCoursesRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    SharedModule,
    NgRatingBarModule
  ],
})
export class RunningCoursesModule { }
