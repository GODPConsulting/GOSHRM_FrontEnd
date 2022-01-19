import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorFacilitatorSetupComponent } from './components/instructor-facilitator-setup/instructor-facilitator-setup.component';
import { InstructorFacilitatorSetupRoutingModule } from './instructor-facilitator-setup-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AddInstructorDialogComponent } from './dialogs/add-instructor-dialog/add-instructor-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    InstructorFacilitatorSetupComponent,
    AddInstructorDialogComponent
  ],
  imports: [
    CommonModule,
    InstructorFacilitatorSetupRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class InstructorFacilitatorSetupModule { }
