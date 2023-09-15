import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserActivitiesComponent } from './components/user-activities/user-activities.component';
import { UserActivitiesRoutingModule } from './user-activities-routing.module';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TableModule } from 'primeng/table';



@NgModule({
  declarations: [
    UserActivitiesComponent
  ],
  imports: [
    CommonModule,
    UserActivitiesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    TableModule
  ]
})
export class UserActivitiesModule { }
