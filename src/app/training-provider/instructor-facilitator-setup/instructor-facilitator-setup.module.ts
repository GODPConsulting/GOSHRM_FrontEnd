import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorFacilitatorSetupComponent } from './components/instructor-facilitator-setup/instructor-facilitator-setup.component';
import { InstructorFacilitatorSetupRoutingModule } from './instructor-facilitator-setup-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AddInstructorDialogComponent } from './dialogs/add-instructor-dialog/add-instructor-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NgRatingBarModule } from 'ng-rating-bar';


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
    SharedModule,
    NgRatingBarModule
  ]
})
export class InstructorFacilitatorSetupModule { }
