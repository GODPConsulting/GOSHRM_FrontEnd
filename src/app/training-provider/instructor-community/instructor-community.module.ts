import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorCommunityComponent } from './components/instructor-community/instructor-community.component';
import { InstructorCommunityRoutingModule } from './instructor-community-routing.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionDialogComponent } from './dialogs/question-dialog/question-dialog.component';
import { SharedModule } from '@shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    InstructorCommunityComponent,
    QuestionDialogComponent
  ],
  imports: [
    CommonModule,
    InstructorCommunityRoutingModule,
    AngularEditorModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    SharedModule
  ]
})
export class InstructorCommunityModule { }
