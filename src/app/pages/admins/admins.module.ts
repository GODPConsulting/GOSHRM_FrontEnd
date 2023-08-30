import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseDescriptionComponent } from './components/course-description/course-description.component';
import { AdminsRoutingModule } from './admins-routing.module';
import { SharedModule } from '@shared/shared.module';
import { NgRatingBarModule } from 'ng-rating-bar';
import { TableModule } from 'primeng/table';
import { AddAdminDialogComponent } from './dialogs/add-admin-dialog/add-admin-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CourseDescriptionComponent,
    AddAdminDialogComponent
  ],
  imports: [
    CommonModule,
    AdminsRoutingModule,
    SharedModule,
    NgRatingBarModule,
    TableModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AdminsModule { }
