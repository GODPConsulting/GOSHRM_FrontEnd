import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseDescriptionComponent } from './components/course-description/course-description.component';
import { CourseDescriptionRoutingModule } from './course-description-routing.module';
import { SharedModule } from '@shared/shared.module';
import { NgRatingBarModule } from 'ng-rating-bar';



@NgModule({
  declarations: [
    CourseDescriptionComponent
  ],
  imports: [
    CommonModule,
    CourseDescriptionRoutingModule,
    SharedModule,
    NgRatingBarModule
  ]
})
export class CourseDescriptionModule { }
