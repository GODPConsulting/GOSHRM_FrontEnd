import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseApprovalComponent } from './components/course-approval/course-approval.component';
import { SharedModule } from '@shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgRatingBarModule } from 'ng-rating-bar';
import { EmailSetupRoutingModule } from './email-setup-routing.module';
import { TableModule } from 'primeng/table';



@NgModule({
  declarations: [
    CourseApprovalComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    EmailSetupRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    NgRatingBarModule,
    TableModule
  ]
})
export class EmailSetupModule { }
