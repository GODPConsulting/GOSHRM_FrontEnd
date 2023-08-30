import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CourseCreationComponent } from './components/course-creation/course-creation.component';
import { CourseCreationRoutingModule } from './course-creation-routing.module';
import { SharedModule } from '@shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { NgRatingBarModule } from 'ng-rating-bar';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [
    CourseCreationComponent,
  ],
  imports: [
    CommonModule,
    CourseCreationRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    NgRatingBarModule,
    AngularEditorModule,
    TableModule
  ],
  providers: [
    DatePipe
  ]
})
export class CourseCreationModule { }
