import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseDetailComponent, FormatTimePipe } from './components/course-detail/course-detail.component';
import { CourseDetailRoutingModule } from './course-detail-routing.module';
import { SharedModule } from '@shared/shared.module';
import { NgRatingBarModule } from 'ng-rating-bar';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CourseDetailComponent, FormatTimePipe
  ],
  imports: [
    CommonModule,
    CourseDetailRoutingModule,
    SharedModule,
    NgRatingBarModule,
    AngularEditorModule,
    FormsModule
  ]
})
export class CourseDetailModule { }
