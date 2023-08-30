import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorInformationComponent } from './components/instructor-information/instructor-information.component';
import { InstructorInformationRoutingModule } from './instructor-information-routing.module';
import { SharedModule } from '@shared/shared.module';
import { LayoutComponent } from './layout/layout.component';
import { FacilitatedCoursesComponent } from './components/facilitated-courses/facilitated-courses.component';
import { NgRatingBarModule } from 'ng-rating-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { MatDialogModule } from '@angular/material/dialog';
import { AddDocumentComponent } from './dialogs/add-document/add-document.component';
import { AddEmpDependentComponent } from './dialogs/add-emp-dependent/add-emp-dependent.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    InstructorInformationComponent,
    LayoutComponent,
    FacilitatedCoursesComponent,
    AddDocumentComponent,
    AddEmpDependentComponent
  ],
  imports: [
    CommonModule,
    InstructorInformationRoutingModule,
    SharedModule,
    NgRatingBarModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    MatDialogModule,
    MatTooltipModule
  ]
})
export class InstructorInformationModule { }
