import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './components/courses/courses.component';
import { TrainingProvidersRoutingModule } from './training-providers-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { NgRatingBarModule } from 'ng-rating-bar';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [
    CoursesComponent
  ],
  imports: [
    CommonModule,
    TrainingProvidersRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    SharedModule,
    NgRatingBarModule,
    TableModule
  ],
})
export class TrainingProvidersModule { }
