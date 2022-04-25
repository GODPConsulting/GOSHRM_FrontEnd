import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseApprovalComponent } from './components/course-approval/course-approval.component';
import { SharedModule } from '@shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgRatingBarModule } from 'ng-rating-bar';
import { CourseApprovalRoutingModule } from './course-approval-routing.module';
import { DecisionDialogComponent } from './dialogs/decision-dialog/decision-dialog.component';
import { TableModule } from 'primeng/table';



@NgModule({
  declarations: [
    CourseApprovalComponent,
    DecisionDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    CourseApprovalRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    NgRatingBarModule,
    TableModule
  ]
})
export class CourseApprovalModule { }
